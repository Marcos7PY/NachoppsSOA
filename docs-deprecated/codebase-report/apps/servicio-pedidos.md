# Reporte de Código: Microservicio `servicio-pedidos`

## 1. Controladores

### AppController (`apps/servicio-pedidos/src/app/app.controller.ts`)

- **GET `/`** — `listarPedidos(mesaId?: string)`: Retorna `{ pedidos: PedidoDto[] }`. Filtro opcional por `mesaId`. 200 OK.
- **POST `/`** — `crearPedido(command)`: `mesaId` + `items[]`. Valida stock contra proyección local `productos_locales`. Retorna `{ message, pedido }`. 201 / 400 / 404 / 503.
- **PATCH `/:id/estado`** — `actualizarEstado(id, command)`: Cambia estado del pedido. Retorna `{ message, pedido }`. 200 OK.
- **PATCH `/items/:itemId/estado`** — `actualizarEstadoItem(itemId, command)`: Cambia estado de un ítem. Si todos los ítems quedan LISTO/ENTREGADO, promueve el pedido a LISTO. Retorna `{ message }`. 200 OK.

**Guards:** JwtAuthGuard global en módulo.

### EventsController
Decorado con `@Controller()` + `@UseInterceptors(RabbitMQRetryInterceptor)`.
- **`MesaCreada`** — Upsert en tabla local `MesaLocal`.
- **`MesaActualizada`** — Upsert en tabla local `MesaLocal`.
- **`ProductoCreado`** — Upsert en tabla local `ProductoLocal` (id, nombre, precio, stockActual, categoriaNombre, disponible).
- **`ProductoActualizado`** — Upsert en tabla local `ProductoLocal`.

## 2. Servicios

### AppService (`apps/servicio-pedidos/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService` + `JwtService`. `RabbitMQPublisherService` fue removido — toda publicación usa Outbox.

**`crearPedido(command): Promise<{ message, pedido }>`**
1. Valida mesa local (`validarMesa`). Si no existe, `NotFoundException`.
2. `asegurarProductosLocales` — verifica qué IDs existen en `productos_locales`. Si faltan, hace cold-start HTTP a inventario (`POST /productos/lote`) y los guarda localmente.
3. Consulta `productos_locales` con `findMany({ where: { id: { in: ids } } })`. Para cada item: valida cantidad, stock, mapea precio/área.
4. Calcula total.
5. Llama a `persistirPedido` que crea el pedido + outbox atómicamente.

**`persistirPedido(mesaId, numeroMesa, items, total): Promise<any>`** (privado)
- En `$transaction`: crea `Pedido` con sus `PedidoItem` y `Modificador` en cascada. Inserta 2 `OutboxEvent` (`PedidoCreado` + `PedidoActualizado`) con status `PENDING`. Atómico: si falla el commit, no se publica nada.

**`listarPedidos(mesaId?): Promise<{ pedidos }>`** — `findMany` con filtro opcional, incluye items y modificadores.

**`actualizarEstado(id, command): Promise<{ message, pedido }>`**
- En `$transaction`: actualiza `Pedido` con nuevo estado. Si el estado es `Listo`, inserta `OutboxEvent` con routingKey `PedidoListo`. Siempre inserta `OutboxEvent` con `PedidoActualizado`.
- Retorna el pedido actualizado como DTO.

**`actualizarEstadoItem(itemId, command): Promise<{ message }>`**
- En `$transaction`: actualiza el ítem. Verifica si todos los ítems del pedido están LISTO/ENTREGADO.
- Si todos listos: actualiza el pedido a LISTO + inserta `OutboxEvent` (`PedidoListo` + `PedidoActualizado`).
- Si no: inserta solo `OutboxEvent` con `PedidoActualizado`.

**`procesarPagoRecibido(payload: PagoRegistradoPayload): Promise<void>`** — Marca todos los pedidos de la mesa como PAGADO.

**`upsertMesaLocal(mesaDto): Promise<void>`** — Sincroniza caché local de mesas vía upsert.

**Métodos privados:**
- `validarMesa(mesaId)` — Busca en `MesaLocal`.
- `asegurarProductosLocales(productoIds)` — Cold-start: si IDs faltan en `productos_locales`, hace HTTP batch a inventario.
- `validarYMapearItems(items)` — Consulta `productos_locales` localmente. Valida cantidad y stock.
- `calcularTotal(items)` — `sum(precioUnitario * cantidad)`.
- `mapToDto(p)` — Transforma entidad Prisma a `PedidoDto`.

**Métodos públicos:**
- `upsertMesaLocal(mesaDto)` — Sincroniza caché local de mesas vía upsert.
- `upsertProductoLocal(producto)` — Sincroniza proyección local de productos vía upsert.
- `procesarPagoRecibido(payload)` — Marca pedidos de la mesa como PAGADO.

### OutboxProcessor (`apps/servicio-pedidos/src/app/outbox.processor.ts`)

Cron cada 5s. Consulta eventos `PENDING` (máx 50), publica a RabbitMQ, marca `PROCESSED` o `FAILED`. Flag `isProcessing` anti-solapamiento. Usa `PrismaService` + `RabbitMQPublisherService`.

## 3. Prisma

### Schema (`apps/servicio-pedidos/prisma/schema.prisma`)

**Modelo `Pedido`** (tabla `pedidos`)
- `id`, `mesaId`, `numeroMesa`: Int?, `estado`: PedidoEstado @default(PENDIENTE), `total`: Decimal(10,2), `comensales`: Int @default(1), `createdAt`, `updatedAt`. Relación: `items: PedidoItem[]`. Índices: `@@index([mesaId])`, `@@index([estado])`.

**Modelo `PedidoItem`** (tabla `pedido_items`)
- `id`, `pedidoId`, `productoId`, `nombre`, `cantidad`: Int, `precioUnitario`: Decimal(10,2), `area`: String? @default("COCINA"), `notas`: String?, `estado`: String @default("PENDIENTE"), `comensal`: Int @default(1). Relaciones: `pedido`, `modificadores: Modificador[]`.

**Modelo `Modificador`** (tabla `modificadores`)
- `id`, `pedidoItemId`, `nombre`, `precioExtra`: Decimal(10,2) @default(0).

**Modelo `MesaLocal`** (tabla `mesas_local`)
- `id` @id, `numero`: Int, `updatedAt`.

**Modelo `OutboxEvent`** (tabla `outbox_events`) — **NUEVO**
- `id`: String @id @default(uuid())
- `routingKey`: String
- `payload`: String (JSON serializado)
- `status`: String @default("PENDING") — PENDING, PROCESSED, FAILED
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

**Modelo `ProductoLocal`** (tabla `productos_locales`) — **NUEVO (Migración HTTP→Eventos)**
- `id`: String @id — ID del producto en servicio-inventario
- `nombre`: String
- `precio`: Decimal(10,2)
- `stockActual`: Int?
- `categoriaNombre`: String @default("COCINA")
- `disponible`: Boolean @default(true)

## Observaciones Adicionales

### Patrón Transactional Outbox
Todos los eventos que publica este servicio (`PedidoCreado`, `PedidoActualizado`, `PedidoListo`) ahora se escriben atómicamente en `outbox_events` dentro de `$transaction`. El `OutboxProcessor` los publica a RabbitMQ cada 5s. Esto eliminó la dependencia directa de `RabbitMQPublisherService` en `AppService`.

### Cold-Start HTTP
El único caso donde se usa HTTP a inventario es en `asegurarProductosLocales`: cuando un producto no está en la proyección local, se hace una llamada batch `POST /productos/lote` para cargarlos todos de una vez. Esto es aceptable porque ocurre raramente (solo productos nuevos que aún no fueron sincronizados por eventos).

### MesaLocal
Caché replicada de mesas desde `servicio-mesas` para validar existencia sin depender del servicio remoto en cada request.

### ProductoLocal (Migración HTTP→Eventos)
`crearPedido` consulta la tabla local `productos_locales` (sincronizada vía eventos `ProductoCreado`/`ProductoActualizado`) en vez de hacer HTTP a inventario. Cold-start: si un producto no está localmente, hace una sola llamada `POST /productos/lote` para cargarlo. Esto elimina la dependencia HTTP en el camino crítico y cumple ADR-002/004.

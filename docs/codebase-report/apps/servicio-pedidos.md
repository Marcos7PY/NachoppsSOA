# Reporte de Código: Microservicio `servicio-pedidos`

## 1. Controladores

### AppController (`apps/servicio-pedidos/src/app/app.controller.ts`)

- **GET `/`** — `listarPedidos(mesaId?: string)`: Retorna `{ pedidos: PedidoDto[] }`. Filtro opcional por `mesaId`. 200 OK.
- **POST `/`** — `crearPedido(command)`: `mesaId` + `items[]`. Valida stock contra inventario vía HTTP. Retorna `{ message, pedido }`. 201 / 400 / 404 / 503.
- **PATCH `/:id/estado`** — `actualizarEstado(id, command)`: Cambia estado del pedido. Retorna `{ message, pedido }`. 200 OK.
- **PATCH `/items/:itemId/estado`** — `actualizarEstadoItem(itemId, command)`: Cambia estado de un ítem. Si todos los ítems quedan LISTO/ENTREGADO, promueve el pedido a LISTO. Retorna `{ message }`. 200 OK.

**Guards:** JwtAuthGuard global en módulo.

### EventsController
Decorado con `@Controller()` pero sin implementaciones activas. Los eventos son consumidos por otros servicios.

## 2. Servicios

### AppService (`apps/servicio-pedidos/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService` + `JwtService`. `RabbitMQPublisherService` fue removido — toda publicación usa Outbox.

**`crearPedido(command): Promise<{ message, pedido }>`**
1. Valida mesa local (`validarMesa`). Si no existe, `NotFoundException`.
2. Itera items → `fetchProducto` (HTTP a inventario con CircuitBreaker). Valida cantidad y stock. Mapea al formato interno.
3. Calcula total.
4. Llama a `persistirPedido` que crea el pedido + outbox atómicamente.

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
- `validarYMapearItems(items)` — Valida cada ítem contra inventario vía HTTP con CircuitBreaker.
- `calcularTotal(items)` — `sum(precioUnitario * cantidad)`.
- `getServiceToken()` — Firma JWT para comunicación entre servicios.
- `fetchProducto(productoId)` — HTTP GET a inventario con `@CircuitBreakerOptions`.
- `mapToDto(p)` — Transforma entidad Prisma a `PedidoDto`.

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

## Observaciones Adicionales

### Patrón Transactional Outbox
Todos los eventos que publica este servicio (`PedidoCreado`, `PedidoActualizado`, `PedidoListo`) ahora se escriben atómicamente en `outbox_events` dentro de `$transaction`. El `OutboxProcessor` los publica a RabbitMQ cada 5s. Esto eliminó la dependencia directa de `RabbitMQPublisherService` en `AppService`.

### Circuit Breaker
Las llamadas HTTP a `servicio-inventario` usan `@CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 })` vía `@org/resiliencia`.

### MesaLocal
Caché replicada de mesas desde `servicio-mesas` para validar existencia sin depender del servicio remoto en cada request.

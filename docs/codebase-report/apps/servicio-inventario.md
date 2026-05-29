# Reporte de Base de Código - Servicio Inventario

## 1. Controladores

### AppController (`apps/servicio-inventario/src/app/app.controller.ts`)

- **GET `/`** — `getHello()`: Retorna `{ message, service }`. 200.
- **GET `/categorias`** — `listarCategorias()`: Retorna `{ categorias }`. 200.
- **POST `/categorias`** — `crearCategoria(body)`: `nombre`, `descripcion?`. Retorna `{ message, categoria }`. 201.
- **GET `/productos`** — `listarProductos(categoriaId?)`: Retorna `{ productos: ProductoDto[] }`. Filtro opcional por categoría. 200.
- **GET `/productos/:id`** — `obtenerProducto(id)`: Retorna `ProductoDto`. 200 / 404.
- **POST `/productos/lote`** — `obtenerProductosLote(ids)`: Retorna `{ productos: ProductoDto[] }` para los IDs solicitados. Usado por `servicio-pedidos` en cold-start.
- **POST `/productos`** — `crearProducto(body: CrearProductoCommand)`: `categoriaId`, `nombre`, `descripcion?`, `precio`, `disponible?`, `stockActual?`. Retorna `{ message, producto }`. 201 / 404.
- **PATCH `/productos/:id/stock`** — `actualizarStock(id, stock)`: Suma `stock` al stock actual (admite negativos con mínimo 0). Retorna `{ message, producto }`. 200 / 404.

**Guards:** Protegido globalmente por `JwtAuthGuard`.

### EventsController (`apps/servicio-inventario/src/app/events.controller.ts`)
- **Decoradores:** `@UseInterceptors(RabbitMQRetryInterceptor)`, `@Controller()`
- **`PedidoCreado`** — `@EventPattern(RoutingKeys.PedidoCreado)`: Extrae `payload.pedido.items` (con fallback a `payload.items`). Por cada ítem con `productoId` y `cantidad`, llama a `reducirStockAutomatico`.

## 2. Servicios

### AppService (`apps/servicio-inventario/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService`.

**`listarCategorias()`** — `findMany` ordenado por nombre.

**`crearCategoria(command)`** — Crea registro `Categoria`.

**`listarProductos(categoriaId?)`** — `findMany` con filtro opcional por categoría, incluye relación `categoria`.

**`obtenerProducto(id)`** — `findUnique` con categoría. `NotFoundException` si no existe.

**`obtenerProductosLote(ids: string[])`** — `findMany` con filtro `id: { in: ids }`. Retorna `{ productos }`. Usado por `servicio-pedidos` en cold-start.

**`crearProducto(command)`** — En `$transaction`: Valida existencia de categoría, crea `Producto`, inserta `OutboxEvent` con `ProductoCreado` (id, nombre, precio, stockActual, categoriaNombre, disponible).

**`actualizarStock(id, cantidad)`** — En `$transaction`: Busca producto, calcula `Math.max(0, stock + cantidad)`, actualiza. Inserta `OutboxEvent` con `ProductoActualizado`.

**`reducirStockAutomatico(id, cantidad): Promise<void>`** — **REFACTORIZADO para atómico condicional**:
1. Busca producto. Si no existe o `stockActual` es null (sin control de stock), retorna sin efecto.
2. **Update condicional atómico con `updateMany`**: `where: { id, stockActual: { gte: cantidad } }` + `data: { decrement: cantidad }`.
3. Si `count === 0`, loguea "stock insuficiente" y retorna — el decremento fue rechazado por la BD porque no había stock suficiente.
4. Si stock llega a 0, desactiva `disponible: false`.
5. Inserta `OutboxEvent` con `ProductoActualizado` para sincronizar proyecciones locales en otros servicios.

## 3. Prisma

### Schema (`apps/servicio-inventario/prisma/schema.prisma`)

**Modelo `Categoria`** (tabla `categorias`)
- `id`, `nombre`, `descripcion`: String?, `createdAt`, `updatedAt`. Relación: `productos: Producto[]`.

**Modelo `Producto`** (tabla `productos`)
- `id`, `categoriaId`, `nombre`, `descripcion`: String?, `precio`: Float, `disponible`: Boolean @default(true), `stockActual`: Int?, `createdAt`, `updatedAt`. Relación: `categoria`.

**Modelo `OutboxEvent`** (tabla `outbox_events`) — **NUEVO**
- `id`: String @id @default(uuid())
- `routingKey`: String
- `payload`: String
- `status`: String @default("PENDING")
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

## Observaciones Adicionales

### Decremento Atómico Condicional
`reducirStockAutomatico` usa `updateMany` con cláusula `where: { stockActual: { gte: cantidad } }`. PostgreSQL ejecuta esto atómicamente: si 20 hilos concurrentes intentan decrementar 10 unidades, solo 10 pasan el filtro `WHERE` y los otros 10 reciben `count === 0`. El stock nunca puede volverse negativo — si no hay suficiente, la operación es rechazada silenciosamente a nivel de BD. Esto reemplazó la implementación anterior que hacía `findUnique` + `update` separados (condición de carrera) y luego un `decrement` ciego (posibilidad de stock negativo).

### Asincronismo y Resiliencia (RabbitMQ)
Binding explícito `pedido.creado` → cola `inventario_queue`. Usa `RabbitMQRetryInterceptor` para reintentos con backoff exponencial. OutboxProcessor cada 5s publica eventos `ProductoCreado` y `ProductoActualizado` para sincronizar proyecciones locales en otros servicios.

### Publicación de Eventos (Migración HTTP→Eventos)
`crearProducto`, `actualizarStock` y `reducirStockAutomatico` ahora publican `ProductoCreado` / `ProductoActualizado` vía outbox. Esto permite que `servicio-pedidos` mantenga una proyección local `productos_locales` y valide items sin llamadas HTTP, cumpliendo ADR-002/004.

### Arquitectura de Datos
PrismaService local. Database-per-Service. shared-prisma no utilizado.

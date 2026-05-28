# Reporte de Base de Código - Servicio Inventario

## 1. Controladores

### AppController (`apps/servicio-inventario/src/app/app.controller.ts`)

- **GET `/`** — `listarProductos(categoriaId?)`: Retorna `{ productos: ProductoDto[] }`. 200.
- **GET `/productos`** — `listarProductosRuta(categoriaId?)`: Igual que `/`. 200.
- **GET `/productos/:id`** — `obtenerProducto(id)`: Retorna `ProductoDto`. 200 / 404.
- **POST `/productos`** — `crearProducto(body: CrearProductoCommand)`: `categoriaId`, `nombre`, `descripcion?`, `precio`, `disponible?`, `stockActual?`. Retorna `{ message, producto }`. 201 / 404.
- **PATCH `/productos/:id/stock`** — `actualizarStock(id, cantidad)`: Suma `cantidad` al stock (admite negativos con mínimo 0). Retorna `{ message, producto }`. 200 / 404.
- **GET `/categorias`** — `listarCategorias()`: Retorna `{ categorias }`. 200.
- **POST `/categorias`** — `crearCategoria(body)`: `nombre`, `descripcion?`. Retorna `{ message, categoria }`. 201.

**Guards:** Ninguno.

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

**`crearProducto(command)`** — Valida existencia de categoría, crea `Producto` con defaults.

**`actualizarStock(id, cantidad)`** — Busca producto, calcula `Math.max(0, stock + cantidad)`, actualiza.

**`reducirStockAutomatico(id, cantidad): Promise<void>`** — **REFACTORIZADO para atómico condicional**:
1. Busca producto. Si no existe o `stockActual` es null (sin control de stock), retorna sin efecto.
2. **Update condicional atómico con `updateMany`**: `where: { id, stockActual: { gte: cantidad } }` + `data: { decrement: cantidad }`.
3. Si `count === 0`, loguea "stock insuficiente" y retorna — el decremento fue rechazado por la BD porque no había stock suficiente.
4. Si stock llega a 0, desactiva `disponible: false`.

## 3. Prisma

### Schema (`apps/servicio-inventario/prisma/schema.prisma`)

**Modelo `Categoria`** (tabla `categorias`)
- `id`, `nombre`, `descripcion`: String?, `createdAt`, `updatedAt`. Relación: `productos: Producto[]`.

**Modelo `Producto`** (tabla `productos`)
- `id`, `categoriaId`, `nombre`, `descripcion`: String?, `precio`: Float, `disponible`: Boolean @default(true), `stockActual`: Int?, `createdAt`, `updatedAt`. Relación: `categoria`.

## Observaciones Adicionales

### Decremento Atómico Condicional
`reducirStockAutomatico` usa `updateMany` con cláusula `where: { stockActual: { gte: cantidad } }`. PostgreSQL ejecuta esto atómicamente: si 20 hilos concurrentes intentan decrementar 10 unidades, solo 10 pasan el filtro `WHERE` y los otros 10 reciben `count === 0`. El stock nunca puede volverse negativo — si no hay suficiente, la operación es rechazada silenciosamente a nivel de BD. Esto reemplazó la implementación anterior que hacía `findUnique` + `update` separados (condición de carrera) y luego un `decrement` ciego (posibilidad de stock negativo).

### Asincronismo y Resiliencia (RabbitMQ)
Binding explícito `pedido.creado` → cola `inventario_queue`. Usa `RabbitMQRetryInterceptor` para reintentos con backoff exponencial.

### Arquitectura de Datos
PrismaService local. Database-per-Service. shared-prisma no utilizado.

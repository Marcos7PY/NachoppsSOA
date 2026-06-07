---
tipo: indice-servicio
servicio: servicio-inventario
fuente: [apps/servicio-inventario/src/app/app.controller.ts:9]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-inventario

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-inventario/src/app/app.controller.ts:9]
- [GET /categorias](endpoints/GET--categorias.md) [apps/servicio-inventario/src/app/app.controller.ts:16]
- [POST /categorias](endpoints/POST--categorias.md) [apps/servicio-inventario/src/app/app.controller.ts:21]
- [GET /productos](endpoints/GET--productos.md) [apps/servicio-inventario/src/app/app.controller.ts:28]
- [GET /productos/:id](endpoints/GET--productos-id.md) [apps/servicio-inventario/src/app/app.controller.ts:33]
- [POST /productos/lote](endpoints/POST--productos-lote.md) [apps/servicio-inventario/src/app/app.controller.ts:38]
- [POST /productos](endpoints/POST--productos.md) [apps/servicio-inventario/src/app/app.controller.ts:43]
- [PATCH /productos/:id/stock](endpoints/PATCH--productos-id-stock.md) [apps/servicio-inventario/src/app/app.controller.ts:48]

**Modelos de datos.**

- [Categoria](datos/Categoria.md) [apps/servicio-inventario/prisma/schema.prisma:11]
- [Producto](datos/Producto.md) [apps/servicio-inventario/prisma/schema.prisma:22]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-inventario/prisma/schema.prisma:38]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-inventario/prisma/schema.prisma:51]

**Eventos consumidos.**

- `RoutingKeys.PedidoCreado` -> `handlePedidoCreado` [apps/servicio-inventario/src/app/events.controller.ts:12]

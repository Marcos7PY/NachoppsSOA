---
tipo: indice-servicio
servicio: servicio-pedidos
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:12]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-pedidos

**Endpoints.**

- [POST /](endpoints/POST--raiz.md) [apps/servicio-pedidos/src/app/app.controller.ts:12]
- [GET /](endpoints/GET--raiz.md) [apps/servicio-pedidos/src/app/app.controller.ts:17]
- [PATCH /:id/estado](endpoints/PATCH--id-estado.md) [apps/servicio-pedidos/src/app/app.controller.ts:22]
- [PATCH /items/:itemId/estado](endpoints/PATCH--items-itemid-estado.md) [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Modelos de datos.**

- [Pedido](datos/Pedido.md) [apps/servicio-pedidos/prisma/schema.prisma:20]
- [PedidoItem](datos/PedidoItem.md) [apps/servicio-pedidos/prisma/schema.prisma:41]
- [MesaLocal](datos/MesaLocal.md) [apps/servicio-pedidos/prisma/schema.prisma:59]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-pedidos/prisma/schema.prisma:77]
- [ProductoLocal](datos/ProductoLocal.md) [apps/servicio-pedidos/prisma/schema.prisma:90]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-pedidos/prisma/schema.prisma:101]

**Eventos consumidos.**

- `RoutingKeys.PagoRegistrado` -> `procesarPago` [apps/servicio-pedidos/src/app/app.controller.ts:32]
- `RoutingKeys.MesaCreada` -> `handleMesaCreada` [apps/servicio-pedidos/src/app/events.controller.ts:13]
- `RoutingKeys.MesaActualizada` -> `handleMesaActualizada` [apps/servicio-pedidos/src/app/events.controller.ts:18]
- `RoutingKeys.ProductoCreado` -> `handleProductoCreado` [apps/servicio-pedidos/src/app/events.controller.ts:23]
- `RoutingKeys.ProductoActualizado` -> `handleProductoActualizado` [apps/servicio-pedidos/src/app/events.controller.ts:28]

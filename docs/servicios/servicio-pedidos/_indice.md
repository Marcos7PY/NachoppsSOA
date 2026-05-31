---
tipo: indice-servicio
servicio: servicio-pedidos
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:8]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-pedidos

**Endpoints.**

- [POST /](endpoints/POST--raiz.md) [apps/servicio-pedidos/src/app/app.controller.ts:12]
- [GET /](endpoints/GET--raiz.md) [apps/servicio-pedidos/src/app/app.controller.ts:17]
- [PATCH /:id/estado](endpoints/PATCH--id-estado.md) [apps/servicio-pedidos/src/app/app.controller.ts:22]
- [PATCH /items/:itemId/estado](endpoints/PATCH--items-itemid-estado.md) [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Modelos de datos.**

- [Pedido](datos/Pedido.md) [apps/servicio-pedidos/prisma/schema.prisma:20]
- [PedidoItem](datos/PedidoItem.md) [apps/servicio-pedidos/prisma/schema.prisma:36]
- [MesaLocal](datos/MesaLocal.md) [apps/servicio-pedidos/prisma/schema.prisma:54]
- [Modificador](datos/Modificador.md) [apps/servicio-pedidos/prisma/schema.prisma:62]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-pedidos/prisma/schema.prisma:72]
- [ProductoLocal](datos/ProductoLocal.md) [apps/servicio-pedidos/prisma/schema.prisma:85]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-pedidos/prisma/schema.prisma:96]

**Eventos consumidos.**

- `RoutingKeys.PagoRegistrado` en `procesarPago`. [apps/servicio-pedidos/src/app/app.controller.ts:32]
- `RoutingKeys.MesaCreada` en `handleMesaCreada`. [apps/servicio-pedidos/src/app/events.controller.ts:13]
- `RoutingKeys.MesaActualizada` en `handleMesaActualizada`. [apps/servicio-pedidos/src/app/events.controller.ts:18]
- `RoutingKeys.ProductoCreado` en `handleProductoCreado`. [apps/servicio-pedidos/src/app/events.controller.ts:23]
- `RoutingKeys.ProductoActualizado` en `handleProductoActualizado`. [apps/servicio-pedidos/src/app/events.controller.ts:28]

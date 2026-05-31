---
tipo: indice-servicio
servicio: servicio-cuentas
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:9]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-cuentas

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-cuentas/src/app/app.controller.ts:13]
- [POST /](endpoints/POST--raiz.md) [apps/servicio-cuentas/src/app/app.controller.ts:18]
- [GET /mesa/:mesaId](endpoints/GET--mesa-mesaid.md) [apps/servicio-cuentas/src/app/app.controller.ts:23]
- [GET /:id](endpoints/GET--id.md) [apps/servicio-cuentas/src/app/app.controller.ts:28]
- [POST /:id/dividir](endpoints/POST--id-dividir.md) [apps/servicio-cuentas/src/app/app.controller.ts:34]
- [POST /:id/cerrar](endpoints/POST--id-cerrar.md) [apps/servicio-cuentas/src/app/app.controller.ts:39]

**Modelos de datos.**

- [Cuenta](datos/Cuenta.md) [apps/servicio-cuentas/prisma/schema.prisma:16]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-cuentas/prisma/schema.prisma:30]

**Eventos consumidos.**

- `RoutingKeys.PedidoCreado` en `handlePedidoCreado`. [apps/servicio-cuentas/src/app/events.controller.ts:15]
- `RoutingKeys.PedidoActualizado` en `handlePedidoActualizado`. [apps/servicio-cuentas/src/app/events.controller.ts:22]
- `RoutingKeys.PagoRegistrado` en `handlePagoRegistrado`. [apps/servicio-cuentas/src/app/events.controller.ts:29]

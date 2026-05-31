---
tipo: indice-servicio
servicio: servicio-notificaciones
fuente: [apps/servicio-notificaciones/src/app/app.controller.ts:15]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-notificaciones

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-notificaciones/src/app/app.controller.ts:24]

**Modelos de datos.**

- [Notificacion](datos/Notificacion.md) [apps/servicio-notificaciones/prisma/schema.prisma:10]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-notificaciones/prisma/schema.prisma:21]

**Eventos consumidos.**

- `RoutingKeys.PedidoCreado` en `handlePedidoCreado`. [apps/servicio-notificaciones/src/app/app.controller.ts:29]
- `RoutingKeys.PedidoActualizado` en `handlePedidoActualizado`. [apps/servicio-notificaciones/src/app/app.controller.ts:37]
- `RoutingKeys.ReservaCreada` en `handleReservaCreada`. [apps/servicio-notificaciones/src/app/app.controller.ts:45]
- `RoutingKeys.ReservaCancelada` en `handleReservaCancelada`. [apps/servicio-notificaciones/src/app/app.controller.ts:53]

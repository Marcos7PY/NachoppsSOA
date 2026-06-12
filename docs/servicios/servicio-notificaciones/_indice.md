---
tipo: indice-servicio
servicio: servicio-notificaciones
fuente: [apps/servicio-notificaciones/src/app/app.controller.ts:27]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-notificaciones

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-notificaciones/src/app/app.controller.ts:27]

**Modelos de datos.**

- [Notificacion](datos/Notificacion.md) [apps/servicio-notificaciones/prisma/schema.prisma:10]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-notificaciones/prisma/schema.prisma:21]

**Eventos consumidos.**

- `RoutingKeys.PedidoCreado` -> `handlePedidoCreado` [apps/servicio-notificaciones/src/app/app.controller.ts:32]
- `RoutingKeys.PedidoActualizado` -> `handlePedidoActualizado` [apps/servicio-notificaciones/src/app/app.controller.ts:40]
- `RoutingKeys.CuentaAbierta` -> `handleCuentaAbierta` [apps/servicio-notificaciones/src/app/app.controller.ts:48]
- `RoutingKeys.CuentaCerrada` -> `handleCuentaCerrada` [apps/servicio-notificaciones/src/app/app.controller.ts:56]
- `RoutingKeys.MesaActualizada` -> `handleMesaActualizada` [apps/servicio-notificaciones/src/app/app.controller.ts:64]
- `RoutingKeys.ReservaCreada` -> `handleReservaCreada` [apps/servicio-notificaciones/src/app/app.controller.ts:72]
- `RoutingKeys.ReservaCancelada` -> `handleReservaCancelada` [apps/servicio-notificaciones/src/app/app.controller.ts:80]

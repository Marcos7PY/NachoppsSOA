---
tipo: evento
routing_key: cuenta.cerrada
constante: RoutingKeys.CuentaCerrada
fuente: [libs/contracts/src/events/routing-keys.ts:24]
revisado: 2026-06-02
commit: 53877c8
---

# cuenta.cerrada

**Definicion.** `RoutingKeys.CuentaCerrada` = `cuenta.cerrada`. [libs/contracts/src/events/routing-keys.ts:24]

**Productores detectados.**

- apps/servicio-cuentas/src/app/app.service.ts:287

**Consumidores detectados.**

- servicio-caja: `handleCuentaCerrada` [apps/servicio-caja/src/app/events.controller.ts:29]
- servicio-notificaciones: `handleCuentaCerrada` [apps/servicio-notificaciones/src/app/app.controller.ts:56]
- servicio-reportes: `handleCuentaCerrada` [apps/servicio-reportes/src/app/app.controller.ts:24]
- servicio-mesas: `handleCuentaCerrada` [apps/servicio-mesas/src/app/events.controller.ts:29]

**Estado.** usado.

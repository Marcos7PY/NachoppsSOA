---
tipo: evento
routing_key: cuenta.abierta
constante: RoutingKeys.CuentaAbierta
fuente: [libs/contracts/src/events/routing-keys.ts:23]
revisado: 2026-06-02
commit: 53877c8
---

# cuenta.abierta

**Definicion.** `RoutingKeys.CuentaAbierta` = `cuenta.abierta`. [libs/contracts/src/events/routing-keys.ts:23]

**Productores detectados.**

- apps/servicio-cuentas/src/app/app.service.ts:69
- apps/servicio-cuentas/src/app/app.service.ts:113

**Consumidores detectados.**

- servicio-caja: `handleCuentaAbierta` [apps/servicio-caja/src/app/events.controller.ts:16]
- servicio-notificaciones: `handleCuentaAbierta` [apps/servicio-notificaciones/src/app/app.controller.ts:48]
- servicio-mesas: `handleCuentaAbierta` [apps/servicio-mesas/src/app/events.controller.ts:16]

**Estado.** usado.

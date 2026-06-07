---
tipo: evento
routing_key: pago.registrado
constante: RoutingKeys.PagoRegistrado
fuente: [libs/contracts/src/events/routing-keys.ts:28]
revisado: 2026-06-02
commit: 53877c8
---

# pago.registrado

**Definicion.** `RoutingKeys.PagoRegistrado` = `pago.registrado`. [libs/contracts/src/events/routing-keys.ts:28]

**Productores detectados.**

- apps/servicio-caja/src/app/app.service.ts:110

**Consumidores detectados.**

- servicio-cuentas: `handlePagoRegistrado` [apps/servicio-cuentas/src/app/events.controller.ts:29]
- servicio-pedidos: `procesarPago` [apps/servicio-pedidos/src/app/app.controller.ts:32]

**Estado.** usado.

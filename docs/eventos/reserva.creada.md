---
tipo: evento
routing_key: reserva.creada
constante: RoutingKeys.ReservaCreada
fuente: [libs/contracts/src/events/routing-keys.ts:7]
revisado: 2026-06-02
commit: 53877c8
---

# reserva.creada

**Definicion.** `RoutingKeys.ReservaCreada` = `reserva.creada`. [libs/contracts/src/events/routing-keys.ts:7]

**Productores detectados.**

- apps/servicio-reservas/src/app/reservas.service.ts:85

**Consumidores detectados.**

- servicio-notificaciones: `handleReservaCreada` [apps/servicio-notificaciones/src/app/app.controller.ts:72]

**Estado.** usado.

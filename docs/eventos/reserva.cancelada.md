---
tipo: evento
routing_key: reserva.cancelada
constante: RoutingKeys.ReservaCancelada
fuente: [libs/contracts/src/events/routing-keys.ts:8]
revisado: 2026-06-02
commit: 53877c8
---

# reserva.cancelada

**Definicion.** `RoutingKeys.ReservaCancelada` = `reserva.cancelada`. [libs/contracts/src/events/routing-keys.ts:8]

**Productores detectados.**

- apps/servicio-reservas/src/app/reservas.service.ts:130

**Consumidores detectados.**

- servicio-notificaciones: `handleReservaCancelada` [apps/servicio-notificaciones/src/app/app.controller.ts:80]

**Estado.** usado.

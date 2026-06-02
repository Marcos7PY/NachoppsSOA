---
tipo: evento
routing_key: mesa.actualizada
constante: RoutingKeys.MesaActualizada
fuente: [libs/contracts/src/events/routing-keys.ts:13]
revisado: 2026-06-02
commit: 53877c8
---

# mesa.actualizada

**Definicion.** `RoutingKeys.MesaActualizada` = `mesa.actualizada`. [libs/contracts/src/events/routing-keys.ts:13]

**Productores detectados.**

- apps/servicio-mesas/src/app/app.service.ts:81

**Consumidores detectados.**

- servicio-notificaciones: `handleMesaActualizada` [apps/servicio-notificaciones/src/app/app.controller.ts:64]
- servicio-pedidos: `handleMesaActualizada` [apps/servicio-pedidos/src/app/events.controller.ts:18]

**Estado.** usado.

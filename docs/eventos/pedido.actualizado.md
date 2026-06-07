---
tipo: evento
routing_key: pedido.actualizado
constante: RoutingKeys.PedidoActualizado
fuente: [libs/contracts/src/events/routing-keys.ts:20]
revisado: 2026-06-02
commit: 53877c8
---

# pedido.actualizado

**Definicion.** `RoutingKeys.PedidoActualizado` = `pedido.actualizado`. [libs/contracts/src/events/routing-keys.ts:20]

**Productores detectados.**

- apps/servicio-pedidos/src/app/app.service.ts:263
- apps/servicio-pedidos/src/app/app.service.ts:336
- apps/servicio-pedidos/src/app/app.service.ts:384
- apps/servicio-pedidos/src/app/app.service.ts:399

**Consumidores detectados.**

- servicio-cuentas: `handlePedidoActualizado` [apps/servicio-cuentas/src/app/events.controller.ts:22]
- servicio-notificaciones: `handlePedidoActualizado` [apps/servicio-notificaciones/src/app/app.controller.ts:40]

**Estado.** usado.

---
tipo: evento
routing_key: pedido.creado
constante: RoutingKeys.PedidoCreado
fuente: [libs/contracts/src/events/routing-keys.ts:18]
revisado: 2026-06-02
commit: 53877c8
---

# pedido.creado

**Definicion.** `RoutingKeys.PedidoCreado` = `pedido.creado`. [libs/contracts/src/events/routing-keys.ts:18]

**Productores detectados.**

- apps/servicio-pedidos/src/app/app.service.ts:258

**Consumidores detectados.**

- servicio-cuentas: `handlePedidoCreado` [apps/servicio-cuentas/src/app/events.controller.ts:15]
- servicio-inventario: `handlePedidoCreado` [apps/servicio-inventario/src/app/events.controller.ts:12]
- servicio-notificaciones: `handlePedidoCreado` [apps/servicio-notificaciones/src/app/app.controller.ts:32]

**Estado.** usado.

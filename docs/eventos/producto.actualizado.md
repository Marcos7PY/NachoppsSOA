---
tipo: evento
routing_key: producto.actualizado
constante: RoutingKeys.ProductoActualizado
fuente: [libs/contracts/src/events/routing-keys.ts:35]
revisado: 2026-06-02
commit: 53877c8
---

# producto.actualizado

**Definicion.** `RoutingKeys.ProductoActualizado` = `producto.actualizado`. [libs/contracts/src/events/routing-keys.ts:35]

**Productores detectados.**

- apps/servicio-inventario/src/app/app.service.ts:199
- apps/servicio-inventario/src/app/app.service.ts:253

**Consumidores detectados.**

- servicio-pedidos: `handleProductoActualizado` [apps/servicio-pedidos/src/app/events.controller.ts:28]

**Estado.** usado.

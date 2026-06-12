---
tipo: evento
routing_key: producto.creado
constante: RoutingKeys.ProductoCreado
fuente: [libs/contracts/src/events/routing-keys.ts:34]
revisado: 2026-06-02
commit: 53877c8
---

# producto.creado

**Definicion.** `RoutingKeys.ProductoCreado` = `producto.creado`. [libs/contracts/src/events/routing-keys.ts:34]

**Productores detectados.**

- apps/servicio-inventario/src/app/app.service.ts:155

**Consumidores detectados.**

- servicio-pedidos: `handleProductoCreado` [apps/servicio-pedidos/src/app/events.controller.ts:23]

**Estado.** usado.

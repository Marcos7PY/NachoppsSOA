---
tipo: flujo
nombre: reposicion-stock-proyeccion-local
disparador: apps/servicio-inventario/src/app/app.service.ts:10
fuente: [apps/servicio-inventario/src/app/app.controller.ts:48, apps/servicio-inventario/src/app/app.service.ts:116, apps/servicio-inventario/src/app/app.service.ts:132, apps/servicio-pedidos/src/app/events.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:457]
revisado: 2026-06-02
commit: 53877c8
---

# Reposicion de stock proyecta delta local

**Disparador.** `PATCH /productos/:id/stock` de inventario llama `actualizarStock`. [apps/servicio-inventario/src/app/app.controller.ts:48, apps/servicio-inventario/src/app/app.service.ts:112]

**Secuencia.**

- Inventario calcula `nuevoStock` desde stock base mas cantidad y actualiza `Producto.stockActual`. [apps/servicio-inventario/src/app/app.service.ts:116, apps/servicio-inventario/src/app/app.service.ts:117, apps/servicio-inventario/src/app/app.service.ts:121]
- Inventario emite `producto.actualizado` con `stockSyncMode` REPOSICION si cantidad es positiva y `stockDelta` igual a la cantidad. [apps/servicio-inventario/src/app/app.service.ts:132, apps/servicio-inventario/src/app/app.service.ts:133, apps/servicio-inventario/src/app/app.service.ts:138]
- Pedidos consume `producto.actualizado`, reclama idempotencia y llama `upsertProductoLocal`. [apps/servicio-pedidos/src/app/events.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:399, apps/servicio-pedidos/src/app/app.service.ts:424]
- Pedidos aumenta la proyeccion local solo si `stockSyncMode === REPOSICION` y `stockDelta > 0`; aplica el delta sobre el stock existente. [apps/servicio-pedidos/src/app/app.service.ts:457, apps/servicio-pedidos/src/app/app.service.ts:460, apps/servicio-pedidos/src/app/app.service.ts:464]

**Estados y transiciones.** Inventario conserva la autoridad operacional de su tabla Producto; pedidos mantiene una proyeccion local para reservar pedidos con baja latencia y la actualiza por deltas idempotentes. [apps/servicio-inventario/src/app/app.service.ts:121, apps/servicio-pedidos/src/app/app.service.ts:450, apps/servicio-pedidos/src/app/app.service.ts:464]

**Fallo y reconvergencia.** Si el evento de reposicion se duplica, la clave unica de pedidos evita reaplicar el delta; si el consumidor falla antes de ACK, RabbitMQ puede redeliver y la misma clave absorbe el duplicado. [apps/servicio-pedidos/src/app/app.service.ts:427, apps/servicio-pedidos/src/app/app.service.ts:431, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Invariantes de extremo a extremo.** [reposicion-como-delta](../invariantes/reposicion-como-delta.md), [idempotencia-inversa](../invariantes/idempotencia-inversa.md), [trust-boundary-stock-sync-mode](../invariantes/trust-boundary-stock-sync-mode.md)


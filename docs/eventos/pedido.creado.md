---
tipo: evento
routingKey: pedido.creado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/pedidos.ts:123
fuente: [libs/contracts/src/events/routing-keys.ts:18, libs/contracts/src/domains/pedidos.ts:123, apps/servicio-pedidos/src/app/app.service.ts:230, apps/servicio-cuentas/src/app/events.controller.ts:15, apps/servicio-inventario/src/app/events.controller.ts:12, apps/servicio-notificaciones/src/app/app.controller.ts:29, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# pedido.creado

**Payload.** El routing key se declara como `PedidoCreado: 'pedido.creado'`. [libs/contracts/src/events/routing-keys.ts:18] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `PedidoCreadoPayload`. [libs/contracts/src/domains/pedidos.ts:123]

**Productor(es).**

- `routingKey: RoutingKeys.PedidoCreado,`. [apps/servicio-pedidos/src/app/app.service.ts:230]

**Consumidor(es).**

- `servicio-cuentas` consume con `handlePedidoCreado`. [apps/servicio-cuentas/src/app/events.controller.ts:15]
- `servicio-inventario` consume con `handlePedidoCreado`. [apps/servicio-inventario/src/app/events.controller.ts:12]
- `servicio-notificaciones` consume con `handlePedidoCreado`. [apps/servicio-notificaciones/src/app/app.controller.ts:29]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

---
tipo: evento
routingKey: pedido.actualizado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/pedidos.ts:136
fuente: [libs/contracts/src/events/routing-keys.ts:20, libs/contracts/src/domains/pedidos.ts:136, apps/servicio-pedidos/src/app/app.service.ts:235, apps/servicio-pedidos/src/app/app.service.ts:285, apps/servicio-pedidos/src/app/app.service.ts:333, apps/servicio-pedidos/src/app/app.service.ts:348, apps/servicio-cuentas/src/app/events.controller.ts:22, apps/servicio-notificaciones/src/app/app.controller.ts:37, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# pedido.actualizado

**Payload.** El routing key se declara como `PedidoActualizado: 'pedido.actualizado'`. [libs/contracts/src/events/routing-keys.ts:20] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `PedidoActualizadoPayload`. [libs/contracts/src/domains/pedidos.ts:136]

**Productor(es).**

- `routingKey: RoutingKeys.PedidoActualizado,`. [apps/servicio-pedidos/src/app/app.service.ts:235]
- `routingKey: RoutingKeys.PedidoActualizado,`. [apps/servicio-pedidos/src/app/app.service.ts:285]
- `routingKey: RoutingKeys.PedidoActualizado,`. [apps/servicio-pedidos/src/app/app.service.ts:333]
- `routingKey: RoutingKeys.PedidoActualizado,`. [apps/servicio-pedidos/src/app/app.service.ts:348]

**Consumidor(es).**

- `servicio-cuentas` consume con `handlePedidoActualizado`. [apps/servicio-cuentas/src/app/events.controller.ts:22]
- `servicio-notificaciones` consume con `handlePedidoActualizado`. [apps/servicio-notificaciones/src/app/app.controller.ts:37]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

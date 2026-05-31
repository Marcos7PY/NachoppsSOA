---
tipo: evento
routingKey: pedido.listo
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/pedidos.ts:129
fuente: [libs/contracts/src/events/routing-keys.ts:19, libs/contracts/src/domains/pedidos.ts:129, apps/servicio-pedidos/src/app/app.service.ts:275, apps/servicio-pedidos/src/app/app.service.ts:325, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# pedido.listo

**Payload.** El routing key se declara como `PedidoListo: 'pedido.listo'`. [libs/contracts/src/events/routing-keys.ts:19] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `PedidoListoPayload`. [libs/contracts/src/domains/pedidos.ts:129]

**Productor(es).**

- `routingKey: RoutingKeys.PedidoListo,`. [apps/servicio-pedidos/src/app/app.service.ts:275]
- `routingKey: RoutingKeys.PedidoListo,`. [apps/servicio-pedidos/src/app/app.service.ts:325]

**Consumidor(es).**

- No se detecto consumidor `@EventPattern(RoutingKeys.PedidoListo)`. [libs/contracts/src/events/routing-keys.ts:19]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

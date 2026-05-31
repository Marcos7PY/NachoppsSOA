---
tipo: evento
routingKey: arqueo.realizado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/events/routing-keys.ts:29
fuente: [libs/contracts/src/events/routing-keys.ts:29, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# arqueo.realizado

**Payload.** El routing key se declara como `ArqueoRealizado: 'arqueo.realizado'`. [libs/contracts/src/events/routing-keys.ts:29] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] No se detecto clase de payload dedicada en contracts.

**Productor(es).**

- No se detecto productor por busqueda de `RoutingKeys.ArqueoRealizado` en propiedades `routingKey` o llamadas `publish`. [libs/contracts/src/events/routing-keys.ts:29]

**Consumidor(es).**

- No se detecto consumidor `@EventPattern(RoutingKeys.ArqueoRealizado)`. [libs/contracts/src/events/routing-keys.ts:29]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este evento -->

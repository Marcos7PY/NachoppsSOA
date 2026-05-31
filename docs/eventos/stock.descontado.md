---
tipo: evento
routingKey: stock.descontado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/inventario.ts:14
fuente: [libs/contracts/src/events/routing-keys.ts:33, libs/contracts/src/domains/inventario.ts:14, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# stock.descontado

**Payload.** El routing key se declara como `StockDescontado: 'stock.descontado'`. [libs/contracts/src/events/routing-keys.ts:33] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `StockDescontadoPayload`. [libs/contracts/src/domains/inventario.ts:14]

**Productor(es).**

- No se detecto productor por busqueda de `RoutingKeys.StockDescontado` en propiedades `routingKey` o llamadas `publish`. [libs/contracts/src/events/routing-keys.ts:33]

**Consumidor(es).**

- No se detecto consumidor `@EventPattern(RoutingKeys.StockDescontado)`. [libs/contracts/src/events/routing-keys.ts:33]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

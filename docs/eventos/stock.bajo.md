---
tipo: evento
routingKey: stock.bajo
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/inventario.ts:3
fuente: [libs/contracts/src/events/routing-keys.ts:32, libs/contracts/src/domains/inventario.ts:3, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# stock.bajo

**Payload.** El routing key se declara como `StockBajo: 'stock.bajo'`. [libs/contracts/src/events/routing-keys.ts:32] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `StockBajoPayload`. [libs/contracts/src/domains/inventario.ts:3]

**Productor(es).**

- No se detecto productor por busqueda de `RoutingKeys.StockBajo` en propiedades `routingKey` o llamadas `publish`. [libs/contracts/src/events/routing-keys.ts:32]

**Consumidor(es).**

- No se detecto consumidor `@EventPattern(RoutingKeys.StockBajo)`. [libs/contracts/src/events/routing-keys.ts:32]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este evento -->

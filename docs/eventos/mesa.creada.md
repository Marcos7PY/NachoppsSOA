---
tipo: evento
routingKey: mesa.creada
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/events/routing-keys.ts:12
fuente: [libs/contracts/src/events/routing-keys.ts:12, apps/servicio-mesas/src/app/app.service.ts:37, apps/servicio-pedidos/src/app/events.controller.ts:13, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# mesa.creada

**Payload.** El routing key se declara como `MesaCreada: 'mesa.creada'`. [libs/contracts/src/events/routing-keys.ts:12] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] No se detecto clase de payload dedicada en contracts.

**Productor(es).**

- `routingKey: RoutingKeys.MesaCreada,`. [apps/servicio-mesas/src/app/app.service.ts:37]

**Consumidor(es).**

- `servicio-pedidos` consume con `handleMesaCreada`. [apps/servicio-pedidos/src/app/events.controller.ts:13]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

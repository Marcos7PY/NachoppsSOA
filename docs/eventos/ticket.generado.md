---
tipo: evento
routingKey: ticket.generado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/cuentas.ts:27
fuente: [libs/contracts/src/events/routing-keys.ts:25, libs/contracts/src/domains/cuentas.ts:27, apps/servicio-cuentas/src/app/app.service.ts:272, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# ticket.generado

**Payload.** El routing key se declara como `TicketGenerado: 'ticket.generado'`. [libs/contracts/src/events/routing-keys.ts:25] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `TicketGeneradoPayload`. [libs/contracts/src/domains/cuentas.ts:27]

**Productor(es).**

- `routingKey: RoutingKeys.TicketGenerado,`. [apps/servicio-cuentas/src/app/app.service.ts:272]

**Consumidor(es).**

- No se detecto consumidor `@EventPattern(RoutingKeys.TicketGenerado)`. [libs/contracts/src/events/routing-keys.ts:25]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

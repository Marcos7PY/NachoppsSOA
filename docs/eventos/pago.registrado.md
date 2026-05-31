---
tipo: evento
routingKey: pago.registrado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/events/routing-keys.ts:28
fuente: [libs/contracts/src/events/routing-keys.ts:28, apps/servicio-caja/src/app/app.service.ts:113, apps/servicio-pedidos/src/app/app.controller.ts:32, apps/servicio-cuentas/src/app/events.controller.ts:29, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# pago.registrado

**Payload.** El routing key se declara como `PagoRegistrado: 'pago.registrado'`. [libs/contracts/src/events/routing-keys.ts:28] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] No se detecto clase de payload dedicada en contracts.

**Productor(es).**

- `routingKey: RoutingKeys.PagoRegistrado,`. [apps/servicio-caja/src/app/app.service.ts:113]

**Consumidor(es).**

- `servicio-pedidos` consume con `procesarPago`. [apps/servicio-pedidos/src/app/app.controller.ts:32]
- `servicio-cuentas` consume con `handlePagoRegistrado`. [apps/servicio-cuentas/src/app/events.controller.ts:29]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

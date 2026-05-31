---
tipo: evento
routingKey: cuenta.cerrada
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/cuentas.ts:18
fuente: [libs/contracts/src/events/routing-keys.ts:24, libs/contracts/src/domains/cuentas.ts:18, apps/servicio-cuentas/src/app/app.service.ts:267, apps/servicio-mesas/src/app/events.controller.ts:28, apps/servicio-caja/src/app/events.controller.ts:29, apps/servicio-reportes/src/app/app.controller.ts:24, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# cuenta.cerrada

**Payload.** El routing key se declara como `CuentaCerrada: 'cuenta.cerrada'`. [libs/contracts/src/events/routing-keys.ts:24] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `CuentaCerradaPayload`. [libs/contracts/src/domains/cuentas.ts:18]

**Productor(es).**

- `routingKey: RoutingKeys.CuentaCerrada,`. [apps/servicio-cuentas/src/app/app.service.ts:267]

**Consumidor(es).**

- `servicio-mesas` consume con `handleCuentaCerrada`. [apps/servicio-mesas/src/app/events.controller.ts:28]
- `servicio-caja` consume con `handleCuentaCerrada`. [apps/servicio-caja/src/app/events.controller.ts:29]
- `servicio-reportes` consume con `handleCuentaCerrada`. [apps/servicio-reportes/src/app/app.controller.ts:24]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

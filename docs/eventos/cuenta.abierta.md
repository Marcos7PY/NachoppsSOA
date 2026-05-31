---
tipo: evento
routingKey: cuenta.abierta
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/cuentas.ts:11
fuente: [libs/contracts/src/events/routing-keys.ts:23, libs/contracts/src/domains/cuentas.ts:11, apps/servicio-cuentas/src/app/app.service.ts:69, apps/servicio-cuentas/src/app/app.service.ts:109, apps/servicio-mesas/src/app/events.controller.ts:16, apps/servicio-caja/src/app/events.controller.ts:16, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# cuenta.abierta

**Payload.** El routing key se declara como `CuentaAbierta: 'cuenta.abierta'`. [libs/contracts/src/events/routing-keys.ts:23] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `CuentaAbiertaPayload`. [libs/contracts/src/domains/cuentas.ts:11]

**Productor(es).**

- `routingKey: RoutingKeys.CuentaAbierta,`. [apps/servicio-cuentas/src/app/app.service.ts:69]
- `routingKey: RoutingKeys.CuentaAbierta,`. [apps/servicio-cuentas/src/app/app.service.ts:109]

**Consumidor(es).**

- `servicio-mesas` consume con `handleCuentaAbierta`. [apps/servicio-mesas/src/app/events.controller.ts:16]
- `servicio-caja` consume con `handleCuentaAbierta`. [apps/servicio-caja/src/app/events.controller.ts:16]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** [colas-limpias-happy-path](../invariantes/colas-limpias-happy-path.md)

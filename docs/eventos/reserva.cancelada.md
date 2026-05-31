---
tipo: evento
routingKey: reserva.cancelada
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/reservas.ts:74
fuente: [libs/contracts/src/events/routing-keys.ts:8, libs/contracts/src/domains/reservas.ts:74, apps/servicio-reservas/src/app/reservas.service.spec.ts:135, apps/servicio-reservas/src/app/reservas.service.ts:105, apps/servicio-notificaciones/src/app/app.controller.ts:53, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-30
commit: 4c186bb
---

# reserva.cancelada

**Payload.** El routing key se declara como `ReservaCancelada: 'reserva.cancelada'`. [libs/contracts/src/events/routing-keys.ts:8] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `ReservaCanceladaPayload`. [libs/contracts/src/domains/reservas.ts:74]

**Productor(es).**

- `routingKey: RoutingKeys.ReservaCancelada,`. [apps/servicio-reservas/src/app/reservas.service.spec.ts:135]
- `routingKey: RoutingKeys.ReservaCancelada,`. [apps/servicio-reservas/src/app/reservas.service.ts:105]

**Consumidor(es).**

- `servicio-notificaciones` consume con `handleReservaCancelada`. [apps/servicio-notificaciones/src/app/app.controller.ts:53]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** Ver [catalogo de invariantes](../invariantes/_indice.md).

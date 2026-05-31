---
tipo: evento
routingKey: reserva.creada
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/reservas.ts:69
fuente: [libs/contracts/src/events/routing-keys.ts:7, libs/contracts/src/domains/reservas.ts:69, apps/servicio-reservas/src/app/reservas.service.spec.ts:76, apps/servicio-reservas/src/app/reservas.service.ts:60, apps/servicio-notificaciones/src/app/app.controller.ts:45, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# reserva.creada

**Payload.** El routing key se declara como `ReservaCreada: 'reserva.creada'`. [libs/contracts/src/events/routing-keys.ts:7] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `ReservaCreadaPayload`. [libs/contracts/src/domains/reservas.ts:69]

**Productor(es).**

- `routingKey: RoutingKeys.ReservaCreada,`. [apps/servicio-reservas/src/app/reservas.service.spec.ts:76]
- `routingKey: RoutingKeys.ReservaCreada,`. [apps/servicio-reservas/src/app/reservas.service.ts:60]

**Consumidor(es).**

- `servicio-notificaciones` consume con `handleReservaCreada`. [apps/servicio-notificaciones/src/app/app.controller.ts:45]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** [slot-reserva-activo-unico](../invariantes/slot-reserva-activo-unico.md), [exactamente-un-exito-bajo-carrera](../invariantes/exactamente-un-exito-bajo-carrera.md)

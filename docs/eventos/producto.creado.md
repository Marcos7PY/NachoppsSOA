---
tipo: evento
routingKey: producto.creado
exchange: nachopps_exchange (topic)
payload: libs/contracts/src/domains/inventario.ts:85
fuente: [libs/contracts/src/events/routing-keys.ts:34, libs/contracts/src/domains/inventario.ts:85, apps/servicio-inventario/src/app/app.service.ts:100, apps/servicio-pedidos/src/app/events.controller.ts:23, libs/contracts/src/messaging/exchange.ts:2, libs/contracts/src/messaging/envelope.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# producto.creado

**Payload.** El routing key se declara como `ProductoCreado: 'producto.creado'`. [libs/contracts/src/events/routing-keys.ts:34] La envoltura `DomainEventEnvelope<TPayload>` tiene `pattern`, `data` y `metadata`. [libs/contracts/src/messaging/envelope.ts:13] El payload tipado inicia en `ProductoCreadoPayload`. [libs/contracts/src/domains/inventario.ts:85]

**Productor(es).**

- `routingKey: RoutingKeys.ProductoCreado,`. [apps/servicio-inventario/src/app/app.service.ts:100]

**Consumidor(es).**

- `servicio-pedidos` consume con `handleProductoCreado`. [apps/servicio-pedidos/src/app/events.controller.ts:23]

**Idempotencia.** La envoltura soporta `metadata.idempotencyKey`. [libs/contracts/src/messaging/envelope.ts:2] Las garantias concretas viven en los consumidores citados.

**Camino de fallo.** El publicador compartido declara DLQ por cola cuando recibe `queue` y `bindings`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:34] El interceptor RMQ aplica tres reintentos con demora inicial de 1000ms y NACK al agotar intentos. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes.** [idempotencia-inversa](../invariantes/idempotencia-inversa.md)

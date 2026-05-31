---
tipo: flujo
nombre: fallo-consumidor-dlq-reinyeccion-parking
disparador: libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25
fuente: [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:11, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, stress-tests/run-stock-idempotency-dlq.js:345, stress-tests/run-stock-idempotency-dlq.js:373]
revisado: 2026-05-31
commit: c5c7891
---

# Fallo de consumidor DLQ reinyeccion parking

**Disparador.** Un consumidor RMQ que lanza error entra al `RabbitMQRetryInterceptor`. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:11]

**Secuencia.**

- El interceptor solo actua en contextos rpc/rmq y obtiene canal y mensaje original desde `RmqContext`. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:14, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:18, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:22]
- Ante exito del handler, hace `channel.ack(originalMsg)`. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:38]
- Ante error, reintenta hasta tres veces con backoff 1000, 2000 y 4000 ms. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:55]
- Si agota reintentos, hace `nack(originalMsg, false, false)`; RabbitMQ enruta a la DLQ configurada por la cola. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35]
- El runner de stock reinyecta desde DLQ incrementando `x-reinjection-count` y aparca en `parking.inventario_queue` al superar `MAX_REINJECTIONS`. [stress-tests/run-stock-idempotency-dlq.js:345, stress-tests/run-stock-idempotency-dlq.js:373, stress-tests/run-stock-idempotency-dlq.js:378]

**Estados y transiciones.** El mensaje pasa de cola principal a DLQ tras NACK sin requeue; una reinyeccion lo devuelve a la cola principal con contador; al superar el tope termina en parking para inspeccion manual. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, stress-tests/run-stock-idempotency-dlq.js:345, stress-tests/run-stock-idempotency-dlq.js:378]

**Fallo y reconvergencia.** La reconvergencia depende de idempotencia del consumidor: al reinyectar `pedido.creado`, inventario reclama la misma clave y evita doble descuento si el efecto ya ocurrio. [apps/servicio-inventario/src/app/app.service.ts:222, apps/servicio-inventario/src/app/app.service.ts:231]

**Invariantes de extremo a extremo.** [colas-limpias-happy-path](../invariantes/colas-limpias-happy-path.md), [idempotencia-directa](../invariantes/idempotencia-directa.md)

---
tipo: invariante
slug: colas-limpias-happy-path
estado: verificada
fuente: [apps/servicio-reportes/src/main.ts:39, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, apps/servicio-inventario/src/app/outbox.processor.ts:41, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:96, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:2424]
revisado: 2026-06-02
commit: 53877c8
---

# colas-limpias-happy-path

**Enunciado.** El happy path termina sin mensajes pendientes en colas principales, DLQ o parking. [apps/servicio-reportes/src/main.ts:39]

**Por que importa.** Si falla, mensajes exitosos quedan sin ACK o fallos recuperados dejan residuo en DLQ/parking y ocultan divergencia operativa. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Mecanismo que la garantiza.** Los consumidores RMQ usan `noAck: false` en la configuracion de microservicio; `RabbitMQRetryInterceptor` hace `ack` cuando el handler completa y `nack(false,false)` cuando agota reintentos. La publicacion sale desde outbox: los processors leen PENDING, publican y marcan PROCESSED, evitando marcar eventos enviados antes de publicar. [apps/servicio-reportes/src/main.ts:39, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, apps/servicio-inventario/src/app/outbox.processor.ts:41]

**Prueba que la verifica.** Los reportes cierran con tablas de colas donde `parking.inventario_queue` y `dlq.*` quedan en 0 ready / 0 unacked. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:96, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:118, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:2424]


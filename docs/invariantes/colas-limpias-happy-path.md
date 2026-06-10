---
tipo: invariante
slug: colas-limpias-happy-path
estado: verificada
fuente: [apps/servicio-reportes/src/main.ts:39, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, libs/resiliencia/src/lib/outbox.processor.ts:122, stress-tests/run-outbox-replicas.js, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:96, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:2424]
revisado: 2026-06-09
commit: 474bb93
---

# colas-limpias-happy-path

**Enunciado.** El happy path termina sin mensajes pendientes en colas principales, DLQ o parking. [apps/servicio-reportes/src/main.ts:39]

**Por que importa.** Si falla, mensajes exitosos quedan sin ACK o fallos recuperados dejan residuo en DLQ/parking y ocultan divergencia operativa. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Mecanismo que la garantiza.** Los consumidores RMQ usan `noAck: false` en la configuracion de microservicio; `RabbitMQRetryInterceptor` hace `ack` cuando el handler completa y `nack(false,false)` cuando agota reintentos. La publicacion sale desde outbox: el `OutboxProcessor` (en `libs/resiliencia`) reclama cada lote con `FOR UPDATE SKIP LOCKED` (status PENDING→PUBLISHING), publica y marca PROCESSED, evitando marcar eventos enviados antes de publicar. Tras T-08 la garantia se sostiene con N replicas por servicio: dos processors sobre el mismo store nunca reclaman el mismo evento, y un cron de rescate devuelve a PENDING los PUBLISHING huerfanos (>60s) sin perder ninguno. [apps/servicio-reportes/src/main.ts:39, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, libs/resiliencia/src/lib/outbox.processor.ts:122]

**Prueba que la verifica.** `stress-tests/run-outbox-replicas.js` (`npm run probar:replicas`) ejercita el claim con 2 workers concurrentes contra la BD de pedidos: (a) cada evento se reclama/publica exactamente una vez en el happy path y (b) al morir una replica a mitad de lote, el rescate devuelve los huerfanos y cero eventos se pierden — estable en 3 ejecuciones consecutivas. Ademas, los reportes de caos cierran con `parking.inventario_queue` y `dlq.*` en 0 ready / 0 unacked. [stress-tests/run-outbox-replicas.js, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:96, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:2424]


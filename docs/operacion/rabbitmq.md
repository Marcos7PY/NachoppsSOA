---
tipo: operacion
nombre: rabbitmq
fuente: [infra/docker-compose.yml:5, libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:28, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]
revisado: 2026-05-30
commit: 4c186bb
---

# RabbitMQ

RabbitMQ usa la imagen `rabbitmq:3-management` en Docker Compose. [infra/docker-compose.yml:5]

El publicador compartido declara `NACHOPPS_DLX` y `nachopps_exchange`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:28, libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:31]

El interceptor RMQ define tres reintentos con demora inicial de 1000ms. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

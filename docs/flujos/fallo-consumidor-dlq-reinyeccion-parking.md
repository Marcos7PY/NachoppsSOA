---
tipo: flujo
nombre: fallo-consumidor-dlq-reinyeccion-parking
disparador: libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25
fuente: [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, docs/eventos/pedido.creado.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Procesar fallo de consumidor con DLQ, reinyeccion y parking

**Disparador.** El paso inicial citado pertenece a `libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts`. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Secuencia.** Eventos enlazados: [pedido.creado](../eventos/pedido.creado.md). [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

---
tipo: flujo
nombre: reserva-crear-cancelar-notificar
disparador: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:19, docs/eventos/reserva.creada.md:1, docs/eventos/reserva.cancelada.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Crear o cancelar reserva y notificar

**Disparador.** El paso inicial citado pertenece a `apps/servicio-reservas/src/app/app.controller.ts`. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Secuencia.** Eventos enlazados: [reserva.creada](../eventos/reserva.creada.md), [reserva.cancelada](../eventos/reserva.cancelada.md). [apps/servicio-reservas/src/app/app.controller.ts:19]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

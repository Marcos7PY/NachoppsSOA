---
tipo: flujo
nombre: apertura-cuenta-ocupa-mesa
disparador: apps/servicio-cuentas/src/app/app.service.ts:69
fuente: [apps/servicio-cuentas/src/app/app.service.ts:69, docs/eventos/cuenta.abierta.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Abrir cuenta y ocupar mesa mediante evento de cuenta abierta

**Disparador.** El paso inicial citado pertenece a `apps/servicio-cuentas/src/app/app.service.ts`. [apps/servicio-cuentas/src/app/app.service.ts:69]

**Secuencia.** Eventos enlazados: [cuenta.abierta](../eventos/cuenta.abierta.md). [apps/servicio-cuentas/src/app/app.service.ts:69]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [apps/servicio-cuentas/src/app/app.service.ts:69]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

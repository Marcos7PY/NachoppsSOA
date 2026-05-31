---
tipo: flujo
nombre: pago-cierra-cuenta-libera-mesa
disparador: apps/servicio-caja/src/app/app.controller.ts:14
fuente: [apps/servicio-caja/src/app/app.controller.ts:14, docs/eventos/pago.registrado.md:1, docs/eventos/cuenta.cerrada.md:1, docs/eventos/mesa.liberada.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Registrar pago, cerrar cuenta, liberar mesa y registrar venta diaria

**Disparador.** El paso inicial citado pertenece a `apps/servicio-caja/src/app/app.controller.ts`. [apps/servicio-caja/src/app/app.controller.ts:14]

**Secuencia.** Eventos enlazados: [pago.registrado](../eventos/pago.registrado.md), [cuenta.cerrada](../eventos/cuenta.cerrada.md), [mesa.liberada](../eventos/mesa.liberada.md). [apps/servicio-caja/src/app/app.controller.ts:14]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [apps/servicio-caja/src/app/app.controller.ts:14]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

---
tipo: flujo
nombre: reposicion-stock-proyeccion-local
disparador: apps/servicio-inventario/src/app/app.service.ts:10
fuente: [apps/servicio-inventario/src/app/app.service.ts:10, docs/eventos/producto.actualizado.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Reponer stock y proyectar el cambio hacia pedidos

**Disparador.** El paso inicial citado pertenece a `apps/servicio-inventario/src/app/app.service.ts`. [apps/servicio-inventario/src/app/app.service.ts:10]

**Secuencia.** Eventos enlazados: [producto.actualizado](../eventos/producto.actualizado.md). [apps/servicio-inventario/src/app/app.service.ts:10]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [apps/servicio-inventario/src/app/app.service.ts:10]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

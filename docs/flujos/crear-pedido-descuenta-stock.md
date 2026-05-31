---
tipo: flujo
nombre: crear-pedido-descuenta-stock
disparador: apps/servicio-pedidos/src/app/app.controller.ts:12
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:12, docs/eventos/pedido.creado.md:1, docs/eventos/producto.actualizado.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Crear pedido, descontar stock, abrir o anexar cuenta y notificar cocina/barra

**Disparador.** El paso inicial citado pertenece a `apps/servicio-pedidos/src/app/app.controller.ts`. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Secuencia.** Eventos enlazados: [pedido.creado](../eventos/pedido.creado.md), [producto.actualizado](../eventos/producto.actualizado.md). [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Estados y transiciones.** Consultar los modelos Prisma y contratos enlazados por los eventos de la secuencia. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Fallo y reconvergencia.** Para consumidores RMQ aplica el interceptor de reintentos y NACK citado en operacion RabbitMQ. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25]

**Invariantes de extremo a extremo.** Ver [invariantes](../invariantes/_indice.md).

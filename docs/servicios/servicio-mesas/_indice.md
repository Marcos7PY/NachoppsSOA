---
tipo: indice-servicio
servicio: servicio-mesas
fuente: [apps/servicio-mesas/src/app/app.controller.ts:5]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-mesas

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-mesas/src/app/app.controller.ts:9]
- [GET /:id](endpoints/GET--id.md) [apps/servicio-mesas/src/app/app.controller.ts:14]
- [POST /](endpoints/POST--raiz.md) [apps/servicio-mesas/src/app/app.controller.ts:19]
- [PATCH /:id/estado](endpoints/PATCH--id-estado.md) [apps/servicio-mesas/src/app/app.controller.ts:24]

**Modelos de datos.**

- [Mesa](datos/Mesa.md) [apps/servicio-mesas/prisma/schema.prisma:17]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-mesas/prisma/schema.prisma:31]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-mesas/prisma/schema.prisma:44]

**Eventos consumidos.**

- `RoutingKeys.CuentaAbierta` en `handleCuentaAbierta`. [apps/servicio-mesas/src/app/events.controller.ts:16]
- `RoutingKeys.CuentaCerrada` en `handleCuentaCerrada`. [apps/servicio-mesas/src/app/events.controller.ts:28]

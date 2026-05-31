---
tipo: indice-servicio
servicio: servicio-reservas
fuente: [apps/servicio-reservas/src/app/app.controller.ts:5]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-reservas

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-reservas/src/app/app.controller.ts:9]
- [GET /disponibilidad](endpoints/GET--disponibilidad.md) [apps/servicio-reservas/src/app/app.controller.ts:14]
- [POST /](endpoints/POST--raiz.md) [apps/servicio-reservas/src/app/app.controller.ts:19]
- [PATCH /:id/confirmar](endpoints/PATCH--id-confirmar.md) [apps/servicio-reservas/src/app/app.controller.ts:24]
- [DELETE /:id](endpoints/DELETE--id.md) [apps/servicio-reservas/src/app/app.controller.ts:29]

**Modelos de datos.**

- [Reserva](datos/Reserva.md) [apps/servicio-reservas/prisma/schema.prisma:10]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-reservas/prisma/schema.prisma:27]

**Eventos consumidos.**

- Sin `@EventPattern` detectado en controladores del servicio. [apps/servicio-reservas/src/app/app.controller.ts:5]

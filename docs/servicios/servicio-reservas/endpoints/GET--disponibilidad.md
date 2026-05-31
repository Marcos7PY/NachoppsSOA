---
tipo: endpoint
servicio: servicio-reservas
metodo: GET
ruta: /disponibilidad
handler: apps/servicio-reservas/src/app/app.controller.ts:14
fuente: [apps/servicio-reservas/src/app/app.controller.ts:14, apps/servicio-reservas/src/app/app.controller.ts:15, apps/servicio-reservas/src/app/reservas.service.ts:117]
revisado: 2026-05-31
commit: c5c7891
---

# GET /disponibilidad

**Proposito.** Consulta disponibilidad de reserva para fecha y hora. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-reservas/src/app/app.module.ts:2, apps/servicio-reservas/src/app/app.controller.ts:14]

**Entrada.** `fecha: string` via Query. [apps/servicio-reservas/src/app/app.controller.ts:15] `hora: string` via Query. [apps/servicio-reservas/src/app/app.controller.ts:15]

**Salida.** Respuesta derivada del handler `disponibilidad` y del servicio `consultarDisponibilidad`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reservas/src/app/app.controller.ts:15]

**Efectos.** No se observan escrituras Prisma en el camino del servicio; el efecto es de lectura o respuesta directa. [apps/servicio-reservas/src/app/reservas.service.ts:117]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-reservas/src/app/reservas.service.ts:117]

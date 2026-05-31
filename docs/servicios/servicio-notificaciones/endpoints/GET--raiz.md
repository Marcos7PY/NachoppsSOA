---
tipo: endpoint
servicio: servicio-notificaciones
metodo: GET
ruta: /
handler: apps/servicio-notificaciones/src/app/app.controller.ts:24
fuente: [apps/servicio-notificaciones/src/app/app.controller.ts:24, apps/servicio-notificaciones/src/app/app.controller.ts:25, apps/servicio-notificaciones/src/app/app.service.ts:5]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** getData atiende GET / en servicio-notificaciones usando `getData`. [apps/servicio-notificaciones/src/app/app.controller.ts:24]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-notificaciones/src/app/app.module.ts:2, apps/servicio-notificaciones/src/app/app.controller.ts:24]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-notificaciones/src/app/app.controller.ts:25]

**Salida.** Respuesta derivada del handler `getData` y del servicio `getData`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-notificaciones/src/app/app.controller.ts:25]

**Efectos.** No se observan escrituras Prisma en el camino del servicio; el efecto es de lectura o respuesta directa. [apps/servicio-notificaciones/src/app/app.service.ts:5]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-notificaciones/src/app/app.service.ts:5]

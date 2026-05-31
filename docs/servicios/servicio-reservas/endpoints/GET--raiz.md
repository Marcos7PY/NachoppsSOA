---
tipo: endpoint
servicio: servicio-reservas
metodo: GET
ruta: /
handler: apps/servicio-reservas/src/app/app.controller.ts:9
fuente: [apps/servicio-reservas/src/app/app.controller.ts:9, apps/servicio-reservas/src/app/app.controller.ts:10, apps/servicio-reservas/src/app/reservas.service.ts:28]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** listar atiende GET / en servicio-reservas usando `listar`. [apps/servicio-reservas/src/app/app.controller.ts:9]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-reservas/src/app/app.module.ts:2, apps/servicio-reservas/src/app/app.controller.ts:9]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-reservas/src/app/app.controller.ts:10]

**Salida.** Respuesta derivada del handler `listar` y del servicio `listar`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reservas/src/app/app.controller.ts:10]

**Efectos.** Usa `reserva.findMany`. [apps/servicio-reservas/src/app/reservas.service.ts:28]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-reservas/src/app/reservas.service.ts:28]

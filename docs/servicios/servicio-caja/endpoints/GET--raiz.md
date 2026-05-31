---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /
handler: apps/servicio-caja/src/app/app.controller.ts:19
fuente: [apps/servicio-caja/src/app/app.controller.ts:19, apps/servicio-caja/src/app/app.controller.ts:20, apps/servicio-caja/src/app/app.service.ts:136]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** listarTransacciones atiende GET / en servicio-caja usando `listarTransacciones`. [apps/servicio-caja/src/app/app.controller.ts:19]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-caja/src/app/app.module.ts:2, apps/servicio-caja/src/app/app.controller.ts:19]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-caja/src/app/app.controller.ts:20]

**Salida.** Respuesta derivada del handler `listarTransacciones` y del servicio `listarTransacciones`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-caja/src/app/app.controller.ts:20]

**Efectos.** Usa `transaccion.findMany`. [apps/servicio-caja/src/app/app.service.ts:136]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-caja/src/app/app.service.ts:136]

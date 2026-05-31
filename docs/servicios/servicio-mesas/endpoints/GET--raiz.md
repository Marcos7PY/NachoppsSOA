---
tipo: endpoint
servicio: servicio-mesas
metodo: GET
ruta: /
handler: apps/servicio-mesas/src/app/app.controller.ts:9
fuente: [apps/servicio-mesas/src/app/app.controller.ts:9, apps/servicio-mesas/src/app/app.controller.ts:10, apps/servicio-mesas/src/app/app.service.ts:12]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** listarMesas atiende GET / en servicio-mesas usando `listarMesas`. [apps/servicio-mesas/src/app/app.controller.ts:9]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-mesas/src/app/app.module.ts:2, apps/servicio-mesas/src/app/app.controller.ts:9]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-mesas/src/app/app.controller.ts:10]

**Salida.** Respuesta derivada del handler `listarMesas` y del servicio `listarMesas`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-mesas/src/app/app.controller.ts:10]

**Efectos.** Usa `mesa.findMany`. [apps/servicio-mesas/src/app/app.service.ts:12]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-mesas/src/app/app.service.ts:12]

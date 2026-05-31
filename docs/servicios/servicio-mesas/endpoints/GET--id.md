---
tipo: endpoint
servicio: servicio-mesas
metodo: GET
ruta: /:id
handler: apps/servicio-mesas/src/app/app.controller.ts:14
fuente: [apps/servicio-mesas/src/app/app.controller.ts:14, apps/servicio-mesas/src/app/app.controller.ts:15, apps/servicio-mesas/src/app/app.service.ts:95]
revisado: 2026-05-31
commit: c5c7891
---

# GET /:id

**Proposito.** obtenerMesa atiende GET /:id en servicio-mesas usando `obtenerMesa`. [apps/servicio-mesas/src/app/app.controller.ts:14]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-mesas/src/app/app.module.ts:2, apps/servicio-mesas/src/app/app.controller.ts:14]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-mesas/src/app/app.controller.ts:15]

**Salida.** Respuesta derivada del handler `obtenerMesa` y del servicio `obtenerMesa`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-mesas/src/app/app.controller.ts:15]

**Efectos.** Usa `mesa.findUnique`. [apps/servicio-mesas/src/app/app.service.ts:95]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Mesa con ID ${id} no encontrada.);. [apps/servicio-mesas/src/app/app.service.ts:98]

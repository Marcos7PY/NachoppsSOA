---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /health
handler: apps/servicio-caja/src/app/app.controller.ts:9
fuente: [apps/servicio-caja/src/app/app.controller.ts:9]
revisado: 2026-05-31
commit: c5c7891
---

# GET /health

**Proposito.** healthCheck atiende GET /health en servicio-caja. [apps/servicio-caja/src/app/app.controller.ts:9]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-caja/src/app/app.module.ts:2, apps/servicio-caja/src/app/app.controller.ts:9]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-caja/src/app/app.controller.ts:10]

**Salida.** Respuesta derivada del handler `healthCheck`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-caja/src/app/app.controller.ts:10]

**Efectos.** <!-- sin evidencia: no se detecto llamada de servicio desde el controlador -->

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No hay llamada de servicio detectable; solo aplica la validacion del handler si corresponde. [apps/servicio-caja/src/app/app.controller.ts:9]

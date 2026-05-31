---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:13
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:13]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:13]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-cuentas/src/app/app.controller.ts:14]

**Salida.** Respuesta derivada del handler `healthCheck`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:14]

**Efectos.** <!-- sin evidencia: no se detecto llamada de servicio desde el controlador -->

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No hay llamada de servicio detectable; solo aplica la validacion del handler si corresponde. [apps/servicio-cuentas/src/app/app.controller.ts:13]

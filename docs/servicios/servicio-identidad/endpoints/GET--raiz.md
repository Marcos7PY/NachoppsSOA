---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /
handler: apps/servicio-identidad/src/auth/auth.controller.ts:28
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:28]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:28]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-identidad/src/auth/auth.controller.ts:28]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:29]

**Salida.** Respuesta derivada del handler `healthCheck`; codigos esperados: 200 si el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:29]

**Efectos.** <!-- sin evidencia: no se detecto llamada de servicio desde el controlador -->

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No hay llamada de servicio detectable; solo aplica la validacion del handler si corresponde. [apps/servicio-identidad/src/auth/auth.controller.ts:28]

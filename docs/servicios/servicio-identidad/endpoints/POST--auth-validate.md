---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/validate
handler: apps/servicio-identidad/src/auth/auth.controller.ts:50
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:50, apps/servicio-identidad/src/auth/auth.controller.ts:51, apps/servicio-identidad/src/auth/auth.service.ts:84]
revisado: 2026-05-31
commit: c5c7891
---

# POST /auth/validate

**Proposito.** validate atiende POST /auth/validate en servicio-identidad usando `validarToken`. [apps/servicio-identidad/src/auth/auth.controller.ts:50]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-identidad/src/auth/auth.controller.ts:50]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:51]

**Salida.** Respuesta derivada del handler `validate` y del servicio `validarToken`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:51]

**Efectos.** No se observan escrituras Prisma en el camino del servicio; el efecto es de lectura o respuesta directa. [apps/servicio-identidad/src/auth/auth.service.ts:84]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-identidad/src/auth/auth.service.ts:84]

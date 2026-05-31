---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /usuarios
handler: apps/servicio-identidad/src/auth/auth.controller.ts:74
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:74, apps/servicio-identidad/src/auth/auth.controller.ts:75, apps/servicio-identidad/src/auth/auth.service.ts:135]
revisado: 2026-05-31
commit: c5c7891
---

# GET /usuarios

**Proposito.** Lista usuarios para administracion. [apps/servicio-identidad/src/auth/auth.controller.ts:74]

**Autorizacion.** `JwtAuthGuard` y `RolesGuard` en el endpoint; roles exigidos: ADMIN. [apps/servicio-identidad/src/auth/auth.controller.ts:57, apps/servicio-identidad/src/auth/auth.controller.ts:66]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:75]

**Salida.** Respuesta derivada del handler `listarUsuarios` y del servicio `listarUsuarios`; codigos esperados: 200 si el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:75]

**Efectos.** Usa `usuario.findMany`. [apps/servicio-identidad/src/auth/auth.service.ts:135]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-identidad/src/auth/auth.service.ts:135]

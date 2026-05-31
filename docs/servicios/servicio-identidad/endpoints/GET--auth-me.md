---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /auth/me
handler: apps/servicio-identidad/src/auth/auth.controller.ts:58
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:58, apps/servicio-identidad/src/auth/auth.controller.ts:59, apps/servicio-identidad/src/auth/auth.service.ts:95]
revisado: 2026-05-31
commit: c5c7891
---

# GET /auth/me

**Proposito.** Devuelve el usuario autenticado. [apps/servicio-identidad/src/auth/auth.controller.ts:58]

**Autorizacion.** `JwtAuthGuard` en el endpoint, sin `@Roles` local. [apps/servicio-identidad/src/auth/auth.controller.ts:57]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:59]

**Salida.** Respuesta derivada del handler `me` y del servicio `obtenerPerfil`; codigos esperados: 200 si el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:59]

**Efectos.** Usa `usuario.findUnique`. [apps/servicio-identidad/src/auth/auth.service.ts:95]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException('Usuario no encontrado');. [apps/servicio-identidad/src/auth/auth.service.ts:101]

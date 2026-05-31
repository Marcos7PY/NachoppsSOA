---
tipo: endpoint
servicio: servicio-identidad
metodo: PATCH
ruta: /usuarios/:id/rol
handler: apps/servicio-identidad/src/auth/auth.controller.ts:81
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:81, apps/servicio-identidad/src/auth/auth.controller.ts:82, apps/servicio-identidad/src/auth/auth.service.ts:142]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /usuarios/:id/rol

**Proposito.** Actualiza el rol de un usuario. [apps/servicio-identidad/src/auth/auth.controller.ts:81]

**Autorizacion.** `JwtAuthGuard` y `RolesGuard` en el endpoint; roles exigidos: ADMIN. [apps/servicio-identidad/src/auth/auth.controller.ts:57, apps/servicio-identidad/src/auth/auth.controller.ts:66]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:82]

**Salida.** Respuesta derivada del handler `handler` y del servicio `cambiarRol`; codigos esperados: 200 si el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:82]

**Efectos.** Usa `usuario.findUnique`, `usuario.update`, `auditoriaLog.create`. [apps/servicio-identidad/src/auth/auth.service.ts:142]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException('Usuario no encontrado');. [apps/servicio-identidad/src/auth/auth.service.ts:145]

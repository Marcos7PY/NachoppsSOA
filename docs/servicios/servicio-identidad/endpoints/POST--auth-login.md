---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/login
handler: apps/servicio-identidad/src/auth/auth.controller.ts:36
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:36, apps/servicio-identidad/src/auth/auth.controller.ts:37, apps/servicio-identidad/src/auth/auth.service.ts:35, libs/contracts/src/domains/identidad.ts:39]
revisado: 2026-05-31
commit: c5c7891
---

# POST /auth/login

**Proposito.** Autentica credenciales y emite token de acceso. [apps/servicio-identidad/src/auth/auth.controller.ts:36]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-identidad/src/auth/auth.controller.ts:36]

**Entrada.** DTO `LoginCommand` con campos: `email: string` (@IsEmail()). [libs/contracts/src/domains/identidad.ts:41] `password: string` (@IsEmail() @IsString() @IsNotEmpty()). [libs/contracts/src/domains/identidad.ts:45]

**Salida.** Respuesta derivada del handler `login` y del servicio `login`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:37]

**Efectos.** Usa `usuario.findUnique`, `auditoriaLog.create`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-identidad/src/auth/auth.service.ts:35] Emite o consume eventos `RoutingKeys.UsuarioAutenticado`. [apps/servicio-identidad/src/auth/auth.service.ts:62]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-identidad/src/auth/auth.service.ts:35]

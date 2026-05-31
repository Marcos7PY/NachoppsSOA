---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /usuarios
handler: apps/servicio-identidad/src/auth/auth.controller.ts:67
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:67, apps/servicio-identidad/src/auth/auth.controller.ts:68, apps/servicio-identidad/src/auth/auth.service.ts:109, libs/contracts/src/domains/identidad.ts:48]
revisado: 2026-05-31
commit: c5c7891
---

# POST /usuarios

**Proposito.** Crea un usuario administrativo. [apps/servicio-identidad/src/auth/auth.controller.ts:67]

**Autorizacion.** `JwtAuthGuard` y `RolesGuard` en el endpoint; roles exigidos: ADMIN. [apps/servicio-identidad/src/auth/auth.controller.ts:57, apps/servicio-identidad/src/auth/auth.controller.ts:66]

**Entrada.** DTO `CrearUsuarioCommand` con campos: `nombre: string` (@IsString() @IsNotEmpty()). [libs/contracts/src/domains/identidad.ts:51] `email: string` (@IsString() @IsNotEmpty() @IsEmail()). [libs/contracts/src/domains/identidad.ts:54] `password: string` (@IsEmail() @IsString() @MinLength(8)). [libs/contracts/src/domains/identidad.ts:58] `rol: RolUsuario` (@IsString() @MinLength(8) @IsEnum(RolUsuario)). [libs/contracts/src/domains/identidad.ts:61]

**Salida.** Respuesta derivada del handler `crearUsuario` y del servicio `crearUsuario`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-identidad/src/auth/auth.controller.ts:68]

**Efectos.** Usa `usuario.findUnique`, `usuario.create`, `auditoriaLog.create`. [apps/servicio-identidad/src/auth/auth.service.ts:109]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 409 por `ConflictException`: throw new ConflictException('Ya existe un usuario con ese email');. [apps/servicio-identidad/src/auth/auth.service.ts:115]

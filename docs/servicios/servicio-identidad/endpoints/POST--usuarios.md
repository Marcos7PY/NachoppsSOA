---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /usuarios
handler: apps/servicio-identidad/src/auth/auth.controller.ts:113
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:113, apps/servicio-identidad/src/auth/auth.service.ts:112]
revisado: 2026-06-02
commit: 53877c8
---

# POST /usuarios

**Proposito.** crearUsuario atiende POST /usuarios en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:113]

**Autorizacion.** @UseGuards(JwtAuthGuard, RolesGuard) con @Roles('ADMIN'). [apps/servicio-identidad/src/auth/auth.controller.ts:111]

**Entrada.** body `CrearUsuarioCommand` (nombre: string, email: string, password: string, rol: RolUsuario). [apps/servicio-identidad/src/auth/auth.controller.ts:114]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:113]

**Efectos.** llama `crearUsuario`; Prisma: `usuario.findUnique`, `usuario.create`. [apps/servicio-identidad/src/auth/auth.service.ts:112]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- 401 si `JwtAuthGuard` rechaza credenciales o token.
- 403 si `RolesGuard` rechaza el rol requerido.
- Conflict por `ConflictException` declarado en el camino de servicio.

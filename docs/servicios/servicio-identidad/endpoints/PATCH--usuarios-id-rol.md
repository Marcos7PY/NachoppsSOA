---
tipo: endpoint
servicio: servicio-identidad
metodo: PATCH
ruta: /usuarios/:id/rol
handler: apps/servicio-identidad/src/auth/auth.controller.ts:127
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:127, apps/servicio-identidad/src/auth/auth.service.ts:177]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /usuarios/:id/rol

**Proposito.** cambiarRol atiende PATCH /usuarios/:id/rol en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:127]

**Autorizacion.** @UseGuards(JwtAuthGuard, RolesGuard) con @Roles('ADMIN'). [apps/servicio-identidad/src/auth/auth.controller.ts:125]

**Entrada.** params id: string; body `CambiarRolCommand` (rol: RolUsuario). [apps/servicio-identidad/src/auth/auth.controller.ts:131]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:127]

**Efectos.** llama `cambiarRol`; Prisma: `usuario.findUnique`, `usuario.update`. [apps/servicio-identidad/src/auth/auth.service.ts:177]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- 401 si `JwtAuthGuard` rechaza credenciales o token.
- 403 si `RolesGuard` rechaza el rol requerido.
- NotFound por `NotFoundException` declarado en el camino de servicio.

---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /usuarios
handler: apps/servicio-identidad/src/auth/auth.controller.ts:120
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:120, apps/servicio-identidad/src/auth/auth.service.ts:138]
revisado: 2026-06-02
commit: 53877c8
---

# GET /usuarios

**Proposito.** listarUsuarios atiende GET /usuarios en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:120]

**Autorizacion.** @UseGuards(JwtAuthGuard, RolesGuard) con @Roles('ADMIN'). [apps/servicio-identidad/src/auth/auth.controller.ts:118]

**Entrada.** query `ListarUsuariosQuery` (limit?: number, cursor?: string, rol?: RolUsuario, search?: string, updatedSince?: string). [apps/servicio-identidad/src/auth/auth.controller.ts:121]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:120]

**Efectos.** llama `listarUsuarios`; Prisma: `usuario.findMany`. [apps/servicio-identidad/src/auth/auth.service.ts:138]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- 401 si `JwtAuthGuard` rechaza credenciales o token.
- 403 si `RolesGuard` rechaza el rol requerido.

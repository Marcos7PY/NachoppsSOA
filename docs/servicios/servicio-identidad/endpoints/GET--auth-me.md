---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /auth/me
handler: apps/servicio-identidad/src/auth/auth.controller.ts:104
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:104, apps/servicio-identidad/src/auth/auth.service.ts:98]
revisado: 2026-06-02
commit: 53877c8
---

# GET /auth/me

**Proposito.** me atiende GET /auth/me en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:104]

**Autorizacion.** @UseGuards(JwtAuthGuard). [apps/servicio-identidad/src/auth/auth.controller.ts:103]

**Entrada.** request autenticado. [apps/servicio-identidad/src/auth/auth.controller.ts:105]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:104]

**Efectos.** llama `obtenerPerfil`; Prisma: `usuario.findUnique`. [apps/servicio-identidad/src/auth/auth.service.ts:98]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- 401 si `JwtAuthGuard` rechaza credenciales o token.
- NotFound por `NotFoundException` declarado en el camino de servicio.

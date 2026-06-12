---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/logout
handler: apps/servicio-identidad/src/auth/auth.controller.ts:75
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:75]
revisado: 2026-06-02
commit: 53877c8
---

# POST /auth/logout

**Proposito.** logout atiende POST /auth/logout en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:75]

**Autorizacion.** @UseGuards(JwtAuthGuard). [apps/servicio-identidad/src/auth/auth.controller.ts:74]

**Entrada.** response Express passthrough. [apps/servicio-identidad/src/auth/auth.controller.ts:76]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:73]

**Efectos.** cookies: `clearCookie:access_token`, `clearCookie:nachopps.csrf_token`. [apps/servicio-identidad/src/auth/auth.controller.ts:76]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- 401 si `JwtAuthGuard` rechaza credenciales o token.

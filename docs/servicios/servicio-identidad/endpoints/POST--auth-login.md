---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/login
handler: apps/servicio-identidad/src/auth/auth.controller.ts:47
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:47, apps/servicio-identidad/src/auth/auth.service.ts:38]
revisado: 2026-06-02
commit: 53877c8
---

# POST /auth/login

**Proposito.** login atiende POST /auth/login en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:47]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-identidad/src/auth/auth.controller.ts:47]

**Entrada.** body `LoginCommand` (email: string, password: string); response Express passthrough. [apps/servicio-identidad/src/auth/auth.controller.ts:51]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:46]

**Efectos.** llama `login`; Prisma: `usuario.findUnique`, `auditoriaLog.create`, `outboxEvent.create`; eventos: `RoutingKeys.UsuarioAutenticado`; cookies: `cookie:access_token`, `cookie:nachopps.csrf_token`. [apps/servicio-identidad/src/auth/auth.service.ts:38]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- Unauthorized por `UnauthorizedException` declarado en el camino de servicio.

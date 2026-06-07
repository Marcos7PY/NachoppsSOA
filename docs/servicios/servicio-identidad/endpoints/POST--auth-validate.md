---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/validate
handler: apps/servicio-identidad/src/auth/auth.controller.ts:96
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:96, apps/servicio-identidad/src/auth/auth.service.ts:87]
revisado: 2026-06-02
commit: 53877c8
---

# POST /auth/validate

**Proposito.** validate atiende POST /auth/validate en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:96]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-identidad/src/auth/auth.controller.ts:96]

**Entrada.** body `{ token: string }`. [apps/servicio-identidad/src/auth/auth.controller.ts:97]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:95]

**Efectos.** llama `validarToken`. [apps/servicio-identidad/src/auth/auth.service.ts:87]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- Unauthorized por `UnauthorizedException` declarado en el camino de servicio.

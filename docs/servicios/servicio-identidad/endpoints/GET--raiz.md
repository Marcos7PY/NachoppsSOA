---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /
handler: apps/servicio-identidad/src/auth/auth.controller.ts:39
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:39]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:39]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-identidad/src/auth/auth.controller.ts:39]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-identidad/src/auth/auth.controller.ts:40]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:39]

**Efectos.** no se detectan escrituras Prisma ni eventos en el camino directo del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:40]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

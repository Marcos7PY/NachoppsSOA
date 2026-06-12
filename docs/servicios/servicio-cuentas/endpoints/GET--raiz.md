---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:13
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:13]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:13]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:13]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-cuentas/src/app/app.controller.ts:14]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:13]

**Efectos.** no se detectan escrituras Prisma ni eventos en el camino directo del handler. [apps/servicio-cuentas/src/app/app.controller.ts:14]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

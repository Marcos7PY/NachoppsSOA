---
tipo: endpoint
servicio: servicio-reportes
metodo: GET
ruta: /
handler: apps/servicio-reportes/src/app/app.controller.ts:14
fuente: [apps/servicio-reportes/src/app/app.controller.ts:14]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-reportes. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-reportes/src/app/app.controller.ts:15]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Efectos.** no se detectan escrituras Prisma ni eventos en el camino directo del handler. [apps/servicio-reportes/src/app/app.controller.ts:15]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

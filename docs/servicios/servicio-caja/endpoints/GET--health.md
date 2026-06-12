---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /health
handler: apps/servicio-caja/src/app/app.controller.ts:9
fuente: [apps/servicio-caja/src/app/app.controller.ts:9]
revisado: 2026-06-02
commit: 53877c8
---

# GET /health

**Proposito.** healthCheck atiende GET /health en servicio-caja. [apps/servicio-caja/src/app/app.controller.ts:9]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-caja/src/app/app.controller.ts:9]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-caja/src/app/app.controller.ts:10]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-caja/src/app/app.controller.ts:9]

**Efectos.** no se detectan escrituras Prisma ni eventos en el camino directo del handler. [apps/servicio-caja/src/app/app.controller.ts:10]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

---
tipo: endpoint
servicio: servicio-mesas
metodo: GET
ruta: /:id
handler: apps/servicio-mesas/src/app/app.controller.ts:14
fuente: [apps/servicio-mesas/src/app/app.controller.ts:14, apps/servicio-mesas/src/app/app.service.ts:98]
revisado: 2026-06-02
commit: 53877c8
---

# GET /:id

**Proposito.** obtenerMesa atiende GET /:id en servicio-mesas. [apps/servicio-mesas/src/app/app.controller.ts:14]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-mesas/src/app/app.controller.ts:14]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-mesas/src/app/app.controller.ts:15]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-mesas/src/app/app.controller.ts:14]

**Efectos.** llama `obtenerMesa`; Prisma: `mesa.findUnique`. [apps/servicio-mesas/src/app/app.service.ts:98]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /:id
handler: apps/servicio-cuentas/src/app/app.controller.ts:28
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:28, apps/servicio-cuentas/src/app/app.service.ts:209]
revisado: 2026-06-02
commit: 53877c8
---

# GET /:id

**Proposito.** obtenerCuenta atiende GET /:id en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-cuentas/src/app/app.controller.ts:29]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Efectos.** llama `obtenerCuenta`; Prisma: `cuenta.findUnique`. [apps/servicio-cuentas/src/app/app.service.ts:209]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

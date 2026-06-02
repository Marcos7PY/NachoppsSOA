---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /mesa/:mesaId
handler: apps/servicio-cuentas/src/app/app.controller.ts:23
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:23, apps/servicio-cuentas/src/app/app.service.ts:218]
revisado: 2026-06-02
commit: 53877c8
---

# GET /mesa/:mesaId

**Proposito.** obtenerCuentaPorMesa atiende GET /mesa/:mesaId en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-cuentas/src/app/app.controller.ts:24]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Efectos.** llama `obtenerCuentaPorMesa`; Prisma: `cuenta.findFirst`. [apps/servicio-cuentas/src/app/app.service.ts:218]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

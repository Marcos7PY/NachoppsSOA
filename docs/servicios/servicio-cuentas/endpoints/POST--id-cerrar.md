---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /:id/cerrar
handler: apps/servicio-cuentas/src/app/app.controller.ts:39
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:39, apps/servicio-cuentas/src/app/app.service.ts:228]
revisado: 2026-06-02
commit: 53877c8
---

# POST /:id/cerrar

**Proposito.** cerrarCuenta atiende POST /:id/cerrar en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:39]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:39]

**Entrada.** body `CerrarCuentaCommand` (descuento?: number). [apps/servicio-cuentas/src/app/app.controller.ts:40]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:39]

**Efectos.** llama `cerrarCuenta`; Prisma: `cuenta.findUnique`, `cuenta.updateMany`, `outboxEvent.createMany`; eventos: `RoutingKeys.CuentaCerrada`, `RoutingKeys.TicketGenerado`. [apps/servicio-cuentas/src/app/app.service.ts:228]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.
- BadRequest por `BadRequestException` declarado en el camino de servicio.

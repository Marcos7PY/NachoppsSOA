---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:18
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:18, apps/servicio-cuentas/src/app/app.service.ts:45]
revisado: 2026-06-02
commit: 53877c8
---

# POST /

**Proposito.** abrirCuenta atiende POST / en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Entrada.** body `AbrirCuentaCommand` (mesaId: string). [apps/servicio-cuentas/src/app/app.controller.ts:19]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Efectos.** llama `abrirCuenta`; Prisma: `cuenta.findFirst`, `cuenta.create`, `outboxEvent.create`; eventos: `RoutingKeys.CuentaAbierta`. [apps/servicio-cuentas/src/app/app.service.ts:45]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- BadRequest por `BadRequestException` declarado en el camino de servicio.

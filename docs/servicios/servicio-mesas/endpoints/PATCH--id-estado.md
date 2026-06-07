---
tipo: endpoint
servicio: servicio-mesas
metodo: PATCH
ruta: /:id/estado
handler: apps/servicio-mesas/src/app/app.controller.ts:24
fuente: [apps/servicio-mesas/src/app/app.controller.ts:24, apps/servicio-mesas/src/app/app.service.ts:50]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /:id/estado

**Proposito.** actualizarEstado atiende PATCH /:id/estado en servicio-mesas. [apps/servicio-mesas/src/app/app.controller.ts:24]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-mesas/src/app/app.controller.ts:24]

**Entrada.** body `ActualizarEstadoMesaCommand` (estado: MesaEstado, cuentaAsociada?: string | null). [apps/servicio-mesas/src/app/app.controller.ts:25]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-mesas/src/app/app.controller.ts:24]

**Efectos.** llama `actualizarEstado`; Prisma: `mesa.findUnique`, `mesa.updateMany`, `outboxEvent.create`; eventos: `RoutingKeys.MesaActualizada`. [apps/servicio-mesas/src/app/app.service.ts:50]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.
- Conflict por `ConflictException` declarado en el camino de servicio.

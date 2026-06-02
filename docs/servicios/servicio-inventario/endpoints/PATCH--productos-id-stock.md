---
tipo: endpoint
servicio: servicio-inventario
metodo: PATCH
ruta: /productos/:id/stock
handler: apps/servicio-inventario/src/app/app.controller.ts:48
fuente: [apps/servicio-inventario/src/app/app.controller.ts:48, apps/servicio-inventario/src/app/app.service.ts:167]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /productos/:id/stock

**Proposito.** actualizarStock atiende PATCH /productos/:id/stock en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Entrada.** params id: string. [apps/servicio-inventario/src/app/app.controller.ts:49]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Efectos.** llama `actualizarStock`; Prisma: `producto.findUnique`, `producto.update`, `outboxEvent.create`; eventos: `RoutingKeys.ProductoActualizado`. [apps/servicio-inventario/src/app/app.service.ts:167]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

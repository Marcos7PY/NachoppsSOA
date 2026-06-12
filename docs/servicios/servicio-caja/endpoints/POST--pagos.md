---
tipo: endpoint
servicio: servicio-caja
metodo: POST
ruta: /pagos
handler: apps/servicio-caja/src/app/app.controller.ts:14
fuente: [apps/servicio-caja/src/app/app.controller.ts:14, apps/servicio-caja/src/app/app.service.ts:41]
revisado: 2026-06-02
commit: 53877c8
---

# POST /pagos

**Proposito.** registrarPago atiende POST /pagos en servicio-caja. [apps/servicio-caja/src/app/app.controller.ts:14]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-caja/src/app/app.controller.ts:14]

**Entrada.** body `PagarPedidoCommand` (cuentaId: string, montoRecibido: number, metodo: string). [apps/servicio-caja/src/app/app.controller.ts:15]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-caja/src/app/app.controller.ts:14]

**Efectos.** llama `registrarPago`; Prisma: `cuentaAbierta.upsert`, `transaccion.aggregate`, `transaccion.create`, `outboxEvent.create`; eventos: `RoutingKeys.PagoRegistrado`. [apps/servicio-caja/src/app/app.service.ts:41]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.
- ServiceUnavailable por `ServiceUnavailableException` declarado en el camino de servicio.
- BadRequest por `BadRequestException` declarado en el camino de servicio.

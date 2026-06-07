---
tipo: endpoint
servicio: servicio-reservas
metodo: POST
ruta: /
handler: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/reservas.service.ts:60]
revisado: 2026-06-02
commit: 53877c8
---

# POST /

**Proposito.** crear atiende POST / en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Entrada.** body `CrearReservaCommand` (clienteId?: string, clienteNombre?: string, clienteTelefono?: string, fecha: string, hora: string, mesaPreferida?: string, numComensales?: number). [apps/servicio-reservas/src/app/app.controller.ts:20]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Efectos.** llama `crear`; Prisma: `reserva.create`, `outboxEvent.create`; eventos: `RoutingKeys.ReservaCreada`. [apps/servicio-reservas/src/app/reservas.service.ts:60]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- Conflict por `ConflictException` declarado en el camino de servicio.

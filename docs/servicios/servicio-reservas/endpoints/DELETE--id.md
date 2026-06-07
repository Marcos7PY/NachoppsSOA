---
tipo: endpoint
servicio: servicio-reservas
metodo: DELETE
ruta: /:id
handler: apps/servicio-reservas/src/app/app.controller.ts:29
fuente: [apps/servicio-reservas/src/app/app.controller.ts:29, apps/servicio-reservas/src/app/reservas.service.ts:118]
revisado: 2026-06-02
commit: 53877c8
---

# DELETE /:id

**Proposito.** cancelar atiende DELETE /:id en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Entrada.** params id: string; query params motivo: string. [apps/servicio-reservas/src/app/app.controller.ts:30]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Efectos.** llama `cancelar`; Prisma: `reserva.update`, `outboxEvent.create`; eventos: `RoutingKeys.ReservaCancelada`. [apps/servicio-reservas/src/app/reservas.service.ts:118]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

---
tipo: endpoint
servicio: servicio-reservas
metodo: PATCH
ruta: /:id/confirmar
handler: apps/servicio-reservas/src/app/app.controller.ts:24
fuente: [apps/servicio-reservas/src/app/app.controller.ts:24, apps/servicio-reservas/src/app/reservas.service.ts:104]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /:id/confirmar

**Proposito.** confirmar atiende PATCH /:id/confirmar en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Entrada.** params id: string. [apps/servicio-reservas/src/app/app.controller.ts:25]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Efectos.** llama `confirmar`; Prisma: `reserva.update`. [apps/servicio-reservas/src/app/reservas.service.ts:104]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- Conflict por `ConflictException` declarado en el camino de servicio.

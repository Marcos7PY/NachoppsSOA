---
tipo: endpoint
servicio: servicio-reservas
metodo: DELETE
ruta: /:id
handler: apps/servicio-reservas/src/app/app.controller.ts:29
fuente: [apps/servicio-reservas/src/app/app.controller.ts:29, apps/servicio-reservas/src/app/app.controller.ts:30, apps/servicio-reservas/src/app/reservas.service.ts:93]
revisado: 2026-05-31
commit: c5c7891
---

# DELETE /:id

**Proposito.** Cancela una reserva existente. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-reservas/src/app/app.module.ts:2, apps/servicio-reservas/src/app/app.controller.ts:29]

**Entrada.** `id: string` via Param. [apps/servicio-reservas/src/app/app.controller.ts:30]

**Salida.** Respuesta derivada del handler `cancelar` y del servicio `cancelar`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reservas/src/app/app.controller.ts:30]

**Efectos.** Usa `reserva.update`, `outboxEvent.create`, `reserva.findUnique`. La operacion incluye una transaccion Prisma. [apps/servicio-reservas/src/app/reservas.service.ts:93] Emite o consume eventos `RoutingKeys.ReservaCancelada`. [apps/servicio-reservas/src/app/reservas.service.ts:105]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Reserva ${id} no encontrada);. [apps/servicio-reservas/src/app/reservas.service.ts:177]

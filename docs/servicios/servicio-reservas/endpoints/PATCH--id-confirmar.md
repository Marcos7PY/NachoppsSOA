---
tipo: endpoint
servicio: servicio-reservas
metodo: PATCH
ruta: /:id/confirmar
handler: apps/servicio-reservas/src/app/app.controller.ts:24
fuente: [apps/servicio-reservas/src/app/app.controller.ts:24, apps/servicio-reservas/src/app/app.controller.ts:25, apps/servicio-reservas/src/app/reservas.service.ts:79]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /:id/confirmar

**Proposito.** Confirma una reserva pendiente. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-reservas/src/app/app.module.ts:2, apps/servicio-reservas/src/app/app.controller.ts:24]

**Entrada.** `id: string` via Param. [apps/servicio-reservas/src/app/app.controller.ts:25]

**Salida.** Respuesta derivada del handler `confirmar` y del servicio `confirmar`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reservas/src/app/app.controller.ts:25]

**Efectos.** Usa `reserva.update`, `reserva.findUnique`. [apps/servicio-reservas/src/app/reservas.service.ts:79]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Reserva ${id} no encontrada);. [apps/servicio-reservas/src/app/reservas.service.ts:177]
- 409 por `ConflictException`: throw new ConflictException('Solo se pueden confirmar reservas pendientes');. [apps/servicio-reservas/src/app/reservas.service.ts:82]

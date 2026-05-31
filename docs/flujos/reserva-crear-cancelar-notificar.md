---
tipo: flujo
nombre: reserva-crear-cancelar-notificar
disparador: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/app.controller.ts:29, apps/servicio-reservas/src/app/reservas.service.ts:70, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-notificaciones/src/app/app.controller.ts:45]
revisado: 2026-05-31
commit: c5c7891
---

# Reserva crear cancelar notificar

**Disparador.** `POST /` crea reserva y `DELETE /:id` cancela reserva en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/app.controller.ts:29]

**Secuencia.**

- Al crear, reservas valida disponibilidad para fecha/hora y crea la fila Reserva. [apps/servicio-reservas/src/app/reservas.service.ts:35, apps/servicio-reservas/src/app/reservas.service.ts:70, apps/servicio-reservas/src/app/reservas.service.ts:45]
- La base impone slot activo unico por indice parcial y el servicio traduce P2002 a ConflictException. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-reservas/src/app/reservas.service.ts:142]
- Reservas emite `reserva.creada` o `reserva.cancelada` por Outbox. [apps/servicio-reservas/src/app/reservas.service.ts:60, apps/servicio-reservas/src/app/reservas.service.ts:105]
- Notificaciones consume ambos eventos para registrar/enviar notificaciones. [apps/servicio-notificaciones/src/app/app.controller.ts:45, apps/servicio-notificaciones/src/app/app.controller.ts:53]

**Estados y transiciones.** La reserva nace PENDIENTE o CONFIRMADA segun el comando, puede pasar a CONFIRMADA y al cancelar pasa a CANCELADA; los estados CANCELADA/EXPIRADA no participan en el indice parcial de slot activo. [apps/servicio-reservas/src/app/reservas.service.ts:11, apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:12]

**Fallo y reconvergencia.** Si notificaciones falla, su cola esta con `noAck:false` y DLQ configurada; la reserva ya quedo persistida y el evento puede reintentarse desde RabbitMQ/Outbox. [apps/servicio-notificaciones/src/main.ts:43, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes de extremo a extremo.** [slot-reserva-activo-unico](../invariantes/slot-reserva-activo-unico.md), [exactamente-un-exito-bajo-carrera](../invariantes/exactamente-un-exito-bajo-carrera.md)

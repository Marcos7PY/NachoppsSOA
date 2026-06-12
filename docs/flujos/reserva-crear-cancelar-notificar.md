---
tipo: flujo
nombre: reserva-crear-cancelar-notificar
disparador: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:23, apps/servicio-reservas/src/app/app.controller.ts:37, apps/servicio-reservas/src/app/reservas.service.ts:73, apps/servicio-reservas/src/app/reservas.service.ts:144, apps/servicio-notificaciones/src/app/app.controller.ts:45]
revisado: 2026-06-11
commit: 53877c8
---

# Reserva crear cancelar notificar

**Disparador.** `POST /` crea reserva y `DELETE /:id` cancela reserva en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/app.controller.ts:29]

**Secuencia.**

- Al crear, reservas exige mesa, valida disponibilidad para fecha/hora/mesa y crea la fila Reserva. [apps/servicio-reservas/src/app/reservas.service.ts:62, apps/servicio-reservas/src/app/reservas.service.ts:73, apps/servicio-reservas/src/app/reservas.service.ts:174]
- La base impone mesa/franja activa unica por indice parcial y el servicio traduce P2002 a ConflictException. [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14, apps/servicio-reservas/src/app/reservas.service.ts:144, apps/servicio-reservas/src/app/reservas.service.ts:174]
- Reservas emite `reserva.creada` o `reserva.cancelada` por Outbox. [apps/servicio-reservas/src/app/reservas.service.ts:60, apps/servicio-reservas/src/app/reservas.service.ts:105]
- Notificaciones consume ambos eventos para registrar/enviar notificaciones. [apps/servicio-notificaciones/src/app/app.controller.ts:45, apps/servicio-notificaciones/src/app/app.controller.ts:53]

**Estados y transiciones.** La reserva nace PENDIENTE, puede pasar a CONFIRMADA y al cancelar pasa a CANCELADA; los estados CANCELADA/EXPIRADA no participan en el indice parcial de mesa/franja activa. [apps/servicio-reservas/src/app/reservas.service.ts:12, apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:16]

**Fallo y reconvergencia.** Si notificaciones falla, su cola esta con `noAck:false` y DLQ configurada; la reserva ya quedo persistida y el evento puede reintentarse desde RabbitMQ/Outbox. [apps/servicio-notificaciones/src/main.ts:43, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes de extremo a extremo.** [slot-reserva-activo-unico](../invariantes/slot-reserva-activo-unico.md), [exactamente-un-exito-bajo-carrera](../invariantes/exactamente-un-exito-bajo-carrera.md)


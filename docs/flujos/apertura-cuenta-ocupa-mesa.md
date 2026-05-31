---
tipo: flujo
nombre: apertura-cuenta-ocupa-mesa
disparador: apps/servicio-cuentas/src/app/app.service.ts:69
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:18, apps/servicio-cuentas/src/app/app.service.ts:45, apps/servicio-cuentas/src/app/app.service.ts:69, apps/servicio-mesas/src/app/events.controller.ts:16]
revisado: 2026-05-31
commit: c5c7891
---

# Apertura de cuenta ocupa mesa

**Disparador.** `POST /` de cuentas llama `abrirCuenta`. [apps/servicio-cuentas/src/app/app.controller.ts:18, apps/servicio-cuentas/src/app/app.service.ts:45]

**Secuencia.**

- servicio-cuentas busca cuenta abierta de la mesa y crea una cuenta ABIERTA cuando no existe. [apps/servicio-cuentas/src/app/app.service.ts:46, apps/servicio-cuentas/src/app/app.service.ts:47]
- Cuentas emite `cuenta.abierta` en Outbox con `cuentaId` y `mesaId`. [apps/servicio-cuentas/src/app/app.service.ts:69]
- Mesas consume `cuenta.abierta` y actualiza la mesa a ocupada/asociada a cuenta. [apps/servicio-mesas/src/app/events.controller.ts:16, apps/servicio-mesas/src/app/events.controller.ts:23]
- Caja tambien consume `cuenta.abierta` para crear la proyeccion de cuenta abierta. [apps/servicio-caja/src/app/events.controller.ts:16]

**Estados y transiciones.** La cuenta queda ABIERTA y la mesa deja de estar disponible mientras conserva la asociacion de cuenta. [apps/servicio-cuentas/src/app/app.service.ts:47, apps/servicio-mesas/src/app/events.controller.ts:23]

**Fallo y reconvergencia.** Si el evento no llega a mesas o caja, queda pendiente en Outbox hasta publicarse; si el consumidor falla, el interceptor reintenta y luego manda a DLQ. [apps/servicio-cuentas/src/app/outbox.processor.ts:21, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:45, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes de extremo a extremo.** [colas-limpias-happy-path](../invariantes/colas-limpias-happy-path.md)

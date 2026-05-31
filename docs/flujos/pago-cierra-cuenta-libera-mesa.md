---
tipo: flujo
nombre: pago-cierra-cuenta-libera-mesa
disparador: apps/servicio-caja/src/app/app.controller.ts:14
fuente: [apps/servicio-caja/src/app/app.controller.ts:14, apps/servicio-caja/src/app/app.service.ts:42, apps/servicio-caja/src/app/app.service.ts:113, apps/servicio-cuentas/src/app/events.controller.ts:29, apps/servicio-mesas/src/app/events.controller.ts:21]
revisado: 2026-05-31
commit: c5c7891
---

# Pago cierra cuenta libera mesa

**Disparador.** `POST /pagos` de caja llama `registrarPago`. [apps/servicio-caja/src/app/app.controller.ts:14, apps/servicio-caja/src/app/app.service.ts:40]

**Secuencia.**

- servicio-caja serializa por cuenta con `pg_advisory_xact_lock`, evita pago duplicado si ya existe una transaccion de la cuenta y crea `Transaccion`. [apps/servicio-caja/src/app/app.service.ts:42, apps/servicio-caja/src/app/app.service.ts:44, apps/servicio-caja/src/app/app.service.ts:60]
- Caja crea o actualiza `CuentaAbierta` y emite `pago.registrado` por Outbox. [apps/servicio-caja/src/app/app.service.ts:75, apps/servicio-caja/src/app/app.service.ts:103, apps/servicio-caja/src/app/app.service.ts:113]
- Cuentas consume `pago.registrado`, cierra la cuenta y emite `cuenta.cerrada` y `ticket.generado`. [apps/servicio-cuentas/src/app/events.controller.ts:29, apps/servicio-cuentas/src/app/app.service.ts:1, apps/servicio-cuentas/src/app/app.service.ts:267, apps/servicio-cuentas/src/app/app.service.ts:272]
- Mesas consume `cuenta.cerrada` y libera la mesa; reportes consume `cuenta.cerrada` para registrar venta diaria. [apps/servicio-mesas/src/app/events.controller.ts:21, apps/servicio-reportes/src/app/app.controller.ts:24]
- Pedidos consume `pago.registrado` para marcar pedidos relacionados como pagados. [apps/servicio-pedidos/src/app/app.controller.ts:32, apps/servicio-pedidos/src/app/app.service.ts:513]

**Estados y transiciones.** La cuenta pasa de ABIERTA a CERRADA/PAGADA segun el servicio que la proyecta, la mesa vuelve a DISPONIBLE y los pedidos quedan PAGADO. [apps/servicio-cuentas/src/app/app.service.ts:258, apps/servicio-mesas/src/app/events.controller.ts:21, apps/servicio-pedidos/src/app/app.service.ts:517]

**Fallo y reconvergencia.** Si un consumidor cae, cada cola con `noAck:false` y el interceptor decide ACK/NACK; al reinyectar, los consumidores deben reconverger desde los eventos persistidos en Outbox. [apps/servicio-caja/src/main.ts:42, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Invariantes de extremo a extremo.** [colas-limpias-happy-path](../invariantes/colas-limpias-happy-path.md), [exactamente-un-exito-bajo-carrera](../invariantes/exactamente-un-exito-bajo-carrera.md)

---
tipo: indice-maestro
fuente: [package.json:63, libs/contracts/src/events/routing-keys.ts:5]
revisado: 2026-05-30
commit: 4c186bb
---

# Documentacion atomica Nachopps

Nachopps Restobar es un monorepo Nx con aplicaciones y librerias declaradas en workspaces. [package.json:63]

- [Arquitectura](arquitectura.md)
- Servicios: [servicio-identidad](servicios/servicio-identidad/_indice.md), [servicio-mesas](servicios/servicio-mesas/_indice.md), [servicio-pedidos](servicios/servicio-pedidos/_indice.md), [servicio-cuentas](servicios/servicio-cuentas/_indice.md), [servicio-reservas](servicios/servicio-reservas/_indice.md), [servicio-inventario](servicios/servicio-inventario/_indice.md), [servicio-notificaciones](servicios/servicio-notificaciones/_indice.md), [servicio-caja](servicios/servicio-caja/_indice.md), [servicio-reportes](servicios/servicio-reportes/_indice.md)
- [Catalogo de eventos](eventos/_catalogo.md)
- Flujos: [crear-pedido-descuenta-stock](flujos/crear-pedido-descuenta-stock.md), [pago-cierra-cuenta-libera-mesa](flujos/pago-cierra-cuenta-libera-mesa.md), [apertura-cuenta-ocupa-mesa](flujos/apertura-cuenta-ocupa-mesa.md), [reposicion-stock-proyeccion-local](flujos/reposicion-stock-proyeccion-local.md), [reserva-crear-cancelar-notificar](flujos/reserva-crear-cancelar-notificar.md), [fallo-consumidor-dlq-reinyeccion-parking](flujos/fallo-consumidor-dlq-reinyeccion-parking.md)
- [Invariantes](invariantes/_indice.md)
- Decisiones: [ADR-001-database-per-service](decisiones/ADR-001-database-per-service.md), [ADR-002-transactional-outbox](decisiones/ADR-002-transactional-outbox.md), [ADR-003-eventos-proyecciones-locales](decisiones/ADR-003-eventos-proyecciones-locales.md), [ADR-004-decremento-atomico-condicional](decisiones/ADR-004-decremento-atomico-condicional.md), [ADR-005-reserva-slot-unico](decisiones/ADR-005-reserva-slot-unico.md), [ADR-006-reposicion-como-delta](decisiones/ADR-006-reposicion-como-delta.md), [ADR-007-ack-nack-rmq](decisiones/ADR-007-ack-nack-rmq.md), [ADR-008-dlq-parking-reinyeccion](decisiones/ADR-008-dlq-parking-reinyeccion.md)
- Librerias: [contracts](libs/contracts.md), [observabilidad](libs/observabilidad.md), [resiliencia](libs/resiliencia.md), [shared-auth](libs/shared-auth.md), [shared-rabbitmq](libs/shared-rabbitmq.md), [shared-prisma](libs/shared-prisma.md)
- Operacion: [levantar sistema](operacion/levantar-sistema.md), [base de datos](operacion/base-de-datos.md), [rabbitmq](operacion/rabbitmq.md)

## Evento a productor a consumidores

| Evento | Productores | Consumidores |
|---|---|---|
| [reserva.creada](eventos/reserva.creada.md) | apps/servicio-reservas/src/app/reservas.service.spec.ts:76<br>apps/servicio-reservas/src/app/reservas.service.ts:60 | servicio-notificaciones:handleReservaCreada |
| [reserva.cancelada](eventos/reserva.cancelada.md) | apps/servicio-reservas/src/app/reservas.service.spec.ts:135<br>apps/servicio-reservas/src/app/reservas.service.ts:105 | servicio-notificaciones:handleReservaCancelada |
| [reserva.confirmada](eventos/reserva.confirmada.md) | sin productor detectado | sin consumidor detectado |
| [mesa.creada](eventos/mesa.creada.md) | apps/servicio-mesas/src/app/app.service.ts:37 | servicio-pedidos:handleMesaCreada |
| [mesa.actualizada](eventos/mesa.actualizada.md) | apps/servicio-mesas/src/app/app.service.ts:78 | servicio-pedidos:handleMesaActualizada |
| [mesa.asignada](eventos/mesa.asignada.md) | sin productor detectado | sin consumidor detectado |
| [mesa.liberada](eventos/mesa.liberada.md) | sin productor detectado | sin consumidor detectado |
| [pedido.creado](eventos/pedido.creado.md) | apps/servicio-pedidos/src/app/app.service.ts:230 | servicio-cuentas:handlePedidoCreado<br>servicio-inventario:handlePedidoCreado<br>servicio-notificaciones:handlePedidoCreado |
| [pedido.listo](eventos/pedido.listo.md) | apps/servicio-pedidos/src/app/app.service.ts:275<br>apps/servicio-pedidos/src/app/app.service.ts:325 | sin consumidor detectado |
| [pedido.actualizado](eventos/pedido.actualizado.md) | apps/servicio-pedidos/src/app/app.service.ts:235<br>apps/servicio-pedidos/src/app/app.service.ts:285<br>apps/servicio-pedidos/src/app/app.service.ts:333<br>apps/servicio-pedidos/src/app/app.service.ts:348 | servicio-cuentas:handlePedidoActualizado<br>servicio-notificaciones:handlePedidoActualizado |
| [cuenta.abierta](eventos/cuenta.abierta.md) | apps/servicio-cuentas/src/app/app.service.ts:69<br>apps/servicio-cuentas/src/app/app.service.ts:109 | servicio-mesas:handleCuentaAbierta<br>servicio-caja:handleCuentaAbierta |
| [cuenta.cerrada](eventos/cuenta.cerrada.md) | apps/servicio-cuentas/src/app/app.service.ts:267 | servicio-mesas:handleCuentaCerrada<br>servicio-caja:handleCuentaCerrada<br>servicio-reportes:handleCuentaCerrada |
| [ticket.generado](eventos/ticket.generado.md) | apps/servicio-cuentas/src/app/app.service.ts:272 | sin consumidor detectado |
| [pago.registrado](eventos/pago.registrado.md) | apps/servicio-caja/src/app/app.service.ts:113 | servicio-pedidos:procesarPago<br>servicio-cuentas:handlePagoRegistrado |
| [arqueo.realizado](eventos/arqueo.realizado.md) | sin productor detectado | sin consumidor detectado |
| [stock.bajo](eventos/stock.bajo.md) | sin productor detectado | sin consumidor detectado |
| [stock.descontado](eventos/stock.descontado.md) | sin productor detectado | sin consumidor detectado |
| [producto.creado](eventos/producto.creado.md) | apps/servicio-inventario/src/app/app.service.ts:100 | servicio-pedidos:handleProductoCreado |
| [producto.actualizado](eventos/producto.actualizado.md) | apps/servicio-inventario/src/app/app.service.ts:138<br>apps/servicio-inventario/src/app/app.service.ts:191 | servicio-pedidos:handleProductoActualizado |
| [usuario.autenticado](eventos/usuario.autenticado.md) | apps/servicio-identidad/src/auth/auth.service.ts:62 | sin consumidor detectado |

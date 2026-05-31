---
tipo: catalogo-eventos
fuente: [libs/contracts/src/events/routing-keys.ts:5]
revisado: 2026-05-30
commit: 4c186bb
---

# Catalogo de eventos

| Routing key | Productores | Consumidores | Estado |
|---|---|---|---|
| [reserva.creada](reserva.creada.md) | apps/servicio-reservas/src/app/reservas.service.spec.ts:76<br>apps/servicio-reservas/src/app/reservas.service.ts:60 | servicio-notificaciones:handleReservaCreada | usado |
| [reserva.cancelada](reserva.cancelada.md) | apps/servicio-reservas/src/app/reservas.service.spec.ts:135<br>apps/servicio-reservas/src/app/reservas.service.ts:105 | servicio-notificaciones:handleReservaCancelada | usado |
| [reserva.confirmada](reserva.confirmada.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [mesa.creada](mesa.creada.md) | apps/servicio-mesas/src/app/app.service.ts:37 | servicio-pedidos:handleMesaCreada | usado |
| [mesa.actualizada](mesa.actualizada.md) | apps/servicio-mesas/src/app/app.service.ts:78 | servicio-pedidos:handleMesaActualizada | usado |
| [mesa.asignada](mesa.asignada.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [mesa.liberada](mesa.liberada.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [pedido.creado](pedido.creado.md) | apps/servicio-pedidos/src/app/app.service.ts:230 | servicio-cuentas:handlePedidoCreado<br>servicio-inventario:handlePedidoCreado<br>servicio-notificaciones:handlePedidoCreado | usado |
| [pedido.listo](pedido.listo.md) | apps/servicio-pedidos/src/app/app.service.ts:275<br>apps/servicio-pedidos/src/app/app.service.ts:325 | definido sin consumidor detectado | usado |
| [pedido.actualizado](pedido.actualizado.md) | apps/servicio-pedidos/src/app/app.service.ts:235<br>apps/servicio-pedidos/src/app/app.service.ts:285<br>apps/servicio-pedidos/src/app/app.service.ts:333<br>apps/servicio-pedidos/src/app/app.service.ts:348 | servicio-cuentas:handlePedidoActualizado<br>servicio-notificaciones:handlePedidoActualizado | usado |
| [cuenta.abierta](cuenta.abierta.md) | apps/servicio-cuentas/src/app/app.service.ts:69<br>apps/servicio-cuentas/src/app/app.service.ts:109 | servicio-mesas:handleCuentaAbierta<br>servicio-caja:handleCuentaAbierta | usado |
| [cuenta.cerrada](cuenta.cerrada.md) | apps/servicio-cuentas/src/app/app.service.ts:267 | servicio-mesas:handleCuentaCerrada<br>servicio-caja:handleCuentaCerrada<br>servicio-reportes:handleCuentaCerrada | usado |
| [ticket.generado](ticket.generado.md) | apps/servicio-cuentas/src/app/app.service.ts:272 | definido sin consumidor detectado | usado |
| [pago.registrado](pago.registrado.md) | apps/servicio-caja/src/app/app.service.ts:113 | servicio-pedidos:procesarPago<br>servicio-cuentas:handlePagoRegistrado | usado |
| [arqueo.realizado](arqueo.realizado.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [stock.bajo](stock.bajo.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [stock.descontado](stock.descontado.md) | definido sin productor detectado | definido sin consumidor detectado | definido-no-usado |
| [producto.creado](producto.creado.md) | apps/servicio-inventario/src/app/app.service.ts:100 | servicio-pedidos:handleProductoCreado | usado |
| [producto.actualizado](producto.actualizado.md) | apps/servicio-inventario/src/app/app.service.ts:138<br>apps/servicio-inventario/src/app/app.service.ts:191 | servicio-pedidos:handleProductoActualizado | usado |
| [usuario.autenticado](usuario.autenticado.md) | apps/servicio-identidad/src/auth/auth.service.ts:62 | definido sin consumidor detectado | usado |

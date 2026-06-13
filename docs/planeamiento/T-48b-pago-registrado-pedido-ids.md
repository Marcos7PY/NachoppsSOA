# T-48b - PagoRegistrado debe transportar pedidoIds

Contexto: `servicio-pedidos` marca pedidos pagados por `mesaId` al consumir
`PagoRegistrado`. El `updateMany` es atomico e idempotente, pero el matching por
mesa puede alcanzar un pedido creado entre el pago y el consumo del evento si la
mesa se reutiliza inmediatamente.

Alcance propuesto:

- Extender el contrato `PagoRegistradoPayload` con `pedidoIds` de la cuenta.
- Hacer que `servicio-caja` publique esos ids al registrar el pago.
- Cambiar `servicio-pedidos` para marcar pagados solo esos pedidos.
- Mantener compatibilidad temporal con eventos antiguos sin `pedidoIds`.

---
tipo: endpoint
servicio: servicio-caja
metodo: POST
ruta: /pagos
handler: apps/servicio-caja/src/app/app.controller.ts:14
fuente: [apps/servicio-caja/src/app/app.controller.ts:14, apps/servicio-caja/src/app/app.controller.ts:15, apps/servicio-caja/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /pagos

**Proposito.** Expone el handler `registrarPago` del controlador `app.controller.ts`. [apps/servicio-caja/src/app/app.controller.ts:14]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-caja/src/app/app.controller.ts:14]

**Entrada.** La firma del handler es `registrarPago(@Body() body: PagarPedidoCommand) {`. [apps/servicio-caja/src/app/app.controller.ts:15]

**Salida.** La respuesta sale del handler `registrarPago`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-caja/src/app/app.controller.ts:15]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-caja/src/app/app.controller.ts:15, apps/servicio-caja/src/app/app.service.ts:1]

**Modelos del servicio.** [Transaccion](../datos/Transaccion.md), [OutboxEvent](../datos/OutboxEvent.md), [CierreCaja](../datos/CierreCaja.md), [CuentaAbierta](../datos/CuentaAbierta.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-caja/src/app/app.controller.ts:15, apps/servicio-caja/src/app/app.service.ts:1]

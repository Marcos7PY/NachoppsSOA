---
tipo: endpoint
servicio: servicio-pedidos
metodo: PATCH
ruta: /items/:itemId/estado
handler: apps/servicio-pedidos/src/app/app.controller.ts:27
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:27, apps/servicio-pedidos/src/app/app.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# PATCH /items/:itemId/estado

**Proposito.** Expone el handler `actualizarEstadoItem` del controlador `app.controller.ts`. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Entrada.** La firma del handler es `actualizarEstadoItem(@Param('itemId') itemId: string, @Body() body: ActualizarEstadoPedidoCommand) {`. [apps/servicio-pedidos/src/app/app.controller.ts:28]

**Salida.** La respuesta sale del handler `actualizarEstadoItem`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-pedidos/src/app/app.controller.ts:28]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-pedidos/src/app/app.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:1]

**Modelos del servicio.** [Pedido](../datos/Pedido.md), [PedidoItem](../datos/PedidoItem.md), [MesaLocal](../datos/MesaLocal.md), [Modificador](../datos/Modificador.md), [OutboxEvent](../datos/OutboxEvent.md), [ProductoLocal](../datos/ProductoLocal.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-pedidos/src/app/app.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:1]

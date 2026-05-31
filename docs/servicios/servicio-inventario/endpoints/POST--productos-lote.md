---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos/lote
handler: apps/servicio-inventario/src/app/app.controller.ts:38
fuente: [apps/servicio-inventario/src/app/app.controller.ts:38, apps/servicio-inventario/src/app/app.controller.ts:39, apps/servicio-inventario/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /productos/lote

**Proposito.** Expone el handler `obtenerProductosLote` del controlador `app.controller.ts`. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Entrada.** La firma del handler es `obtenerProductosLote(@Body() body: ObtenerProductosLoteCommand) {`. [apps/servicio-inventario/src/app/app.controller.ts:39]

**Salida.** La respuesta sale del handler `obtenerProductosLote`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-inventario/src/app/app.controller.ts:39]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-inventario/src/app/app.controller.ts:39, apps/servicio-inventario/src/app/app.service.ts:1]

**Modelos del servicio.** [Categoria](../datos/Categoria.md), [Producto](../datos/Producto.md), [OutboxEvent](../datos/OutboxEvent.md), [IdempotencyKey](../datos/IdempotencyKey.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-inventario/src/app/app.controller.ts:39, apps/servicio-inventario/src/app/app.service.ts:1]

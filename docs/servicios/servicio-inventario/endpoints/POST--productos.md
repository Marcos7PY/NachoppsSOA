---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos
handler: apps/servicio-inventario/src/app/app.controller.ts:43
fuente: [apps/servicio-inventario/src/app/app.controller.ts:43, apps/servicio-inventario/src/app/app.controller.ts:44, apps/servicio-inventario/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /productos

**Proposito.** Expone el handler `crearProducto` del controlador `app.controller.ts`. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Entrada.** La firma del handler es `crearProducto(@Body() body: CrearProductoCommand) {`. [apps/servicio-inventario/src/app/app.controller.ts:44]

**Salida.** La respuesta sale del handler `crearProducto`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-inventario/src/app/app.controller.ts:44]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-inventario/src/app/app.controller.ts:44, apps/servicio-inventario/src/app/app.service.ts:1]

**Modelos del servicio.** [Categoria](../datos/Categoria.md), [Producto](../datos/Producto.md), [OutboxEvent](../datos/OutboxEvent.md), [IdempotencyKey](../datos/IdempotencyKey.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-inventario/src/app/app.controller.ts:44, apps/servicio-inventario/src/app/app.service.ts:1]

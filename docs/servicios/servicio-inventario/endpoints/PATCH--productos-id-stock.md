---
tipo: endpoint
servicio: servicio-inventario
metodo: PATCH
ruta: /productos/:id/stock
handler: apps/servicio-inventario/src/app/app.controller.ts:48
fuente: [apps/servicio-inventario/src/app/app.controller.ts:48, apps/servicio-inventario/src/app/app.controller.ts:49, apps/servicio-inventario/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# PATCH /productos/:id/stock

**Proposito.** Expone el handler `actualizarStock` del controlador `app.controller.ts`. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Entrada.** La firma del handler es `actualizarStock(@Param('id') id: string, @Body('stock') stock: number) {`. [apps/servicio-inventario/src/app/app.controller.ts:49]

**Salida.** La respuesta sale del handler `actualizarStock`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-inventario/src/app/app.controller.ts:49]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-inventario/src/app/app.controller.ts:49, apps/servicio-inventario/src/app/app.service.ts:1]

**Modelos del servicio.** [Categoria](../datos/Categoria.md), [Producto](../datos/Producto.md), [OutboxEvent](../datos/OutboxEvent.md), [IdempotencyKey](../datos/IdempotencyKey.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-inventario/src/app/app.controller.ts:49, apps/servicio-inventario/src/app/app.service.ts:1]

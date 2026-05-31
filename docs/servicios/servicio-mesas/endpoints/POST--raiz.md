---
tipo: endpoint
servicio: servicio-mesas
metodo: POST
ruta: /
handler: apps/servicio-mesas/src/app/app.controller.ts:19
fuente: [apps/servicio-mesas/src/app/app.controller.ts:19, apps/servicio-mesas/src/app/app.controller.ts:20, apps/servicio-mesas/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /

**Proposito.** Expone el handler `crearMesa` del controlador `app.controller.ts`. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Entrada.** La firma del handler es `crearMesa(@Body() body: CrearMesaCommand) {`. [apps/servicio-mesas/src/app/app.controller.ts:20]

**Salida.** La respuesta sale del handler `crearMesa`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-mesas/src/app/app.controller.ts:20]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-mesas/src/app/app.controller.ts:20, apps/servicio-mesas/src/app/app.service.ts:1]

**Modelos del servicio.** [Mesa](../datos/Mesa.md), [OutboxEvent](../datos/OutboxEvent.md), [IdempotencyKey](../datos/IdempotencyKey.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-mesas/src/app/app.controller.ts:20, apps/servicio-mesas/src/app/app.service.ts:1]

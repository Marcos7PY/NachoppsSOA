---
tipo: endpoint
servicio: servicio-reservas
metodo: POST
ruta: /
handler: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/app.controller.ts:20, apps/servicio-reservas/src/app/reservas.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /

**Proposito.** Expone el handler `crear` del controlador `app.controller.ts`. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Entrada.** La firma del handler es `crear(@Body() body: CrearReservaCommand) {`. [apps/servicio-reservas/src/app/app.controller.ts:20]

**Salida.** La respuesta sale del handler `crear`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-reservas/src/app/app.controller.ts:20]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-reservas/src/app/app.controller.ts:20, apps/servicio-reservas/src/app/reservas.service.ts:1]

**Modelos del servicio.** [Reserva](../datos/Reserva.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-reservas/src/app/app.controller.ts:20, apps/servicio-reservas/src/app/reservas.service.ts:1]

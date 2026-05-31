---
tipo: endpoint
servicio: servicio-reservas
metodo: DELETE
ruta: /:id
handler: apps/servicio-reservas/src/app/app.controller.ts:29
fuente: [apps/servicio-reservas/src/app/app.controller.ts:29, apps/servicio-reservas/src/app/app.controller.ts:30, apps/servicio-reservas/src/app/reservas.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# DELETE /:id

**Proposito.** Expone el handler `cancelar` del controlador `app.controller.ts`. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-reservas/src/app/app.controller.ts:29]

**Entrada.** La firma del handler es `cancelar(@Param('id') id: string, @Body() body?: { motivo?: string }) {`. [apps/servicio-reservas/src/app/app.controller.ts:30]

**Salida.** La respuesta sale del handler `cancelar`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-reservas/src/app/app.controller.ts:30]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-reservas/src/app/app.controller.ts:30, apps/servicio-reservas/src/app/reservas.service.ts:1]

**Modelos del servicio.** [Reserva](../datos/Reserva.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-reservas/src/app/app.controller.ts:30, apps/servicio-reservas/src/app/reservas.service.ts:1]

---
tipo: endpoint
servicio: servicio-reservas
metodo: PATCH
ruta: /:id/confirmar
handler: apps/servicio-reservas/src/app/app.controller.ts:24
fuente: [apps/servicio-reservas/src/app/app.controller.ts:24, apps/servicio-reservas/src/app/app.controller.ts:25, apps/servicio-reservas/src/app/reservas.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# PATCH /:id/confirmar

**Proposito.** Expone el handler `confirmar` del controlador `app.controller.ts`. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-reservas/src/app/app.controller.ts:24]

**Entrada.** La firma del handler es `confirmar(@Param('id') id: string) {`. [apps/servicio-reservas/src/app/app.controller.ts:25]

**Salida.** La respuesta sale del handler `confirmar`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-reservas/src/app/app.controller.ts:25]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-reservas/src/app/app.controller.ts:25, apps/servicio-reservas/src/app/reservas.service.ts:1]

**Modelos del servicio.** [Reserva](../datos/Reserva.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-reservas/src/app/app.controller.ts:25, apps/servicio-reservas/src/app/reservas.service.ts:1]

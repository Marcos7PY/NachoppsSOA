---
tipo: endpoint
servicio: servicio-reservas
metodo: GET
ruta: /disponibilidad
handler: apps/servicio-reservas/src/app/app.controller.ts:14
fuente: [apps/servicio-reservas/src/app/app.controller.ts:14, apps/servicio-reservas/src/app/app.controller.ts:15, apps/servicio-reservas/src/app/reservas.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /disponibilidad

**Proposito.** Expone el handler `disponibilidad` del controlador `app.controller.ts`. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Entrada.** La firma del handler es `disponibilidad(@Query('fecha') fecha: string, @Query('hora') hora: string) {`. [apps/servicio-reservas/src/app/app.controller.ts:15]

**Salida.** La respuesta sale del handler `disponibilidad`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-reservas/src/app/app.controller.ts:15]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-reservas/src/app/app.controller.ts:15, apps/servicio-reservas/src/app/reservas.service.ts:1]

**Modelos del servicio.** [Reserva](../datos/Reserva.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-reservas/src/app/app.controller.ts:15, apps/servicio-reservas/src/app/reservas.service.ts:1]

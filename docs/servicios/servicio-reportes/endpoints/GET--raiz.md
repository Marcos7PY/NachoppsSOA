---
tipo: endpoint
servicio: servicio-reportes
metodo: GET
ruta: /
handler: apps/servicio-reportes/src/app/app.controller.ts:14
fuente: [apps/servicio-reportes/src/app/app.controller.ts:14, apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /

**Proposito.** Expone el handler `healthCheck` del controlador `app.controller.ts`. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Entrada.** La firma del handler es `healthCheck() {`. [apps/servicio-reportes/src/app/app.controller.ts:15]

**Salida.** La respuesta sale del handler `healthCheck`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-reportes/src/app/app.controller.ts:15]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.service.ts:1]

**Modelos del servicio.** [VentaDiaria](../datos/VentaDiaria.md), [IdempotencyKey](../datos/IdempotencyKey.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.service.ts:1]

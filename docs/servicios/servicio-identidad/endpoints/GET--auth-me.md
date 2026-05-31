---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /auth/me
handler: apps/servicio-identidad/src/auth/auth.controller.ts:58
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:58, apps/servicio-identidad/src/auth/auth.controller.ts:59, apps/servicio-identidad/src/auth/auth.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /auth/me

**Proposito.** Expone el handler `me` del controlador `auth.controller.ts`. [apps/servicio-identidad/src/auth/auth.controller.ts:58]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-identidad/src/auth/auth.controller.ts:58]

**Entrada.** La firma del handler es `async me(@Request() req: any) {`. [apps/servicio-identidad/src/auth/auth.controller.ts:59]

**Salida.** La respuesta sale del handler `me`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-identidad/src/auth/auth.controller.ts:59]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-identidad/src/auth/auth.controller.ts:59, apps/servicio-identidad/src/auth/auth.service.ts:1]

**Modelos del servicio.** [Usuario](../datos/Usuario.md), [AuditoriaLog](../datos/AuditoriaLog.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-identidad/src/auth/auth.controller.ts:59, apps/servicio-identidad/src/auth/auth.service.ts:1]

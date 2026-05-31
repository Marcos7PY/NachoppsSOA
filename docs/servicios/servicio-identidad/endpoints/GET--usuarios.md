---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /usuarios
handler: apps/servicio-identidad/src/auth/auth.controller.ts:74
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:74, apps/servicio-identidad/src/auth/auth.controller.ts:75, apps/servicio-identidad/src/auth/auth.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /usuarios

**Proposito.** Expone el handler `listarUsuarios` del controlador `auth.controller.ts`. [apps/servicio-identidad/src/auth/auth.controller.ts:74]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-identidad/src/auth/auth.controller.ts:74]

**Entrada.** La firma del handler es `async listarUsuarios() {`. [apps/servicio-identidad/src/auth/auth.controller.ts:75]

**Salida.** La respuesta sale del handler `listarUsuarios`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-identidad/src/auth/auth.controller.ts:75]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-identidad/src/auth/auth.controller.ts:75, apps/servicio-identidad/src/auth/auth.service.ts:1]

**Modelos del servicio.** [Usuario](../datos/Usuario.md), [AuditoriaLog](../datos/AuditoriaLog.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-identidad/src/auth/auth.controller.ts:75, apps/servicio-identidad/src/auth/auth.service.ts:1]

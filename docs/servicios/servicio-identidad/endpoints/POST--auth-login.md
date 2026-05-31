---
tipo: endpoint
servicio: servicio-identidad
metodo: POST
ruta: /auth/login
handler: apps/servicio-identidad/src/auth/auth.controller.ts:36
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:36, apps/servicio-identidad/src/auth/auth.controller.ts:37, apps/servicio-identidad/src/auth/auth.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /auth/login

**Proposito.** Expone el handler `login` del controlador `auth.controller.ts`. [apps/servicio-identidad/src/auth/auth.controller.ts:36]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-identidad/src/auth/auth.controller.ts:36]

**Entrada.** La firma del handler es `async login(@Body() command: LoginCommand, @Res({ passthrough: true }) res: Response) {`. [apps/servicio-identidad/src/auth/auth.controller.ts:37]

**Salida.** La respuesta sale del handler `login`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-identidad/src/auth/auth.controller.ts:37]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-identidad/src/auth/auth.controller.ts:37, apps/servicio-identidad/src/auth/auth.service.ts:1]

**Modelos del servicio.** [Usuario](../datos/Usuario.md), [AuditoriaLog](../datos/AuditoriaLog.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-identidad/src/auth/auth.controller.ts:37, apps/servicio-identidad/src/auth/auth.service.ts:1]

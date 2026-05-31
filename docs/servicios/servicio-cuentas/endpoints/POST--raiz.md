---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:18
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:18, apps/servicio-cuentas/src/app/app.controller.ts:19, apps/servicio-cuentas/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /

**Proposito.** Expone el handler `abrirCuenta` del controlador `app.controller.ts`. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Entrada.** La firma del handler es `abrirCuenta(@Body() command: AbrirCuentaCommand) {`. [apps/servicio-cuentas/src/app/app.controller.ts:19]

**Salida.** La respuesta sale del handler `abrirCuenta`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-cuentas/src/app/app.controller.ts:19]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-cuentas/src/app/app.controller.ts:19, apps/servicio-cuentas/src/app/app.service.ts:1]

**Modelos del servicio.** [Cuenta](../datos/Cuenta.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-cuentas/src/app/app.controller.ts:19, apps/servicio-cuentas/src/app/app.service.ts:1]

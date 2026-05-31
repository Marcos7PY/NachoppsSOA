---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /:id/dividir
handler: apps/servicio-cuentas/src/app/app.controller.ts:34
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:34, apps/servicio-cuentas/src/app/app.controller.ts:35, apps/servicio-cuentas/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# POST /:id/dividir

**Proposito.** Expone el handler `dividirCuenta` del controlador `app.controller.ts`. [apps/servicio-cuentas/src/app/app.controller.ts:34]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-cuentas/src/app/app.controller.ts:34]

**Entrada.** La firma del handler es `dividirCuenta(@Param('id', ParseUUIDPipe) id: string, @Body() command: DividirCuentaCommand) {`. [apps/servicio-cuentas/src/app/app.controller.ts:35]

**Salida.** La respuesta sale del handler `dividirCuenta`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-cuentas/src/app/app.controller.ts:35]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-cuentas/src/app/app.controller.ts:35, apps/servicio-cuentas/src/app/app.service.ts:1]

**Modelos del servicio.** [Cuenta](../datos/Cuenta.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-cuentas/src/app/app.controller.ts:35, apps/servicio-cuentas/src/app/app.service.ts:1]

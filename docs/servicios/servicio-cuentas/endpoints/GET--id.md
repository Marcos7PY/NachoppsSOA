---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /:id
handler: apps/servicio-cuentas/src/app/app.controller.ts:28
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:28, apps/servicio-cuentas/src/app/app.controller.ts:29, apps/servicio-cuentas/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /:id

**Proposito.** Expone el handler `obtenerCuenta` del controlador `app.controller.ts`. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Entrada.** La firma del handler es `obtenerCuenta(@Param('id', ParseUUIDPipe) id: string) {`. [apps/servicio-cuentas/src/app/app.controller.ts:29]

**Salida.** La respuesta sale del handler `obtenerCuenta`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-cuentas/src/app/app.controller.ts:29]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-cuentas/src/app/app.controller.ts:29, apps/servicio-cuentas/src/app/app.service.ts:1]

**Modelos del servicio.** [Cuenta](../datos/Cuenta.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-cuentas/src/app/app.controller.ts:29, apps/servicio-cuentas/src/app/app.service.ts:1]

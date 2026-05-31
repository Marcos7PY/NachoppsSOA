---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /mesa/:mesaId
handler: apps/servicio-cuentas/src/app/app.controller.ts:23
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:23, apps/servicio-cuentas/src/app/app.controller.ts:24, apps/servicio-cuentas/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /mesa/:mesaId

**Proposito.** Expone el handler `obtenerCuentaPorMesa` del controlador `app.controller.ts`. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Entrada.** La firma del handler es `obtenerCuentaPorMesa(@Param('mesaId', ParseUUIDPipe) mesaId: string) {`. [apps/servicio-cuentas/src/app/app.controller.ts:24]

**Salida.** La respuesta sale del handler `obtenerCuentaPorMesa`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-cuentas/src/app/app.controller.ts:24]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-cuentas/src/app/app.controller.ts:24, apps/servicio-cuentas/src/app/app.service.ts:1]

**Modelos del servicio.** [Cuenta](../datos/Cuenta.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-cuentas/src/app/app.controller.ts:24, apps/servicio-cuentas/src/app/app.service.ts:1]

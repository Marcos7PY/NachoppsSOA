---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /
handler: apps/servicio-caja/src/app/app.controller.ts:19
fuente: [apps/servicio-caja/src/app/app.controller.ts:19, apps/servicio-caja/src/app/app.controller.ts:20, apps/servicio-caja/src/app/app.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# GET /

**Proposito.** Expone el handler `listarTransacciones` del controlador `app.controller.ts`. [apps/servicio-caja/src/app/app.controller.ts:19]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-caja/src/app/app.controller.ts:19]

**Entrada.** La firma del handler es `listarTransacciones() {`. [apps/servicio-caja/src/app/app.controller.ts:20]

**Salida.** La respuesta sale del handler `listarTransacciones`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-caja/src/app/app.controller.ts:20]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-caja/src/app/app.controller.ts:20, apps/servicio-caja/src/app/app.service.ts:1]

**Modelos del servicio.** [Transaccion](../datos/Transaccion.md), [OutboxEvent](../datos/OutboxEvent.md), [CierreCaja](../datos/CierreCaja.md), [CuentaAbierta](../datos/CuentaAbierta.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-caja/src/app/app.controller.ts:20, apps/servicio-caja/src/app/app.service.ts:1]

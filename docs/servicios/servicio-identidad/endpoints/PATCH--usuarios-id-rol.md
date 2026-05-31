---
tipo: endpoint
servicio: servicio-identidad
metodo: PATCH
ruta: /usuarios/:id/rol
handler: apps/servicio-identidad/src/auth/auth.controller.ts:81
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:81, apps/servicio-identidad/src/auth/auth.controller.ts:82, apps/servicio-identidad/src/auth/auth.service.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# PATCH /usuarios/:id/rol

**Proposito.** Expone el handler `cambiarRol` del controlador `auth.controller.ts`. [apps/servicio-identidad/src/auth/auth.controller.ts:81]

**Autorizacion.** Este atomo solo afirma la decoracion visible en el handler; revisar guards globales o modulos del servicio junto con este controlador. [apps/servicio-identidad/src/auth/auth.controller.ts:81]

**Entrada.** La firma del handler es `async cambiarRol(`. [apps/servicio-identidad/src/auth/auth.controller.ts:82]

**Salida.** La respuesta sale del handler `cambiarRol`; el tipo exacto no se declara en la firma del controlador cuando TypeScript no lo explicita. [apps/servicio-identidad/src/auth/auth.controller.ts:82]

**Efectos.** El handler delega en el codigo del controlador y, cuando corresponde, en el servicio del mismo proyecto. [apps/servicio-identidad/src/auth/auth.controller.ts:82, apps/servicio-identidad/src/auth/auth.service.ts:1]

**Modelos del servicio.** [Usuario](../datos/Usuario.md), [AuditoriaLog](../datos/AuditoriaLog.md), [OutboxEvent](../datos/OutboxEvent.md)

**Invariantes que toca.** Ver [catalogo de invariantes](../../../invariantes/_indice.md) para las pruebas enlazadas a rutas, eventos y modelos.

**Errores.** Los errores verificables para este endpoint se obtienen de las ramas del controlador y servicio citados. [apps/servicio-identidad/src/auth/auth.controller.ts:82, apps/servicio-identidad/src/auth/auth.service.ts:1]

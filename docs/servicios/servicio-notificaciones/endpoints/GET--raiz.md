---
tipo: endpoint
servicio: servicio-notificaciones
metodo: GET
ruta: /
handler: apps/servicio-notificaciones/src/app/app.controller.ts:27
fuente: [apps/servicio-notificaciones/src/app/app.controller.ts:27, apps/servicio-notificaciones/src/app/app.service.ts:10]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** obtenerNotificaciones atiende GET / en servicio-notificaciones. [apps/servicio-notificaciones/src/app/app.controller.ts:27]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-notificaciones/src/app/app.controller.ts:27]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-notificaciones/src/app/app.controller.ts:28]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-notificaciones/src/app/app.controller.ts:27]

**Efectos.** llama `obtenerNotificaciones`; Prisma: `notificacion.findMany`. [apps/servicio-notificaciones/src/app/app.service.ts:10]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

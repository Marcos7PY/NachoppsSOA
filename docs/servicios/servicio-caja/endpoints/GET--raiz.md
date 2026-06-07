---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /
handler: apps/servicio-caja/src/app/app.controller.ts:19
fuente: [apps/servicio-caja/src/app/app.controller.ts:19, apps/servicio-caja/src/app/app.service.ts:133]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** listarTransacciones atiende GET / en servicio-caja. [apps/servicio-caja/src/app/app.controller.ts:19]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-caja/src/app/app.controller.ts:19]

**Entrada.** query `ListarTransaccionesQuery` (limit?: number, cursor?: string, metodo?: string, updatedSince?: string). [apps/servicio-caja/src/app/app.controller.ts:20]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-caja/src/app/app.controller.ts:19]

**Efectos.** llama `listarTransacciones`; Prisma: `transaccion.findMany`. [apps/servicio-caja/src/app/app.service.ts:133]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

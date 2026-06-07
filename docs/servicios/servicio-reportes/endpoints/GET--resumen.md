---
tipo: endpoint
servicio: servicio-reportes
metodo: GET
ruta: /resumen
handler: apps/servicio-reportes/src/app/app.controller.ts:19
fuente: [apps/servicio-reportes/src/app/app.controller.ts:19, apps/servicio-reportes/src/app/app.service.ts:29]
revisado: 2026-06-02
commit: 53877c8
---

# GET /resumen

**Proposito.** getResumen atiende GET /resumen en servicio-reportes. [apps/servicio-reportes/src/app/app.controller.ts:19]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reportes/src/app/app.controller.ts:19]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-reportes/src/app/app.controller.ts:20]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reportes/src/app/app.controller.ts:19]

**Efectos.** llama `obtenerResumenDiario`; Prisma: `ventaDiaria.findMany`. [apps/servicio-reportes/src/app/app.service.ts:29]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

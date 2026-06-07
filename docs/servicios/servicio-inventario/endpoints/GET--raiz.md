---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /
handler: apps/servicio-inventario/src/app/app.controller.ts:9
fuente: [apps/servicio-inventario/src/app/app.controller.ts:9, apps/servicio-inventario/src/app/app.service.ts:22]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** getData atiende GET / en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:9]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:9]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-inventario/src/app/app.controller.ts:10]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:9]

**Efectos.** llama `getHello`. [apps/servicio-inventario/src/app/app.service.ts:22]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

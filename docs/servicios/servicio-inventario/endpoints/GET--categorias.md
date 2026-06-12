---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /categorias
handler: apps/servicio-inventario/src/app/app.controller.ts:16
fuente: [apps/servicio-inventario/src/app/app.controller.ts:16, apps/servicio-inventario/src/app/app.service.ts:28]
revisado: 2026-06-02
commit: 53877c8
---

# GET /categorias

**Proposito.** listarCategorias atiende GET /categorias en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:16]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:16]

**Entrada.** Sin body/query/params declarados en la firma. [apps/servicio-inventario/src/app/app.controller.ts:17]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:16]

**Efectos.** llama `listarCategorias`; Prisma: `categoria.findMany`. [apps/servicio-inventario/src/app/app.service.ts:28]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

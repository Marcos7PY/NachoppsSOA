---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /categorias
handler: apps/servicio-inventario/src/app/app.controller.ts:21
fuente: [apps/servicio-inventario/src/app/app.controller.ts:21, apps/servicio-inventario/src/app/app.service.ts:35]
revisado: 2026-06-02
commit: 53877c8
---

# POST /categorias

**Proposito.** crearCategoria atiende POST /categorias en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:21]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:21]

**Entrada.** body `CrearCategoriaCommand` (nombre: string, descripcion?: string). [apps/servicio-inventario/src/app/app.controller.ts:22]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:21]

**Efectos.** llama `crearCategoria`; Prisma: `categoria.create`. [apps/servicio-inventario/src/app/app.service.ts:35]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

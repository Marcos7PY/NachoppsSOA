---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /productos
handler: apps/servicio-inventario/src/app/app.controller.ts:28
fuente: [apps/servicio-inventario/src/app/app.controller.ts:28, apps/servicio-inventario/src/app/app.service.ts:47]
revisado: 2026-06-02
commit: 53877c8
---

# GET /productos

**Proposito.** listarProductos atiende GET /productos en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:28]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:28]

**Entrada.** query `ListarProductosQuery` (categoriaId?: string, disponible?: boolean, search?: string, limit?: number, cursor?: string, updatedSince?: string). [apps/servicio-inventario/src/app/app.controller.ts:29]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:28]

**Efectos.** llama `listarProductos`; Prisma: `producto.findMany`. [apps/servicio-inventario/src/app/app.service.ts:47]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

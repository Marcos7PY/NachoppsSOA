---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos/lote
handler: apps/servicio-inventario/src/app/app.controller.ts:38
fuente: [apps/servicio-inventario/src/app/app.controller.ts:38, apps/servicio-inventario/src/app/app.service.ts:118]
revisado: 2026-06-02
commit: 53877c8
---

# POST /productos/lote

**Proposito.** obtenerProductosLote atiende POST /productos/lote en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Entrada.** body `ObtenerProductosLoteCommand` (ids: string[]). [apps/servicio-inventario/src/app/app.controller.ts:39]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Efectos.** llama `obtenerProductosLote`; Prisma: `producto.findMany`. [apps/servicio-inventario/src/app/app.service.ts:118]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

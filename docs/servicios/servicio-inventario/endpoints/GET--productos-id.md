---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /productos/:id
handler: apps/servicio-inventario/src/app/app.controller.ts:33
fuente: [apps/servicio-inventario/src/app/app.controller.ts:33, apps/servicio-inventario/src/app/app.service.ts:109]
revisado: 2026-06-02
commit: 53877c8
---

# GET /productos/:id

**Proposito.** obtenerProducto atiende GET /productos/:id en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:33]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:33]

**Entrada.** params id: string. [apps/servicio-inventario/src/app/app.controller.ts:34]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:33]

**Efectos.** llama `obtenerProducto`; Prisma: `producto.findUnique`. [apps/servicio-inventario/src/app/app.service.ts:109]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

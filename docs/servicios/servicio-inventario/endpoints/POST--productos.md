---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos
handler: apps/servicio-inventario/src/app/app.controller.ts:43
fuente: [apps/servicio-inventario/src/app/app.controller.ts:43, apps/servicio-inventario/src/app/app.service.ts:126]
revisado: 2026-06-02
commit: 53877c8
---

# POST /productos

**Proposito.** crearProducto atiende POST /productos en servicio-inventario. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Entrada.** body `CrearProductoCommand` (categoriaId: string, nombre: string, descripcion?: string, precio: number, disponible?: boolean, stockActual?: number). [apps/servicio-inventario/src/app/app.controller.ts:44]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Efectos.** llama `crearProducto`; Prisma: `categoria.findUnique`, `producto.create`, `outboxEvent.create`; eventos: `RoutingKeys.ProductoCreado`. [apps/servicio-inventario/src/app/app.service.ts:126]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- NotFound por `NotFoundException` declarado en el camino de servicio.

---
tipo: endpoint
servicio: servicio-pedidos
metodo: PATCH
ruta: /items/:itemId/estado
handler: apps/servicio-pedidos/src/app/app.controller.ts:27
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:27, apps/servicio-pedidos/src/app/app.service.ts:349]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /items/:itemId/estado

**Proposito.** actualizarEstadoItem atiende PATCH /items/:itemId/estado en servicio-pedidos. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Entrada.** params itemId: string; body `ActualizarEstadoPedidoCommand` (estado: PedidoEstado). [apps/servicio-pedidos/src/app/app.controller.ts:28]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Efectos.** llama `actualizarEstadoItem`; Prisma: `pedidoItem.update`, `pedidoItem.findMany`, `pedido.update`, `pedido.findUnique`, `outboxEvent.createMany`, `outboxEvent.create`; eventos: `RoutingKeys.PedidoListo`, `RoutingKeys.PedidoActualizado`. [apps/servicio-pedidos/src/app/app.service.ts:349]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

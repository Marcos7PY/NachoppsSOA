---
tipo: endpoint
servicio: servicio-pedidos
metodo: PATCH
ruta: /:id/estado
handler: apps/servicio-pedidos/src/app/app.controller.ts:22
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:22, apps/servicio-pedidos/src/app/app.service.ts:313]
revisado: 2026-06-02
commit: 53877c8
---

# PATCH /:id/estado

**Proposito.** actualizarEstado atiende PATCH /:id/estado en servicio-pedidos. [apps/servicio-pedidos/src/app/app.controller.ts:22]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-pedidos/src/app/app.controller.ts:22]

**Entrada.** params id: string; body `ActualizarEstadoPedidoCommand` (estado: PedidoEstado). [apps/servicio-pedidos/src/app/app.controller.ts:23]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-pedidos/src/app/app.controller.ts:22]

**Efectos.** llama `actualizarEstado`; Prisma: `pedido.update`, `outboxEvent.createMany`; eventos: `RoutingKeys.PedidoListo`, `RoutingKeys.PedidoActualizado`. [apps/servicio-pedidos/src/app/app.service.ts:313]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

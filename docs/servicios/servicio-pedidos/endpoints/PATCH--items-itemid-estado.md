---
tipo: endpoint
servicio: servicio-pedidos
metodo: PATCH
ruta: /items/:itemId/estado
handler: apps/servicio-pedidos/src/app/app.controller.ts:27
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:27, apps/servicio-pedidos/src/app/app.controller.ts:28, apps/servicio-pedidos/src/app/app.service.ts:298, libs/contracts/src/domains/pedidos.ts:118]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /items/:itemId/estado

**Proposito.** Actualiza el estado de un item de pedido. [apps/servicio-pedidos/src/app/app.controller.ts:27]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-pedidos/src/app/app.module.ts:2, apps/servicio-pedidos/src/app/app.controller.ts:27]

**Entrada.** DTO `ActualizarEstadoPedidoCommand` con campos: `estado: PedidoEstado` (@IsEnum(PedidoEstado)). [libs/contracts/src/domains/pedidos.ts:120]

**Salida.** Respuesta derivada del handler `actualizarEstadoItem` y del servicio `actualizarEstadoItem`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-pedidos/src/app/app.controller.ts:28]

**Efectos.** Usa `pedidoItem.update`, `pedidoItem.findMany`, `pedido.update`, `pedido.findUnique`, `outboxEvent.createMany`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-pedidos/src/app/app.service.ts:298] Emite o consume eventos `RoutingKeys.PedidoListo`, `RoutingKeys.PedidoActualizado`. [apps/servicio-pedidos/src/app/app.service.ts:275]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-pedidos/src/app/app.service.ts:298]

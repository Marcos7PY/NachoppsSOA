---
tipo: endpoint
servicio: servicio-pedidos
metodo: PATCH
ruta: /:id/estado
handler: apps/servicio-pedidos/src/app/app.controller.ts:22
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:22, apps/servicio-pedidos/src/app/app.controller.ts:23, apps/servicio-pedidos/src/app/app.service.ts:262, libs/contracts/src/domains/pedidos.ts:118]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /:id/estado

**Proposito.** Actualiza el estado de un pedido. [apps/servicio-pedidos/src/app/app.controller.ts:22]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-pedidos/src/app/app.module.ts:2, apps/servicio-pedidos/src/app/app.controller.ts:22]

**Entrada.** DTO `ActualizarEstadoPedidoCommand` con campos: `estado: PedidoEstado` (@IsEnum(PedidoEstado)). [libs/contracts/src/domains/pedidos.ts:120]

**Salida.** Respuesta derivada del handler `actualizarEstado` y del servicio `actualizarEstado`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-pedidos/src/app/app.controller.ts:23]

**Efectos.** Usa `pedido.update`, `outboxEvent.createMany`. La operacion incluye una transaccion Prisma. [apps/servicio-pedidos/src/app/app.service.ts:262] Emite o consume eventos `RoutingKeys.PedidoListo`, `RoutingKeys.PedidoActualizado`. [apps/servicio-pedidos/src/app/app.service.ts:275]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-pedidos/src/app/app.service.ts:262]

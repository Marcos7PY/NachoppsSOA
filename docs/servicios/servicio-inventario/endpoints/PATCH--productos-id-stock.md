---
tipo: endpoint
servicio: servicio-inventario
metodo: PATCH
ruta: /productos/:id/stock
handler: apps/servicio-inventario/src/app/app.controller.ts:48
fuente: [apps/servicio-inventario/src/app/app.controller.ts:48, apps/servicio-inventario/src/app/app.controller.ts:49, apps/servicio-inventario/src/app/app.service.ts:112]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /productos/:id/stock

**Proposito.** Ajusta stock de un producto y publica actualizacion de producto. [apps/servicio-inventario/src/app/app.controller.ts:48]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:48]

**Entrada.** `id: string` via Param. [apps/servicio-inventario/src/app/app.controller.ts:49]

**Salida.** Respuesta derivada del handler `actualizarStock` y del servicio `actualizarStock`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:49]

**Efectos.** Usa `producto.findUnique`, `producto.update`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-inventario/src/app/app.service.ts:112] Emite o consume eventos `RoutingKeys.ProductoActualizado`. [apps/servicio-inventario/src/app/app.service.ts:138]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- 404 por `NotFoundException`: if (!producto) throw new NotFoundException('Producto no encontrado');. [apps/servicio-inventario/src/app/app.service.ts:114]

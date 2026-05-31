---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /productos/:id
handler: apps/servicio-inventario/src/app/app.controller.ts:33
fuente: [apps/servicio-inventario/src/app/app.controller.ts:33, apps/servicio-inventario/src/app/app.controller.ts:34, apps/servicio-inventario/src/app/app.service.ts:54]
revisado: 2026-05-31
commit: c5c7891
---

# GET /productos/:id

**Proposito.** obtenerProducto atiende GET /productos/:id en servicio-inventario usando `obtenerProducto`. [apps/servicio-inventario/src/app/app.controller.ts:33]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:33]

**Entrada.** `id: string` via Param. [apps/servicio-inventario/src/app/app.controller.ts:34]

**Salida.** Respuesta derivada del handler `obtenerProducto` y del servicio `obtenerProducto`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:34]

**Efectos.** Usa `producto.findUnique`. [apps/servicio-inventario/src/app/app.service.ts:54]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- 404 por `NotFoundException`: if (!producto) throw new NotFoundException('Producto no encontrado');. [apps/servicio-inventario/src/app/app.service.ts:59]

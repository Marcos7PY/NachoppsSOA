---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /productos
handler: apps/servicio-inventario/src/app/app.controller.ts:28
fuente: [apps/servicio-inventario/src/app/app.controller.ts:28, apps/servicio-inventario/src/app/app.controller.ts:29, apps/servicio-inventario/src/app/app.service.ts:44]
revisado: 2026-05-31
commit: c5c7891
---

# GET /productos

**Proposito.** listarProductos atiende GET /productos en servicio-inventario usando `listarProductos`. [apps/servicio-inventario/src/app/app.controller.ts:28]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:28]

**Entrada.** `categoriaId: string` via Query. [apps/servicio-inventario/src/app/app.controller.ts:29]

**Salida.** Respuesta derivada del handler `listarProductos` y del servicio `listarProductos`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:29]

**Efectos.** Usa `producto.findMany`. [apps/servicio-inventario/src/app/app.service.ts:44]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-inventario/src/app/app.service.ts:44]

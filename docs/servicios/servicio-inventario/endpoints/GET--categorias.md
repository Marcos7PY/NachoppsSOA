---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /categorias
handler: apps/servicio-inventario/src/app/app.controller.ts:16
fuente: [apps/servicio-inventario/src/app/app.controller.ts:16, apps/servicio-inventario/src/app/app.controller.ts:17, apps/servicio-inventario/src/app/app.service.ts:25]
revisado: 2026-05-31
commit: c5c7891
---

# GET /categorias

**Proposito.** listarCategorias atiende GET /categorias en servicio-inventario usando `listarCategorias`. [apps/servicio-inventario/src/app/app.controller.ts:16]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:16]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-inventario/src/app/app.controller.ts:17]

**Salida.** Respuesta derivada del handler `listarCategorias` y del servicio `listarCategorias`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:17]

**Efectos.** Usa `categoria.findMany`. [apps/servicio-inventario/src/app/app.service.ts:25]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-inventario/src/app/app.service.ts:25]

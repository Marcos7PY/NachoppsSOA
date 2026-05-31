---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos/lote
handler: apps/servicio-inventario/src/app/app.controller.ts:38
fuente: [apps/servicio-inventario/src/app/app.controller.ts:38, apps/servicio-inventario/src/app/app.controller.ts:39, apps/servicio-inventario/src/app/app.service.ts:63, libs/contracts/src/domains/inventario.ts:78]
revisado: 2026-05-31
commit: c5c7891
---

# POST /productos/lote

**Proposito.** obtenerProductosLote atiende POST /productos/lote en servicio-inventario usando `obtenerProductosLote`. [apps/servicio-inventario/src/app/app.controller.ts:38]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:38]

**Entrada.** DTO `ObtenerProductosLoteCommand` con campos: `ids: string[]` (@IsArray() @ArrayMinSize(1) @IsUUID('all', { each: true })). [libs/contracts/src/domains/inventario.ts:82]

**Salida.** Respuesta derivada del handler `obtenerProductosLote` y del servicio `obtenerProductosLote`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:39]

**Efectos.** Usa `producto.findMany`. [apps/servicio-inventario/src/app/app.service.ts:63]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-inventario/src/app/app.service.ts:63]

---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /categorias
handler: apps/servicio-inventario/src/app/app.controller.ts:21
fuente: [apps/servicio-inventario/src/app/app.controller.ts:21, apps/servicio-inventario/src/app/app.controller.ts:22, apps/servicio-inventario/src/app/app.service.ts:32, libs/contracts/src/domains/inventario.ts:33]
revisado: 2026-05-31
commit: c5c7891
---

# POST /categorias

**Proposito.** Crea una categoria de inventario. [apps/servicio-inventario/src/app/app.controller.ts:21]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:21]

**Entrada.** DTO `CrearCategoriaCommand` con campos: `nombre: string` (@IsString()). [libs/contracts/src/domains/inventario.ts:35] `descripcion?: string` (@IsString() @IsOptional() @IsString()). [libs/contracts/src/domains/inventario.ts:38]

**Salida.** Respuesta derivada del handler `crearCategoria` y del servicio `crearCategoria`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:22]

**Efectos.** Usa `categoria.create`. [apps/servicio-inventario/src/app/app.service.ts:32]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-inventario/src/app/app.service.ts:32]

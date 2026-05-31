---
tipo: endpoint
servicio: servicio-inventario
metodo: POST
ruta: /productos
handler: apps/servicio-inventario/src/app/app.controller.ts:43
fuente: [apps/servicio-inventario/src/app/app.controller.ts:43, apps/servicio-inventario/src/app/app.controller.ts:44, apps/servicio-inventario/src/app/app.service.ts:71, libs/contracts/src/domains/inventario.ts:60]
revisado: 2026-05-31
commit: c5c7891
---

# POST /productos

**Proposito.** Crea un producto de inventario. [apps/servicio-inventario/src/app/app.controller.ts:43]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:43]

**Entrada.** DTO `CrearProductoCommand` con campos: `categoriaId: string` (@IsString()). [libs/contracts/src/domains/inventario.ts:62] `nombre: string` (@IsString() @IsString()). [libs/contracts/src/domains/inventario.ts:64] `descripcion?: string` (@IsString() @IsOptional() @IsString()). [libs/contracts/src/domains/inventario.ts:67] `precio: number` (@IsOptional() @IsString() @IsNumber()). [libs/contracts/src/domains/inventario.ts:69] `disponible?: boolean` (@IsNumber() @IsOptional() @IsBoolean()). [libs/contracts/src/domains/inventario.ts:72] `stockActual?: number` (@IsOptional() @IsBoolean() @IsOptional() @IsNumber()). [libs/contracts/src/domains/inventario.ts:75]

**Salida.** Respuesta derivada del handler `crearProducto` y del servicio `crearProducto`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:44]

**Efectos.** Usa `categoria.findUnique`, `producto.create`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-inventario/src/app/app.service.ts:71] Emite o consume eventos `RoutingKeys.ProductoCreado`. [apps/servicio-inventario/src/app/app.service.ts:100]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Categoría con ID ${command.categoriaId} no encontrada);. [apps/servicio-inventario/src/app/app.service.ts:74]

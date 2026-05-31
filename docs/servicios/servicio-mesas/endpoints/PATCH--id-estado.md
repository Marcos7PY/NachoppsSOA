---
tipo: endpoint
servicio: servicio-mesas
metodo: PATCH
ruta: /:id/estado
handler: apps/servicio-mesas/src/app/app.controller.ts:24
fuente: [apps/servicio-mesas/src/app/app.controller.ts:24, apps/servicio-mesas/src/app/app.controller.ts:25, apps/servicio-mesas/src/app/app.service.ts:50, libs/contracts/src/domains/mesas.ts:57]
revisado: 2026-05-31
commit: c5c7891
---

# PATCH /:id/estado

**Proposito.** Cambia el estado de una mesa con control de concurrencia optimista. [apps/servicio-mesas/src/app/app.controller.ts:24]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-mesas/src/app/app.module.ts:2, apps/servicio-mesas/src/app/app.controller.ts:24]

**Entrada.** DTO `ActualizarEstadoMesaCommand` con campos: `estado: MesaEstado` (@IsEnum(MesaEstado)). [libs/contracts/src/domains/mesas.ts:59] `cuentaAsociada?: string` (@IsEnum(MesaEstado) @IsOptional() @IsString()). [libs/contracts/src/domains/mesas.ts:62]

**Salida.** Respuesta derivada del handler `actualizarEstado` y del servicio `actualizarEstado`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-mesas/src/app/app.controller.ts:25]

**Efectos.** Usa `mesa.findUnique`, `mesa.updateMany`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-mesas/src/app/app.service.ts:50] Emite o consume eventos `RoutingKeys.MesaActualizada`. [apps/servicio-mesas/src/app/app.service.ts:78]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Mesa con ID ${id} no encontrada.);. [apps/servicio-mesas/src/app/app.service.ts:53]
- 409 por `ConflictException`: throw new ConflictException(El estado de la mesa fue modificado por otra transacción.);. [apps/servicio-mesas/src/app/app.service.ts:89]

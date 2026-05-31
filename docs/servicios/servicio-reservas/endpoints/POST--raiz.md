---
tipo: endpoint
servicio: servicio-reservas
metodo: POST
ruta: /
handler: apps/servicio-reservas/src/app/app.controller.ts:19
fuente: [apps/servicio-reservas/src/app/app.controller.ts:19, apps/servicio-reservas/src/app/app.controller.ts:20, apps/servicio-reservas/src/app/reservas.service.ts:35, libs/contracts/src/domains/reservas.ts:37]
revisado: 2026-05-31
commit: c5c7891
---

# POST /

**Proposito.** Crea una reserva para fecha y hora solicitadas. [apps/servicio-reservas/src/app/app.controller.ts:19]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-reservas/src/app/app.module.ts:2, apps/servicio-reservas/src/app/app.controller.ts:19]

**Entrada.** DTO `CrearReservaCommand` con campos: `clienteId?: string` (@IsOptional() @IsString()). [libs/contracts/src/domains/reservas.ts:40] `clienteNombre?: string` (@IsOptional() @IsString() @Transform(({ obj, value }) => value ?? obj.nombreCliente)). [libs/contracts/src/domains/reservas.ts:45] `clienteTelefono?: string` (@Transform(({ obj, value }) => value ?? obj.nombreCliente) @IsOptional() @IsString()). [libs/contracts/src/domains/reservas.ts:49] `fecha: string` (@IsString() @IsString() @IsNotEmpty()). [libs/contracts/src/domains/reservas.ts:53] `hora: string` (@IsNotEmpty() @IsString() @IsNotEmpty()). [libs/contracts/src/domains/reservas.ts:57] `mesaPreferida?: string` (@IsNotEmpty() @IsOptional() @IsString()). [libs/contracts/src/domains/reservas.ts:61] `numComensales?: number` (@IsOptional() @IsNumber() @Transform(({ obj, value }) => value ?? obj.personas)). [libs/contracts/src/domains/reservas.ts:66]

**Salida.** Respuesta derivada del handler `crear` y del servicio `crear`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reservas/src/app/app.controller.ts:20]

**Efectos.** Usa `reserva.create`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-reservas/src/app/reservas.service.ts:35] Emite o consume eventos `RoutingKeys.ReservaCreada`. [apps/servicio-reservas/src/app/reservas.service.ts:60]

**Invariantes que toca.** [slot-reserva-activo-unico](../../../invariantes/slot-reserva-activo-unico.md), [exactamente-un-exito-bajo-carrera](../../../invariantes/exactamente-un-exito-bajo-carrera.md)

**Errores.**

- 409 por `ConflictException`: throw new ConflictException('No hay disponibilidad para la fecha y hora solicitadas');. [apps/servicio-reservas/src/app/reservas.service.ts:70]

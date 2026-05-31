---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /:id/cerrar
handler: apps/servicio-cuentas/src/app/app.controller.ts:39
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:39, apps/servicio-cuentas/src/app/app.controller.ts:40, apps/servicio-cuentas/src/app/app.service.ts:196, libs/contracts/src/domains/cuentas.ts:78, apps/servicio-cuentas/src/app/app.service.ts:221]
revisado: 2026-05-31
commit: c5c7891
---

# POST /:id/cerrar

**Proposito.** Cierra una cuenta y genera ticket/eventos de cierre. [apps/servicio-cuentas/src/app/app.controller.ts:39]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:39]

**Entrada.** DTO `CerrarCuentaCommand` con campos: `descuento?: number` (@IsOptional() @IsNumber()). [libs/contracts/src/domains/cuentas.ts:81]

**Salida.** Respuesta derivada del handler `cerrarCuenta` y del servicio `cerrarCuenta`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:40]

**Efectos.** Usa `cuenta.findUnique`, `cuenta.update`, `outboxEvent.createMany`. La operacion incluye una transaccion Prisma. [apps/servicio-cuentas/src/app/app.service.ts:221] Emite o consume eventos `RoutingKeys.CuentaCerrada`, `RoutingKeys.TicketGenerado`. [apps/servicio-cuentas/src/app/app.service.ts:267]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 400 por `BadRequestException`: throw new BadRequestException(La cuenta no está abierta. Estado actual: ${cuenta.estado});. [apps/servicio-cuentas/src/app/app.service.ts:228]
- 404 por `NotFoundException`: throw new NotFoundException(Cuenta con ID ${id} no encontrada);. [apps/servicio-cuentas/src/app/app.service.ts:224]

---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:18
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:18, apps/servicio-cuentas/src/app/app.controller.ts:19, apps/servicio-cuentas/src/app/app.service.ts:45, libs/contracts/src/domains/cuentas.ts:73]
revisado: 2026-05-31
commit: c5c7891
---

# POST /

**Proposito.** Abre una cuenta para una mesa. [apps/servicio-cuentas/src/app/app.controller.ts:18]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:18]

**Entrada.** DTO `AbrirCuentaCommand` con campos: `mesaId: string` (@IsString()). [libs/contracts/src/domains/cuentas.ts:75]

**Salida.** Respuesta derivada del handler `abrirCuenta` y del servicio `abrirCuenta`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:19]

**Efectos.** Usa `cuenta.findFirst`, `cuenta.create`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-cuentas/src/app/app.service.ts:45] Emite o consume eventos `RoutingKeys.CuentaAbierta`. [apps/servicio-cuentas/src/app/app.service.ts:69]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 400 por `BadRequestException`: throw new BadRequestException('La mesa ya tiene una cuenta abierta.');. [apps/servicio-cuentas/src/app/app.service.ts:54]

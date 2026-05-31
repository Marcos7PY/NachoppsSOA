---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /:id/dividir
handler: apps/servicio-cuentas/src/app/app.controller.ts:34
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:34, apps/servicio-cuentas/src/app/app.controller.ts:35, apps/servicio-cuentas/src/app/app.service.ts:296, libs/contracts/src/domains/cuentas.ts:84]
revisado: 2026-05-31
commit: c5c7891
---

# POST /:id/dividir

**Proposito.** dividirCuenta atiende POST /:id/dividir en servicio-cuentas usando `dividirCuenta`. [apps/servicio-cuentas/src/app/app.controller.ts:34]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:34]

**Entrada.** DTO `DividirCuentaCommand` con campos: `metodo: 'IGUALES' | 'POR_ITEMS'` (@IsString()). [libs/contracts/src/domains/cuentas.ts:86] `numPartes?: number` (@IsString() @IsOptional() @IsNumber()). [libs/contracts/src/domains/cuentas.ts:89]

**Salida.** Respuesta derivada del handler `dividirCuenta` y del servicio `dividirCuenta`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:35]

**Efectos.** Usa `cuenta.findUnique`. [apps/servicio-cuentas/src/app/app.service.ts:296]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 400 por `BadRequestException`: throw new BadRequestException('La cuenta no tiene pedidos para dividir.');. [apps/servicio-cuentas/src/app/app.service.ts:301]
- 404 por `NotFoundException`: throw new NotFoundException(Cuenta con ID ${id} no encontrada);. [apps/servicio-cuentas/src/app/app.service.ts:205]

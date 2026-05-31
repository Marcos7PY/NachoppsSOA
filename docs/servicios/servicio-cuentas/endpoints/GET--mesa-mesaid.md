---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /mesa/:mesaId
handler: apps/servicio-cuentas/src/app/app.controller.ts:23
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:23, apps/servicio-cuentas/src/app/app.controller.ts:24, apps/servicio-cuentas/src/app/app.service.ts:211]
revisado: 2026-05-31
commit: c5c7891
---

# GET /mesa/:mesaId

**Proposito.** obtenerCuentaPorMesa atiende GET /mesa/:mesaId en servicio-cuentas usando `obtenerCuentaPorMesa`. [apps/servicio-cuentas/src/app/app.controller.ts:23]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:23]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-cuentas/src/app/app.controller.ts:24]

**Salida.** Respuesta derivada del handler `obtenerCuentaPorMesa` y del servicio `obtenerCuentaPorMesa`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:24]

**Efectos.** Usa `cuenta.findFirst`, `cuenta.findUnique`. [apps/servicio-cuentas/src/app/app.service.ts:211]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(No hay cuenta abierta para la mesa ${mesaId});. [apps/servicio-cuentas/src/app/app.service.ts:216]

---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /:id
handler: apps/servicio-cuentas/src/app/app.controller.ts:28
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:28, apps/servicio-cuentas/src/app/app.controller.ts:29, apps/servicio-cuentas/src/app/app.service.ts:202]
revisado: 2026-05-31
commit: c5c7891
---

# GET /:id

**Proposito.** obtenerCuenta atiende GET /:id en servicio-cuentas usando `obtenerCuenta`. [apps/servicio-cuentas/src/app/app.controller.ts:28]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:28]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-cuentas/src/app/app.controller.ts:29]

**Salida.** Respuesta derivada del handler `obtenerCuenta` y del servicio `obtenerCuenta`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-cuentas/src/app/app.controller.ts:29]

**Efectos.** Usa `cuenta.findUnique`. [apps/servicio-cuentas/src/app/app.service.ts:202]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 404 por `NotFoundException`: throw new NotFoundException(Cuenta con ID ${id} no encontrada);. [apps/servicio-cuentas/src/app/app.service.ts:205]

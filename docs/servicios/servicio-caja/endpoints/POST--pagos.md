---
tipo: endpoint
servicio: servicio-caja
metodo: POST
ruta: /pagos
handler: apps/servicio-caja/src/app/app.controller.ts:14
fuente: [apps/servicio-caja/src/app/app.controller.ts:14, apps/servicio-caja/src/app/app.controller.ts:15, apps/servicio-caja/src/app/app.service.ts:40, libs/contracts/src/domains/caja.ts:38]
revisado: 2026-05-31
commit: c5c7891
---

# POST /pagos

**Proposito.** Registra un pago de cuenta y publica el evento de pago. [apps/servicio-caja/src/app/app.controller.ts:14]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-caja/src/app/app.module.ts:2, apps/servicio-caja/src/app/app.controller.ts:14]

**Entrada.** DTO `PagarPedidoCommand` con campos: `cuentaId: string` (@IsString() @IsNotEmpty()). [libs/contracts/src/domains/caja.ts:41] `montoRecibido: number` (@IsString() @IsNotEmpty() @IsNumber()). [libs/contracts/src/domains/caja.ts:44] `metodo: string` (@IsNumber() @IsString() @IsNotEmpty()). [libs/contracts/src/domains/caja.ts:48]

**Salida.** Respuesta derivada del handler `registrarPago` y del servicio `registrarPago`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-caja/src/app/app.controller.ts:15]

**Efectos.** Usa `cuentaAbierta.findUnique`, `cuentaAbierta.upsert`, `transaccion.create`, `outboxEvent.create`, `executeRaw`. La operacion incluye una transaccion Prisma. [apps/servicio-caja/src/app/app.service.ts:40] Emite o consume eventos `RoutingKeys.PagoRegistrado`. [apps/servicio-caja/src/app/app.service.ts:113]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 400 por `BadRequestException`: throw new BadRequestException(La cuenta ya está ${cuenta.estado.toLowerCase()}.);. [apps/servicio-caja/src/app/app.service.ts:74]
- 404 por `NotFoundException`: throw new NotFoundException(Cuenta ${command.cuentaId} no encontrada.);. [apps/servicio-caja/src/app/app.service.ts:54]
- 503 por `ServiceUnavailableException`: throw new ServiceUnavailableException('No se pudo obtener la cuenta. Reintente.');. [apps/servicio-caja/src/app/app.service.ts:56]

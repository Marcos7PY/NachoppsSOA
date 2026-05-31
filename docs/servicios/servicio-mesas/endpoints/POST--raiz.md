---
tipo: endpoint
servicio: servicio-mesas
metodo: POST
ruta: /
handler: apps/servicio-mesas/src/app/app.controller.ts:19
fuente: [apps/servicio-mesas/src/app/app.controller.ts:19, apps/servicio-mesas/src/app/app.controller.ts:20, apps/servicio-mesas/src/app/app.service.ts:19, libs/contracts/src/domains/mesas.ts:47]
revisado: 2026-05-31
commit: c5c7891
---

# POST /

**Proposito.** Crea una mesa. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-mesas/src/app/app.module.ts:2, apps/servicio-mesas/src/app/app.controller.ts:19]

**Entrada.** DTO `CrearMesaCommand` con campos: `numero: number` (@IsNumber()). [libs/contracts/src/domains/mesas.ts:49] `capacidad: number` (@IsNumber() @IsNumber()). [libs/contracts/src/domains/mesas.ts:51] `ubicacion?: string` (@IsNumber() @IsOptional() @IsString()). [libs/contracts/src/domains/mesas.ts:54]

**Salida.** Respuesta derivada del handler `crearMesa` y del servicio `crearMesa`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-mesas/src/app/app.controller.ts:20]

**Efectos.** Usa `mesa.findUnique`, `mesa.create`, `outboxEvent.create`. La operacion incluye una transaccion Prisma. [apps/servicio-mesas/src/app/app.service.ts:19] Emite o consume eventos `RoutingKeys.MesaCreada`. [apps/servicio-mesas/src/app/app.service.ts:37]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- 409 por `ConflictException`: throw new ConflictException(La mesa número ${command.numero} ya existe.);. [apps/servicio-mesas/src/app/app.service.ts:22]

---
tipo: endpoint
servicio: servicio-pedidos
metodo: POST
ruta: /
handler: apps/servicio-pedidos/src/app/app.controller.ts:12
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:12, apps/servicio-pedidos/src/app/app.controller.ts:13, apps/servicio-pedidos/src/app/app.service.ts:45, libs/contracts/src/domains/pedidos.ts:107]
revisado: 2026-05-31
commit: c5c7891
---

# POST /

**Proposito.** Crea un pedido para una mesa, valida items, reserva stock local y deja eventos en Outbox. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-pedidos/src/app/app.module.ts:2, apps/servicio-pedidos/src/app/app.controller.ts:12]

**Entrada.** DTO `CrearPedidoCommand` con campos: `mesaId: string` (@IsString() @IsNotEmpty()). [libs/contracts/src/domains/pedidos.ts:110] `items: PedidoItemInput[]` (@IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PedidoItemInput)). [libs/contracts/src/domains/pedidos.ts:115]

**Salida.** Respuesta derivada del handler `crearPedido` y del servicio `crearPedido`; codigos esperados: 201 si Nest aplica el codigo por defecto de POST y el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-pedidos/src/app/app.controller.ts:13]

**Efectos.** Usa `mesaLocal.findUnique`, `productoLocal.findMany`, `productoLocal.upsert`, `pedido.create`, `outboxEvent.createMany`, `SQL raw`, `executeRaw`. La operacion incluye una transaccion Prisma. [apps/servicio-pedidos/src/app/app.service.ts:45] Emite o consume eventos `RoutingKeys.PedidoCreado`, `RoutingKeys.PedidoActualizado`. [apps/servicio-pedidos/src/app/app.service.ts:230]

**Invariantes que toca.** [no-oversell](../../../invariantes/no-oversell.md), [exactamente-un-exito-bajo-carrera](../../../invariantes/exactamente-un-exito-bajo-carrera.md)

**Errores.**

- 400 por `BadRequestException`: throw new BadRequestException(La cantidad para ${p.nombre} debe ser al menos 1.);. [apps/servicio-pedidos/src/app/app.service.ts:143]
- 404 por `NotFoundException`: throw new NotFoundException(La mesa con ID ${mesaId} no existe o no está sincronizada.);. [apps/servicio-pedidos/src/app/app.service.ts:61]
- 503 por `ServiceUnavailableException`: throw new ServiceUnavailableException('No se pudo generar token para inventario. Reintente.');. [apps/servicio-pedidos/src/app/app.service.ts:82]
- 500 por `InternalServerErrorException`: throw new InternalServerErrorException('No se pudieron cargar productos desde inventario. Reintente.');. [apps/servicio-pedidos/src/app/app.service.ts:125]

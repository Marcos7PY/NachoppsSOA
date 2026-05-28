# Reporte de Base de Código - Servicio Cuentas

## 1. Controladores

### AppController (`apps/servicio-cuentas/src/app/app.controller.ts`)

- **POST `/`** (línea 13-16)
  - **Método:** `abrirCuenta`
  - **Decoradores Aplicados:** `@Post()`
  - **Entrada (DTO):** `@Body() command: AbrirCuentaCommand` — `mesaId`: string (requerido). Sin decoradores `class-validator`.
  - **Forma de la Respuesta:** `{ message: string; cuenta: CuentaDto }`
  - **Códigos de estado HTTP:** 201 (creación exitosa), 400 (Bad Request si la mesa ya tiene cuenta).
  - **Guards:** Ninguno.

- **GET `/mesa/:mesaId`**
  - **Método:** `obtenerCuentaPorMesa`
  - **Decoradores Aplicados:** `@Get('mesa/:mesaId')`, `@Param('mesaId')`
  - **Forma de la Respuesta:** `CuentaDto`
  - **Códigos de estado HTTP:** 200 (éxito), 404 (Not Found).
  - **Guards:** Ninguno.

- **GET `/`**
  - **Método:** `listarCuentas`
  - **Decoradores Aplicados:** `@Get()`
  - **Forma de la Respuesta:** `{ cuentas: CuentaDto[] }`
  - **Códigos de estado HTTP:** 200 (éxito).
  - **Guards:** Ninguno.

- **GET `/:id`**
  - **Método:** `obtenerCuenta`
  - **Decoradores Aplicados:** `@Get(':id')`, `@Param('id')`
  - **Forma de la Respuesta:** `CuentaDto`
  - **Códigos de estado HTTP:** 200 (éxito), 404 (Not Found).
  - **Guards:** Ninguno.

- **POST `/:id/dividir`**
  - **Método:** `dividirCuenta`
  - **Decoradores Aplicados:** `@Post(':id/dividir')`, `@Param('id')`, `@Body()`
  - **Entrada (DTO):** `DividirCuentaCommand` — `metodo`: 'IGUALES' | 'POR_ITEMS' (requerido), `numPartes`: number (opcional). Sin decoradores `class-validator`.
  - **Forma de la Respuesta:** `any` (objeto con el método y las partes)
  - **Códigos de estado HTTP:** 201 (éxito), 400 (Bad Request), 404 (Not Found).
  - **Guards:** Ninguno.

- **POST `/:id/cerrar`**
  - **Método:** `cerrarCuenta`
  - **Decoradores Aplicados:** `@Post(':id/cerrar')`, `@Param('id')`, `@Body()`
  - **Entrada (DTO):** `CerrarCuentaCommand` — `descuento`: number (opcional). Sin decoradores `class-validator`.
  - **Forma de la Respuesta:** `{ message: string; ticket: TicketDto }`
  - **Códigos de estado HTTP:** 201 (éxito), 400 (Bad Request), 404 (Not Found).
  - **Guards:** Ninguno.

### EventsController (`apps/servicio-cuentas/src/app/events.controller.ts`)
- **Decoradores de la clase:** `@UseInterceptors(RabbitMQRetryInterceptor)`, `@Controller()`

- **Evento: PedidoCreado**
  - **Decoradores:** `@EventPattern(RoutingKeys.PedidoCreado)`, `@Payload()`
  - **Entrada:** `DomainEventEnvelope<any>`. Delega a `AppService.procesarPedidoCreado`.

- **Evento: PagoRegistrado**
  - **Decoradores:** `@EventPattern(RoutingKeys.PagoRegistrado)`, `@Payload()`
  - **Entrada:** `DomainEventEnvelope<PagoRegistradoPayload>`. Delega a `AppService.procesarPagoRegistrado`.

- **Evento: PedidoActualizado**
  - **Decoradores:** `@EventPattern(RoutingKeys.PedidoActualizado)`, `@Payload()`
  - **Entrada:** `DomainEventEnvelope<any>`. Delega a `AppService.procesarPedidoActualizado`.

## 2. Servicios

### AppService (`apps/servicio-cuentas/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService` (BD). Ya no inyecta `RabbitMQPublisherService` ni `JwtService` — toda publicación de eventos se hace mediante el patrón Transactional Outbox.

**`listarCuentas(): Promise<{ cuentas: CuentaDto[] }>`** — Consulta todas las cuentas ordenadas por `createdAt` desc, mapea a DTO.

**`abrirCuenta(command, origen = 'manual'): Promise<{ message: string; cuenta: CuentaDto }>`**
1. Verifica si la mesa ya tiene cuenta abierta. Si existe y origen es `fallback`, aplica idempotencia retornando la existente. Si origen es `manual`, lanza `BadRequestException`.
2. Dentro de una transacción `$transaction`: crea el registro `Cuenta` + inserta un `OutboxEvent` con routingKey `CuentaAbierta` y status `PENDING`. Garantía atómica: si falla el commit, no se publica nada a medias.
3. Retorna mensaje de éxito con el DTO.

**`procesarPedidoCreado(envelope): Promise<void>`** — Extrae `pedido.mesaId`. Busca cuenta abierta, si no existe hace fallback con `abrirCuenta`. Agrega el pedido al snapshot `pedidos` e incrementa `total`.

**`procesarPedidoActualizado(envelope): Promise<void>`** — Actualiza el snapshot del pedido en la cuenta, recalculando `total` con el delta.

**`procesarPagoRegistrado(envelope): Promise<void>`** — Extrae el payload. Si la cuenta está ABIERTA, llama a `cerrarCuenta` para completar el ciclo de vida.

**`obtenerCuenta(id): Promise<CuentaDto>`** — Busca cuenta por ID. Si no existe, `NotFoundException`. Usa snapshot local como fuente de verdad.

**`obtenerCuentaPorMesa(mesaId): Promise<CuentaDto>`** — Busca cuenta abierta por mesaId. Si no existe, `NotFoundException`.

**`cerrarCuenta(id, command): Promise<{ message: string; ticket: TicketDto }>`**
1. Valida existencia y estado ABIERTA. Verifica que tenga pedidos.
2. Calcula total con descuento, genera `ticketId` con uuid v4.
3. En `$transaction`: actualiza estado a CERRADA, inserta 2 `OutboxEvent` (`CuentaCerrada` y `TicketGenerado`) con status `PENDING`.
4. Retorna el ticket generado.

**`dividirCuenta(id, command): Promise<any>`** — Divide según método `IGUALES` (total / numPartes) o `POR_ITEMS` (agrupa por comensal).

### OutboxProcessor (`apps/servicio-cuentas/src/app/outbox.processor.ts`)

Cron que corre cada 5 segundos (`@Cron(CronExpression.EVERY_5_SECONDS)`). Consulta eventos `PENDING` (máx 50), los publica uno por uno a RabbitMQ, los marca `PROCESSED` o `FAILED`. Usa flag `isProcessing` para evitar solapamiento. Dependencias: `PrismaService` + `RabbitMQPublisherService`.

## 3. Prisma

### Schema (`apps/servicio-cuentas/prisma/schema.prisma`)

**Modelo `Cuenta`** (tabla `cuentas`)
- `id`: String @id @default(uuid())
- `mesaId`: String
- `pedidos`: Json
- `total`: Float @default(0)
- `estado`: CuentaEstado @default(ABIERTA)
- `ticket`: String?
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt
- Índices: `@@index([mesaId, estado])`

**Modelo `OutboxEvent`** (tabla `outbox_events`)
- `id`: String @id @default(uuid())
- `routingKey`: String
- `payload`: String (JSON serializado)
- `status`: String @default("PENDING") — PENDING, PROCESSED, FAILED
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

## Observaciones Adicionales

### Patrón Transactional Outbox
Todos los eventos que publica este servicio (`CuentaAbierta`, `CuentaCerrada`, `TicketGenerado`) ahora se escriben atómicamente en la tabla `outbox_events` dentro de la misma transacción que modifica el estado de la cuenta. El `OutboxProcessor` los publica a RabbitMQ de manera asíncrona cada 5 segundos. Esto garantiza consistencia: si el commit de BD falla, ningún evento se publica a medias.

### Arquitectura de Datos (Prisma Local)
PrismaService local. Patrón Database-per-Service. La librería global shared-prisma no es utilizada.

### Seguridad y Autenticación
Sin guards propios. Depende del API Gateway (Kong) para validación de JWT.

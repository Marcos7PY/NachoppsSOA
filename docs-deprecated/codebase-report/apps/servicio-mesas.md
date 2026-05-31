# Reporte del Microservicio `servicio-mesas`

## 1. Controladores

### AppController (`apps/servicio-mesas/src/app/app.controller.ts`)

- **GET `/`** — `listarMesas()`: Retorna `{ mesas: MesaDto[] }`. 200 OK.
- **GET `/:id`** — `obtenerMesa()`: Retorna `MesaDto`. 200 / 404.
- **POST `/`** — `crearMesa(command: CrearMesaCommand)`: Crea mesa con `numero`, `capacidad`, `ubicacion`. Retorna `{ message, mesa }`. 201 / 409.
- **PATCH `/:id/estado`** — `actualizarEstado(id, command: ActualizarEstadoMesaCommand)`: Cambia `estado` y `cuentaAsociada` con guard de estado concurrente. Retorna `{ message, mesa }`. 200 / 404 / 409.

**Guards:** JwtAuthGuard global en módulo.

### EventsController (`apps/servicio-mesas/src/app/events.controller.ts`)
- **Decoradores:** `@UseInterceptors(RabbitMQRetryInterceptor)`, `@Controller()`
- **`CuentaAbierta`** — `@EventPattern(RoutingKeys.CuentaAbierta)`: Recibe `DomainEventEnvelope<CuentaAbiertaPayload>`. Bloquea la mesa marcándola OCUPADA.
- **`CuentaCerrada`** — `@EventPattern(RoutingKeys.CuentaCerrada)`: Recibe `DomainEventEnvelope<CuentaCerradaPayload>`. Libera la mesa marcándola LIBRE.

## 2. Servicios

### AppService (`apps/servicio-mesas/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService`. `RabbitMQPublisherService` fue removido — toda publicación usa Outbox.

**`listarMesas(): Promise<{ mesas: MesaDto[] }>`** — `findMany` ordenado por `numero` asc.

**`crearMesa(command): Promise<{ message, mesa }>`**
1. Verifica unicidad de `numero` con `findUnique`. Si existe, `ConflictException`.
2. En `$transaction`: crea el registro `Mesa` con estado `LIBRE` + inserta `OutboxEvent` con routingKey `MesaCreada` y status `PENDING`. Atómico: si falla el commit, no se publica nada.
3. Retorna mensaje de éxito con el DTO.

**`actualizarEstado(id, command): Promise<{ message, mesa }>`**
1. Busca mesa por ID. Si no existe, `NotFoundException`. Si mismo estado, retorna sin cambios.
2. En `$transaction`: ejecuta `updateMany` con guard de estado (`where: { id, estado: mesa.estado }`). Si `count === 0`, retorna `{ conflicto: true }` (se lanza `ConflictException` afuera). Si éxito, busca la mesa actualizada e inserta `OutboxEvent` con routingKey `MesaActualizada` y status `PENDING`.
3. Retorna la mesa actualizada.

**`obtenerMesa(id): Promise<MesaDto>`** — `findUnique` por ID, `NotFoundException` si no existe.

### OutboxProcessor (`apps/servicio-mesas/src/app/outbox.processor.ts`)

Cron cada 5s (`EVERY_5_SECONDS`). Consulta eventos `PENDING` (máx 50 ordenados por `createdAt` asc), los publica uno por uno a RabbitMQ y los marca `PROCESSED` o `FAILED`. Flag `isProcessing` para evitar solapamiento. Usa `PrismaService` + `RabbitMQPublisherService`.

## 3. Prisma

### Schema (`apps/servicio-mesas/prisma/schema.prisma`)

**Modelo `Mesa`** (tabla `mesas`)
- `id`: String @id @default(uuid())
- `numero`: Int @unique
- `capacidad`: Int
- `ubicacion`: String @default("Salon Principal")
- `estado`: MesaEstado @default(LIBRE) — LIBRE, OCUPADA, RESERVADA
- `cuentaAsociada`: String?
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt
- Índices: `@@index([estado])`

**Modelo `OutboxEvent`** (tabla `outbox_events`) — **NUEVO**
- `id`: String @id @default(uuid())
- `routingKey`: String
- `payload`: String (JSON serializado)
- `status`: String @default("PENDING") — PENDING, PROCESSED, FAILED
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

**Modelo `IdempotencyKey`** (tabla `idempotency_keys`)
- `key`: String @id
- `createdAt`: DateTime @default(now())

## Observaciones Adicionales

### Patrón Transactional Outbox
Los eventos `MesaCreada` y `MesaActualizada` ahora se escriben atómicamente en `outbox_events` dentro de la misma transacción que modifica el estado de la mesa. `OutboxProcessor` los publica cada 5s. Esto eliminó la dependencia directa de `RabbitMQPublisherService` en `AppService`.

### Concurrencia
`actualizarEstado` usa `updateMany` con guard de estado (`where: { id, estado: mesa.estado }`) para prevenir condiciones de carrera al cambiar estados de mesa.

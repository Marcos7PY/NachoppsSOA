# Reporte del Microservicio: servicio-caja

## 1. Controladores

### AppController (`apps/servicio-caja/src/app/app.controller.ts`)

- **GET `/`** — `listarTransacciones()`: Retorna `Promise<TransaccionDto[]>`. 200 OK.
- **POST `/pagos`** — `registrarPago(command: PagarPedidoCommand)`: `cuentaId`, `montoRecibido`, `metodo`. Retorna `{ message, transaccion }`. 201 / 400 / 404 / 503.
  - **400 Bad Request**: cuenta no ABIERTA, monto insuficiente, o pago duplicado/excedente detectado por advisory lock.
  - **404 Not Found**: cuenta no encontrada en servicio-cuentas.
  - **503 Service Unavailable**: servicio-cuentas no responde.

**Guards:** JwtAuthGuard global en módulo.

### EventsController (`apps/servicio-caja/src/app/events.controller.ts`)
- **Decoradores:** `@UseInterceptors(RabbitMQRetryInterceptor)`, `@Controller()`
- **`CuentaCerrada`** — `@EventPattern(RoutingKeys.CuentaCerrada)`: Recibe `DomainEventEnvelope<CuentaCerradaPayload>`. Agrega la orden al historial financiero diario.

## 2. Servicios

### AppService (`apps/servicio-caja/src/app/app.service.ts`)

**Constructor:** Inyecta `PrismaService` + `ServiceTokenService`. Usa `ServiceTokenService` en vez de `JwtService` directo para generación de tokens internos. `RabbitMQPublisherService` no se inyecta en AppService — solo en `OutboxProcessor`.

**`registrarPago(command: PagarPedidoCommand): Promise<{ message, transaccion }>`**
1. Abre `$transaction` con Prisma.
2. **Advisory Lock**: `pg_advisory_xact_lock(1234, hash(cuentaId))` — serializa peticiones concurrentes para la misma cuenta.
3. Obtiene cuenta remota vía `fetchCuenta` (HTTP a servicio-cuentas con CircuitBreaker).
4. Valida estado `ABIERTA` de la cuenta.
5. **Validación de sobrepago**: `aggregate({ _sum: { monto } })` sobre transacciones locales de esa cuenta. Si `montoTotalPagado + montoRecibido > cuenta.total`, lanza `BadRequestException` (doble pago bloqueado).
6. Crea `Transaccion` + inserta `OutboxEvent` con routingKey `PagoRegistrado` y status `PENDING` — todo atómico.
7. Retorna la transacción como DTO.

**`fetchCuenta(cuentaId): Promise<any>`** (privado) — HTTP GET a `servicio-cuentas` con token JWT. Decorado con `@CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 })`.

**`listarTransacciones(): Promise<TransaccionDto[]>`** — `findMany` ordenado por `createdAt` desc, mapea Decimal a Number.

### OutboxProcessor (`apps/servicio-caja/src/app/outbox.processor.ts`)

Cron cada 5s. Consulta eventos `PENDING` (máx 50), publica a RabbitMQ, marca `PROCESSED` o `FAILED`. Flag `isProcessing` anti-solapamiento.

## 3. Prisma

### Schema (`apps/servicio-caja/prisma/schema.prisma`)

**Modelo `Transaccion`** (tabla `transacciones`)
- `id`: String @id @default(uuid())
- `cuentaId`: String
- `monto`: Decimal(10,2)
- `metodo`: String
- `referencia`: String?
- `notas`: String?
- `createdAt`: DateTime @default(now())
- Índices: `@@index([cuentaId])`

**Modelo `OutboxEvent`** (tabla `outbox_events`)
- `id`: String @id @default(uuid())
- `routingKey`: String
- `payload`: String
- `status`: String @default("PENDING") — PENDING, PROCESSED, FAILED
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

**Modelo `CierreCaja`** (tabla `cierres_caja`)
- `id`, `montoEsperado`: Decimal(10,2), `montoReal`: Decimal(10,2), `diferencia`: Decimal(10,2), `usuarioId`, `createdAt`

## Observaciones Adicionales

### Advisory Lock + Aggregate Sum (Anti-Doble Pago)
La combinación de `pg_advisory_xact_lock` + `aggregate` de transacciones locales garantiza que dos pagos simultáneos para la misma cuenta se serialicen. El primero pasa, el segundo detecta que `montoTotalPagado + montoRecibido > cuenta.total` y es rechazado con 400.

### Patrón Transactional Outbox
El evento `PagoRegistrado` se escribe atómicamente en `outbox_events` junto con la `Transaccion`. El `OutboxProcessor` publica cada 5s.

### Circuit Breaker
La llamada HTTP a `servicio-cuentas` usa `@CircuitBreakerOptions` para tolerancia a fallos.

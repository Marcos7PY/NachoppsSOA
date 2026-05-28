# Documentación: `servicio-reportes`

## 1. Controladores

### `AppController`
- **Ruta de archivo:** `apps/servicio-reportes/src/app/app.controller.ts`
- **Interceptores:** `@UseInterceptors(RabbitMQRetryInterceptor)` a nivel de clase
- **Guards aplicados:** `JwtAuthGuard` como APP_GUARD global

- **Endpoint: `GET /` → `healthCheck()`**
  - **Respuesta exacta:** `{ status: 'OK', service: 'Reportes' }`
  - **Códigos de estado HTTP:** 200 OK

- **Endpoint: `GET /resumen` → `getResumen()`**
  - **Respuesta exacta:** `{ fecha: Date, totalVentas: number, ingresosTotales: number }`
  - **Códigos de estado HTTP:** 200 OK

- **Event Handler: `@EventPattern(RoutingKeys.CuentaCerrada)` → `handleCuentaCerrada()`**
  - **Payload:** `DomainEventEnvelope<CuentaCerradaPayload>`
  - **Acción:** Registra la venta diaria vía `AppService.registrarVenta()`

## 2. Servicios (clases)

### `AppService`
- **Ruta de archivo:** `apps/servicio-reportes/src/app/app.service.ts`
- **Constructor:** Inyecta `PrismaService`
- **Método:** `registrarVenta(data: CuentaCerradaPayload)`
  - Crea o actualiza (upsert) un registro `VentaDiaria` con el total de la cuenta cerrada
- **Método:** `obtenerResumenDiario()`
  - Suma todas las `VentaDiaria` del día actual y retorna totales

### `PrismaService`
- **Ruta de archivo:** `apps/servicio-reportes/src/prisma/prisma.service.ts`
- **Implementación:** Usa `createBasePrismaService(PrismaClient)` de `@org/shared-prisma`
- **Service name:** `'servicio-reportes'`

## 3. Prisma

### Modelo `VentaDiaria`
- **Ruta de archivo:** `apps/servicio-reportes/prisma/schema.prisma`
- **Nombre real de la tabla (`@@map`):** `ventas_diarias`
- **Índices:** `@@index([fecha])`
- **Campos:**
  - `id`: `String` (`@id`, `@default(uuid())`)
  - `cuentaId`: `String` (`@unique`)
  - `mesaId`: `String`
  - `total`: `Decimal` (`@db.Decimal(10, 2)`)
  - `fecha`: `DateTime` (`@default(now())`)

### Modelo `IdempotencyKey`
- **Nombre real de la tabla (`@@map`):** `idempotency_keys`
- **Campos:**
  - `key`: `String` (`@id`)
  - `createdAt`: `DateTime` (`@default(now())`)

## Observaciones Adicionales

### RabbitMQ
- **Queue:** `reportes_queue` con DLQ configurada
- **Exchange:** `nachopps_exchange`
- **Binding:** `RoutingKeys.CuentaCerrada`
- **URI default:** `amqp://nachopps:nachopps_secret@localhost:5672`
- **Retry interceptor:** `RabbitMQRetryInterceptor` aplicado

### Swagger
- **Path:** `api/docs` con BearerAuth
- **Título:** "Nachopps Restobar — API Reportes"

### Tracing
- `initTracing('servicio-reportes')` al inicio de `main.ts`

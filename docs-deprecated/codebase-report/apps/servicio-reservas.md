# Reporte de Base de Código - Servicio Reservas

## 1. Controladores

### AppController (`apps/servicio-reservas/src/app/app.controller.ts`)
- **Guards:** `JwtAuthGuard` como APP_GUARD global
- **Interceptores:** `RabbitMQRetryInterceptor` en handlers de eventos

- **GET `/`** → `listar()`
  - **Respuesta:** `{ reservas: ReservaDto[] }`

- **GET `/disponibilidad`** → `disponibilidad()`
  - **Query:** `fecha`, `hora`
  - **Respuesta:** `{ fecha, hora, disponible, capacidadRestante }`

- **POST `/`** → `crear()`
  - **Body:** `CrearReservaCommand`
  - **Respuesta:** `{ message, reserva: ReservaDto }`

- **PATCH `/:id/confirmar`** → `confirmar()`
- **DELETE `/:id`** → `cancelar()`

## 2. Servicios

### ReservasService
- **Constructor:** Inyecta `PrismaService` y `RabbitMQPublisherService`
- `listar()`, `crear()`, `confirmar()`, `cancelar()`, `consultarDisponibilidad()`

### PrismaService
- **Implementación:** Usa `createBasePrismaService(PrismaClient)` de `@org/shared-prisma`
- **Service name:** `'servicio-reservas'`

## 3. Prisma

### Modelo `Reserva`
- Campos: `id`, `clienteId`, `clienteNombre`, `clienteTelefono`, `fecha` (`@db.Date`), `hora`, `mesaPreferida`, `numComensales`, `estado`, `createdAt`, `updatedAt`
- **Índices:** `@@index([fecha, hora])`, `@@index([estado])`

NOTA: No existe endpoint `GET /health` — el health check es `GET /`.

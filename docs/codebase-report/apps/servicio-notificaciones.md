# Documentación del Microservicio: servicio-notificaciones

## 1. Controladores

### `AppController`
**Archivo:** `apps/servicio-notificaciones/src/app/app.controller.ts`
**Interceptores:** `@UseInterceptors(RabbitMQRetryInterceptor)` a nivel de clase
**Guards:** `JwtAuthGuard` como APP_GUARD global

#### Endpoint: `GET /` → `getData()`
- **Respuesta:** `{ message: 'Servicio de Notificaciones activo', service: 'servicio-notificaciones' }`

#### Event Handlers:
- `@EventPattern(RoutingKeys.PedidoCreado)` → `handlePedidoCreado()`
- `@EventPattern(RoutingKeys.PedidoActualizado)` → `handlePedidoActualizado()`
- `@EventPattern(RoutingKeys.ReservaCreada)` → `handleReservaCreada()`
- `@EventPattern(RoutingKeys.ReservaCancelada)` → `handleReservaCancelada()`

Todos delegan a `handleEvent()` que emite vía WebSocket (`gateway.emitPedidoUpdate()`).
El ACK/NACK y reintentos son gestionados por `RabbitMQRetryInterceptor`.

## 2. Servicios

### `AppService`
- `getData()`: Retorna mensaje estático de servicio activo.

### `NotificationsGateway`
- **Decoradores:** `@WebSocketGateway({ cors: ..., path: '/api/socket.io' })`
- `handleConnection(client)`: Loguea conexión KDS
- `handleDisconnect(client)`: Loguea desconexión KDS
- `emitPedidoUpdate(evento)`: Emite `pedidoUpdate` a todos los clientes WebSocket

### `PrismaService`
- **Ruta:** `apps/servicio-notificaciones/src/prisma/prisma.service.ts`
- **Implementación:** Usa `createBasePrismaService(PrismaClient)` de `@org/shared-prisma`
- **Service name:** `'servicio-notificaciones'`

## 3. Prisma

### Modelo `Notificacion`
- Sin `@@map` (tabla = `Notificacion`)
- Campos: `id`, `eventoOrigen`, `destinatario`, `canal`, `contenido`, `estado` (PENDIENTE/ENVIADO/FALLIDO), `intentos`, `timestamp`

### Modelo `IdempotencyKey`
- `@@map("idempotency_keys")`
- Campos: `key` (`@id`), `createdAt`

## Observaciones Adicionales

### RabbitMQ
- **Queue:** `notificaciones_queue` con DLQ
- **Exchange:** `nachopps_exchange`
- **Retry interceptor:** `RabbitMQRetryInterceptor` aplicado (3 reintentos con backoff exponencial)

### Swagger
- `api/docs` con BearerAuth
- Título: "Nachopps Restobar — API Notificaciones"

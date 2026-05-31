# Mapa Global de Eventos RabbitMQ

La arquitectura asíncrona del monorepo se basa en RabbitMQ. Todo fluye por un único exchange global `NACHOPPS_EXCHANGE` de tipo `topic`.

## Publicación: Patrón Transactional Outbox (Estandarizado)

**Todos los eventos son publicados mediante el patrón Transactional Outbox.** Ningún `AppService` publica directamente a RabbitMQ. En su lugar:

1. El servicio escribe el evento en la tabla `outbox_events` (status `PENDING`) dentro de la misma transacción de BD que modifica el estado de negocio.
2. Un `OutboxProcessor` (cron cada 5s) lee eventos `PENDING`, los publica a RabbitMQ, y los marca `PROCESSED` o `FAILED`.

Esto garantiza consistencia transaccional: si el commit de BD falla, ningún evento se publica a medias.

## Estructura de Envoltura (Envelope)

Todos los eventos están tipados mediante `DomainEventEnvelope<T>` (`libs/contracts/src/messaging/envelope.ts`):

```typescript
export interface DomainEventEnvelope<TPayload> {
  pattern: string; // La RoutingKey (ej. 'pedido.creado')
  data: TPayload;   // El payload específico del dominio
  metadata?: {
    correlationId?: string;
    occurredAt: string; // Timestamp ISO 8601 autogenerado
    producer?: string;  // Nombre del microservicio origen
    idempotencyKey?: string;
  };
}
```

## Flujo de Eventos (Publicadores y Consumidores)

### 1. `pedido.creado` (`RoutingKeys.PedidoCreado`)
- **Publicado por:** `servicio-pedidos` — vía Outbox en `persistirPedido` (tabla `outbox_events`)
- **Consumido por:**
  - `servicio-cuentas`: Abre cuenta automáticamente si no existe (fallback). Agrega ítems al snapshot de la cuenta.
  - `servicio-inventario`: Descuenta stock con `updateMany` condicional atómico (`stockActual: { gte: cantidad }`). Si no hay stock suficiente, el decremento es rechazado por la BD.
  - `servicio-notificaciones`: Transmite el nuevo pedido al KDS (Kitchen Display System).

### 2. `pedido.actualizado` (`RoutingKeys.PedidoActualizado`)
- **Publicado por:** `servicio-pedidos` — vía Outbox en `actualizarEstado` y `actualizarEstadoItem`
- **Consumido por:**
  - `servicio-cuentas`: Actualiza el snapshot del pedido en la cuenta y recalcula delta de total.
  - `servicio-notificaciones`: Actualiza el estado visual del pedido en cocina.

### 3. `pedido.listo` (`RoutingKeys.PedidoListo`)
- **Publicado por:** `servicio-pedidos` — vía Outbox en `actualizarEstado` y `actualizarEstadoItem` (cuando todos los ítems están LISTO/ENTREGADO)
- **Consumido por:** *(Reservado para PWA de Meseros / notificaciones push).*

### 4. `pago.registrado` (`RoutingKeys.PagoRegistrado`)
- **Publicado por:** `servicio-caja` — vía Outbox en `registrarPago` (tabla `outbox_events`)
- **Consumido por:**
  - `servicio-cuentas`: Marca la cuenta como pagada, llama a `cerrarCuenta`.
  - `servicio-pedidos`: Marca todos los pedidos de la mesa como PAGADO.

### 5. `cuenta.cerrada` (`RoutingKeys.CuentaCerrada`)
- **Publicado por:** `servicio-cuentas` — vía Outbox en `cerrarCuenta`
- **Consumido por:**
  - `servicio-caja`: Actualiza proyección local `CuentaAbierta` a estado CERRADA.
  - `servicio-mesas`: Libera la mesa en el plano (marca LIBRE).
  - `servicio-reportes`: Registra la venta diaria vía `ventaDiaria.upsert`.

### 6. `cuenta.abierta` (`RoutingKeys.CuentaAbierta`)
- **Publicado por:** `servicio-cuentas` — vía Outbox en `abrirCuenta`
- **Consumido por:**
  - `servicio-mesas`: Bloquea la mesa marcándola como OCUPADA.
  - `servicio-caja`: Sincroniza proyección local `CuentaAbierta` para consulta sin HTTP.

### 7. `ticket.generado` (`RoutingKeys.TicketGenerado`)
- **Publicado por:** `servicio-cuentas` — vía Outbox en `cerrarCuenta`
- **Consumido por:** *(Pendiente de integrarse a servicio-reportes o de impresión local).*

### 8. `mesa.creada` (`RoutingKeys.MesaCreada`)
- **Publicado por:** `servicio-mesas` — vía Outbox en `crearMesa`
- **Consumido por:**
  - `servicio-pedidos`: Sincroniza caché local `MesaLocal` vía `upsertMesaLocal`.

### 9. `mesa.actualizada` (`RoutingKeys.MesaActualizada`)
- **Publicado por:** `servicio-mesas` — vía Outbox en `actualizarEstado`
- **Consumido por:**
  - `servicio-pedidos`: Sincroniza caché local `MesaLocal` vía `upsertMesaLocal`.

### 10. `reserva.creada` (`RoutingKeys.ReservaCreada`)
- **Publicado por:** `servicio-reservas`
- **Consumido por:** `servicio-notificaciones`: Envía confirmación.

### 11. `reserva.cancelada` (`RoutingKeys.ReservaCancelada`)
- **Publicado por:** `servicio-reservas`
- **Consumido por:** `servicio-notificaciones`: Envía notificación de cancelación.

### 12. `producto.creado` (`RoutingKeys.ProductoCreado`)
- **Publicado por:** `servicio-inventario` — vía Outbox en `crearProducto`
- **Consumido por:**
  - `servicio-pedidos`: Sincroniza proyección local `ProductoLocal` para validar items sin HTTP.

### 13. `producto.actualizado` (`RoutingKeys.ProductoActualizado`)
- **Publicado por:** `servicio-inventario` — vía Outbox en `actualizarStock`, `reducirStockAutomatico`
- **Consumido por:**
  - `servicio-pedidos`: Actualiza proyección local `ProductoLocal` (precio, stock, nombre, categoría).

### 14. `usuario.autenticado` (`RoutingKeys.UsuarioAutenticado`)
- **Publicado por:** `servicio-identidad`
- **Consumido por:** Auditoría / observabilidad.

---

## Resiliencia

Todos los consumidores usan `@UseInterceptors(RabbitMQRetryInterceptor)` que provee reintentos con backoff exponencial (máx 3 intentos, delay: 1s → 2s → 4s). El interceptor maneja `channel.ack`/`nack` automáticamente — **no invocar manualmente** en controladores (causa "Double ACK" fatal).

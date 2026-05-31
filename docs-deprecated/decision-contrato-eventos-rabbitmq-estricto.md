# Decision: contrato estricto de eventos RabbitMQ

Fecha: 2026-05-29

## Decision final

Adoptar contrato estricto para consumidores RabbitMQ con `@EventPattern()`:

- Los handlers deben recibir payload de dominio directo mediante `@Payload()`.
- Los handlers no deben recibir ni depender de `DomainEventEnvelope<T>`.
- No se mantendra compatibilidad con mensajes viejos ni formatos alternativos.
- Si el estado actual de colas/DB queda inconsistente, se recrea el stack con volumenes limpios.

Ejemplo esperado:

```ts
@EventPattern(RoutingKeys.MesaActualizada)
async handleMesaActualizada(@Payload() payload: MesaActualizadaPayload) {
  await this.appService.upsertMesaLocal(payload.mesa);
}
```

No usar:

```ts
@EventPattern(RoutingKeys.MesaActualizada)
async handleMesaActualizada(@Payload() envelope: DomainEventEnvelope<MesaActualizadaPayload>) {
  await this.appService.upsertMesaLocal(envelope.data.mesa);
}
```

## Motivo

Durante la corrida de pruebas, `servicio-pedidos` fallo al consumir `mesa.actualizada`:

```text
Cannot read properties of undefined (reading 'mesa')
```

El handler esperaba `envelope.data.mesa`, pero con `@EventPattern()` Nest entrega el payload de negocio en `@Payload()`. Para `mesa.actualizada`, el handler recibia `{ mesa: ... }`, no `{ data: { mesa: ... } }`.

Esto genero reintentos, mensajes en DLQ y degradacion de RabbitMQ:

```text
dlq.pedidos_queue = 26
pedidos_queue messages_unacknowledged = 13
```

## Cambios a aplicar

Actualizar consumidores RabbitMQ para usar payload directo.

### servicio-pedidos

Archivo:

- `apps/servicio-pedidos/src/app/events.controller.ts`

Cambiar:

- `handleMesaCreada`
- `handleMesaActualizada`
- `handleProductoCreado`
- `handleProductoActualizado`

Todos deben recibir payload directo.

### servicio-cuentas

Archivos:

- `apps/servicio-cuentas/src/app/events.controller.ts`
- `apps/servicio-cuentas/src/app/app.service.ts`

Cambiar handlers de:

- `pedido.creado`
- `pedido.actualizado`
- `pago.registrado`

Los metodos internos deben recibir payload directo o el controller debe pasar payload directo.

### servicio-caja

Archivo:

- `apps/servicio-caja/src/app/events.controller.ts`

Cambiar handlers de:

- `cuenta.abierta`
- `cuenta.cerrada`

### servicio-inventario

Archivo:

- `apps/servicio-inventario/src/app/events.controller.ts`

Cambiar handlers que consumen eventos de pedidos para payload directo.

### servicio-reportes

Archivos:

- `apps/servicio-reportes/src/app/app.controller.ts`
- `apps/servicio-reportes/src/app/app.service.ts`

Cambiar `cuenta.cerrada` para payload directo.

### servicio-notificaciones

Archivo:

- `apps/servicio-notificaciones/src/app/app.controller.ts`

Eliminar tipos union/fallback de envelope cuando no sean necesarios. Consumir payload directo.

## Reglas de implementacion

- No usar fallback tipo `envelope.data ?? envelope`.
- No preservar compatibilidad con mensajes viejos.
- No dejar handlers tipados como `DomainEventEnvelope<T>`.
- Mantener `DomainEventEnvelope` solo en la capa de publicacion/transporte si aun es necesario para `RabbitMQPublisherService`.
- Si algun handler necesita metadata, definirlo explicitamente despues; no mezclarlo con payload de dominio.

## Tests requeridos

Agregar o actualizar tests unitarios para handlers/event services con payload directo.

Casos minimos:

- `mesa.creada` recibe `{ mesa }` y llama `upsertMesaLocal(mesa)`.
- `mesa.actualizada` recibe `{ mesa }` y llama `upsertMesaLocal(mesa)`.
- `pedido.creado` recibe payload directo y abre/consolida cuenta.
- `pedido.actualizado` recibe payload directo y actualiza snapshot.
- `pago.registrado` recibe payload directo y cierra cuenta.
- `cuenta.abierta` recibe payload directo y sincroniza caja/mesas.
- `cuenta.cerrada` recibe payload directo y sincroniza caja/mesas/reportes.

## Limpieza de entorno

Como todos los datos son de prueba, despues de implementar se puede recrear todo:

```powershell
docker compose -f infra\docker-compose.yml --profile all down -v
docker compose -f infra\docker-compose.yml --profile all up -d --wait --wait-timeout 240
```

Luego:

```powershell
$env:DATABASE_URL='postgresql://nachopps:secret@localhost:5439/identidad_db?schema=public'
Push-Location apps\servicio-identidad
node ..\..\scripts\seed-admin.js
Pop-Location
npm run poblar
npm run probar
```

## Verificacion obligatoria

Despues de `npm run probar`, verificar colas:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Estado esperado:

- `dlq.*` en 0.
- `messages_ready` en 0 para colas principales.
- `messages_unacknowledged` en 0 para colas principales.
- `npm run probar` sin fallas.

Si esto pasa, continuar con las fases de concurrencia y limite del plan:

- `docs/plan-pruebas-funcionales-integracion-seguridad-concurrencia.md`

# Continuacion: stock idempotency, DLQ y reconciliacion

## Estado alcanzado

Ya se hizo merge de la fase de seguridad y limites.

- Branch trabajado: `codex/security-and-limit-tests`
- Commit pusheado: `e155c5c test: add security and limit checks`
- PR creado desde: `codex/security-and-limit-tests`
- Validaciones ejecutadas:
  - `npm exec nx build servicio-inventario`
  - `npm run probar:seguridad`
  - `npm run probar`
  - RabbitMQ revisado con colas en `0 ready / 0 unacked`

La fase anterior de concurrencia ya habia corregido el overselling reservando stock localmente en pedidos y dejando inventario como actualizacion asincrona via evento.

## Lo que procede

La siguiente fase recomendada es P1: consistencia de stock ante redelivery, fallos de consumidor y recuperacion.

Objetivo: demostrar que el sistema no descuenta stock dos veces por el mismo pedido/evento, y documentar o implementar una ruta clara de recuperacion cuando el consumidor de inventario falla.

## Al iniciar la nueva sesion

Ejecutar:

```powershell
git checkout main
git pull
npm run probar
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
git checkout -b codex/stock-idempotency-dlq
```

Si `main` ya contiene el merge, trabajar desde ahi. Si no, revisar primero el branch remoto que contiene el merge.

## Hipotesis a investigar

### H1: idempotencia del consumidor de inventario

Revisar:

- `apps/servicio-inventario/src/app/events.controller.ts`
- `apps/servicio-inventario/src/app/app.service.ts`
- `apps/servicio-inventario/prisma/schema.prisma`

Pregunta central: si RabbitMQ reentrega el mismo evento `pedido.creado`, inventario descuenta stock una sola vez o varias veces?

Posible solucion si no existe idempotencia:

- Persistir eventos procesados por `pedidoId` o `eventId`.
- Hacer que el descuento sea transaccional junto con el registro de evento procesado.
- Ignorar redeliveries ya procesadas.

### H2: divergencia entre pedidos e inventario

Pedidos ya reserva stock en su propia base para evitar overselling. Inventario se actualiza despues por evento.

Riesgo: si el consumidor falla, pedidos puede mostrar stock reservado/descontado y la base de inventario quedar atrasada.

Lo que se debe decidir o documentar:

- Si se aceptara consistencia eventual.
- Como se detecta atraso entre ambas proyecciones.
- Como se reintenta o reconcilia.

### H3: politica de retry y DLQ

Revisar configuracion de RabbitMQ/Nest para:

- Retries.
- Dead-letter queue.
- Ack/nack en fallos.
- Comportamiento cuando el consumidor cae.

Si no hay DLQ, documentar el gap o implementarlo en el alcance de la fase.

## Pruebas sugeridas

### D1: redelivery idempotente

Prueba esperada:

1. Crear producto con stock inicial conocido.
2. Crear pedido que descuenta una cantidad.
3. Esperar que inventario procese `pedido.creado`.
4. Reemitir el mismo evento con el mismo identificador de pedido/evento.
5. Verificar que inventario no descuenta dos veces.

Criterio de exito: el stock final refleja un solo descuento.

### D2: fallo de consumidor y recuperacion

Prueba esperada:

1. Provocar una falla controlada del consumidor o detener temporalmente el servicio de inventario.
2. Crear un pedido valido.
3. Verificar que el evento queda pendiente, se reintenta o termina en DLQ segun politica definida.
4. Reactivar consumidor o ejecutar reconciliacion.
5. Verificar que pedidos e inventario vuelven a un estado consistente.

Criterio de exito: no hay perdida silenciosa de eventos y queda claro como operar la recuperacion.

## Comandos utiles de evidencia

RabbitMQ:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Buscar consumidores/eventos:

```powershell
rg "pedido.creado|EventPattern|RabbitMQ|nack|ack|DLQ|dead" apps
```

Revisar estado git:

```powershell
git status --short --branch
```

Validacion general:

```powershell
npm run probar
```

## Criterios de salida

La fase queda lista cuando:

- Existe una prueba automatizada o script reproducible para redelivery idempotente.
- Existe una prueba automatizada o procedimiento documentado para fallo de consumidor y recuperacion.
- `npm run probar` queda verde.
- RabbitMQ queda sin mensajes pendientes inesperados.
- Se agrega un informe corto con hallazgos, por ejemplo:
  - `docs/informe-stock-idempotency-dlq.md`

## Fuera de alcance por ahora

No mezclar con pruebas P2 de carga alta o performance. Esta fase debe enfocarse en correccion y recuperabilidad del flujo de stock.

# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T22:48:41.096Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Iteraciones: 3
- Modo alta contencion: si
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante |
|---|---:|
| D1c redelivery concurrente idempotente iter 1/3 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 1/3 | OK |
| Colas finales sin pendientes inesperados iter 1/3 | OK |
| D1c redelivery concurrente idempotente iter 2/3 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 2/3 | OK |
| Colas finales sin pendientes inesperados iter 2/3 | OK |
| D1c redelivery concurrente idempotente iter 3/3 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 3/3 | OK |
| Colas finales sin pendientes inesperados iter 3/3 | OK |

## Detalle

### D1c redelivery concurrente idempotente iter 1/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780267689252-85weei","productId":"35d5cb14-70ae-4697-becf-925d3b20d878","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780267693063-fxjpff","productId":"8a2eeb4f-930d-417b-80b1-a45d21861d34","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780267699146-2jnw4f","productId":"ad22cc33-e078-4b6c-9f2e-8d963536402b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780267704436-nbws97","productId":"99ce8191-e8dd-446e-afc0-3295b750d6d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780267711143-h1s2no","productId":"d6cc4de1-2f1b-4104-8751-37a9658f2044","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780267715384-jiw72z","productId":"65c1f32c-3132-4ab0-b718-7815be3460bd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

## RabbitMQ antes

```text
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
name	messages_ready	messages_unacknowledged	consumers
parking.inventario_queue	0	0	0
mesas_queue	0	0	1
dlq.pedidos_queue	0	0	0
dlq.reportes_queue	0	0	0
dlq.inventario_queue	0	0	0
caja_queue	0	0	1
pedidos_queue	0	0	1
dlq.cuentas_queue	0	0	0
inventario_queue	0	0	1
dlq.mesas_queue	0	0	0
reportes_queue	0	0	1
notificaciones_queue	0	0	1
dlq.caja_queue	0	0	0
cuentas_queue	0	0	1
```

## RabbitMQ despues

```text
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
name	messages_ready	messages_unacknowledged	consumers
parking.inventario_queue	0	0	0
mesas_queue	0	0	1
dlq.pedidos_queue	0	0	0
dlq.reportes_queue	0	0	0
dlq.inventario_queue	0	0	0
caja_queue	0	0	1
pedidos_queue	0	0	1
dlq.cuentas_queue	0	0	0
inventario_queue	0	0	1
dlq.mesas_queue	0	0	0
reportes_queue	0	0	1
notificaciones_queue	0	0	1
dlq.caja_queue	0	0	0
cuentas_queue	0	0	1
```

## Recuperacion y deteccion

1. La proyeccion que previene oversell es `servicio-pedidos.productos_locales`; inventario reporta y emite actualizaciones asincronas.
2. Ante fallos, revisar `dlq.inventario_queue`, corregir causa y reinyectar a `nachopps_exchange` con routing key `pedido.creado`.
3. El check de DLQ debe alertar si cualquier `dlq.*` tiene `messages_ready > 0`.
4. Mensajes con `x-reinjection-count >= 2` se aparcan en `parking.inventario_queue` para inspeccion manual.

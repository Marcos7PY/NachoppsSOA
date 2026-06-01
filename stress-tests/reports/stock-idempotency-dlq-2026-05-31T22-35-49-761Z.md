# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T22:35:49.761Z
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
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780266920139-jfftdx","productId":"3af3b9c7-83b0-45bc-9af6-69817ad37f28","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/3

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780266924107-tvzc17","productId":"10bc7f2b-51d6-45ce-a251-e39dccc6cb33","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780266930231-g7m6a3","productId":"8d6cb83a-0ec8-4587-a314-ea840c797d90","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780266934057-4n0jqf","productId":"be79ce51-f7ff-43af-9f9c-d98f9cdf0510","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780266940071-naumsi","productId":"080e36c0-5295-49ba-98a6-58ee99de5965","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780266944388-nrdhnd","productId":"fd985917-c0e0-468a-b294-80baadec4e7e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

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

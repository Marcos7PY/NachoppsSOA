# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T22:33:41.417Z
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
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780266792314-xpulgh","productId":"3c855ad9-0bb1-41cb-9c41-aaf6e665a761","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780266796146-jadlrl","productId":"6e7f7270-806c-430c-94d4-4b5fa318471d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780266802170-ndi1c6","productId":"f5c0a874-c669-434e-9173-e818398ddaf8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780266806112-mnrl9q","productId":"b5607255-12b2-4e59-afbb-b86b83ca48e9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/3

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780266812345-in0xkm","productId":"457fa845-a2cd-4216-9b38-7e914e48f1da","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/3

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780266816070-w7vd50","productId":"3b18c477-ddb2-4abd-8c5c-301704bdf665","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

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

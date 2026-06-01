# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T21:54:31.642Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Iteraciones: 100
- Modo alta contencion: si
- Resultado: 300/300 invariantes OK

## Resumen

| Escenario | Invariante |
|---|---:|
| D1c redelivery concurrente idempotente iter 1/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 1/100 | OK |
| Colas finales sin pendientes inesperados iter 1/100 | OK |
| D1c redelivery concurrente idempotente iter 2/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 2/100 | OK |
| Colas finales sin pendientes inesperados iter 2/100 | OK |
| D1c redelivery concurrente idempotente iter 3/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 3/100 | OK |
| Colas finales sin pendientes inesperados iter 3/100 | OK |
| D1c redelivery concurrente idempotente iter 4/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 4/100 | OK |
| Colas finales sin pendientes inesperados iter 4/100 | OK |
| D1c redelivery concurrente idempotente iter 5/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 5/100 | OK |
| Colas finales sin pendientes inesperados iter 5/100 | OK |
| D1c redelivery concurrente idempotente iter 6/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 6/100 | OK |
| Colas finales sin pendientes inesperados iter 6/100 | OK |
| D1c redelivery concurrente idempotente iter 7/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 7/100 | OK |
| Colas finales sin pendientes inesperados iter 7/100 | OK |
| D1c redelivery concurrente idempotente iter 8/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 8/100 | OK |
| Colas finales sin pendientes inesperados iter 8/100 | OK |
| D1c redelivery concurrente idempotente iter 9/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 9/100 | OK |
| Colas finales sin pendientes inesperados iter 9/100 | OK |
| D1c redelivery concurrente idempotente iter 10/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 10/100 | OK |
| Colas finales sin pendientes inesperados iter 10/100 | OK |
| D1c redelivery concurrente idempotente iter 11/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 11/100 | OK |
| Colas finales sin pendientes inesperados iter 11/100 | OK |
| D1c redelivery concurrente idempotente iter 12/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 12/100 | OK |
| Colas finales sin pendientes inesperados iter 12/100 | OK |
| D1c redelivery concurrente idempotente iter 13/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 13/100 | OK |
| Colas finales sin pendientes inesperados iter 13/100 | OK |
| D1c redelivery concurrente idempotente iter 14/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 14/100 | OK |
| Colas finales sin pendientes inesperados iter 14/100 | OK |
| D1c redelivery concurrente idempotente iter 15/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 15/100 | OK |
| Colas finales sin pendientes inesperados iter 15/100 | OK |
| D1c redelivery concurrente idempotente iter 16/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 16/100 | OK |
| Colas finales sin pendientes inesperados iter 16/100 | OK |
| D1c redelivery concurrente idempotente iter 17/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 17/100 | OK |
| Colas finales sin pendientes inesperados iter 17/100 | OK |
| D1c redelivery concurrente idempotente iter 18/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 18/100 | OK |
| Colas finales sin pendientes inesperados iter 18/100 | OK |
| D1c redelivery concurrente idempotente iter 19/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 19/100 | OK |
| Colas finales sin pendientes inesperados iter 19/100 | OK |
| D1c redelivery concurrente idempotente iter 20/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 20/100 | OK |
| Colas finales sin pendientes inesperados iter 20/100 | OK |
| D1c redelivery concurrente idempotente iter 21/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 21/100 | OK |
| Colas finales sin pendientes inesperados iter 21/100 | OK |
| D1c redelivery concurrente idempotente iter 22/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 22/100 | OK |
| Colas finales sin pendientes inesperados iter 22/100 | OK |
| D1c redelivery concurrente idempotente iter 23/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 23/100 | OK |
| Colas finales sin pendientes inesperados iter 23/100 | OK |
| D1c redelivery concurrente idempotente iter 24/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 24/100 | OK |
| Colas finales sin pendientes inesperados iter 24/100 | OK |
| D1c redelivery concurrente idempotente iter 25/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 25/100 | OK |
| Colas finales sin pendientes inesperados iter 25/100 | OK |
| D1c redelivery concurrente idempotente iter 26/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 26/100 | OK |
| Colas finales sin pendientes inesperados iter 26/100 | OK |
| D1c redelivery concurrente idempotente iter 27/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 27/100 | OK |
| Colas finales sin pendientes inesperados iter 27/100 | OK |
| D1c redelivery concurrente idempotente iter 28/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 28/100 | OK |
| Colas finales sin pendientes inesperados iter 28/100 | OK |
| D1c redelivery concurrente idempotente iter 29/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 29/100 | OK |
| Colas finales sin pendientes inesperados iter 29/100 | OK |
| D1c redelivery concurrente idempotente iter 30/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 30/100 | OK |
| Colas finales sin pendientes inesperados iter 30/100 | OK |
| D1c redelivery concurrente idempotente iter 31/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 31/100 | OK |
| Colas finales sin pendientes inesperados iter 31/100 | OK |
| D1c redelivery concurrente idempotente iter 32/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 32/100 | OK |
| Colas finales sin pendientes inesperados iter 32/100 | OK |
| D1c redelivery concurrente idempotente iter 33/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 33/100 | OK |
| Colas finales sin pendientes inesperados iter 33/100 | OK |
| D1c redelivery concurrente idempotente iter 34/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 34/100 | OK |
| Colas finales sin pendientes inesperados iter 34/100 | OK |
| D1c redelivery concurrente idempotente iter 35/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 35/100 | OK |
| Colas finales sin pendientes inesperados iter 35/100 | OK |
| D1c redelivery concurrente idempotente iter 36/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 36/100 | OK |
| Colas finales sin pendientes inesperados iter 36/100 | OK |
| D1c redelivery concurrente idempotente iter 37/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 37/100 | OK |
| Colas finales sin pendientes inesperados iter 37/100 | OK |
| D1c redelivery concurrente idempotente iter 38/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 38/100 | OK |
| Colas finales sin pendientes inesperados iter 38/100 | OK |
| D1c redelivery concurrente idempotente iter 39/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 39/100 | OK |
| Colas finales sin pendientes inesperados iter 39/100 | OK |
| D1c redelivery concurrente idempotente iter 40/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 40/100 | OK |
| Colas finales sin pendientes inesperados iter 40/100 | OK |
| D1c redelivery concurrente idempotente iter 41/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 41/100 | OK |
| Colas finales sin pendientes inesperados iter 41/100 | OK |
| D1c redelivery concurrente idempotente iter 42/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 42/100 | OK |
| Colas finales sin pendientes inesperados iter 42/100 | OK |
| D1c redelivery concurrente idempotente iter 43/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 43/100 | OK |
| Colas finales sin pendientes inesperados iter 43/100 | OK |
| D1c redelivery concurrente idempotente iter 44/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 44/100 | OK |
| Colas finales sin pendientes inesperados iter 44/100 | OK |
| D1c redelivery concurrente idempotente iter 45/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 45/100 | OK |
| Colas finales sin pendientes inesperados iter 45/100 | OK |
| D1c redelivery concurrente idempotente iter 46/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 46/100 | OK |
| Colas finales sin pendientes inesperados iter 46/100 | OK |
| D1c redelivery concurrente idempotente iter 47/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 47/100 | OK |
| Colas finales sin pendientes inesperados iter 47/100 | OK |
| D1c redelivery concurrente idempotente iter 48/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 48/100 | OK |
| Colas finales sin pendientes inesperados iter 48/100 | OK |
| D1c redelivery concurrente idempotente iter 49/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 49/100 | OK |
| Colas finales sin pendientes inesperados iter 49/100 | OK |
| D1c redelivery concurrente idempotente iter 50/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 50/100 | OK |
| Colas finales sin pendientes inesperados iter 50/100 | OK |
| D1c redelivery concurrente idempotente iter 51/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 51/100 | OK |
| Colas finales sin pendientes inesperados iter 51/100 | OK |
| D1c redelivery concurrente idempotente iter 52/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 52/100 | OK |
| Colas finales sin pendientes inesperados iter 52/100 | OK |
| D1c redelivery concurrente idempotente iter 53/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 53/100 | OK |
| Colas finales sin pendientes inesperados iter 53/100 | OK |
| D1c redelivery concurrente idempotente iter 54/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 54/100 | OK |
| Colas finales sin pendientes inesperados iter 54/100 | OK |
| D1c redelivery concurrente idempotente iter 55/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 55/100 | OK |
| Colas finales sin pendientes inesperados iter 55/100 | OK |
| D1c redelivery concurrente idempotente iter 56/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 56/100 | OK |
| Colas finales sin pendientes inesperados iter 56/100 | OK |
| D1c redelivery concurrente idempotente iter 57/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 57/100 | OK |
| Colas finales sin pendientes inesperados iter 57/100 | OK |
| D1c redelivery concurrente idempotente iter 58/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 58/100 | OK |
| Colas finales sin pendientes inesperados iter 58/100 | OK |
| D1c redelivery concurrente idempotente iter 59/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 59/100 | OK |
| Colas finales sin pendientes inesperados iter 59/100 | OK |
| D1c redelivery concurrente idempotente iter 60/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 60/100 | OK |
| Colas finales sin pendientes inesperados iter 60/100 | OK |
| D1c redelivery concurrente idempotente iter 61/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 61/100 | OK |
| Colas finales sin pendientes inesperados iter 61/100 | OK |
| D1c redelivery concurrente idempotente iter 62/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 62/100 | OK |
| Colas finales sin pendientes inesperados iter 62/100 | OK |
| D1c redelivery concurrente idempotente iter 63/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 63/100 | OK |
| Colas finales sin pendientes inesperados iter 63/100 | OK |
| D1c redelivery concurrente idempotente iter 64/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 64/100 | OK |
| Colas finales sin pendientes inesperados iter 64/100 | OK |
| D1c redelivery concurrente idempotente iter 65/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 65/100 | OK |
| Colas finales sin pendientes inesperados iter 65/100 | OK |
| D1c redelivery concurrente idempotente iter 66/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 66/100 | OK |
| Colas finales sin pendientes inesperados iter 66/100 | OK |
| D1c redelivery concurrente idempotente iter 67/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 67/100 | OK |
| Colas finales sin pendientes inesperados iter 67/100 | OK |
| D1c redelivery concurrente idempotente iter 68/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 68/100 | OK |
| Colas finales sin pendientes inesperados iter 68/100 | OK |
| D1c redelivery concurrente idempotente iter 69/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 69/100 | OK |
| Colas finales sin pendientes inesperados iter 69/100 | OK |
| D1c redelivery concurrente idempotente iter 70/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 70/100 | OK |
| Colas finales sin pendientes inesperados iter 70/100 | OK |
| D1c redelivery concurrente idempotente iter 71/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 71/100 | OK |
| Colas finales sin pendientes inesperados iter 71/100 | OK |
| D1c redelivery concurrente idempotente iter 72/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 72/100 | OK |
| Colas finales sin pendientes inesperados iter 72/100 | OK |
| D1c redelivery concurrente idempotente iter 73/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 73/100 | OK |
| Colas finales sin pendientes inesperados iter 73/100 | OK |
| D1c redelivery concurrente idempotente iter 74/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 74/100 | OK |
| Colas finales sin pendientes inesperados iter 74/100 | OK |
| D1c redelivery concurrente idempotente iter 75/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 75/100 | OK |
| Colas finales sin pendientes inesperados iter 75/100 | OK |
| D1c redelivery concurrente idempotente iter 76/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 76/100 | OK |
| Colas finales sin pendientes inesperados iter 76/100 | OK |
| D1c redelivery concurrente idempotente iter 77/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 77/100 | OK |
| Colas finales sin pendientes inesperados iter 77/100 | OK |
| D1c redelivery concurrente idempotente iter 78/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 78/100 | OK |
| Colas finales sin pendientes inesperados iter 78/100 | OK |
| D1c redelivery concurrente idempotente iter 79/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 79/100 | OK |
| Colas finales sin pendientes inesperados iter 79/100 | OK |
| D1c redelivery concurrente idempotente iter 80/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 80/100 | OK |
| Colas finales sin pendientes inesperados iter 80/100 | OK |
| D1c redelivery concurrente idempotente iter 81/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 81/100 | OK |
| Colas finales sin pendientes inesperados iter 81/100 | OK |
| D1c redelivery concurrente idempotente iter 82/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 82/100 | OK |
| Colas finales sin pendientes inesperados iter 82/100 | OK |
| D1c redelivery concurrente idempotente iter 83/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 83/100 | OK |
| Colas finales sin pendientes inesperados iter 83/100 | OK |
| D1c redelivery concurrente idempotente iter 84/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 84/100 | OK |
| Colas finales sin pendientes inesperados iter 84/100 | OK |
| D1c redelivery concurrente idempotente iter 85/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 85/100 | OK |
| Colas finales sin pendientes inesperados iter 85/100 | OK |
| D1c redelivery concurrente idempotente iter 86/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 86/100 | OK |
| Colas finales sin pendientes inesperados iter 86/100 | OK |
| D1c redelivery concurrente idempotente iter 87/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 87/100 | OK |
| Colas finales sin pendientes inesperados iter 87/100 | OK |
| D1c redelivery concurrente idempotente iter 88/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 88/100 | OK |
| Colas finales sin pendientes inesperados iter 88/100 | OK |
| D1c redelivery concurrente idempotente iter 89/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 89/100 | OK |
| Colas finales sin pendientes inesperados iter 89/100 | OK |
| D1c redelivery concurrente idempotente iter 90/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 90/100 | OK |
| Colas finales sin pendientes inesperados iter 90/100 | OK |
| D1c redelivery concurrente idempotente iter 91/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 91/100 | OK |
| Colas finales sin pendientes inesperados iter 91/100 | OK |
| D1c redelivery concurrente idempotente iter 92/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 92/100 | OK |
| Colas finales sin pendientes inesperados iter 92/100 | OK |
| D1c redelivery concurrente idempotente iter 93/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 93/100 | OK |
| Colas finales sin pendientes inesperados iter 93/100 | OK |
| D1c redelivery concurrente idempotente iter 94/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 94/100 | OK |
| Colas finales sin pendientes inesperados iter 94/100 | OK |
| D1c redelivery concurrente idempotente iter 95/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 95/100 | OK |
| Colas finales sin pendientes inesperados iter 95/100 | OK |
| D1c redelivery concurrente idempotente iter 96/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 96/100 | OK |
| Colas finales sin pendientes inesperados iter 96/100 | OK |
| D1c redelivery concurrente idempotente iter 97/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 97/100 | OK |
| Colas finales sin pendientes inesperados iter 97/100 | OK |
| D1c redelivery concurrente idempotente iter 98/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 98/100 | OK |
| Colas finales sin pendientes inesperados iter 98/100 | OK |
| D1c redelivery concurrente idempotente iter 99/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 99/100 | OK |
| Colas finales sin pendientes inesperados iter 99/100 | OK |
| D1c redelivery concurrente idempotente iter 100/100 | OK |
| R1 reposicion inversa idempotente secuencial y concurrente iter 100/100 | OK |
| Colas finales sin pendientes inesperados iter 100/100 | OK |

## Detalle

### D1c redelivery concurrente idempotente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263375164-tcj0ff","productId":"a202adfa-0afc-4d63-9b80-c6f96ec99cf4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263380229-pwa3xo","productId":"24e8ca1c-787f-4120-a0dc-f7f65ac870af","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263387119-bma5z3","productId":"45236021-a249-4a28-89f3-520b7678927f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263392230-iky3pd","productId":"7ce8771c-f0e2-4819-887d-00087c6eda78","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263399434-96w619","productId":"66701230-3b7b-439b-b30a-72023e7c987b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263404420-hntjym","productId":"5756dbde-d3be-4d35-a3cf-f98ba31e8a51","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

### D1c redelivery concurrente idempotente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263411132-6edppm","productId":"bb76e5a3-5182-44bc-b744-84cce14040ac","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":4}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263416271-8gl22p","productId":"adc3697f-2581-4c6d-83df-325a015e2969","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":4}`

### Colas finales sin pendientes inesperados iter 4/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":4}`

### D1c redelivery concurrente idempotente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263423203-j0k121","productId":"7ea835dd-df51-49aa-abbb-271d4f308822","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":5}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263428202-q2npwb","productId":"fd2ccdec-7c1a-4338-9910-7d9632a21ee7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":5}`

### Colas finales sin pendientes inesperados iter 5/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":5}`

### D1c redelivery concurrente idempotente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263435213-ecnhd9","productId":"55a4ff0d-caaf-41dd-9ffc-ef4a3c0c157c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":6}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263440256-zsri0e","productId":"386ba32b-1640-42a9-9ad4-2da193db3643","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":6}`

### Colas finales sin pendientes inesperados iter 6/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":6}`

### D1c redelivery concurrente idempotente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263446061-1xs6w2","productId":"d842409c-5270-4994-b16b-409c34595c7d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":7}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263451452-o4fnms","productId":"55f4fc56-0692-48d1-8d01-00f1e387d641","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":7}`

### Colas finales sin pendientes inesperados iter 7/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":7}`

### D1c redelivery concurrente idempotente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263458349-tq3joe","productId":"fa2bd0fb-b41f-4865-b2ae-d67899500639","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":8}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263463213-932a4c","productId":"6f2ccd5e-7725-47f8-ac18-b85db158d8d9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":8}`

### Colas finales sin pendientes inesperados iter 8/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":8}`

### D1c redelivery concurrente idempotente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263470254-prpc2m","productId":"030b2b02-0dd7-4ad4-b48d-aa8c6a544a00","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":9}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263475380-3tmkeq","productId":"4c60230b-c85f-4514-abbd-b50b0f271ab3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":9}`

### Colas finales sin pendientes inesperados iter 9/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":9}`

### D1c redelivery concurrente idempotente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263482246-017lzm","productId":"2ae5df37-e964-453e-90b2-25519adb4393","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":10}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263487263-073ei3","productId":"1abfb2c7-3a5d-4577-8a21-f10c601d247b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":10}`

### Colas finales sin pendientes inesperados iter 10/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":10}`

### D1c redelivery concurrente idempotente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263494311-37bi5k","productId":"d736402f-a92c-47cf-a687-e85056c0c69d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":11}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263499392-nky5gh","productId":"0df20a30-ff7e-4a17-becd-56fe5c307755","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":11}`

### Colas finales sin pendientes inesperados iter 11/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":11}`

### D1c redelivery concurrente idempotente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263506107-9usnjj","productId":"33b61d3c-a059-4c5c-81fa-dc8432fd7f10","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":12}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263510044-ef5wzf","productId":"d7505174-acab-4e50-9eb6-092173665994","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":12}`

### Colas finales sin pendientes inesperados iter 12/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":12}`

### D1c redelivery concurrente idempotente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263517228-do55v3","productId":"b0558536-d951-41a9-8ed2-e2b9dabfbbfb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":13}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263522379-42oeu1","productId":"559d4a84-2531-4898-aa2b-5d790fd4777d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":13}`

### Colas finales sin pendientes inesperados iter 13/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":13}`

### D1c redelivery concurrente idempotente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263529051-pylwgz","productId":"d0ef7762-ed15-4aee-b0fb-f0e9037a8ac7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":14}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263534258-9c768d","productId":"c18352f4-b39c-4f89-b33e-6f007a72af75","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":14}`

### Colas finales sin pendientes inesperados iter 14/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":14}`

### D1c redelivery concurrente idempotente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263541177-etceu6","productId":"fdf4caf5-080a-47e4-82f4-b6e91252ee80","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":15}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263546225-k09ip0","productId":"4af9e84d-40e8-4a3b-8e54-697beff30543","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":15}`

### Colas finales sin pendientes inesperados iter 15/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":15}`

### D1c redelivery concurrente idempotente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263553286-azmhan","productId":"7a95a2d7-1b73-4b00-9376-5eb349b196cd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":16}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263558077-jtmlfe","productId":"f884c43a-5ad8-4892-b59c-448e71bc9ba8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":16}`

### Colas finales sin pendientes inesperados iter 16/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":16}`

### D1c redelivery concurrente idempotente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263564431-1i8yhi","productId":"25b162ed-5cc5-4aa1-aabb-df9eeb0086ea","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":17}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263569424-w3nd0y","productId":"9dfe6f9b-0481-4421-8a62-07444ff19f80","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":17}`

### Colas finales sin pendientes inesperados iter 17/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":17}`

### D1c redelivery concurrente idempotente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263576420-8k4628","productId":"f2c87b88-8376-4e5a-a854-3611a39df7a2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":18}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263581415-h18rj4","productId":"9dc98f4c-3259-4797-8480-c74149773417","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":18}`

### Colas finales sin pendientes inesperados iter 18/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":18}`

### D1c redelivery concurrente idempotente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263588242-zgc9yv","productId":"887f314f-ccde-4f1b-b6c8-5c379abd19ba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":19}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263593274-uq7kn2","productId":"4ab88044-3f7c-4642-9c46-e2b1226603bf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":19}`

### Colas finales sin pendientes inesperados iter 19/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":19}`

### D1c redelivery concurrente idempotente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263600155-am0w3e","productId":"bbc9732b-5a67-4cfb-a4bd-ff73deb77ad4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":20}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263604539-tg18pk","productId":"f33329a3-2572-4971-bc57-fc2954a280a3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":20}`

### Colas finales sin pendientes inesperados iter 20/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":20}`

### D1c redelivery concurrente idempotente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263611103-onx4zq","productId":"0c43a8a7-54a6-4a4b-859b-ba5890f2a45d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":21}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263615089-d6p4kt","productId":"7806897b-ec48-4fcb-9acc-6af81edefff5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":21}`

### Colas finales sin pendientes inesperados iter 21/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":21}`

### D1c redelivery concurrente idempotente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263621468-dkxaxx","productId":"873c8205-d840-4501-98ae-beabd85159c3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":22}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263626265-uzsd6r","productId":"9b650cb2-64a7-4a98-a060-b0ee3f2b317b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":22}`

### Colas finales sin pendientes inesperados iter 22/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":22}`

### D1c redelivery concurrente idempotente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263633044-qlgp8v","productId":"9f358223-7653-4657-9ccf-ad3c926a7019","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":23}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263637041-l5o85q","productId":"ab080e5c-8d3d-4732-9b40-33c168d52681","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":23}`

### Colas finales sin pendientes inesperados iter 23/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":23}`

### D1c redelivery concurrente idempotente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263643462-0n4krh","productId":"14a2af82-0cfd-4b89-9394-c0fc5a9dd86a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":24}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263648216-xjs9jd","productId":"b4b35b1e-14b1-45a4-9658-951d491a4f0c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":24}`

### Colas finales sin pendientes inesperados iter 24/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":24}`

### D1c redelivery concurrente idempotente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263654248-sv55q5","productId":"45dd9daa-0cfa-45bf-b8ac-e11e4f47a65d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":25}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263659271-yf591u","productId":"f52d6533-3a06-4712-af7a-079a95bb034f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":25}`

### Colas finales sin pendientes inesperados iter 25/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":25}`

### D1c redelivery concurrente idempotente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263665267-i6utp7","productId":"99a23995-782b-40c9-a164-500e46ea27bf","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":26}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263670152-awosew","productId":"be0ca592-02e8-4b50-927b-a2b850b5de38","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":26}`

### Colas finales sin pendientes inesperados iter 26/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":26}`

### D1c redelivery concurrente idempotente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263676348-7khmm8","productId":"ea60fba7-7f4c-452e-a8c6-451e83026854","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":27}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263681061-0hp0xd","productId":"6f7856c4-5665-44bb-9356-fb94e2cb9cdf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":27}`

### Colas finales sin pendientes inesperados iter 27/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":27}`

### D1c redelivery concurrente idempotente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263687334-dxvsd4","productId":"b7a5412d-6bd6-405b-b181-c360ccb28e51","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":28}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263692148-ru7zxr","productId":"82240f3a-482c-4b44-ae67-3d176cb17c02","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":28}`

### Colas finales sin pendientes inesperados iter 28/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":28}`

### D1c redelivery concurrente idempotente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263698445-g9y3ow","productId":"4647b5eb-e665-4ad1-aaf8-0763703ea88f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":29}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263703178-lcxxhh","productId":"f03a371b-34d9-4582-81c4-d54e7add0232","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":29}`

### Colas finales sin pendientes inesperados iter 29/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":29}`

### D1c redelivery concurrente idempotente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263709436-8c6p05","productId":"9e0851b5-fbf9-4ccb-9856-823199d4a8a4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":30}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263714160-xwi4p8","productId":"a564df81-6a38-473e-abca-d372bb516410","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":30}`

### Colas finales sin pendientes inesperados iter 30/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":30}`

### D1c redelivery concurrente idempotente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263720136-g4408x","productId":"3d13f82d-0352-4e99-afe9-d4b21c8deab7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":31}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263724470-sji6k4","productId":"26fd66fe-52e8-489d-8766-bae8f3b1d2d5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":31}`

### Colas finales sin pendientes inesperados iter 31/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":31}`

### D1c redelivery concurrente idempotente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263731243-2jc50x","productId":"773d6ee1-e1e4-4016-a8b5-31eb03acbffa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":32}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263736168-pknv8h","productId":"0e73de50-51ff-4dd9-95b5-0bc6777c1109","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":32}`

### Colas finales sin pendientes inesperados iter 32/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":32}`

### D1c redelivery concurrente idempotente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263743377-u322ho","productId":"dd2b260b-36fd-4864-a9f7-e0d693613caa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":33}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263748175-g2ds1w","productId":"0ec836cc-627b-4766-b5ea-027648970c7c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":33}`

### Colas finales sin pendientes inesperados iter 33/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":33}`

### D1c redelivery concurrente idempotente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263755046-ttrm81","productId":"ef24f095-f6b5-4bbd-975b-070c92071344","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":34}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263759064-9khf77","productId":"e382bb7d-4f64-4a78-8ec8-9352c75b35ae","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":34}`

### Colas finales sin pendientes inesperados iter 34/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":34}`

### D1c redelivery concurrente idempotente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263766130-h2znee","productId":"4ef7712d-e2f8-4085-88f3-2b483154d06d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":35}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263770068-h0jb9d","productId":"c8a93d7b-8a20-47aa-8029-4a1ed5811a34","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":35}`

### Colas finales sin pendientes inesperados iter 35/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":35}`

### D1c redelivery concurrente idempotente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263776194-y65x34","productId":"b070afb0-0774-408d-b11f-70b18a4ea263","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":36}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263781216-oseraw","productId":"61383380-f0b8-40b1-bf8c-a2d593509992","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":36}`

### Colas finales sin pendientes inesperados iter 36/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":36}`

### D1c redelivery concurrente idempotente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263788398-kpplvh","productId":"eaed2557-2103-41c4-b43a-6200758fbcd1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":37}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263793426-z96eol","productId":"f0bcf6df-ac80-40fc-ab7d-0a8ac2c1062a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":37}`

### Colas finales sin pendientes inesperados iter 37/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":37}`

### D1c redelivery concurrente idempotente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263800370-sxo2ox","productId":"df05c271-31ef-42d3-85f9-41700a49bb15","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":38}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263805351-ppeoge","productId":"08bfeb71-082e-4248-91f6-e6e42471cfa1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":38}`

### Colas finales sin pendientes inesperados iter 38/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":38}`

### D1c redelivery concurrente idempotente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263812151-tmtfmw","productId":"113ec4c9-9679-4c10-81bf-ede0fc274562","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":39}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263816440-i7avjr","productId":"09b45570-c049-4b93-ad50-f2f335285bb0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":39}`

### Colas finales sin pendientes inesperados iter 39/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":39}`

### D1c redelivery concurrente idempotente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263823394-smi58a","productId":"74bfa16d-c856-4ea5-bd34-779bad30ec1c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":40}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263828113-3r5lrw","productId":"0ac4e3c1-ba24-45ec-bd8c-d87bc49328c4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":40}`

### Colas finales sin pendientes inesperados iter 40/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":40}`

### D1c redelivery concurrente idempotente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263834496-7yz55e","productId":"dc4daa6b-8167-4fe8-82c5-250c696ece97","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":41}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263839426-ns8hrr","productId":"53070783-2a95-42cc-aad5-53279c5cd476","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":41}`

### Colas finales sin pendientes inesperados iter 41/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":41}`

### D1c redelivery concurrente idempotente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263846140-5vsfdx","productId":"a3f3d605-9198-44a7-9596-18ab1154cbd5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":42}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263851146-0gyx8u","productId":"bc629ab3-90ef-411c-8fbc-2b1edfcc96bb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":42}`

### Colas finales sin pendientes inesperados iter 42/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":42}`

### D1c redelivery concurrente idempotente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263857386-6t63f1","productId":"1d785058-7d82-41a3-a1c5-8239af35012d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":43}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263862177-m5mkvq","productId":"8c538003-4e89-46f7-8077-2ae2301896ed","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":43}`

### Colas finales sin pendientes inesperados iter 43/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":43}`

### D1c redelivery concurrente idempotente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263868393-be396t","productId":"b44527dd-6391-410a-948c-09dd7d8942f9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":44}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263873129-b513r5","productId":"939bd947-f0bf-4b3f-bfd6-4855942dba06","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":44}`

### Colas finales sin pendientes inesperados iter 44/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":44}`

### D1c redelivery concurrente idempotente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263879398-oue34c","productId":"5ef5546c-29cf-40c5-91c9-f600fc97e242","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":45}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263884285-90qyah","productId":"b7102721-023b-40c9-8e5a-03a549a43c76","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":45}`

### Colas finales sin pendientes inesperados iter 45/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":45}`

### D1c redelivery concurrente idempotente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263890073-kgn7n1","productId":"dcc40625-bc24-4cee-af10-4362ad27d891","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":46}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263894337-1ygt2a","productId":"5aa30385-8b36-492d-aa25-96bc7fc36b3f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":46}`

### Colas finales sin pendientes inesperados iter 46/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":46}`

### D1c redelivery concurrente idempotente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263901114-mukv06","productId":"3abfc1eb-c70c-45d2-9efb-5a32f9499313","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":47}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263905094-7hqpk0","productId":"adfee754-62c9-4f6f-ba4e-8e00281275d0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":47}`

### Colas finales sin pendientes inesperados iter 47/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":47}`

### D1c redelivery concurrente idempotente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263911376-qlxoi8","productId":"66710cf0-55f3-4453-867f-89f50ca67b4a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":48}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263916188-fjxhbs","productId":"6e01881a-8a75-49c1-803a-96375779f97e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":48}`

### Colas finales sin pendientes inesperados iter 48/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":48}`

### D1c redelivery concurrente idempotente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263922141-06g8qm","productId":"0d3c52dd-7fdc-4d41-a85e-d8053e424190","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":49}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263927158-zhdrgr","productId":"42d149ac-7765-4d2f-b7ac-bc700f4c8bc2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":49}`

### Colas finales sin pendientes inesperados iter 49/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":49}`

### D1c redelivery concurrente idempotente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263933450-432pjl","productId":"8c9f9a57-9f33-405a-8a91-2bb73acde5a6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":50}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263938167-ikqatu","productId":"1fa5d302-57f8-4593-9f23-161f4a0e8f7a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":50}`

### Colas finales sin pendientes inesperados iter 50/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":50}`

### D1c redelivery concurrente idempotente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263944300-jcimxm","productId":"0d13ba19-3595-4f26-a15b-d06f1a90b932","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":51}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263949070-bop2h1","productId":"ba7d5906-5ca6-4ee9-9503-3e4b00cc0909","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":51}`

### Colas finales sin pendientes inesperados iter 51/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":51}`

### D1c redelivery concurrente idempotente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263955203-gmriq9","productId":"d5d5ae76-6e9f-4750-87b4-50a62e02d330","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":52}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263959056-58y5ye","productId":"5d465093-93a8-4823-b882-31faee0a90f1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":52}`

### Colas finales sin pendientes inesperados iter 52/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":52}`

### D1c redelivery concurrente idempotente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263965208-k15jvu","productId":"211af89d-bd0d-4ade-aa07-025c82228e19","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":53}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263969093-qmz0c6","productId":"b2d59069-24f6-4e17-b41a-71ddf320c945","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":53}`

### Colas finales sin pendientes inesperados iter 53/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":53}`

### D1c redelivery concurrente idempotente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263975164-m6x87u","productId":"da2817b4-1c17-4632-8499-5a0c347c1797","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":54}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263979394-sa7t34","productId":"1841ee0d-39d8-41da-af31-01cfffab0887","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":54}`

### Colas finales sin pendientes inesperados iter 54/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":54}`

### D1c redelivery concurrente idempotente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263986161-7m055a","productId":"f1d6410c-f06a-478f-bc95-a59164371eb4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":55}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780263990138-27irir","productId":"36146e92-7a41-4a91-9060-f15df0354af8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":55}`

### Colas finales sin pendientes inesperados iter 55/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":55}`

### D1c redelivery concurrente idempotente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780263996224-ms7pjn","productId":"02fd513c-a5c6-47dc-a2f4-0f9eb0e355ed","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":56}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264000140-e0ypbo","productId":"892a004e-6b50-4a5c-bc8b-69750b28df70","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":56}`

### Colas finales sin pendientes inesperados iter 56/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":56}`

### D1c redelivery concurrente idempotente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264006394-zit3g1","productId":"6ca015c9-0905-4d46-954d-8d1c5737f9f2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":57}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264011103-larxs7","productId":"90dc2e25-7687-4160-9942-cc4aba31073d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":57}`

### Colas finales sin pendientes inesperados iter 57/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":57}`

### D1c redelivery concurrente idempotente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264017301-c7fngn","productId":"c4221ddf-4fff-403c-a125-78b3d17e8d2c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":58}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264022060-1j2edv","productId":"cfa09ace-1bfb-4453-a967-c62c11d580a8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":58}`

### Colas finales sin pendientes inesperados iter 58/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":58}`

### D1c redelivery concurrente idempotente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264028050-vuozsa","productId":"f2b79f47-1781-49a8-b22b-58cae64e465f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":59}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264032112-kjq9ec","productId":"a716d6be-5ad4-464f-9015-7a0eab20e733","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":59}`

### Colas finales sin pendientes inesperados iter 59/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":59}`

### D1c redelivery concurrente idempotente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264038264-y51pod","productId":"f3eadc51-736f-4066-8b6f-3126107a19c9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":60}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264042107-d8su0f","productId":"c8859330-a15b-4510-9b8e-3cdb8673c129","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":60}`

### Colas finales sin pendientes inesperados iter 60/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":60}`

### D1c redelivery concurrente idempotente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264048333-981oa9","productId":"2f1f29a0-6bfc-4d42-8552-ae1cd7d0db38","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":61}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264052141-wp5t8y","productId":"354fb532-2feb-4686-8cb2-2bc66546514a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":61}`

### Colas finales sin pendientes inesperados iter 61/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":61}`

### D1c redelivery concurrente idempotente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264058361-synae9","productId":"3e448a44-7820-45cf-858f-8ea0f1b64837","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":62}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264063154-ltzt84","productId":"c7bfa592-1af6-4dd1-b2f1-09cb4888eea7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":62}`

### Colas finales sin pendientes inesperados iter 62/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":62}`

### D1c redelivery concurrente idempotente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264069347-isth8r","productId":"1d40289c-1e34-4da6-ab40-c782270334be","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":63}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264074066-5sjohn","productId":"164496ff-8e0e-451c-bb5b-91254e1422f0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":63}`

### Colas finales sin pendientes inesperados iter 63/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":63}`

### D1c redelivery concurrente idempotente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264080295-xz5gv2","productId":"4832ed23-e995-40cd-b885-d57c33826356","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":64}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264085085-6dm3i9","productId":"aafb7383-33c9-4051-b293-c730cfdc8fb1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":64}`

### Colas finales sin pendientes inesperados iter 64/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":64}`

### D1c redelivery concurrente idempotente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264091343-24bb7r","productId":"1fb38f8c-f2cc-4f8a-ac6e-9dc92b97cb95","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":65}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264096174-1da7b5","productId":"eef1c2df-1933-42cc-a8f3-3978718b9277","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":65}`

### Colas finales sin pendientes inesperados iter 65/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":65}`

### D1c redelivery concurrente idempotente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264102325-8mggg8","productId":"f802c971-5d43-4786-8032-a86448cbe3a9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":66}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264107038-81y2xj","productId":"30024d03-4bce-4473-a4d8-1eacbc22db5a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":66}`

### Colas finales sin pendientes inesperados iter 66/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":66}`

### D1c redelivery concurrente idempotente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264113279-lo9bq0","productId":"bbc6edfe-03c2-471c-87fc-4985f9063eda","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":67}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264117127-v32ed5","productId":"3fddc6a5-156f-4409-a8cc-1d5fb34ca71b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":67}`

### Colas finales sin pendientes inesperados iter 67/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":67}`

### D1c redelivery concurrente idempotente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264123305-waxwd1","productId":"3be65d3f-0a7a-4a0c-90c9-1e245c3ed327","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":68}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264127129-y8omgt","productId":"35f76347-3fb9-49d8-b975-3501e63a853c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":68}`

### Colas finales sin pendientes inesperados iter 68/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":68}`

### D1c redelivery concurrente idempotente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264133265-r0aez3","productId":"69c9d1c9-f916-432e-bc43-03eb1fa447b2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":69}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264137093-kekylf","productId":"27e74e50-7f75-4377-b5eb-8ff5e2c8c967","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":69}`

### Colas finales sin pendientes inesperados iter 69/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":69}`

### D1c redelivery concurrente idempotente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264143339-3k9h80","productId":"4b573392-f0ba-4b9c-b139-c123e3310929","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":70}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264148077-1iphne","productId":"96c0c9b5-5c17-452a-8090-5c36b0ccf138","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":70}`

### Colas finales sin pendientes inesperados iter 70/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":70}`

### D1c redelivery concurrente idempotente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264154345-et3mtn","productId":"f63b437e-b51f-46da-a9f0-b6714f0032b6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":71}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264158150-4ha3e2","productId":"49f0b091-5b60-47cc-b7bf-8d1feae8b3e3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":71}`

### Colas finales sin pendientes inesperados iter 71/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":71}`

### D1c redelivery concurrente idempotente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264164453-ijjkur","productId":"583a2df2-f603-412b-b734-b5a971e76b55","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":72}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264169298-34pn4t","productId":"22fef4a3-ab42-4c44-82b2-5a81e182eae5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":72}`

### Colas finales sin pendientes inesperados iter 72/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":72}`

### D1c redelivery concurrente idempotente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264175130-i3uceu","productId":"4faeaa3a-f38b-42fe-9719-db4c3ce01d3d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":73}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264179406-yx7pzs","productId":"aca687f3-c426-4094-bb4d-656b09c1272c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":73}`

### Colas finales sin pendientes inesperados iter 73/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":73}`

### D1c redelivery concurrente idempotente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264186193-xjdab3","productId":"f4426670-57bf-4fc6-98e0-e9341bd29763","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":74}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264190097-1ib334","productId":"04271bf5-046b-4dbf-8831-44b6316ed722","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":74}`

### Colas finales sin pendientes inesperados iter 74/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":74}`

### D1c redelivery concurrente idempotente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264196416-asioar","productId":"aaa01cca-98b2-4de5-ab60-9a584f29355c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":75}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264201119-hwunrt","productId":"a52a6d25-9a38-41b8-9760-bc0363bb321f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":75}`

### Colas finales sin pendientes inesperados iter 75/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":75}`

### D1c redelivery concurrente idempotente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264207381-4e7syy","productId":"fee67558-81f0-4bfe-b7e0-6b905ede753e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":76}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264212167-iqk0yb","productId":"60bc3d48-12c7-42bc-9baf-0f2977edd052","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":76}`

### Colas finales sin pendientes inesperados iter 76/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":76}`

### D1c redelivery concurrente idempotente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264218057-c68njp","productId":"aee308e0-bd96-47ed-86d2-bb4eb6601439","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":77}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264222081-esc7da","productId":"1c6475e9-f59c-4862-a2c3-590a0c9ab5cb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":77}`

### Colas finales sin pendientes inesperados iter 77/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":77}`

### D1c redelivery concurrente idempotente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264228287-w0dtj4","productId":"cbee8f7d-0963-459e-bab5-59c2ea629cba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":78}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264233071-npy5fr","productId":"764501cb-7db4-4e71-ac5f-32bc0c707a88","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":78}`

### Colas finales sin pendientes inesperados iter 78/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":78}`

### D1c redelivery concurrente idempotente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264239345-7rhqoa","productId":"10f0aa62-1bb8-4f2f-ad1c-68b667aa8d42","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":79}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264244262-bp6nco","productId":"53c9436a-fd72-472b-9141-4052690669bd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":79}`

### Colas finales sin pendientes inesperados iter 79/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":79}`

### D1c redelivery concurrente idempotente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264250058-5d71pb","productId":"4497b048-b8b9-400e-b52f-a0eb3eef50b1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":80}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264254294-3n0tlq","productId":"96166381-d12e-4cbe-b1fd-17f2f99cb6bc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":80}`

### Colas finales sin pendientes inesperados iter 80/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":80}`

### D1c redelivery concurrente idempotente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264261069-30t6ps","productId":"a5b31961-e652-4ede-98e0-56acc041072d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":81}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264265437-uhv3t2","productId":"0c8c268a-5534-4ada-bdee-5fe48b040846","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":81}`

### Colas finales sin pendientes inesperados iter 81/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":81}`

### D1c redelivery concurrente idempotente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264272220-7g583u","productId":"71a92c15-4839-4242-85bb-2a2ef78000dc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":82}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264276440-d2x2ho","productId":"722fa68a-4a50-4464-8e0d-7aee7f4b6e6e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":82}`

### Colas finales sin pendientes inesperados iter 82/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":82}`

### D1c redelivery concurrente idempotente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264283148-e76zbr","productId":"e557121a-fc6f-49a7-bd78-00cfa3b51817","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":83}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264287035-q6sfq6","productId":"5d43e61c-8519-4ff2-aa3f-bb4065438fd9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":83}`

### Colas finales sin pendientes inesperados iter 83/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":83}`

### D1c redelivery concurrente idempotente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264293074-1ziw8z","productId":"8a928fcf-51b1-4471-bc61-6db417822e9d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":84}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264297281-2tayi9","productId":"28f8a1bd-6376-4476-87c8-93bd54cc37b0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":84}`

### Colas finales sin pendientes inesperados iter 84/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":84}`

### D1c redelivery concurrente idempotente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264304191-u9zxcz","productId":"59383679-fc53-4759-9c1c-4d17f13e8afc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":85}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264308423-32bql0","productId":"5cbda000-95e4-4465-bc51-b53b54656944","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":85}`

### Colas finales sin pendientes inesperados iter 85/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":85}`

### D1c redelivery concurrente idempotente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264315160-bbg5lp","productId":"6e232178-4dfa-4e06-85aa-0011005cab11","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":86}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264319444-fl06i5","productId":"c2ca81d1-70b4-4ba5-adde-3226653dfbf2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":86}`

### Colas finales sin pendientes inesperados iter 86/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":86}`

### D1c redelivery concurrente idempotente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264325187-eefy39","productId":"a79ae62e-4b14-41a6-b786-eb4c95b4afc8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":87}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264329425-tx8djw","productId":"029ff589-97c8-4af2-9f2d-3f61d3e5c5d3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":87}`

### Colas finales sin pendientes inesperados iter 87/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":87}`

### D1c redelivery concurrente idempotente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264336110-g7crc7","productId":"db964a1e-0e30-4d52-8f9f-31b35837b104","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":88}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264340400-0hr5om","productId":"165a0628-4e16-4596-8da2-b763b4d7d6f9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":88}`

### Colas finales sin pendientes inesperados iter 88/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":88}`

### D1c redelivery concurrente idempotente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264346044-63np03","productId":"8aeecf6a-d33d-4f1c-9d91-afdcc837e5b2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":89}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264350405-b262jw","productId":"bef2fb6b-5e56-4d3d-82c9-01db2d3ba186","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":89}`

### Colas finales sin pendientes inesperados iter 89/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":89}`

### D1c redelivery concurrente idempotente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264357133-jhdcwj","productId":"b1a191ff-ba9a-4084-8218-48fc68ef58db","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":90}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264361390-o7uuqa","productId":"51b1c875-4e01-410f-926b-c24c052f6579","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":90}`

### Colas finales sin pendientes inesperados iter 90/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":90}`

### D1c redelivery concurrente idempotente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264367104-3kwite","productId":"f4e19457-9b81-4991-9f4f-aebbdd4de3e8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":91}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264371031-h33g7r","productId":"e02af9df-8970-43c1-a60b-0252c01aed9a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":91}`

### Colas finales sin pendientes inesperados iter 91/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":91}`

### D1c redelivery concurrente idempotente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264377330-b0e0py","productId":"8201a6f5-499c-4562-bf9c-75f3a74380f4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":92}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264381124-rqu9tb","productId":"b5549c3a-21cb-4d17-b2a7-58b6f33cd7bb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":92}`

### Colas finales sin pendientes inesperados iter 92/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":92}`

### D1c redelivery concurrente idempotente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264387307-0eobhb","productId":"44ef6384-32c6-4c0d-ab76-403a82e8057a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":93}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264391117-2rjvla","productId":"064cc62c-9cf5-4da4-a167-16c47cdaf8fd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":93}`

### Colas finales sin pendientes inesperados iter 93/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":93}`

### D1c redelivery concurrente idempotente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264397371-o4ic23","productId":"7426ac37-9725-4806-a799-2c67a8a54e91","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":94}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264402126-xbhvas","productId":"1eb06532-fa0c-4045-ab1d-aa466f64055d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":94}`

### Colas finales sin pendientes inesperados iter 94/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":94}`

### D1c redelivery concurrente idempotente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264408058-nxhmqg","productId":"a503f050-4f84-49ed-b770-4c1fc9a1a70c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":95}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264412316-oh73yw","productId":"4b01d8c9-bbeb-412a-bcab-a8122a0a41d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":95}`

### Colas finales sin pendientes inesperados iter 95/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":95}`

### D1c redelivery concurrente idempotente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264419114-aab1z3","productId":"afa26b28-20e2-4f48-815a-7fb4819c52ae","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":96}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264423401-48re5y","productId":"cf725ba8-63fc-4788-8bd5-72130631011a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":96}`

### Colas finales sin pendientes inesperados iter 96/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":96}`

### D1c redelivery concurrente idempotente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264430054-3k35o6","productId":"4bb3c8b2-cd88-40b0-86a7-5ef3054b2f54","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":97}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264434333-w1kkku","productId":"d7814e2c-c643-447f-a78d-7d3d3931be76","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":97}`

### Colas finales sin pendientes inesperados iter 97/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":97}`

### D1c redelivery concurrente idempotente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264440189-if7itn","productId":"72b4ceef-a487-4b96-8647-a9b71500afe7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":98}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264444093-kipzp8","productId":"7cada68c-3b44-4be1-8a47-c8935d22bc36","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":98}`

### Colas finales sin pendientes inesperados iter 98/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":98}`

### D1c redelivery concurrente idempotente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264450373-ffm1ch","productId":"bc6e3582-b717-4d0c-a804-33aa5ee8feda","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":99}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264455076-x2iusc","productId":"e7dd2a5f-1872-4930-a0c4-4aaa3bf7c464","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":99}`

### Colas finales sin pendientes inesperados iter 99/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":99}`

### D1c redelivery concurrente idempotente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780264461416-6kxzwt","productId":"aeae7a52-b5e4-42ac-b531-9d4aa8a0a2d8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":100}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780264466130-2yn5vh","productId":"36360b4d-fdf6-48ec-ba7d-31c6b349f609","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":100}`

### Colas finales sin pendientes inesperados iter 100/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":100}`

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

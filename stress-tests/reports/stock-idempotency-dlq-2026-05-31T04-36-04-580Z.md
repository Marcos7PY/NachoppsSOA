# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T04:36:04.581Z
- Base URL: http://localhost:8000
- Rama: main
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
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201145385-45ofas","productId":"e69afc10-5161-40ff-b505-1bba33c72bcb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201150128-1b8oam","productId":"e66c844a-4952-4fc4-a339-265bb2b56aaa","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201156348-z2ohx9","productId":"62d169d5-3607-4b84-a8da-b2492d61675b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201161075-rf530n","productId":"1fdc795c-1a53-4538-9af4-16a33e092a16","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201167449-svd0dx","productId":"8e4edf3e-9c04-4d0e-b7f5-061f28d3ce7a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201172333-xn6kha","productId":"b51a4e54-fdb2-48b1-a10e-13627d2b6b67","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

### D1c redelivery concurrente idempotente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201179137-dav5s0","productId":"37e85754-0715-446e-b71c-1586983c7416","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":4}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201183489-qoiagj","productId":"998dc885-8758-4be5-bf49-d3c3cc0ceb99","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":4}`

### Colas finales sin pendientes inesperados iter 4/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":4}`

### D1c redelivery concurrente idempotente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201190233-ehssdh","productId":"1bc4315e-779e-435d-88e7-0ce4fad3a803","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":5}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201194092-j15vpc","productId":"f1465d79-d52b-4fd5-a017-1961dddf8f60","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":5}`

### Colas finales sin pendientes inesperados iter 5/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":5}`

### D1c redelivery concurrente idempotente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201200366-v366pc","productId":"e246d07d-d08d-4899-8807-f044acf53f92","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":6}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201205182-fx38xy","productId":"03c78517-1f2c-4c14-b353-c7bf503b7884","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":6}`

### Colas finales sin pendientes inesperados iter 6/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":6}`

### D1c redelivery concurrente idempotente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201211415-8xa4o4","productId":"50b7de65-da76-4793-bbf0-15c493afd402","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":7}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201216184-yfm1sf","productId":"3b4e4415-ed7b-420d-aeff-c0d82648d311","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":7}`

### Colas finales sin pendientes inesperados iter 7/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":7}`

### D1c redelivery concurrente idempotente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201222373-9f7ocj","productId":"e5e0d199-9035-4279-831e-a28b9ebcac32","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":8}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201227118-ih1pjz","productId":"f1174105-d94f-4577-9a54-1be176a0acb3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":8}`

### Colas finales sin pendientes inesperados iter 8/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":8}`

### D1c redelivery concurrente idempotente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201233449-djsd62","productId":"be7c61f3-737b-409e-ad31-0dd601dedabd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":9}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201238222-izxveo","productId":"c0eae545-c595-49ae-9a9f-163f96e68709","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":9}`

### Colas finales sin pendientes inesperados iter 9/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":9}`

### D1c redelivery concurrente idempotente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201244404-3jlsci","productId":"6d2991de-13d9-4c89-8d46-be77ec168d1d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":10}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201249152-knjf81","productId":"8e4d0521-1cc8-4061-8c1c-6165c248d9ca","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":10}`

### Colas finales sin pendientes inesperados iter 10/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":10}`

### D1c redelivery concurrente idempotente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201255209-smcs7b","productId":"2fe89973-4255-4630-bda7-0321967b13ee","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":11}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201259041-6yqbn9","productId":"6c138038-4786-4096-933c-d869d3765e5c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":11}`

### Colas finales sin pendientes inesperados iter 11/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":11}`

### D1c redelivery concurrente idempotente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201265218-4ab99u","productId":"18436161-4df4-4295-9785-a86d1e88f0ea","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":12}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201269429-423e34","productId":"e7307dad-4387-45de-bd19-181a690533c9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":12}`

### Colas finales sin pendientes inesperados iter 12/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":12}`

### D1c redelivery concurrente idempotente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201275111-z0nqen","productId":"3ab98f7e-d0cb-4f5a-820a-aaa9231a3080","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":13}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201279342-u826ie","productId":"56060cce-aea3-47fe-8800-fe875198eaf0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":13}`

### Colas finales sin pendientes inesperados iter 13/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":13}`

### D1c redelivery concurrente idempotente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201285135-8e2jq8","productId":"509a5d6a-65f7-458e-a3e5-8b840399da5f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":14}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201289405-38h40l","productId":"5ee6aad7-76bb-414e-bf83-259c9ecfafdc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":14}`

### Colas finales sin pendientes inesperados iter 14/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":14}`

### D1c redelivery concurrente idempotente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201295162-au0ivb","productId":"7c53100c-cc8e-49a3-97fb-8c0ce0d66059","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":15}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201299411-dxpbto","productId":"50814a50-cd3b-4a40-b413-5054f6b5ff3b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":15}`

### Colas finales sin pendientes inesperados iter 15/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":15}`

### D1c redelivery concurrente idempotente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201306052-txos07","productId":"ac3f0f3c-8f2b-4213-9469-e84f731f175e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":16}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201310270-xxvham","productId":"9ef837d4-b453-412f-879b-3e2eb0062c96","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":16}`

### Colas finales sin pendientes inesperados iter 16/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":16}`

### D1c redelivery concurrente idempotente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201316405-q7z8oh","productId":"14b46d0b-d82d-429a-a5fe-b5f28e02b112","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":17}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201321142-s5z5u7","productId":"7330e696-455b-4d1e-bc11-0a44f944e997","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":17}`

### Colas finales sin pendientes inesperados iter 17/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":17}`

### D1c redelivery concurrente idempotente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201327269-iq9c62","productId":"9b3b446b-945c-4277-9316-b9fd552279c0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":18}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201331079-xbenpl","productId":"2180e166-a542-46b7-948f-3578f14782b6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":18}`

### Colas finales sin pendientes inesperados iter 18/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":18}`

### D1c redelivery concurrente idempotente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201337231-okbzef","productId":"64f3e54d-e84f-42a3-b4af-3cd5a5049895","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":19}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201341456-rzj8wd","productId":"f2561ca9-fabf-4c87-aedc-746835b8f5d0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":19}`

### Colas finales sin pendientes inesperados iter 19/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":19}`

### D1c redelivery concurrente idempotente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201348087-v1mfp2","productId":"22c8f5fa-0361-440a-91ab-e89e90c14bc2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":20}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201352402-p9e6c7","productId":"3af42abe-3905-45ee-b12c-616190b01958","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":20}`

### Colas finales sin pendientes inesperados iter 20/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":20}`

### D1c redelivery concurrente idempotente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201358166-tdrona","productId":"fce4190d-1c52-445f-99ca-fb126e25fece","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":21}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201362055-u127nb","productId":"3fe724a9-8fee-480c-9fd9-dfab27aedb64","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":21}`

### Colas finales sin pendientes inesperados iter 21/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":21}`

### D1c redelivery concurrente idempotente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201368335-qnm6x7","productId":"b1822a32-3692-4775-8646-ed237eb63dfa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":22}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201372112-g1o6fo","productId":"3ecf15ba-5a20-4199-a645-19b06d6c4a45","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":22}`

### Colas finales sin pendientes inesperados iter 22/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":22}`

### D1c redelivery concurrente idempotente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201378245-gtkont","productId":"d1557094-f6be-4356-b064-760258af4116","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":23}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201382442-00jnjd","productId":"4b665957-e64b-4274-ae34-dd53a52d735d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":23}`

### Colas finales sin pendientes inesperados iter 23/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":23}`

### D1c redelivery concurrente idempotente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201388186-196unj","productId":"beed02d7-2a1e-496d-aafa-44dc072eb6fa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":24}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201392441-qnx54a","productId":"b015cd1b-3c67-4cda-9edc-73cba8431cf7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":24}`

### Colas finales sin pendientes inesperados iter 24/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":24}`

### D1c redelivery concurrente idempotente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201399172-3rjq0n","productId":"7dfe6650-946d-463b-a239-a537d4781719","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":25}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201403435-87fer0","productId":"4cbffcc7-d09b-4324-b8ec-1cf764367530","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":25}`

### Colas finales sin pendientes inesperados iter 25/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":25}`

### D1c redelivery concurrente idempotente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201409207-7kt7hi","productId":"eda0e0bd-a44a-48a6-8ae7-660fc1e4d372","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":26}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201413464-7u4f4f","productId":"833b51ed-c321-444e-8a1f-5b2fa43c679e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":26}`

### Colas finales sin pendientes inesperados iter 26/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":26}`

### D1c redelivery concurrente idempotente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201420108-unwv2s","productId":"27f2517a-4e4d-4e69-b912-2a8e5f368f47","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":27}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201424334-hf00z9","productId":"b9bae26d-dd32-4d1f-ab58-60a433a2c1fb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":27}`

### Colas finales sin pendientes inesperados iter 27/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":27}`

### D1c redelivery concurrente idempotente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201430075-55kup2","productId":"51bb5cfa-048a-4b0c-bc96-b58f302dd3b7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":28}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201434242-lrf64a","productId":"50285766-2785-4d88-bbf1-5bce38548177","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":28}`

### Colas finales sin pendientes inesperados iter 28/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":28}`

### D1c redelivery concurrente idempotente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201440453-lfrdi8","productId":"60dbb32a-cdab-4990-b29c-6c55b3347857","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":29}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201445202-75waxk","productId":"5e9e4d4f-0383-43e8-8101-e56bee871d43","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":29}`

### Colas finales sin pendientes inesperados iter 29/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":29}`

### D1c redelivery concurrente idempotente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201451317-dtnlr4","productId":"7879283f-d6af-488e-9ed6-9b5add0f35f8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":30}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201455115-saqgfm","productId":"78900742-2420-4873-b142-673195badafd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":30}`

### Colas finales sin pendientes inesperados iter 30/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":30}`

### D1c redelivery concurrente idempotente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201461335-um77y7","productId":"591e00e4-736d-4b06-bad7-ce727fa44509","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":31}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201465135-446ilf","productId":"885a0cab-4d34-4ab5-b82e-fa34384cef86","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":31}`

### Colas finales sin pendientes inesperados iter 31/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":31}`

### D1c redelivery concurrente idempotente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201471363-xvcy5z","productId":"149cfc90-b400-41af-b6cd-15e8a7c2819f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":32}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201476066-dyoij1","productId":"bd13b9d2-2e86-4e0e-956c-f1f229e7c828","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":32}`

### Colas finales sin pendientes inesperados iter 32/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":32}`

### D1c redelivery concurrente idempotente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201482238-kt7wug","productId":"7e7dbfc1-b38c-4fa5-96e4-e6ffe878c4e5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":33}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201486446-u5wkho","productId":"0a613da6-5bb5-442f-b641-37e34f7e8e8b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":33}`

### Colas finales sin pendientes inesperados iter 33/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":33}`

### D1c redelivery concurrente idempotente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201492131-mp23b9","productId":"39e425fb-b1e5-464d-8d8b-fec083d5470a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":34}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201496368-2zqcxc","productId":"5ee71625-366c-4554-a777-e2232e214620","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":34}`

### Colas finales sin pendientes inesperados iter 34/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":34}`

### D1c redelivery concurrente idempotente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201502139-7t62ny","productId":"87246db1-f96e-4f54-83c7-1ac56038f2f3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":35}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201506371-vc9d2r","productId":"99cbacaf-28e2-4011-9f78-c436afd5be27","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":35}`

### Colas finales sin pendientes inesperados iter 35/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":35}`

### D1c redelivery concurrente idempotente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201512048-a3zhmt","productId":"62bc245d-c5ec-4eb2-9d42-7a1b3a509231","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":36}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201516278-z24y30","productId":"f58d5511-f17a-4ebe-964f-a3ab3869a4bb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":36}`

### Colas finales sin pendientes inesperados iter 36/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":36}`

### D1c redelivery concurrente idempotente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201522364-wldjik","productId":"1004f906-4b6e-48b1-8c46-1587d5241b01","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":37}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201526139-h7fvj0","productId":"806f006a-e9db-4001-92c5-434736a5f544","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":37}`

### Colas finales sin pendientes inesperados iter 37/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":37}`

### D1c redelivery concurrente idempotente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201532326-4qbxfr","productId":"be639c3f-18b7-4f79-b2c8-25a20bde3fb9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":38}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201536092-ezcab4","productId":"eaba3584-e275-4179-ba63-c7de7ef0cb0f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":38}`

### Colas finales sin pendientes inesperados iter 38/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":38}`

### D1c redelivery concurrente idempotente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201542237-clrro6","productId":"776436fd-57af-40e3-8b93-89a6710808ed","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":39}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201546033-z1z6q0","productId":"1532ff2e-1658-45ca-b1a1-e4809ecc986d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":39}`

### Colas finales sin pendientes inesperados iter 39/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":39}`

### D1c redelivery concurrente idempotente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201552074-ltw5k1","productId":"47bfaa17-82e9-4cd1-9d29-c5cf1eadb643","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":40}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201556333-crbyg0","productId":"513e2ddb-459f-4df5-aa0e-20c60a3cb595","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":40}`

### Colas finales sin pendientes inesperados iter 40/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":40}`

### D1c redelivery concurrente idempotente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201562130-5f8xs4","productId":"ff58e1b8-fb5b-4319-9577-7ca844148904","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":41}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201566335-fr2tkv","productId":"a5101ea3-e0b1-4af8-a500-3977a6004cce","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":41}`

### Colas finales sin pendientes inesperados iter 41/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":41}`

### D1c redelivery concurrente idempotente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201572155-qax9e4","productId":"571a7852-3eac-43b8-bbc1-55f2d5d340a3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":42}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201576358-ib5go8","productId":"bc406421-dcb3-45a5-837e-b0d099c4ecd6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":42}`

### Colas finales sin pendientes inesperados iter 42/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":42}`

### D1c redelivery concurrente idempotente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201582030-2r4ok6","productId":"c971e79b-9c03-4751-b253-10dbe59bfadd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":43}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201586220-extm9m","productId":"39c70a40-3f1e-49d3-bdf7-14a7937feea0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":43}`

### Colas finales sin pendientes inesperados iter 43/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":43}`

### D1c redelivery concurrente idempotente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201592139-f4fyhg","productId":"fde5f893-cc2e-4272-8567-070796866e8d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":44}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201596358-k9xlfn","productId":"07fef9bf-4143-4785-92cd-0506a11e6ef5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":44}`

### Colas finales sin pendientes inesperados iter 44/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":44}`

### D1c redelivery concurrente idempotente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201602037-ykwf4v","productId":"c4767876-6965-4e93-a8d0-fa0911d3c48d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":45}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201606262-mrd3ay","productId":"cc8eb4d0-eddd-4057-904a-41ad8639a497","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":45}`

### Colas finales sin pendientes inesperados iter 45/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":45}`

### D1c redelivery concurrente idempotente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201612298-1v0h6w","productId":"ea169ad4-4533-4f5b-9916-26d5b37a4a0f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":46}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201616074-iwlkdq","productId":"9e7de0e0-b91b-4abf-929f-16505ef9f8c6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":46}`

### Colas finales sin pendientes inesperados iter 46/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":46}`

### D1c redelivery concurrente idempotente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201622121-xqceb1","productId":"a8798161-bde2-4e78-9d18-904e971897e1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":47}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201626337-notvid","productId":"174c4d7a-d93f-4097-9ffa-f8358ce814e6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":47}`

### Colas finales sin pendientes inesperados iter 47/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":47}`

### D1c redelivery concurrente idempotente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201632450-mdjwrn","productId":"11d49070-6206-4f92-aa46-4de63be2f9bd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":48}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201637166-zsjguc","productId":"8586d8db-7465-48ae-949e-a4defe2d8547","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":48}`

### Colas finales sin pendientes inesperados iter 48/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":48}`

### D1c redelivery concurrente idempotente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201643308-ntz6n8","productId":"5df5d2e8-59af-44ea-bc98-fff10f510f9a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":49}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201647127-x71ukm","productId":"9e1a7d8a-f491-4789-9ec2-926a82ae11fe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":49}`

### Colas finales sin pendientes inesperados iter 49/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":49}`

### D1c redelivery concurrente idempotente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201653239-7u34yd","productId":"7c905ee9-0972-4e4b-bc1f-2499bf2f86cb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":50}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201657361-yfc76p","productId":"ada67f20-8107-4391-8ebf-388af443e937","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":50}`

### Colas finales sin pendientes inesperados iter 50/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":50}`

### D1c redelivery concurrente idempotente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201663274-xsy0w9","productId":"8c61ee0c-e0a3-4031-8f46-eee90dc061e5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":51}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201667372-o48zp2","productId":"b50c5a97-14f3-4f29-8974-98b1eac7479f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":51}`

### Colas finales sin pendientes inesperados iter 51/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":51}`

### D1c redelivery concurrente idempotente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201673293-x92xqr","productId":"88d8901b-310e-494e-b5c6-415da83058fb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":52}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201677423-cb4b5g","productId":"4b34ce03-8b51-4489-b0cb-496a808c7129","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":52}`

### Colas finales sin pendientes inesperados iter 52/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":52}`

### D1c redelivery concurrente idempotente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201683417-isq9tt","productId":"aef9f62d-c16d-468d-af99-5c07630aca4f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":53}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201687136-7mv3ha","productId":"b8809c6b-3c29-45fc-ab43-a972ddbdf4e1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":53}`

### Colas finales sin pendientes inesperados iter 53/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":53}`

### D1c redelivery concurrente idempotente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201693054-hkqyc3","productId":"9582cabc-ae8a-4c77-879c-fe9206f454a0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":54}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201697176-zs8jm4","productId":"8dbdad83-1c8e-4a30-9b24-4ab558d59899","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":54}`

### Colas finales sin pendientes inesperados iter 54/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":54}`

### D1c redelivery concurrente idempotente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201703088-spukus","productId":"c53ac79d-048e-4d9f-b76d-9af33ecbf16a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":55}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201707191-t94ls1","productId":"d4a568a8-80c3-4356-b795-0ea6695c4600","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":55}`

### Colas finales sin pendientes inesperados iter 55/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":55}`

### D1c redelivery concurrente idempotente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201713306-4aprts","productId":"215828df-fae8-4d07-8d0a-88b202954bc2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":56}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201717451-6tc3p3","productId":"2b088499-77e6-46a3-9999-3e97e7302494","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":56}`

### Colas finales sin pendientes inesperados iter 56/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":56}`

### D1c redelivery concurrente idempotente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201723340-79nmbs","productId":"23c06de8-841b-448e-8e5a-e7554cfa3654","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":57}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201727058-19geim","productId":"378b1e3a-ed20-468b-8902-52a22b095e7c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":57}`

### Colas finales sin pendientes inesperados iter 57/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":57}`

### D1c redelivery concurrente idempotente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201733451-3dk9ai","productId":"54a145e3-4cd0-4864-9df4-e1dcd55e7019","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":58}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201737108-ws4sz4","productId":"88169f0b-bd5a-47c2-84a6-34ba8e6bf43c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":58}`

### Colas finales sin pendientes inesperados iter 58/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":58}`

### D1c redelivery concurrente idempotente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201743048-msweb9","productId":"302ffb3c-f755-4de4-a8ef-00fbf8d2f8ae","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":59}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201747179-sni1le","productId":"06b279e4-cfa6-44ee-ba2b-2760758e1a4e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":59}`

### Colas finales sin pendientes inesperados iter 59/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":59}`

### D1c redelivery concurrente idempotente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201753189-74e408","productId":"513e5f32-000a-4864-ad51-f9f2a5a3421a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":60}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201757311-3glr7i","productId":"77a05dd1-b68c-4679-aa5c-734c09306fdc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":60}`

### Colas finales sin pendientes inesperados iter 60/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":60}`

### D1c redelivery concurrente idempotente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201763226-dkdpi5","productId":"f32a2ebe-e0ec-4d8f-a916-80c9bd12348b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":61}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201767295-qrb73z","productId":"904fbe47-0b92-4478-b092-0366decda4fc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":61}`

### Colas finales sin pendientes inesperados iter 61/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":61}`

### D1c redelivery concurrente idempotente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201773400-fi52ce","productId":"cfb67d05-370f-41ef-a876-bbac56eccb6d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":62}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201777086-2u6hkr","productId":"986aec86-29b7-4c9b-b4a2-eaab89f60ae6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":62}`

### Colas finales sin pendientes inesperados iter 62/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":62}`

### D1c redelivery concurrente idempotente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201783448-msir0e","productId":"8be41822-f426-4d04-8853-2bdfd75b5eb4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":63}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201787152-t9t02b","productId":"a26c3c6b-3515-42ad-b946-59c89f21bd88","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":63}`

### Colas finales sin pendientes inesperados iter 63/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":63}`

### D1c redelivery concurrente idempotente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201793078-emsgrr","productId":"20098d76-7e27-4752-9851-7257566b31f8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":64}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201797190-b3qkn7","productId":"45fcdde7-54f0-4914-91f9-b30e29261d41","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":64}`

### Colas finales sin pendientes inesperados iter 64/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":64}`

### D1c redelivery concurrente idempotente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201803154-xi02w0","productId":"18db724b-d0dd-4c57-be4e-73492185031a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":65}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201807242-rs3pzf","productId":"9bacdfb7-d7d6-414e-bac8-2db583098d34","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":65}`

### Colas finales sin pendientes inesperados iter 65/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":65}`

### D1c redelivery concurrente idempotente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201813115-qki87c","productId":"6d4923fa-ddf4-44d3-aaa9-44ee686ea531","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":66}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201817291-qsxm1k","productId":"202d03fd-c806-416f-89e9-5a683476a153","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":66}`

### Colas finales sin pendientes inesperados iter 66/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":66}`

### D1c redelivery concurrente idempotente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201823239-5n6e11","productId":"216b4107-ebe9-4039-9bb9-4a9456f5135d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":67}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201827379-4ta70k","productId":"1083ba77-fe8c-473b-bdbb-6aa79b7794fe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":67}`

### Colas finales sin pendientes inesperados iter 67/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":67}`

### D1c redelivery concurrente idempotente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201833420-gu6cc0","productId":"2060ed81-61bb-4cdc-8f83-c194b1909016","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":68}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201837144-gvb58a","productId":"9ab59a3e-67d1-4347-9d1d-2f1658c4255e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":68}`

### Colas finales sin pendientes inesperados iter 68/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":68}`

### D1c redelivery concurrente idempotente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201843095-noiaq7","productId":"e5eec5c1-e72e-4e97-8945-a29be1910924","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":69}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201847241-bunrh1","productId":"13e17bf5-a628-4cf0-8d0c-bf924f4e5dc4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":69}`

### Colas finales sin pendientes inesperados iter 69/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":69}`

### D1c redelivery concurrente idempotente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201853218-vp7ja8","productId":"713a4f06-b35d-45a8-8627-8d602b53402b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":70}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201857380-ulvkwx","productId":"ea03100c-83f0-4a08-b81f-6e0effe9efdc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":70}`

### Colas finales sin pendientes inesperados iter 70/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":70}`

### D1c redelivery concurrente idempotente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201863350-u98rgj","productId":"2761ffc4-308a-44fc-9b32-a175f66a5523","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":71}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201867105-8rv5t0","productId":"389f5138-e57e-4c53-8f40-93b5bfadcb21","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":71}`

### Colas finales sin pendientes inesperados iter 71/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":71}`

### D1c redelivery concurrente idempotente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201873102-t983sa","productId":"ba2799bd-24a4-446f-a2b4-28754bdfd9e8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":72}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201877206-4pegib","productId":"eb4fa98d-8b9e-4f83-942d-0c4b95fe30cb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":72}`

### Colas finales sin pendientes inesperados iter 72/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":72}`

### D1c redelivery concurrente idempotente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201883119-bt4kob","productId":"a079b27e-0752-4073-9015-42167cc8e5eb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":73}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201887302-sspfvx","productId":"7203bb0e-f3e9-4ebd-b617-8f83b5fa68a4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":73}`

### Colas finales sin pendientes inesperados iter 73/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":73}`

### D1c redelivery concurrente idempotente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201893443-srn63j","productId":"ad0b588b-337c-499d-bbb5-850ddabf4773","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":74}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201897113-neqf1b","productId":"6adb6b35-f5f5-4825-8266-e0187ccfae6f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":74}`

### Colas finales sin pendientes inesperados iter 74/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":74}`

### D1c redelivery concurrente idempotente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201903147-1z35ch","productId":"88ae0182-bc83-4f55-af49-8401b7b9ea9b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":75}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201907248-ossen3","productId":"1d5e3612-065c-4340-97e5-ff8a0d53b7fe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":75}`

### Colas finales sin pendientes inesperados iter 75/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":75}`

### D1c redelivery concurrente idempotente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201913218-avk6zh","productId":"d2ab6917-587b-4ffd-a7dc-26ef360f0003","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":76}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201917289-o42gdr","productId":"f6876ade-a874-4b72-9075-7de526c322da","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":76}`

### Colas finales sin pendientes inesperados iter 76/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":76}`

### D1c redelivery concurrente idempotente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201923259-uqj4y4","productId":"125f0980-e4d3-4631-af18-583a5ba3ba65","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":77}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201927341-pft7fq","productId":"5ccd499b-dc6e-4317-8139-90cd0dbf7cb5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":77}`

### Colas finales sin pendientes inesperados iter 77/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":77}`

### D1c redelivery concurrente idempotente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201933313-000ga7","productId":"9a7829a9-1cb2-4861-b41d-5d249fa1a8fc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":78}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201937374-7knwq0","productId":"23f81cd2-3900-4af5-9a61-d0d82d5dc92c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":78}`

### Colas finales sin pendientes inesperados iter 78/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":78}`

### D1c redelivery concurrente idempotente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201943287-ltdez0","productId":"6729860e-99ff-49fe-8399-927b1d658927","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":79}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201947411-73cq4y","productId":"b2cc22d4-cc9d-43de-a295-a62a17ca02c2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":79}`

### Colas finales sin pendientes inesperados iter 79/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":79}`

### D1c redelivery concurrente idempotente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201953457-ej5ueb","productId":"4f4c2eb7-eb86-41f7-8e9c-2f70035fcd03","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":80}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201957067-6vb2m3","productId":"de751b74-2ae3-41b4-b3ca-6de553f8e3bd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":80}`

### Colas finales sin pendientes inesperados iter 80/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":80}`

### D1c redelivery concurrente idempotente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201963033-0as11q","productId":"5e892880-0093-4139-8046-8bd7f9353514","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":81}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201967145-5aoce8","productId":"df5cbffd-cd55-498d-9869-407ffd606d5f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":81}`

### Colas finales sin pendientes inesperados iter 81/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":81}`

### D1c redelivery concurrente idempotente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201973146-2k7bx6","productId":"84103b58-8edc-4db9-bea4-e003683fe909","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":82}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201977285-7su91g","productId":"04a42b12-8dfc-426d-b522-2767008f83b7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":82}`

### Colas finales sin pendientes inesperados iter 82/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":82}`

### D1c redelivery concurrente idempotente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201983329-hgmmwr","productId":"c475b4ad-a491-42af-a836-05f3499f0db6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":83}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201987027-shwjse","productId":"4b6ff676-f1ab-47fe-8a01-9f012c195517","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":83}`

### Colas finales sin pendientes inesperados iter 83/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":83}`

### D1c redelivery concurrente idempotente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780201993411-wmid14","productId":"dedac7f8-b42c-4484-afd4-c954714531b9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":84}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780201998068-dqw47q","productId":"b05810fa-32d1-434c-a1a7-45f5e395e668","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":84}`

### Colas finales sin pendientes inesperados iter 84/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":84}`

### D1c redelivery concurrente idempotente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202004409-mmpcv2","productId":"43712716-26fa-40ff-903f-65d3276806cb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":85}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202008094-ty6zm8","productId":"ce9e7bc9-3930-4d1d-85e6-cc86a4e5c786","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":85}`

### Colas finales sin pendientes inesperados iter 85/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":85}`

### D1c redelivery concurrente idempotente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202014075-qpdbi7","productId":"9e9f1be2-8a74-4d7d-b37e-7c6f62f93168","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":86}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202018231-w4bjy9","productId":"00da157c-561b-4cb2-abfe-c5296a8d3e8b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":86}`

### Colas finales sin pendientes inesperados iter 86/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":86}`

### D1c redelivery concurrente idempotente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202024182-5tlttc","productId":"5cad4119-612b-498e-ae30-20259a22bab1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":87}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202028453-vlis8v","productId":"9cdf1ba1-9b47-469a-9ece-477a844cf08c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":87}`

### Colas finales sin pendientes inesperados iter 87/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":87}`

### D1c redelivery concurrente idempotente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202034337-q2ywvs","productId":"0878da95-516e-4205-b1b5-f47267c60aef","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":88}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202038045-bfqr7g","productId":"366183c6-9bfd-4ed3-acaf-a94ecd062e98","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":88}`

### Colas finales sin pendientes inesperados iter 88/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":88}`

### D1c redelivery concurrente idempotente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202044441-pn5jgv","productId":"29b01e9a-2451-4f91-9e32-b0ca560f503e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":89}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202049458-5iqo0i","productId":"68a81788-0601-4c05-a7d5-b86837f40921","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":89}`

### Colas finales sin pendientes inesperados iter 89/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":89}`

### D1c redelivery concurrente idempotente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202055042-4995ir","productId":"b3adf5c2-5ae8-4f9d-be40-7b230f82c7a8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":90}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202059201-ov3j1c","productId":"0b768dbb-940d-42fd-9b49-58cb3edc8abb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":90}`

### Colas finales sin pendientes inesperados iter 90/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":90}`

### D1c redelivery concurrente idempotente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202065144-vx2fpx","productId":"7823c498-0e30-43b9-ad29-f14150907c6c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":91}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202069233-d4eqpk","productId":"1baae736-cc3d-499e-ae45-d6f76ee274a4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":91}`

### Colas finales sin pendientes inesperados iter 91/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":91}`

### D1c redelivery concurrente idempotente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202075144-tshmh0","productId":"cd2f484e-27da-4d0d-9997-ebd0ced8e1df","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":92}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202079294-mutr57","productId":"12a741f1-b511-4232-a15c-10a3d8afaad0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":92}`

### Colas finales sin pendientes inesperados iter 92/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":92}`

### D1c redelivery concurrente idempotente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202085283-1hl3dz","productId":"f97183a9-914a-4215-a742-e4b6896fb4de","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":93}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202089406-84pfek","productId":"15b316f6-d0c0-4890-abde-fe4501accf28","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":93}`

### Colas finales sin pendientes inesperados iter 93/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":93}`

### D1c redelivery concurrente idempotente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202095275-shfpdy","productId":"3e133625-eaf6-450a-aa94-2b5c118e96fc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":94}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202099427-el3gr8","productId":"b7164dc0-12e2-4818-ba0d-8f36b596f85a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":94}`

### Colas finales sin pendientes inesperados iter 94/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":94}`

### D1c redelivery concurrente idempotente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202105341-o4zw6x","productId":"cd08a75e-6942-4e55-bdc3-ae9000b5b236","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":95}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202109451-lhpya0","productId":"04aff18c-8000-43c2-998e-c50e916eb33b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":95}`

### Colas finales sin pendientes inesperados iter 95/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":95}`

### D1c redelivery concurrente idempotente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202115385-yp49g8","productId":"a9037fe6-448e-412b-a08e-d4d54c294964","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":96}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202119084-k7931j","productId":"daeb5d91-d13b-4c50-9753-69420cd338dc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":96}`

### Colas finales sin pendientes inesperados iter 96/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":96}`

### D1c redelivery concurrente idempotente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202125025-9erwy5","productId":"618323d6-1298-4a04-b68e-855f3e22688c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":97}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202129206-qxw8o9","productId":"41313ad4-ffbc-4dfb-b15d-a3302f5e7c51","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":97}`

### Colas finales sin pendientes inesperados iter 97/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":97}`

### D1c redelivery concurrente idempotente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202135111-1b1rz9","productId":"088cf052-6ef6-4424-9963-61a364819f35","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":98}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202139252-rbn3nl","productId":"00158cc2-345f-4f4a-bf0e-891460f61eff","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":98}`

### Colas finales sin pendientes inesperados iter 98/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":98}`

### D1c redelivery concurrente idempotente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202145122-3ag5nn","productId":"36f94ba2-c25e-4aec-b866-2bca292af9b1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":99}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202149234-6hnjjc","productId":"6a591976-5de3-40bd-9406-32d5886fdab1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":99}`

### Colas finales sin pendientes inesperados iter 99/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":99}`

### D1c redelivery concurrente idempotente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780202155207-42arzi","productId":"690932ae-0924-4f7b-bece-5537ba70d69c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":100}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780202159378-7weggw","productId":"c9bc2263-e151-46c2-be8c-f0fe9072ece7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":100}`

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
dlq.mesas_queue	0	0	0
inventario_queue	0	0	1
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
dlq.mesas_queue	0	0	0
inventario_queue	0	0	1
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

# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T03:35:50.401Z
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
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197496068-mxzabd","productId":"1d9e6a43-de58-46b3-8c23-2ae010f09c8a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197500473-0n322f","productId":"6e285ba9-6a49-4050-9ec8-6f105fc7416e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197506164-eakr8l","productId":"c6a7d340-d431-4b27-9635-8a92d2f5fe06","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197510045-rj7902","productId":"f99ada6c-6b04-453e-89d8-b0985f7cf0fd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197516104-q2cvo2","productId":"ac46483c-8079-40f5-8c61-2a8cc1192785","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197520342-72sgxr","productId":"bda004ee-5a48-47e4-b7c8-5871ed011fc0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

### D1c redelivery concurrente idempotente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197526301-y91h6h","productId":"d54aca29-bb43-4d48-baea-ae693a7ecb93","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":4}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197530089-shevnq","productId":"25dc5b9b-f077-4871-89a6-1251ad5510d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":4}`

### Colas finales sin pendientes inesperados iter 4/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":4}`

### D1c redelivery concurrente idempotente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197536054-xz5o0r","productId":"003ac91d-625b-411a-9d35-cff964206e15","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":5}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197540284-y62he3","productId":"4be11f64-6434-4714-92c5-a545f520e783","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":5}`

### Colas finales sin pendientes inesperados iter 5/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":5}`

### D1c redelivery concurrente idempotente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197546331-yxd8l5","productId":"6acf394c-ed11-4061-8be5-e8f51d2d71d7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":6}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197550133-9hj7eh","productId":"203a1707-7c4f-4260-8399-2b493c09bc9f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":6}`

### Colas finales sin pendientes inesperados iter 6/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":6}`

### D1c redelivery concurrente idempotente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197556344-38xtq2","productId":"90c8e985-fa70-42aa-a75e-92b7b5aa975c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":7}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197560129-rig9mb","productId":"0881c359-0dc5-43f8-bfcc-231532756185","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":7}`

### Colas finales sin pendientes inesperados iter 7/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":7}`

### D1c redelivery concurrente idempotente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197566265-lnaffl","productId":"d5d9da32-2289-482b-a7db-c418a755cc18","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":8}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197570056-tyhy8n","productId":"78f5889d-c8bf-49f6-b053-7989a4be07b1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":8}`

### Colas finales sin pendientes inesperados iter 8/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":8}`

### D1c redelivery concurrente idempotente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197576473-3v0iob","productId":"f46ebdc6-bf63-4bc2-b0f9-76c54865e4e6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":9}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197581224-epeqay","productId":"86a76d9a-13f2-4008-beaf-36f41abdc7c5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":9}`

### Colas finales sin pendientes inesperados iter 9/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":9}`

### D1c redelivery concurrente idempotente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197587177-uekowk","productId":"72623705-a8ec-4835-a53d-31a067b31395","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":10}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197591435-xevz41","productId":"3fd388de-6833-40c3-b294-b0a1823c2367","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":10}`

### Colas finales sin pendientes inesperados iter 10/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":10}`

### D1c redelivery concurrente idempotente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197597129-cppyfe","productId":"66aea4eb-3813-44da-986b-0ed695793701","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":11}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197601374-j3qzni","productId":"2c98a2dc-06c1-4fe9-a1bc-aebfeda2f587","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":11}`

### Colas finales sin pendientes inesperados iter 11/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":11}`

### D1c redelivery concurrente idempotente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197607095-pe9dxo","productId":"b9215e07-b69d-44bd-aa3d-6620620a0b03","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":12}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197611418-pfuqi6","productId":"650564b2-e56a-458e-8636-6977f2909ab2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":12}`

### Colas finales sin pendientes inesperados iter 12/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":12}`

### D1c redelivery concurrente idempotente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197617046-87rhi9","productId":"fa91535d-a2fd-4955-9e14-296c6bae9df4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":13}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197621286-pdl2y7","productId":"0ef65e4d-404e-468d-9514-2cde252808a3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":13}`

### Colas finales sin pendientes inesperados iter 13/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":13}`

### D1c redelivery concurrente idempotente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197627374-vdlu4g","productId":"7493dad4-ba96-44e2-98c4-1d0a2f38c297","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":14}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197631142-60y4ms","productId":"95de8752-04f3-418c-826f-767d32e1ed6b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":14}`

### Colas finales sin pendientes inesperados iter 14/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":14}`

### D1c redelivery concurrente idempotente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197637171-oix02r","productId":"33ae5c62-b12f-40dd-b3b4-596d8208ba6c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":15}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197641412-swb3l2","productId":"f5df6b8b-bb1c-4794-8264-bc281463dfb0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":15}`

### Colas finales sin pendientes inesperados iter 15/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":15}`

### D1c redelivery concurrente idempotente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197648138-4r32au","productId":"6c595edd-68d0-4c0e-8cda-6a0ac6dde088","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":16}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197652165-7ap0lt","productId":"6ce6dab5-3e76-4ef8-954a-37453ca4ff52","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":16}`

### Colas finales sin pendientes inesperados iter 16/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":16}`

### D1c redelivery concurrente idempotente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197658241-59ja6h","productId":"9a725bfe-13b2-490d-ab4b-7ff4e203b1d1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":17}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197662061-mbhxnl","productId":"4d709239-b00b-4d30-a6ca-431c4fdcf67a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":17}`

### Colas finales sin pendientes inesperados iter 17/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":17}`

### D1c redelivery concurrente idempotente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197668171-pxiroa","productId":"bde70251-6da5-4692-be61-3b00a4c89a83","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":18}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197672399-x1kjn4","productId":"df348592-6c50-485b-a24c-4e29ec1601cf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":18}`

### Colas finales sin pendientes inesperados iter 18/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":18}`

### D1c redelivery concurrente idempotente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197678117-ln9lpq","productId":"16637a9b-bf55-409d-bc15-1a760d2ac2af","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":19}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197682346-35au3y","productId":"c2f7b25c-c6aa-46bc-8f4c-3f0a6ba72a22","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":19}`

### Colas finales sin pendientes inesperados iter 19/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":19}`

### D1c redelivery concurrente idempotente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197688112-1ku6h1","productId":"05e58ee5-dc7e-4c0a-96db-7190b6ef1fde","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":20}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197692323-sxvequ","productId":"1d30a0f0-85cb-4ec8-9a09-b43c3c9a6584","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":20}`

### Colas finales sin pendientes inesperados iter 20/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":20}`

### D1c redelivery concurrente idempotente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197698455-prg3hm","productId":"0cee5baa-a976-4bb1-9926-e52b0977cb17","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":21}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197703127-kblcdo","productId":"1bfc4536-5040-4ae8-9bb6-97b49e26d9b4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":21}`

### Colas finales sin pendientes inesperados iter 21/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":21}`

### D1c redelivery concurrente idempotente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197709242-lbdchf","productId":"9f48e393-e3ba-41a6-9af6-2f691dbabcea","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":22}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197713453-2muwdp","productId":"639269e0-82a7-4e36-a3cd-60b7601467be","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":22}`

### Colas finales sin pendientes inesperados iter 22/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":22}`

### D1c redelivery concurrente idempotente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197719137-2pppu9","productId":"dc4e368e-20e6-4341-9160-61ddefef6be8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":23}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197723327-waw21d","productId":"d6bebb64-fa74-4032-9e75-3231b9a2a39e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":23}`

### Colas finales sin pendientes inesperados iter 23/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":23}`

### D1c redelivery concurrente idempotente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197729054-e7kjpu","productId":"0ac6cd43-8e25-4bed-9d78-61ff2ba8a421","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":24}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197733459-mrgqzd","productId":"529e2a4a-cb95-458b-aa9d-fcde12c20c4d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":24}`

### Colas finales sin pendientes inesperados iter 24/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":24}`

### D1c redelivery concurrente idempotente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197739136-5qapxm","productId":"674f9790-1656-4ec9-9732-f986828ed873","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":25}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197743359-xpsrmd","productId":"0e3c8612-744f-4ef1-831a-c5b8c81bba60","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":25}`

### Colas finales sin pendientes inesperados iter 25/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":25}`

### D1c redelivery concurrente idempotente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197750145-hnp2h4","productId":"44c54980-260e-49bd-a90c-e22bcdbf88ff","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":26}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197754455-zdvusi","productId":"9131b4b4-6143-4ee7-ad52-81d0020fcf06","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":26}`

### Colas finales sin pendientes inesperados iter 26/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":26}`

### D1c redelivery concurrente idempotente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197761171-ljblfq","productId":"26c16cbc-b046-4d5c-b602-f8b2b2d19bd9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":27}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197765410-3ap6ga","productId":"0f5ea011-7d64-4d42-b634-d64916543c54","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":27}`

### Colas finales sin pendientes inesperados iter 27/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":27}`

### D1c redelivery concurrente idempotente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197807290-bn1zhx","productId":"faeed3f0-6609-4b76-90d4-20a9955e7b8c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":28}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197811065-6v04mo","productId":"34de5f68-9f42-40d4-9f91-a79c69dba18f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":28}`

### Colas finales sin pendientes inesperados iter 28/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":28}`

### D1c redelivery concurrente idempotente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197817187-iuhd99","productId":"59b23778-f81f-4839-87da-98a13ebbfaee","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":29}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197821437-w3iriy","productId":"5718b107-3cc4-4218-b3af-5090fd394cc8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":29}`

### Colas finales sin pendientes inesperados iter 29/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":29}`

### D1c redelivery concurrente idempotente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197828461-ensojg","productId":"85151381-1682-4a3b-a128-cf1910bf91ed","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":30}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197833182-6fh7q1","productId":"efd73473-4494-48fd-a176-0568dc83bf2c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":30}`

### Colas finales sin pendientes inesperados iter 30/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":30}`

### D1c redelivery concurrente idempotente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197839327-kh5y11","productId":"1e327593-57e3-4a6a-813d-7d9e6e379001","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":31}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197844062-uum26x","productId":"47924407-2de7-4580-a5c5-b6620c392971","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":31}`

### Colas finales sin pendientes inesperados iter 31/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":31}`

### D1c redelivery concurrente idempotente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197850159-qzapo1","productId":"afa34018-f566-4d10-872a-e99d57b9c108","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":32}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197854351-5ksajc","productId":"9d76ec31-9043-4da5-9b37-18b692e4916e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":32}`

### Colas finales sin pendientes inesperados iter 32/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":32}`

### D1c redelivery concurrente idempotente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197860039-yyfpet","productId":"522fa799-610e-496d-950f-76f86f0f965a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":33}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197864275-jalbpd","productId":"1fa4a292-37d6-49f3-9536-22ed7c7a506c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":33}`

### Colas finales sin pendientes inesperados iter 33/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":33}`

### D1c redelivery concurrente idempotente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197870122-pmln8y","productId":"64595416-1ba1-402d-b280-410010d8801a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":34}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197874333-inqv4j","productId":"45ed4fc1-31f1-4b03-9503-356f4691d6dc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":34}`

### Colas finales sin pendientes inesperados iter 34/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":34}`

### D1c redelivery concurrente idempotente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197880420-yg1rmd","productId":"9f06e345-5b93-4c2d-92be-48f98081a04b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":35}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197885099-4n0d0t","productId":"26ee3f94-751f-45dd-93b5-d987373182d1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":35}`

### Colas finales sin pendientes inesperados iter 35/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":35}`

### D1c redelivery concurrente idempotente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197891181-g7bk08","productId":"5fa13c8f-0d8d-4640-aee8-384b28920f3e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":36}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197895443-wvudi7","productId":"d5b23fb7-cdf5-4a75-b045-d3911e7b573d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":36}`

### Colas finales sin pendientes inesperados iter 36/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":36}`

### D1c redelivery concurrente idempotente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197901494-l519k9","productId":"4b3f184d-abb1-4375-b554-739656ff1143","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":37}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197906152-fp4yg6","productId":"3c41f668-2c2e-44b9-bb11-c73945f32bf6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":37}`

### Colas finales sin pendientes inesperados iter 37/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":37}`

### D1c redelivery concurrente idempotente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197912331-y0j285","productId":"0f96b893-b68f-4802-b49c-a9fa50245f1e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":38}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197916110-v45e6i","productId":"adabb6f2-e94c-4f33-9784-921d21e5e3d8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":38}`

### Colas finales sin pendientes inesperados iter 38/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":38}`

### D1c redelivery concurrente idempotente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197922140-o2b9wt","productId":"c7710b24-23bd-4353-bc28-081de5960315","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":39}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197926356-n30s4w","productId":"b50afd51-69dd-40ed-b3b2-48801a4ac367","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":39}`

### Colas finales sin pendientes inesperados iter 39/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":39}`

### D1c redelivery concurrente idempotente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197932040-mudyfz","productId":"5acfcfaf-1367-4b11-872b-74c7fa0269a1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":40}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197936262-43o5jb","productId":"39e65532-45d6-43f2-9353-d384015db762","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":40}`

### Colas finales sin pendientes inesperados iter 40/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":40}`

### D1c redelivery concurrente idempotente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197942071-s76f9q","productId":"07090aca-e7cd-41ec-9edc-b84837031327","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":41}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197946412-2y4rbm","productId":"423466b4-2e54-43d3-9e1e-88895910a2a9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":41}`

### Colas finales sin pendientes inesperados iter 41/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":41}`

### D1c redelivery concurrente idempotente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197952166-t2s6e9","productId":"65afc8c0-a66c-4dac-8f66-00382b4b78d7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":42}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197956043-dc9zo9","productId":"8e8e8252-9eb7-416a-86fb-58a2fd0c52ce","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":42}`

### Colas finales sin pendientes inesperados iter 42/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":42}`

### D1c redelivery concurrente idempotente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197962259-tvzm5s","productId":"8344766c-3638-421c-8755-f13fd75fdbe3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":43}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197966111-uqwnjl","productId":"97300704-caf9-43a4-84fb-5a534bc022e6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":43}`

### Colas finales sin pendientes inesperados iter 43/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":43}`

### D1c redelivery concurrente idempotente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197972174-9b4q3z","productId":"a9883263-ef96-47ad-9841-d376c8f2e931","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":44}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197976445-01x53d","productId":"6b49fd32-dfd9-4c57-9faf-a41c4cb3a33b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":44}`

### Colas finales sin pendientes inesperados iter 44/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":44}`

### D1c redelivery concurrente idempotente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197982123-lnwbtz","productId":"34a5fb12-1692-4ead-b48f-0cac025b22fd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":45}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197986382-1sqkca","productId":"ffb44158-c875-4bfd-9e0a-9e42ffe9859f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":45}`

### Colas finales sin pendientes inesperados iter 45/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":45}`

### D1c redelivery concurrente idempotente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780197993117-f70411","productId":"b783f3d4-45f9-413f-92c8-dc78a97c8185","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":46}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780197997338-e85uh9","productId":"69d73c47-9c49-4100-a3a4-1615a83d617f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":46}`

### Colas finales sin pendientes inesperados iter 46/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":46}`

### D1c redelivery concurrente idempotente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198003098-z6t2yn","productId":"a97301b0-a2b2-4441-8c9f-8c3eff0510ac","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":47}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198007327-1uhj2h","productId":"880e4cb3-3cab-4fa7-93b0-119df2dc6fde","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":47}`

### Colas finales sin pendientes inesperados iter 47/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":47}`

### D1c redelivery concurrente idempotente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198013069-1qfc7p","productId":"dea77a39-00da-4a5a-b25a-92561f530e43","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":48}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198017257-gjmtwb","productId":"216b1bf8-3dc3-4b5f-984a-b7b350bd4426","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":48}`

### Colas finales sin pendientes inesperados iter 48/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":48}`

### D1c redelivery concurrente idempotente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198023232-kg52dw","productId":"e1a20496-f66e-4531-93d4-781ef1ee1801","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":49}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198027080-jpq4lt","productId":"c0d0c583-47d6-44c7-be51-d2dd32712568","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":49}`

### Colas finales sin pendientes inesperados iter 49/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":49}`

### D1c redelivery concurrente idempotente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198033121-u9tm2r","productId":"80e2fb7e-e124-43ba-9c3e-31af3caac8c0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":50}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198037410-lagw8m","productId":"9bd73763-ff68-4f67-b733-f2adca55e7ff","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":50}`

### Colas finales sin pendientes inesperados iter 50/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":50}`

### D1c redelivery concurrente idempotente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198043095-3yuudc","productId":"d53ceb9c-4f4f-4e44-8127-6a32eab0779b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":51}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198047256-axlnr2","productId":"34b3459d-7d8d-430e-905a-907a443a978c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":51}`

### Colas finales sin pendientes inesperados iter 51/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":51}`

### D1c redelivery concurrente idempotente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198053376-p1krl4","productId":"76fd239d-2e1c-45bb-8458-7b34c3f57c20","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":52}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198058095-vu2xgc","productId":"9593c739-c100-4ab2-bc5f-f605e2fea75b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":52}`

### Colas finales sin pendientes inesperados iter 52/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":52}`

### D1c redelivery concurrente idempotente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198064201-n8qft7","productId":"7bd9f665-a36e-4f2e-9a23-c57923b72c11","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":53}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198068419-h5lqtb","productId":"807226cc-49ca-4775-9d28-eea3dc7bccdd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":53}`

### Colas finales sin pendientes inesperados iter 53/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":53}`

### D1c redelivery concurrente idempotente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198074146-n1pyhj","productId":"3dee044a-8cf9-42ef-8f97-ce82ff16c77d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":54}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198078364-7nwb6v","productId":"331a2af6-cafd-41d0-9520-10f854ba595f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":54}`

### Colas finales sin pendientes inesperados iter 54/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":54}`

### D1c redelivery concurrente idempotente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198084067-wytvo3","productId":"13463b02-5be0-47ac-9a3c-995440c93c44","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":55}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198088286-63x41a","productId":"3ca17037-e20b-4ba9-bd2a-c1e48ae40a09","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":55}`

### Colas finales sin pendientes inesperados iter 55/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":55}`

### D1c redelivery concurrente idempotente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198094364-nn0qt0","productId":"d371f818-1e50-4d70-a423-e2cea631e438","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":56}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198098149-pbdi5s","productId":"1619a6da-a2e6-4eae-b81c-cda2dfbc0104","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":56}`

### Colas finales sin pendientes inesperados iter 56/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":56}`

### D1c redelivery concurrente idempotente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198104234-55ska6","productId":"ac704fdf-6818-4184-8a9d-ea015b17e1e5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":57}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198108032-of7op4","productId":"b240b2d4-8393-4abf-bcdf-29832b3b209d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":57}`

### Colas finales sin pendientes inesperados iter 57/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":57}`

### D1c redelivery concurrente idempotente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198114128-an07nz","productId":"5ab84a44-d684-4642-a047-e95d9b271a9b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":58}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198118379-mia97m","productId":"8dd6e05d-d453-4957-8461-ee4fd36a3160","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":58}`

### Colas finales sin pendientes inesperados iter 58/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":58}`

### D1c redelivery concurrente idempotente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198124139-j9bwfi","productId":"b4e9d096-693f-40ff-aff1-823b3c03ec5f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":59}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198128308-qz96hc","productId":"66e15a5a-fbe4-4145-9594-fe72d938d36a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":59}`

### Colas finales sin pendientes inesperados iter 59/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":59}`

### D1c redelivery concurrente idempotente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198134098-0gtqqm","productId":"c9d102b6-dbd7-4556-88b8-43408c461a03","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":60}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198138335-onr05h","productId":"e83fab0b-a84a-47b5-add1-5ade0fabf17b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":60}`

### Colas finales sin pendientes inesperados iter 60/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":60}`

### D1c redelivery concurrente idempotente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198144413-yqnhl1","productId":"21102782-394d-404a-8d5a-18f90fa5c37c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":61}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198149152-81t36c","productId":"3d4ed9c8-3285-4c54-b4b0-55591e20fa2e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":61}`

### Colas finales sin pendientes inesperados iter 61/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":61}`

### D1c redelivery concurrente idempotente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198155257-bj4r70","productId":"0f53e590-5828-4feb-990a-ca6d0a3f76df","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":62}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198159069-z31nyn","productId":"80a26032-fb4d-4dab-a4c6-1c5d5925d360","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":62}`

### Colas finales sin pendientes inesperados iter 62/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":62}`

### D1c redelivery concurrente idempotente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198165203-rde4y6","productId":"228cd5cd-8543-4785-b62a-5259758f8bbf","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":63}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198169387-6ylm4l","productId":"4549293a-d293-4ffb-8653-2b24ae62877d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":63}`

### Colas finales sin pendientes inesperados iter 63/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":63}`

### D1c redelivery concurrente idempotente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198175139-239347","productId":"909642ea-5e5a-4f7d-898f-efa81eecddba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":64}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198179302-bduqb2","productId":"ee6f02fb-fd56-460a-8149-a7f0985cbd29","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":64}`

### Colas finales sin pendientes inesperados iter 64/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":64}`

### D1c redelivery concurrente idempotente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198185077-ca6p39","productId":"3396eb29-4e53-4d2c-8a2b-f3b95cd5cc1e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":65}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198189261-zcrw98","productId":"c59982b6-2c0f-4f9b-b436-0cb52dbac025","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":65}`

### Colas finales sin pendientes inesperados iter 65/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":65}`

### D1c redelivery concurrente idempotente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198195354-bb5bgz","productId":"81136e12-ecc8-4f98-8a3b-fb96f94d1bbe","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":66}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198200466-l3v3b8","productId":"d199360a-1d0d-46ad-8d21-b7038c495289","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":66}`

### Colas finales sin pendientes inesperados iter 66/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":66}`

### D1c redelivery concurrente idempotente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198206142-f5um06","productId":"387bc5fc-263f-4914-85cc-62c83cc72a6b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":67}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198210361-fehbtk","productId":"31dfa5ef-76bb-485f-9795-9691d972dd46","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":67}`

### Colas finales sin pendientes inesperados iter 67/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":67}`

### D1c redelivery concurrente idempotente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198216051-hn3cjy","productId":"fbe00510-4bf2-48b9-b892-3431756db96c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":68}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198220257-z8ft1c","productId":"b2c56f97-b1ac-44b4-8a71-1d226bdf8762","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":68}`

### Colas finales sin pendientes inesperados iter 68/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":68}`

### D1c redelivery concurrente idempotente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198226389-qtlbok","productId":"3323ac9e-e2d9-4bcf-8e28-504bdd22d69b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":69}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198231132-wp3cbp","productId":"32857434-43d8-481f-8e00-f002bdebba46","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":69}`

### Colas finales sin pendientes inesperados iter 69/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":69}`

### D1c redelivery concurrente idempotente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198237283-l3euyj","productId":"5b7b41e8-d4e7-49c2-9885-0d6030dbf5aa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":70}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198242094-4kuha9","productId":"1c5efd7d-8701-4ee1-bee1-e228a1d2dd33","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":70}`

### Colas finales sin pendientes inesperados iter 70/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":70}`

### D1c redelivery concurrente idempotente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198248276-iivx49","productId":"a0b014f2-d56a-4030-aeea-e1f264d8c230","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":71}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198252059-3smgdj","productId":"7b66109d-8897-4137-9802-559b4e7421fc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":71}`

### Colas finales sin pendientes inesperados iter 71/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":71}`

### D1c redelivery concurrente idempotente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198258235-qvicdc","productId":"0c112095-07f0-4c13-adfa-5300c81282d8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":72}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198262407-l0cbyj","productId":"6454a0a2-a609-4571-a572-ae096d234f9f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":72}`

### Colas finales sin pendientes inesperados iter 72/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":72}`

### D1c redelivery concurrente idempotente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198268087-6rnuk4","productId":"3fa2e243-70e7-477f-8eb2-c96338083be5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":73}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198272343-l8kpku","productId":"171e6538-0578-46b7-8f42-248e0f95e012","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":73}`

### Colas finales sin pendientes inesperados iter 73/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":73}`

### D1c redelivery concurrente idempotente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198279115-b3duy9","productId":"bea1ccdb-eb0e-43f4-9a61-a1e9bf059c9e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":74}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198283355-5w5iq6","productId":"d6585f21-dd65-484a-b6d9-8a543c60b984","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":74}`

### Colas finales sin pendientes inesperados iter 74/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":74}`

### D1c redelivery concurrente idempotente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198289047-tg7kdy","productId":"4ad53897-16d0-4ad3-94dd-83232ccf250e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":75}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198293293-siajt3","productId":"d7e789ad-fbab-4af5-901a-f63472fc6045","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":75}`

### Colas finales sin pendientes inesperados iter 75/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":75}`

### D1c redelivery concurrente idempotente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198299448-k5bs7q","productId":"5224294c-6506-4ac2-a381-bafdb016b26c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":76}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198304190-edzd3t","productId":"9b523bf0-93cf-4d2d-ab26-aad85a076e07","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":76}`

### Colas finales sin pendientes inesperados iter 76/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":76}`

### D1c redelivery concurrente idempotente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198310377-dr784r","productId":"0bf8da31-32b5-489f-bbee-1187605dcb06","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":77}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198315030-8topr0","productId":"e57ee177-e730-43b9-ad81-2ca234dfbc3e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":77}`

### Colas finales sin pendientes inesperados iter 77/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":77}`

### D1c redelivery concurrente idempotente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198321408-w5ngtv","productId":"d4b89c6f-b9f6-4cd6-ba10-ea17b9bf43a3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":78}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198325097-5dhuty","productId":"cb17d704-b831-4aac-8219-a6e534c68a36","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":78}`

### Colas finales sin pendientes inesperados iter 78/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":78}`

### D1c redelivery concurrente idempotente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198331094-oei5bt","productId":"5e340dfe-abed-41c7-b117-308a4ff1f889","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":79}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198335214-861ffd","productId":"07694d59-1249-448b-abfb-e15b59e9ad8b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":79}`

### Colas finales sin pendientes inesperados iter 79/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":79}`

### D1c redelivery concurrente idempotente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198341239-zdbaqo","productId":"5a8e2da8-c2dd-4984-9ff0-ed905be9fc0e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":80}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198345412-4loo5z","productId":"61af0cb8-6306-4453-91fe-ee2ef9f1ee17","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":80}`

### Colas finales sin pendientes inesperados iter 80/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":80}`

### D1c redelivery concurrente idempotente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198351047-s2g4r9","productId":"03ffe8f6-2810-4f18-8134-5d587d4ca9ef","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":81}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198355220-mprmo0","productId":"09ee9114-7cc3-4b7c-9f4a-5eec9290a982","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":81}`

### Colas finales sin pendientes inesperados iter 81/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":81}`

### D1c redelivery concurrente idempotente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198361361-0r3mk6","productId":"bfafe396-4b31-463f-a28b-b09ab3ccf727","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":82}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198365111-v7u221","productId":"b38f40a4-75ba-48ae-a90c-30f4c9881041","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":82}`

### Colas finales sin pendientes inesperados iter 82/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":82}`

### D1c redelivery concurrente idempotente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198371102-h8w3yi","productId":"273ead19-8eef-4852-b923-6e370a7c564e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":83}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198375234-lqomsk","productId":"ebcb03bf-a5a6-4476-bcdc-298ec6c7a211","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":83}`

### Colas finales sin pendientes inesperados iter 83/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":83}`

### D1c redelivery concurrente idempotente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198381373-lerf9q","productId":"3b05b747-d4c8-4637-9a21-d907fcba7baa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":84}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198385061-e5wdjp","productId":"350530a9-d893-4790-9324-c148073e4f6a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":84}`

### Colas finales sin pendientes inesperados iter 84/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":84}`

### D1c redelivery concurrente idempotente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198391042-48z7ta","productId":"39b3a4a3-454e-425e-b1d5-c943cfe9281c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":85}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198395203-du78sc","productId":"7e331afe-dba4-49a8-a8ae-d896668a49ec","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":85}`

### Colas finales sin pendientes inesperados iter 85/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":85}`

### D1c redelivery concurrente idempotente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198401145-s33guq","productId":"247879b6-75d2-4389-9b61-5717e2d69f56","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":86}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198405463-st6lu2","productId":"b545d470-5157-442b-a70f-9e606b96d72e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":86}`

### Colas finales sin pendientes inesperados iter 86/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":86}`

### D1c redelivery concurrente idempotente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198411071-aix9v1","productId":"c72efa27-032a-4005-a602-6106bfa9f154","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":87}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198415258-tod7u5","productId":"08b80e9c-6159-45fe-883d-34b7d431747d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":87}`

### Colas finales sin pendientes inesperados iter 87/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":87}`

### D1c redelivery concurrente idempotente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198421262-6dbdyb","productId":"a61f5379-ae40-46dd-85c6-1e0f524fa204","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":88}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198425436-5qna4r","productId":"fe967ce8-b2c6-4ae1-aab6-022a9297859d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":88}`

### Colas finales sin pendientes inesperados iter 88/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":88}`

### D1c redelivery concurrente idempotente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198431358-hx0hk8","productId":"5eb1a0ce-8806-4c19-9ee5-e85b064c7df6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":89}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198435036-zho16k","productId":"1751c251-d3ff-427c-8efd-458442c62587","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":89}`

### Colas finales sin pendientes inesperados iter 89/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":89}`

### D1c redelivery concurrente idempotente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198441386-k3vibe","productId":"1bb03765-b823-43b1-862d-8312dc017f87","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":90}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198445097-n5s6yv","productId":"07e29794-fe1f-4ebd-99a3-6332e20bd023","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":90}`

### Colas finales sin pendientes inesperados iter 90/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":90}`

### D1c redelivery concurrente idempotente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198451039-8f8rth","productId":"0ea788b0-5a60-4caa-b0fc-1d57eaf120a8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":91}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198455198-o0es2g","productId":"3cafe4b1-cca6-471b-9d47-08afb06f90f8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":91}`

### Colas finales sin pendientes inesperados iter 91/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":91}`

### D1c redelivery concurrente idempotente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198461105-tkwoj8","productId":"b5798f75-018a-4cbd-a22b-63b6435505ba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":92}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198465350-kh3bkd","productId":"75c62366-d96d-4711-a11b-a4bcea15b3f9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":92}`

### Colas finales sin pendientes inesperados iter 92/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":92}`

### D1c redelivery concurrente idempotente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198471091-0g5nxs","productId":"801373ac-96f6-4232-80a8-f852955ba656","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":93}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198475203-i43mpa","productId":"b8f0421b-b354-4d75-9583-9d61412a047c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":93}`

### Colas finales sin pendientes inesperados iter 93/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":93}`

### D1c redelivery concurrente idempotente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198481227-v920cj","productId":"7be699ff-bc47-40de-bbc1-732a467d05af","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":94}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198485377-0smgvq","productId":"ecd1f764-16f4-4945-a4e9-4d41d37482b9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":94}`

### Colas finales sin pendientes inesperados iter 94/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":94}`

### D1c redelivery concurrente idempotente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198491304-b75ugc","productId":"85619068-27c2-48c5-9a7f-1a195ed57e7e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":95}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198495397-g0sw0n","productId":"2863c262-5b29-4a47-8a9a-9d07d92c6eb3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":95}`

### Colas finales sin pendientes inesperados iter 95/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":95}`

### D1c redelivery concurrente idempotente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198501358-7ztibb","productId":"b97fa852-9c96-4e96-a044-5a168582caef","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":96}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198505049-kuodi2","productId":"d8d0503e-ff10-436e-a0dc-7399d1970f45","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":96}`

### Colas finales sin pendientes inesperados iter 96/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":96}`

### D1c redelivery concurrente idempotente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198511385-natm3q","productId":"b28d0d38-cfb3-4955-a5bd-8bd858fc10fa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":97}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198515094-nd9m27","productId":"a9cf0caf-85e7-4242-8270-37cd29ff5f6a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":97}`

### Colas finales sin pendientes inesperados iter 97/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":97}`

### D1c redelivery concurrente idempotente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198521449-sm6dqz","productId":"47a222e3-8029-4241-8abd-a94c5057632d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":98}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198525091-9hzkbd","productId":"c8233d47-d6be-40d0-b332-1086485e860b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":98}`

### Colas finales sin pendientes inesperados iter 98/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":98}`

### D1c redelivery concurrente idempotente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198531074-7lawdw","productId":"6b2af55a-99c7-4111-8af1-a5ef4f004848","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":99}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198535223-ofejbv","productId":"b08fe0a4-ce90-434a-84b7-907dd21fea98","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":99}`

### Colas finales sin pendientes inesperados iter 99/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":99}`

### D1c redelivery concurrente idempotente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"pedidoId":"pedido-d1c-1780198541158-gep336","productId":"2411375d-9ec6-4468-ab10-792deb56304e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":100}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":50,"eventId":"repo-r1-1780198545256-vc0dgm","productId":"89795f1e-c23a-4d5e-b044-e03356a3ab31","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":100}`

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

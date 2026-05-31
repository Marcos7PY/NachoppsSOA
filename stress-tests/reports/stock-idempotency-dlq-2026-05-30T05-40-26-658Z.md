# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-30T05:40:26.659Z
- Base URL: http://localhost:8000
- Rama: codex/stock-idempotency-dlq
- Commit: bfd9ff0 Merge pull request #4 from Marcos7PY/codex/security-and-limit-tests
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
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118518459-2sjjs0","productId":"48146824-bc98-42c8-8e4f-5fdb8c003f55","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118523429-9ixxo0","productId":"487a2e24-77fd-4164-bfcf-3018e755380d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118530097-ey5vm2","productId":"aa7440a6-721b-44db-84ec-f5254616e51b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118535097-a69tio","productId":"6eee91d2-3289-4775-9a53-061ea02ddf6f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118541128-l3xo0z","productId":"8b9fee4b-9a3a-4385-91ad-3de73f747051","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118545099-0z5k04","productId":"449fcac5-f87d-4f0a-a179-8a6c82efdbf8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

### D1c redelivery concurrente idempotente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118551366-nd251m","productId":"17d29fd7-988a-4aa1-9f91-4ebcb515e00c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":4}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118556379-vdhda2","productId":"1218dc55-416b-455d-80f2-4f65b28dd92c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":4}`

### Colas finales sin pendientes inesperados iter 4/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":4}`

### D1c redelivery concurrente idempotente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118563190-xipsih","productId":"2df26685-281d-40e9-9b3c-378f448bee32","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":5}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118568050-m5dmmi","productId":"2a978d14-3846-47ae-9aff-a1271a741bfd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":5}`

### Colas finales sin pendientes inesperados iter 5/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":5}`

### D1c redelivery concurrente idempotente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118574065-p92tru","productId":"1c72b65e-7352-42de-aee1-f2d4a498d99b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":6}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118579381-wcrc63","productId":"d9aef0d6-12d1-4243-9997-da655bb7aead","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":6}`

### Colas finales sin pendientes inesperados iter 6/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":6}`

### D1c redelivery concurrente idempotente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118586385-n04jup","productId":"39ad988e-15df-460d-9a76-b4e86141709b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":7}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118591256-j1pcfp","productId":"18b89970-123f-40df-94c8-bd04ffabf910","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":7}`

### Colas finales sin pendientes inesperados iter 7/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":7}`

### D1c redelivery concurrente idempotente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118598266-gdrlhy","productId":"24188074-fab6-4106-a8dc-3bbd9bfb4aa4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":8}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118602133-t6jufr","productId":"2064912b-77c9-4aa9-a591-538fbc1c4f0a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":8}`

### Colas finales sin pendientes inesperados iter 8/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":8}`

### D1c redelivery concurrente idempotente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118608307-rcbng6","productId":"9cdc18f9-a7ee-43e9-b116-0ea9c930d56f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":9}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118613087-lv1hkr","productId":"6f30b577-59dd-4a6b-946a-3f8c3da78e73","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":9}`

### Colas finales sin pendientes inesperados iter 9/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":9}`

### D1c redelivery concurrente idempotente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118619238-7jxx54","productId":"da172e76-a293-442d-a489-e6447d4ecfc1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":10}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118624225-4kvitd","productId":"402299d3-4022-4ea9-b7fe-1262cfc297c2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":10}`

### Colas finales sin pendientes inesperados iter 10/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":10}`

### D1c redelivery concurrente idempotente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118630096-8x41vj","productId":"22737968-af3d-4355-b70d-a7817ff31139","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":11}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118634041-r04fsx","productId":"4870b8d6-5fdd-46cf-8600-d62674e29667","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":11}`

### Colas finales sin pendientes inesperados iter 11/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":11}`

### D1c redelivery concurrente idempotente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118640114-6f9dip","productId":"a09dee4a-2187-4160-a2b8-d8c26ff95a22","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":12}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118645067-387do7","productId":"75a9aa62-867d-482b-8da5-a979c4b2e989","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":12}`

### Colas finales sin pendientes inesperados iter 12/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":12}`

### D1c redelivery concurrente idempotente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118651209-4zaix2","productId":"b7647b3a-0f59-4feb-ba4f-2f7a433c41cc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":13}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118655099-o9xaic","productId":"6acebb41-984b-4ddf-a32c-82bc1c8a9ceb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":13}`

### Colas finales sin pendientes inesperados iter 13/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":13}`

### D1c redelivery concurrente idempotente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118661254-pxwx8e","productId":"a12f304c-793e-4e3d-9c3f-6f3890c5866c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":14}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118666233-f4wu72","productId":"2166b94b-1684-474f-82a8-be4ae0298b19","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":14}`

### Colas finales sin pendientes inesperados iter 14/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":14}`

### D1c redelivery concurrente idempotente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118673343-5v4rox","productId":"30f805f6-2ec8-47c0-83cd-c76918871c62","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":15}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118678194-ju36hz","productId":"7d2a8fb2-3e55-4fcb-ae3b-de94c9f869b8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":15}`

### Colas finales sin pendientes inesperados iter 15/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":15}`

### D1c redelivery concurrente idempotente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118684247-iebnt2","productId":"9a352432-f800-4cc1-b36c-5525c06ca98a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":16}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118689139-o4os1d","productId":"3605e32a-807b-4a4d-8e79-efdafe094efe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":16}`

### Colas finales sin pendientes inesperados iter 16/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":16}`

### D1c redelivery concurrente idempotente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118695300-lh7xto","productId":"f20a3793-6472-42a6-9f3e-f8c3b1adf0d4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":17}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118699134-yahg1u","productId":"71e18a2e-73e2-4c3c-86ce-f9ad866df586","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":17}`

### Colas finales sin pendientes inesperados iter 17/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":17}`

### D1c redelivery concurrente idempotente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118705239-gjcktc","productId":"66b20608-b9b9-463e-841b-f979c8cf2d05","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":18}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118710089-jttaxu","productId":"905d9ba3-ac29-4aa2-a544-8f89137a4aa9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":18}`

### Colas finales sin pendientes inesperados iter 18/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":18}`

### D1c redelivery concurrente idempotente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118716236-px9s5g","productId":"db3fc5d9-3fc2-4934-855d-b7a45c30e6e1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":19}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118721298-inogvf","productId":"c2e088c1-9fc5-40ed-a045-55b45ab63db1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":19}`

### Colas finales sin pendientes inesperados iter 19/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":19}`

### D1c redelivery concurrente idempotente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118727046-36431v","productId":"aa21b329-a707-4ee0-a7ed-c6b3a5c05580","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":20}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118731414-eiaty9","productId":"773bf9da-bfeb-4561-ad66-646de27b02cf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":20}`

### Colas finales sin pendientes inesperados iter 20/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":20}`

### D1c redelivery concurrente idempotente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118738370-tkp7mv","productId":"0f894b6b-5e23-4db3-898f-c6d14326d920","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":21}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118743044-h8ki00","productId":"c417c884-79cb-4b7b-9311-634cc045c22f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":21}`

### Colas finales sin pendientes inesperados iter 21/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":21}`

### D1c redelivery concurrente idempotente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118749269-nzkxz3","productId":"8561843a-a7c6-493e-b917-a81f9edae0f8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":22}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118754102-bdvtok","productId":"88445322-19c8-45ba-a879-5695f8301286","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":22}`

### Colas finales sin pendientes inesperados iter 22/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":22}`

### D1c redelivery concurrente idempotente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118760327-h3b62y","productId":"1e155c37-42a3-42f6-b410-c9523e057b5a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":23}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118765163-gau8pi","productId":"db5c7b6c-826a-4ff3-9ce6-ee4fe84d6a8e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":23}`

### Colas finales sin pendientes inesperados iter 23/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":23}`

### D1c redelivery concurrente idempotente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118771413-gks5v4","productId":"1c626550-cdad-4830-9e11-c5ac72dda69c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":24}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118776324-whc3ap","productId":"a157953c-9334-4ec0-b71c-a92fccf18ac1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":24}`

### Colas finales sin pendientes inesperados iter 24/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":24}`

### D1c redelivery concurrente idempotente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118782061-sc7suq","productId":"f4125ce4-b32b-4daa-bb47-3e6f3efa73bf","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":25}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118786466-h3v2pu","productId":"578aa03e-79ba-46ba-9ebd-8ba98ae98c1a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":25}`

### Colas finales sin pendientes inesperados iter 25/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":25}`

### D1c redelivery concurrente idempotente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118792153-i7onze","productId":"936c7e5f-8a16-4915-a5b1-191316e0cdbb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":26}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118797124-k9ysto","productId":"fff95492-dfc4-4b04-b0af-82ab89d86b59","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":26}`

### Colas finales sin pendientes inesperados iter 26/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":26}`

### D1c redelivery concurrente idempotente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118803113-67qib9","productId":"ac48e9e6-e013-431b-9ea6-f62754bbc471","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":27}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118807067-rorg6a","productId":"5bdbadb8-2543-4b30-9ddd-1a922d4e7439","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":27}`

### Colas finales sin pendientes inesperados iter 27/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":27}`

### D1c redelivery concurrente idempotente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118813234-inti3d","productId":"f2c72586-f7d1-4d14-a66e-daac02cc69d3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":28}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118818171-rhrftr","productId":"a6b9fe45-2096-4811-99cc-c4d8afc11e41","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":28}`

### Colas finales sin pendientes inesperados iter 28/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":28}`

### D1c redelivery concurrente idempotente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118825236-qhnzi5","productId":"8a8d3f9c-b44b-4efd-a5d9-21b5b8915341","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":29}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118830132-7uqr20","productId":"4f4bb4bf-d67c-475b-9005-f8c4341fe3d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":29}`

### Colas finales sin pendientes inesperados iter 29/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":29}`

### D1c redelivery concurrente idempotente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118836147-rdpy09","productId":"1fc12304-4c96-4c05-b278-f433de543c8d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":30}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118840155-h36ngx","productId":"dc9c8d03-f35a-498f-84be-c0da21bd040a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":30}`

### Colas finales sin pendientes inesperados iter 30/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":30}`

### D1c redelivery concurrente idempotente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118846228-h166y7","productId":"824503ce-fc92-441c-9fce-7f3d2ff1ec95","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":31}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118850469-qkmt09","productId":"5f7e2833-315a-4205-a29b-31622819063c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":31}`

### Colas finales sin pendientes inesperados iter 31/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":31}`

### D1c redelivery concurrente idempotente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118857031-2zvdgh","productId":"a5ee4583-6f98-4f64-8a03-56ccbd310dec","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":32}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118861317-43ebjo","productId":"0c871472-82f5-4841-ab91-e8bb99ad3be2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":32}`

### Colas finales sin pendientes inesperados iter 32/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":32}`

### D1c redelivery concurrente idempotente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118867230-e9kjbh","productId":"8afc8c52-ff9c-434c-917d-1273b3f37bee","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":33}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118871082-01c9cc","productId":"1b34e1e2-cff3-42b8-8e0f-5c71463eac20","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":33}`

### Colas finales sin pendientes inesperados iter 33/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":33}`

### D1c redelivery concurrente idempotente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118877118-i1rhbx","productId":"e7018a37-150d-4fec-bda4-89fdeab5a593","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":34}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118881386-63d0ma","productId":"90378e74-cc0b-4cdc-bd47-79315c941a99","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":34}`

### Colas finales sin pendientes inesperados iter 34/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":34}`

### D1c redelivery concurrente idempotente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118887099-6vwx9v","productId":"4e4e6722-4d1e-46c9-9c2c-c417de5602ab","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":35}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118892168-pqu0qu","productId":"e5761079-9133-4b23-ab08-500a1faf7586","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":35}`

### Colas finales sin pendientes inesperados iter 35/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":35}`

### D1c redelivery concurrente idempotente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118898071-tauz9h","productId":"a00129ea-46a9-4e46-a17b-9c2bab88933e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":36}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118902098-vf6br8","productId":"00f0c2c9-3dc6-4f4c-b5e6-b8581ef30387","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":36}`

### Colas finales sin pendientes inesperados iter 36/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":36}`

### D1c redelivery concurrente idempotente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118908164-kk9oit","productId":"fd761702-ba37-4bfe-b480-a9079e103816","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":37}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118913061-fpson7","productId":"741a6c77-db10-48ab-96ab-aa9624f3a2f7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":37}`

### Colas finales sin pendientes inesperados iter 37/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":37}`

### D1c redelivery concurrente idempotente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118919211-202jba","productId":"003fac0e-17ab-45ba-bd8b-e5f7ff5851c6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":38}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118924145-8rb6iz","productId":"90a154d8-f1ad-4d4f-bb94-8c87500f018d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":38}`

### Colas finales sin pendientes inesperados iter 38/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":38}`

### D1c redelivery concurrente idempotente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118930034-htarht","productId":"a6bf24be-56a8-4b72-a594-d4a0f0b1bf46","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":39}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118934140-vtmd8q","productId":"fabb2427-7c62-4eca-9f54-44f58c371ed6","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":39}`

### Colas finales sin pendientes inesperados iter 39/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":39}`

### D1c redelivery concurrente idempotente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118940341-360byq","productId":"1437ac4a-edac-4806-8d06-8ff2e3d322e6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":40}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118945242-pcp43e","productId":"eec76178-4e04-43e6-bdea-6690489bd3dd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":40}`

### Colas finales sin pendientes inesperados iter 40/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":40}`

### D1c redelivery concurrente idempotente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118951371-40x2dq","productId":"fc0415d3-42b1-40b4-b549-e025275a38f8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":41}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118956240-pohyhn","productId":"bbd38c1e-d559-42e1-84d4-c30ff118ac17","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":41}`

### Colas finales sin pendientes inesperados iter 41/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":41}`

### D1c redelivery concurrente idempotente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118962375-7ixcf9","productId":"7062f83a-a1a2-4702-a8fc-e66b29bb8742","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":42}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118967247-lo668j","productId":"7cd7c4b0-f9a6-4192-9d51-853cad27f25f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":42}`

### Colas finales sin pendientes inesperados iter 42/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":42}`

### D1c redelivery concurrente idempotente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118973238-onz3zi","productId":"0d31bd3b-165a-495d-8f0c-534d53e68a84","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":43}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118978089-mdp9dk","productId":"c2b8918d-c997-4bd5-9c43-d4b09a46b52d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":43}`

### Colas finales sin pendientes inesperados iter 43/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":43}`

### D1c redelivery concurrente idempotente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118984141-043aho","productId":"46ba6bd4-3080-498a-b8df-200ade1d96df","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":44}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780118989248-aufij0","productId":"8ae38121-6c00-4d40-8fc7-6e95b8179b6b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":44}`

### Colas finales sin pendientes inesperados iter 44/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":44}`

### D1c redelivery concurrente idempotente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780118996127-tums78","productId":"cafd8de4-e072-4500-a682-f03726bd2a6c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":45}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119000149-wl8y9p","productId":"4c75632c-d976-4365-92d6-b58cd95f3ae1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":45}`

### Colas finales sin pendientes inesperados iter 45/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":45}`

### D1c redelivery concurrente idempotente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119006100-mbpzb4","productId":"e1e049d8-fd23-481c-87d2-81f3171ec7f6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":46}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119010101-nclsrt","productId":"0eca9f33-6dc0-433f-9145-63de67da5565","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":46}`

### Colas finales sin pendientes inesperados iter 46/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":46}`

### D1c redelivery concurrente idempotente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119016416-wvh07d","productId":"a6e6957a-1950-46cc-b9cd-32ba3ab42a31","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":47}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119021224-mbg0j8","productId":"5c25a84d-0f65-40cd-8d66-0ae5619bfed5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":47}`

### Colas finales sin pendientes inesperados iter 47/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":47}`

### D1c redelivery concurrente idempotente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119027028-kvceso","productId":"4f0ab2d7-8820-42a9-afcc-8e2451c02df3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":48}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119031361-9x7y0y","productId":"19e4a706-ec78-4e70-a39e-2de4c8a09850","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":48}`

### Colas finales sin pendientes inesperados iter 48/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":48}`

### D1c redelivery concurrente idempotente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119037153-jskfmr","productId":"32c3349c-0c80-4285-a8a4-fb3ab4d4df81","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":49}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119042076-14mukm","productId":"e8091627-c2ee-4d2b-81fd-4377ec19f786","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":49}`

### Colas finales sin pendientes inesperados iter 49/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":49}`

### D1c redelivery concurrente idempotente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119048372-xoruug","productId":"52c9d43d-4572-4b37-909b-f0b1133dcdc0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":50}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119053267-12zvv9","productId":"84dba460-1b59-4af1-ae22-f2af13d928f4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":50}`

### Colas finales sin pendientes inesperados iter 50/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":50}`

### D1c redelivery concurrente idempotente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119060126-7xlkpo","productId":"93076f44-c1c7-460e-83a9-b474f2cd5d6b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":51}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119065052-ysorla","productId":"922d9821-a5ac-4c55-a195-84faaad0f4bf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":51}`

### Colas finales sin pendientes inesperados iter 51/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":51}`

### D1c redelivery concurrente idempotente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119071157-8jgdzl","productId":"a531bf0f-9a7d-4c01-acea-07c2809804bc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":52}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119076047-1c77rg","productId":"3bae1d77-158c-4611-9e2f-e56fe139c651","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":52}`

### Colas finales sin pendientes inesperados iter 52/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":52}`

### D1c redelivery concurrente idempotente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119082245-c1pnzh","productId":"1c12eca9-ba94-448b-ad90-09ff4470c25f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":53}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119087231-ojgfcd","productId":"13c56416-ceab-4bf0-b167-b269b8f22ddf","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":53}`

### Colas finales sin pendientes inesperados iter 53/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":53}`

### D1c redelivery concurrente idempotente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119093240-oem78v","productId":"9c6859d8-d7b9-4013-b97f-fb163f7ef7c9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":54}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119098360-mcuypb","productId":"9380ac97-ded6-443c-ac96-d85550bccbda","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":54}`

### Colas finales sin pendientes inesperados iter 54/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":54}`

### D1c redelivery concurrente idempotente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119105365-c61ovi","productId":"cad91629-9252-44ff-b395-86d0d163e52e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":55}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119110147-2ur6l4","productId":"ccb6fd14-9f5b-4276-8fed-eaf56a3564cd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":55}`

### Colas finales sin pendientes inesperados iter 55/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":55}`

### D1c redelivery concurrente idempotente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119116459-b48div","productId":"b83ef03a-fa68-4da7-b1c4-b0a053a67e32","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":56}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119121233-hdtloe","productId":"1b734d74-e747-4efa-86e1-0f17f08c44f2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":56}`

### Colas finales sin pendientes inesperados iter 56/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":56}`

### D1c redelivery concurrente idempotente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119127106-606mzw","productId":"8a94489e-8d89-4040-8e72-5a6b599bbf6a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":57}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119132078-khlvgm","productId":"4f354917-a0c9-4b73-9fd1-eda715f74ca0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":57}`

### Colas finales sin pendientes inesperados iter 57/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":57}`

### D1c redelivery concurrente idempotente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119138275-xzx8qe","productId":"9104d81f-1708-4ba8-9457-49faf246552d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":58}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119143302-bbi91v","productId":"3653aa35-fbf0-4250-9095-05f9d6a62dee","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":58}`

### Colas finales sin pendientes inesperados iter 58/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":58}`

### D1c redelivery concurrente idempotente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119150121-g1his3","productId":"7046648c-0d89-4db5-87a8-328952a62bf8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":59}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119154424-myjw7k","productId":"283ba2b6-45f5-489a-866b-9555830d4bc2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":59}`

### Colas finales sin pendientes inesperados iter 59/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":59}`

### D1c redelivery concurrente idempotente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119160362-wgl26r","productId":"25449a49-d237-49bd-97ab-c6cb6c8d9428","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":60}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119165441-7mw7pl","productId":"2b73e25e-f781-4c51-84cb-f1d16f92d836","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":60}`

### Colas finales sin pendientes inesperados iter 60/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":60}`

### D1c redelivery concurrente idempotente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119172072-dit5vy","productId":"505dc47d-46cc-48ce-9db8-bebd990a8f58","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":61}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119176261-3o6jwd","productId":"c786871f-f2e1-40c8-8c67-88662bc02559","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":61}`

### Colas finales sin pendientes inesperados iter 61/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":61}`

### D1c redelivery concurrente idempotente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119182352-io6kys","productId":"767d0355-389c-43c1-a3c7-109375b70a1b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":62}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119187452-g19s9i","productId":"7697934b-a9b4-42e2-b112-a5deeeb0e16a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":62}`

### Colas finales sin pendientes inesperados iter 62/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":62}`

### D1c redelivery concurrente idempotente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119194239-8qy8up","productId":"90736f29-cd87-4411-a170-a5b65d491269","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":63}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119198090-0n0hjh","productId":"31ea1ef5-b3de-460d-83d2-5051f8d599be","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":63}`

### Colas finales sin pendientes inesperados iter 63/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":63}`

### D1c redelivery concurrente idempotente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119204108-81y4fv","productId":"57b13b84-f4cf-4338-a38e-952cdb161132","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":64}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119208354-1gk2ic","productId":"044f35fa-c631-47a0-bcfc-754116084f05","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":64}`

### Colas finales sin pendientes inesperados iter 64/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":64}`

### D1c redelivery concurrente idempotente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119215159-amugke","productId":"d8ed9552-a3ae-46ca-8d78-8832d0b4867c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":65}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119219423-yvoam9","productId":"679b63b4-dc47-4587-abb4-b250570d7a81","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":65}`

### Colas finales sin pendientes inesperados iter 65/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":65}`

### D1c redelivery concurrente idempotente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119226059-9h1j1x","productId":"2dcd0e0f-23fd-41cb-8727-14e160231051","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":66}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119230338-5vv9bz","productId":"c3ccc8fd-9a88-49ab-be92-bf2617d1f53b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":66}`

### Colas finales sin pendientes inesperados iter 66/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":66}`

### D1c redelivery concurrente idempotente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119236154-i61xef","productId":"870d173d-2bad-49b5-8d78-dc865912918d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":67}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119241170-pg2nzn","productId":"7caf8dd6-32a4-4a21-be76-af992a0849ed","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":67}`

### Colas finales sin pendientes inesperados iter 67/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":67}`

### D1c redelivery concurrente idempotente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119248356-yg3qx9","productId":"7571509b-d094-45f9-bb52-ee3f286f0772","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":68}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119253308-89bfbw","productId":"83a1849c-7979-4ac8-8bcd-d744868bff5d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":68}`

### Colas finales sin pendientes inesperados iter 68/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":68}`

### D1c redelivery concurrente idempotente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119260091-cg82tz","productId":"c774cb4d-607b-463d-977c-412992ff8803","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":69}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119264406-3ey99k","productId":"488bb775-dc03-425a-86a4-efdcb534d23a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":69}`

### Colas finales sin pendientes inesperados iter 69/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":69}`

### D1c redelivery concurrente idempotente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119271332-ww7wb2","productId":"8886d394-1d5b-449e-897b-362aea95332f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":70}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119276312-g1f6qo","productId":"a8c8919a-ab25-4972-8b82-8843d3651207","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":70}`

### Colas finales sin pendientes inesperados iter 70/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":70}`

### D1c redelivery concurrente idempotente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119283283-r3nvw7","productId":"8f56ba40-69e8-4709-ac09-41016e673163","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":71}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119288306-knwj3x","productId":"6a2b4010-6018-472c-b86a-cb9e7cd48521","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":71}`

### Colas finales sin pendientes inesperados iter 71/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":71}`

### D1c redelivery concurrente idempotente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119295238-ad9azz","productId":"4698ceeb-087d-4885-9e05-41d1d7a263eb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":72}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119300249-klxs53","productId":"ac76d3a7-ed7c-4203-986a-39b2f497a967","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":72}`

### Colas finales sin pendientes inesperados iter 72/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":72}`

### D1c redelivery concurrente idempotente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119306185-0ygxnu","productId":"71f616f6-7a97-4542-ab65-c6a0142a6130","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":73}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119311062-ed9dfe","productId":"c27810fd-459d-4617-b502-d8fa2f346d42","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":73}`

### Colas finales sin pendientes inesperados iter 73/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":73}`

### D1c redelivery concurrente idempotente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119317058-fz5vz9","productId":"8314405e-bc3d-4b7f-a53b-30e92be72b6b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":74}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119322193-4xterc","productId":"d80e2599-f6d0-436b-ad3f-0200ac44df15","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":74}`

### Colas finales sin pendientes inesperados iter 74/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":74}`

### D1c redelivery concurrente idempotente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119328066-pxa5vr","productId":"54f0684c-56ab-4d46-ae37-970e9c5c980e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":75}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119333143-ut3o0y","productId":"32c6efe1-8c1c-477f-a3ba-10af7a98d22b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":75}`

### Colas finales sin pendientes inesperados iter 75/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":75}`

### D1c redelivery concurrente idempotente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119339372-80ltrx","productId":"647d4461-668d-4437-bbe3-57e93906a8f1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":76}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119344328-93697p","productId":"fd8a08c0-d698-40b5-902f-f2b907a2ecb3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":76}`

### Colas finales sin pendientes inesperados iter 76/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":76}`

### D1c redelivery concurrente idempotente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119351448-mwwi6t","productId":"cd6707ae-8b33-4a25-9c6e-a5921b4a3e00","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":77}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119356387-227u9j","productId":"610c3378-510d-4f72-8afc-80031474e069","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":77}`

### Colas finales sin pendientes inesperados iter 77/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":77}`

### D1c redelivery concurrente idempotente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119362144-cwpdgy","productId":"008d0ae6-d514-4144-8a7f-13474c267591","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":78}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119366119-74ja61","productId":"3cea8629-3195-4150-843a-85052fa77e0a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":78}`

### Colas finales sin pendientes inesperados iter 78/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":78}`

### D1c redelivery concurrente idempotente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119372188-r4se0r","productId":"f35cdcba-5ffd-4b02-b53c-566151fd8678","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":79}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119377062-ovql0t","productId":"9750be26-baa3-4637-9b41-59b385b7305f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":79}`

### Colas finales sin pendientes inesperados iter 79/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":79}`

### D1c redelivery concurrente idempotente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119384179-d5jyg3","productId":"c5329544-672e-416d-a398-808372d72a38","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":80}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119389332-v8s9sg","productId":"1a7c44ef-6de6-43e0-b354-6293cd57d4b1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":80}`

### Colas finales sin pendientes inesperados iter 80/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":80}`

### D1c redelivery concurrente idempotente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119396259-s88d10","productId":"fa241635-670e-4243-a9c9-6e0998db7c41","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":81}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119401148-976oml","productId":"8bd549f7-5bf2-451e-9ffd-cf022882794a","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":81}`

### Colas finales sin pendientes inesperados iter 81/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":81}`

### D1c redelivery concurrente idempotente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119408083-hbcea6","productId":"24670f77-0fa5-41fe-a3b3-de1885d91c0c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":82}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119413471-i64kvr","productId":"51e6bec2-4724-42f4-89c8-d4ba7bc2b529","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":82}`

### Colas finales sin pendientes inesperados iter 82/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":82}`

### D1c redelivery concurrente idempotente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119420455-8t97kf","productId":"5b934923-5dc5-45fa-b9e2-54c5b3ba2f0b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":83}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119425181-7p4hf5","productId":"1891bdbe-5fb2-478d-8e56-d325e6bbed07","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":83}`

### Colas finales sin pendientes inesperados iter 83/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":83}`

### D1c redelivery concurrente idempotente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119432337-ifrg9e","productId":"6eb196fa-6b31-4385-9b76-c2d4926f5ef8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":84}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119437226-1lymd3","productId":"6d202a32-2f3e-4427-b11a-314c899adc26","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":84}`

### Colas finales sin pendientes inesperados iter 84/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":84}`

### D1c redelivery concurrente idempotente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119443400-t5f6ee","productId":"8896cec9-cd92-40c7-bbd6-6433c71b2b16","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":85}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119448286-y05swu","productId":"7de172cc-115a-4b31-a240-f9d9b3902629","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":85}`

### Colas finales sin pendientes inesperados iter 85/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":85}`

### D1c redelivery concurrente idempotente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119454387-9n7p82","productId":"449702f4-5ada-4242-88ad-18850e3e40ba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":86}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119459172-ib03vi","productId":"8e55d4cf-e4d5-4459-a4b1-e3b6a45a4d84","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":86}`

### Colas finales sin pendientes inesperados iter 86/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":86}`

### D1c redelivery concurrente idempotente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119465063-yuhlqs","productId":"60ecd84a-1ce8-4a77-bc52-a24ee0a54a3a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":87}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119469364-0161eb","productId":"2d95f0e6-e8bc-478f-9aae-07de56b25049","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":87}`

### Colas finales sin pendientes inesperados iter 87/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":87}`

### D1c redelivery concurrente idempotente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119476085-49nwv5","productId":"060f4fcf-516f-4b5a-9d0c-4b4ef9c6df07","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":88}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119480144-o4z362","productId":"0fe8a59f-6b98-4a47-851c-bcea2df4beb0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":88}`

### Colas finales sin pendientes inesperados iter 88/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":88}`

### D1c redelivery concurrente idempotente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119486418-p8cnme","productId":"597bdb59-5b1d-4d68-b6bb-79cdce80c97c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":89}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119491453-ql6h4z","productId":"4a518c3d-38ca-4274-9c67-2a0dc50902d9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":89}`

### Colas finales sin pendientes inesperados iter 89/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":89}`

### D1c redelivery concurrente idempotente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119498169-euoh4k","productId":"c902296a-fe9d-453f-a7f2-9864edc20b85","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":90}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119503152-ep845h","productId":"b0f9ca94-4cde-4597-b810-fa38cba361c0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":90}`

### Colas finales sin pendientes inesperados iter 90/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":90}`

### D1c redelivery concurrente idempotente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119509214-p1hsm2","productId":"499aa8f4-b0a3-44e9-92fe-6745e22a8656","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":91}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119513143-cmxvt9","productId":"bc4603e8-812e-4b34-8d18-8a6ccab8d525","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":91}`

### Colas finales sin pendientes inesperados iter 91/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":91}`

### D1c redelivery concurrente idempotente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119520250-p6nno0","productId":"77887e61-7a91-46e5-bb8b-f97494faece3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":92}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119525327-wzuf41","productId":"47fca1a7-977b-409c-81d1-23c25ef5996c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":92}`

### Colas finales sin pendientes inesperados iter 92/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":92}`

### D1c redelivery concurrente idempotente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119532124-gayfa2","productId":"2153037b-859f-4ad9-8ea6-2f383dcc6b87","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":93}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119537155-xb3v3s","productId":"0dc6e67b-f132-49ca-9c6e-b8d4c524ae3e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":93}`

### Colas finales sin pendientes inesperados iter 93/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":93}`

### D1c redelivery concurrente idempotente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119544320-oqtuad","productId":"a2cf101b-6763-4422-a07b-39aba0796686","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":94}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119549241-s82t47","productId":"363370c3-e272-45a6-ad28-e8c14ef51d6d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":94}`

### Colas finales sin pendientes inesperados iter 94/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":94}`

### D1c redelivery concurrente idempotente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119556040-rs4yxs","productId":"2dbb1405-9b2d-461f-b33d-d48a3996d2c3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":95}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119561372-kosfz8","productId":"32adffc3-a3f0-4647-b583-afafd0fba0b0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":95}`

### Colas finales sin pendientes inesperados iter 95/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":95}`

### D1c redelivery concurrente idempotente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119568454-qo89sc","productId":"100340fd-4bf4-4b85-9a7f-4776bbab3041","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":96}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119574099-mff84t","productId":"a55ccb1e-923d-4202-bb56-e16e7da90c16","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":96}`

### Colas finales sin pendientes inesperados iter 96/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":96}`

### D1c redelivery concurrente idempotente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119582225-r4g564","productId":"9ab210d5-2de7-49cd-8ba0-a57b5bd5a117","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":97}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119587442-qypeje","productId":"efc05097-944e-4832-899d-411dba98f020","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":97}`

### Colas finales sin pendientes inesperados iter 97/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":97}`

### D1c redelivery concurrente idempotente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119594132-fucxzi","productId":"9dfa6f30-7f57-4a8b-9f71-fbe31644bbfa","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":98}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119599045-q648pz","productId":"2ddece1c-462a-4245-a14d-8fcafd87dd67","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":98}`

### Colas finales sin pendientes inesperados iter 98/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":98}`

### D1c redelivery concurrente idempotente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119606289-1sbbhn","productId":"00e9c59c-c467-466a-8de2-94e4949ed4fd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":99}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119611231-4hqd9f","productId":"abb8a4dd-d54b-4e42-8e29-e27f1c39cadb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":99}`

### Colas finales sin pendientes inesperados iter 99/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":99}`

### D1c redelivery concurrente idempotente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"pedidoId":"pedido-d1c-1780119617066-glj0to","productId":"94dad6f3-e607-41b7-93b8-8e9afa42c298","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":100}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":100,"eventId":"repo-r1-1780119621123-3tzoxr","productId":"cafa51ab-1aea-432a-b431-51b549cd6dfe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":100}`

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

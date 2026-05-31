# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-30T06:26:26.834Z
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
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121190306-xgnuu9","productId":"05b8cac8-3b23-4476-8c26-875ce1691dca","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 1/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121196199-njkv6c","productId":"2825a50a-17a3-4fef-b8d6-089125f33127","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### Colas finales sin pendientes inesperados iter 1/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

### D1c redelivery concurrente idempotente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121203469-zugpmq","productId":"c66ceb58-726e-4f56-aa42-93e604d5bcf6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":2}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 2/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121209562-qgojli","productId":"143a109d-f890-4ed2-8696-0ba4fdad6870","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":2}`

### Colas finales sin pendientes inesperados iter 2/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":2}`

### D1c redelivery concurrente idempotente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121218475-fw2muv","productId":"756cc33d-4c3e-4e85-866a-f37d5e6153c6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":3}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 3/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121224389-3x22d8","productId":"38cfb715-c3cd-4f5e-90f4-f33683e35e0c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":3}`

### Colas finales sin pendientes inesperados iter 3/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":3}`

### D1c redelivery concurrente idempotente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121231515-8m3llb","productId":"3d56a326-34bb-4c33-9ea1-c7b7e044e690","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":4}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 4/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121237062-tu4nty","productId":"5f937a82-5cee-473c-bb72-49aa8914de99","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":4}`

### Colas finales sin pendientes inesperados iter 4/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":4}`

### D1c redelivery concurrente idempotente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121244501-bkevoq","productId":"0ea021ea-ef08-473e-b0f1-c0f069ff6968","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":5}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 5/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121250142-lr4dk4","productId":"97525a78-af1b-494d-a2ef-9c81a9c886eb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":5}`

### Colas finales sin pendientes inesperados iter 5/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":5}`

### D1c redelivery concurrente idempotente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121257383-7r283e","productId":"446481ab-9b4d-4337-94d2-0fec849d5b56","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":6}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 6/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121263442-e7n7p7","productId":"14f18af5-5724-42e6-9dce-c677c5366282","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":6}`

### Colas finales sin pendientes inesperados iter 6/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":6}`

### D1c redelivery concurrente idempotente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121271471-ya21s9","productId":"2bf79c2f-96b5-497b-b433-b00226fe77a8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":7}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 7/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121277315-ntxp17","productId":"7112a1a6-386d-4177-a2c6-da33ac30076d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":7}`

### Colas finales sin pendientes inesperados iter 7/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":7}`

### D1c redelivery concurrente idempotente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121284487-0eakk9","productId":"46dc1c1e-c17b-4698-9109-c4c6ac61be9f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":8}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 8/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121289474-faavse","productId":"c300cf59-b780-40f7-80b1-b2c9c4ff3174","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":8}`

### Colas finales sin pendientes inesperados iter 8/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":8}`

### D1c redelivery concurrente idempotente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121296370-ibq01b","productId":"6fa0fb9c-9e6b-493b-bf81-6a0fcee95edc","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":9}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 9/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121302403-ean698","productId":"b68a6822-548d-4575-8568-7ad0d06dbc9c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":9}`

### Colas finales sin pendientes inesperados iter 9/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":9}`

### D1c redelivery concurrente idempotente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121309053-1ojkyh","productId":"27254ab9-e49c-4c33-aeb9-93d3725ef8f0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":10}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 10/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121314385-d5ah23","productId":"163638ec-6054-4306-b204-360a23708138","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":10}`

### Colas finales sin pendientes inesperados iter 10/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":10}`

### D1c redelivery concurrente idempotente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121321056-os1sw8","productId":"2c278934-d4a9-48c0-9775-e3978f9ffc2c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":11}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 11/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121326385-q1onqc","productId":"f063294c-e745-483a-8bac-83b33f7125d1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":11}`

### Colas finales sin pendientes inesperados iter 11/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":11}`

### D1c redelivery concurrente idempotente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121333492-eoup0a","productId":"bcabb17e-ce4d-4f5c-830e-96976b417547","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":12}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 12/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121339152-6o1p2o","productId":"6fd5f72a-0083-42d9-aa97-6db2e03780b4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":12}`

### Colas finales sin pendientes inesperados iter 12/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":12}`

### D1c redelivery concurrente idempotente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121346118-vujy0h","productId":"15001859-6907-4f24-8b83-4a404fefbf28","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":13}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 13/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121351153-fb34xs","productId":"7a8dc11f-02ff-47ce-9d3d-8fd67e386297","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":13}`

### Colas finales sin pendientes inesperados iter 13/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":13}`

### D1c redelivery concurrente idempotente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121358201-x22fft","productId":"fb0304e5-23ba-4970-95d7-abf5a0f480d2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":14}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 14/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121363345-g5xeie","productId":"1798cdea-3cf5-4308-a548-cfb3ed213197","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":14}`

### Colas finales sin pendientes inesperados iter 14/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":14}`

### D1c redelivery concurrente idempotente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121369188-yj8jn0","productId":"2d7421b5-2d0a-4302-9de8-2e2412d29478","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":15}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 15/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121374331-lfpcfl","productId":"e2ec87d6-7832-44da-86d4-150fd9919206","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":15}`

### Colas finales sin pendientes inesperados iter 15/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":15}`

### D1c redelivery concurrente idempotente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121381077-ckj1sd","productId":"c305dcc0-7635-4f8d-8f86-afb3cb85717b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":16}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 16/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121386385-83urio","productId":"d0cfd1ff-a996-4e80-b832-b08190fd0ad5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":16}`

### Colas finales sin pendientes inesperados iter 16/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":16}`

### D1c redelivery concurrente idempotente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121393308-omrxuy","productId":"f641a7d7-f938-4d19-a746-6163e18570de","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":17}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 17/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121399288-urra9m","productId":"95f9f1e5-5732-4da0-b6cd-b9947bd0b355","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":17}`

### Colas finales sin pendientes inesperados iter 17/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":17}`

### D1c redelivery concurrente idempotente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121408358-j68apc","productId":"52c73953-884d-4a3b-b243-680c3eb7213f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":18}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 18/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121414540-7tg72e","productId":"d67b1050-ac20-471d-8e36-5ca966de8f58","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":18}`

### Colas finales sin pendientes inesperados iter 18/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":18}`

### D1c redelivery concurrente idempotente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121422181-38n7u0","productId":"6b25cc1c-0f5b-4cef-8079-305d0cac5dba","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":19}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 19/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121428432-i2eonr","productId":"5d8fb1ae-095b-46c6-9ccd-13f6f90434fc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":19}`

### Colas finales sin pendientes inesperados iter 19/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":19}`

### D1c redelivery concurrente idempotente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121435056-5teqt8","productId":"85b91cc7-1d8e-4544-9e7b-1ab0e88719e1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":20}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 20/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121440407-5e7eoo","productId":"f1e29b36-ab60-46db-8085-d9381f8556bc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":20}`

### Colas finales sin pendientes inesperados iter 20/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":20}`

### D1c redelivery concurrente idempotente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121447065-kw54sl","productId":"40882a49-b59f-41cb-97c4-78c43f0f34c4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":21}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 21/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121452254-54ubdj","productId":"002d96a9-2053-4333-927b-e5bb50f73562","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":21}`

### Colas finales sin pendientes inesperados iter 21/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":21}`

### D1c redelivery concurrente idempotente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121458118-2u3ili","productId":"cf38cc16-e058-4476-817c-3d82f6ede923","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":22}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 22/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121463205-73yvri","productId":"b6931d49-ef59-4389-b5b8-9f7cc6e26e43","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":22}`

### Colas finales sin pendientes inesperados iter 22/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":22}`

### D1c redelivery concurrente idempotente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121470267-6d7glm","productId":"5692a848-d5c5-4f35-a558-cbd2bbfe53da","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":23}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 23/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121476204-vnbcyp","productId":"d73cce9e-deb0-4d92-befb-4a8c92d1f686","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":23}`

### Colas finales sin pendientes inesperados iter 23/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":23}`

### D1c redelivery concurrente idempotente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121483292-kijpir","productId":"40188f19-ca88-482c-a498-55b3b17e7258","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":24}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 24/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121488472-zguqga","productId":"8e76612d-f651-4809-8e2d-1644396d202f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":24}`

### Colas finales sin pendientes inesperados iter 24/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":24}`

### D1c redelivery concurrente idempotente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121495180-8qjto8","productId":"3a99f278-40cb-43fd-b8a1-2affb962af21","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":25}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 25/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121500252-xq89tt","productId":"29920a42-7ba6-4381-b880-4b1ea28ac945","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":25}`

### Colas finales sin pendientes inesperados iter 25/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":25}`

### D1c redelivery concurrente idempotente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121506132-yseqgl","productId":"19f34939-efd8-4558-b6c9-d3cdc78f7cb4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":26}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 26/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121511277-6n5iv7","productId":"a24ab4c1-dd72-4d4a-ac30-025f8f1f1da5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":26}`

### Colas finales sin pendientes inesperados iter 26/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":26}`

### D1c redelivery concurrente idempotente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121517456-2jwva4","productId":"8b0c8c74-d10e-4f98-b5bc-a042eca71b63","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":27}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 27/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121522261-90e4gu","productId":"4f1f37d5-536f-4eb8-baf0-b5bd18c260b7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":27}`

### Colas finales sin pendientes inesperados iter 27/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":27}`

### D1c redelivery concurrente idempotente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121528471-9jnbvx","productId":"519d6310-c2df-4e44-883d-dc896ca5eb84","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":28}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 28/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121533387-3a8322","productId":"4ea4d5ba-e258-4102-b89c-ee361ac73187","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":28}`

### Colas finales sin pendientes inesperados iter 28/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":28}`

### D1c redelivery concurrente idempotente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121540128-nvj8zl","productId":"d7d7d7bb-24b5-4293-ae21-e7d0de16f7bd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":29}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 29/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121545164-subr23","productId":"aed61f06-b71b-48ad-9e2c-40413d034a68","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":29}`

### Colas finales sin pendientes inesperados iter 29/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":29}`

### D1c redelivery concurrente idempotente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121552384-qdcy6g","productId":"daaa63dc-0a41-41e3-b58d-c46bfd0c24c7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":30}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 30/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121557061-ajr0j4","productId":"93773657-21ab-413e-be23-767cf1c86ae1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":30}`

### Colas finales sin pendientes inesperados iter 30/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":30}`

### D1c redelivery concurrente idempotente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121564380-h6xxx8","productId":"d7d2474c-c7a3-42f9-bf06-9ae7377dc2ff","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":31}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 31/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121570404-0a851a","productId":"379e5ac1-6ae5-4e41-ae40-e647cada35b2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":31}`

### Colas finales sin pendientes inesperados iter 31/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":31}`

### D1c redelivery concurrente idempotente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121577189-hag0lw","productId":"cb8a9b67-cc22-49fa-b7f3-be2d8e88180f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":32}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 32/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121582428-8qfoq1","productId":"5b0d5114-5ee3-47a8-81af-5e1240ce5100","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":32}`

### Colas finales sin pendientes inesperados iter 32/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":32}`

### D1c redelivery concurrente idempotente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121589202-4er51q","productId":"1d4ff8b9-175c-4c9d-8d26-cc51e05812be","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":33}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 33/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121595187-n2dfex","productId":"2ecfe7ec-0582-4d51-9d0a-a7231e67bc7d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":33}`

### Colas finales sin pendientes inesperados iter 33/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":33}`

### D1c redelivery concurrente idempotente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121602517-lcnwdr","productId":"b96f2c2e-91b6-4796-a4ba-336618bcb43d","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":34}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 34/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121608235-3ymsyj","productId":"0c3a0923-3a85-4c57-ac37-ffadb65fa6ca","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":34}`

### Colas finales sin pendientes inesperados iter 34/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":34}`

### D1c redelivery concurrente idempotente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121616411-qq98zk","productId":"442cf9ea-eb26-4438-8ffb-237148f915a1","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":35}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 35/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121621050-a3jlde","productId":"63d3ab0b-af2e-4fe7-88be-519c1c2197e0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":35}`

### Colas finales sin pendientes inesperados iter 35/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":35}`

### D1c redelivery concurrente idempotente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121628422-36q5an","productId":"b685f39c-d025-45b4-a5ab-6eefb3a8dd5a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":36}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 36/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121634541-lj6hdu","productId":"2b692dfe-744a-4138-afc2-f5a00a8cb7f1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":36}`

### Colas finales sin pendientes inesperados iter 36/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":36}`

### D1c redelivery concurrente idempotente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121641252-5ahwij","productId":"4c0c70e9-da7b-44b1-91df-a59e8240230a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":37}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 37/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121646413-xwinuy","productId":"8f15547e-8a98-4226-ac0a-2414b741fd90","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":37}`

### Colas finales sin pendientes inesperados iter 37/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":37}`

### D1c redelivery concurrente idempotente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121653153-dpbaoi","productId":"e598f3ab-539b-402f-b617-9f426592a028","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":38}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 38/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121658339-yazt05","productId":"247a39f8-c341-46d8-b7d8-3810e6ffcfb3","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":38}`

### Colas finales sin pendientes inesperados iter 38/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":38}`

### D1c redelivery concurrente idempotente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121664280-70fv8f","productId":"9167b5e1-4730-49f9-87ae-f53604fe3fa2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":39}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 39/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121669358-h4gq02","productId":"291fc9cb-cae4-421a-a173-1b7b47d57915","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":39}`

### Colas finales sin pendientes inesperados iter 39/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":39}`

### D1c redelivery concurrente idempotente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121676147-51d8wg","productId":"f31b68f9-9ff7-448a-a0d2-e2c6ed45de19","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":40}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 40/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121681229-nqv7rs","productId":"083fbdb5-6638-4cdb-96c1-50b8c663eb9c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":40}`

### Colas finales sin pendientes inesperados iter 40/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":40}`

### D1c redelivery concurrente idempotente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121687181-6yt3uc","productId":"80a4ebb8-a040-4920-83e4-b08c79c1dbfe","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":41}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 41/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121692256-0ag6p4","productId":"9e132e9c-7f73-4e82-81c7-e9909d52331e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":41}`

### Colas finales sin pendientes inesperados iter 41/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":41}`

### D1c redelivery concurrente idempotente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121699351-jv24li","productId":"e775cbcc-a06d-43fa-a3bb-3fc32b2a3fb0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":42}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 42/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121704034-ebu3ty","productId":"a7d6b94b-f99f-4a8c-9bd5-35d3904a51a4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":42}`

### Colas finales sin pendientes inesperados iter 42/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":42}`

### D1c redelivery concurrente idempotente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121710272-y1xrag","productId":"661fbd41-b69f-4e89-aa34-148d45b97999","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":43}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 43/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121715489-8hqm0b","productId":"9c901ef8-a4cf-4e14-be5f-f5aed5d1d845","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":43}`

### Colas finales sin pendientes inesperados iter 43/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":43}`

### D1c redelivery concurrente idempotente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121722390-9pblnd","productId":"09ce8347-8a10-4d98-be61-eef0dfb78275","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":44}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 44/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121727488-g31r0w","productId":"6c85b3fc-f931-468e-8751-1d5120cd0807","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":44}`

### Colas finales sin pendientes inesperados iter 44/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":44}`

### D1c redelivery concurrente idempotente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121734091-hstyo0","productId":"67967854-3980-4cb8-99c2-013d8a177ae6","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":45}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 45/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121739455-yzfeoj","productId":"4cead152-13b2-4002-883e-5e51b74e8aa4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":45}`

### Colas finales sin pendientes inesperados iter 45/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":45}`

### D1c redelivery concurrente idempotente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121746416-4xql6h","productId":"6e6c81cd-c827-4e44-a19f-34519bd7e068","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":46}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 46/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121751139-wwfo60","productId":"ee45b2d0-8cb3-4108-b9fa-a646d1e762c0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":46}`

### Colas finales sin pendientes inesperados iter 46/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":46}`

### D1c redelivery concurrente idempotente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121757374-0czgtd","productId":"75147ed9-8ebe-435e-9ee2-9f6f04fea274","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":47}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 47/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121762170-8npmju","productId":"92458bff-cc8f-4f4f-8aa4-9119f729d4d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":47}`

### Colas finales sin pendientes inesperados iter 47/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":47}`

### D1c redelivery concurrente idempotente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121768427-f5ds80","productId":"49b34111-3820-4e15-8ddb-c783f5d99d16","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":48}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 48/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121773379-z6gkbn","productId":"2b3e35c7-3cac-495f-90d8-7ccd94e4c021","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":48}`

### Colas finales sin pendientes inesperados iter 48/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":48}`

### D1c redelivery concurrente idempotente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121780156-frbif1","productId":"1ec81950-2664-40a3-8496-54f5d3c2b6bd","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":49}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 49/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121786418-02mdw9","productId":"f803a749-39bc-4cf7-89c5-e2b0cd1817c5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":49}`

### Colas finales sin pendientes inesperados iter 49/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":49}`

### D1c redelivery concurrente idempotente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121793137-kv0whn","productId":"596a7e33-e212-4963-a3f4-804789cb0efe","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":50}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 50/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121798080-6keqhz","productId":"cc0de581-97a1-4e95-99b3-160a893e0fe4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":50}`

### Colas finales sin pendientes inesperados iter 50/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":50}`

### D1c redelivery concurrente idempotente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121805206-s54r33","productId":"f76eb39a-05de-4474-9246-94285306e091","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":51}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 51/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121810431-trqya7","productId":"6391ed8c-3cb1-4117-9393-b954a617e109","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":51}`

### Colas finales sin pendientes inesperados iter 51/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":51}`

### D1c redelivery concurrente idempotente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121817150-7r002f","productId":"24a404ab-c213-4c00-b9ed-26493b811b10","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":52}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 52/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121822103-71l9fg","productId":"52ee646d-0a50-4a40-b8c1-bc4420effd63","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":52}`

### Colas finales sin pendientes inesperados iter 52/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":52}`

### D1c redelivery concurrente idempotente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121829205-vbqqqd","productId":"c5d9df05-de12-40dd-9f26-7c692e9b1165","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":53}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 53/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121834082-1fqc26","productId":"f3a49c69-a5f6-4028-8cdc-221a351af715","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":53}`

### Colas finales sin pendientes inesperados iter 53/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":53}`

### D1c redelivery concurrente idempotente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121841212-9umb99","productId":"eadaf4e4-4fbe-42dd-b8af-96fc894724de","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":54}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 54/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121846386-djyg7g","productId":"8d39388c-8544-406b-b755-5a1e9ad0faa9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":54}`

### Colas finales sin pendientes inesperados iter 54/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":54}`

### D1c redelivery concurrente idempotente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121853226-n9qcaf","productId":"d9591185-bb0d-4f80-aea5-5ccd08104c5c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":55}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 55/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121858415-y01qg3","productId":"e8a1e614-d7ba-49ed-84c5-974d7385cf0e","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":55}`

### Colas finales sin pendientes inesperados iter 55/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":55}`

### D1c redelivery concurrente idempotente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121865221-rqljt5","productId":"7386e212-b88b-4641-b06a-4d4572f9c871","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":56}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 56/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121870325-ch0p7v","productId":"b694cd2e-25a0-4656-888f-6f642541982d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":56}`

### Colas finales sin pendientes inesperados iter 56/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":56}`

### D1c redelivery concurrente idempotente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121877156-s35vwp","productId":"bc4867ee-2efb-4d66-b809-acf41b8cab2b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":57}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 57/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121882324-k519ip","productId":"308cb2dc-8474-4170-ae2d-8175fb90e749","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":57}`

### Colas finales sin pendientes inesperados iter 57/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":57}`

### D1c redelivery concurrente idempotente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121888103-8dxwi7","productId":"3ea72aff-e983-4f7d-8803-6dedd8489f93","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":58}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 58/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121893224-b7t7zo","productId":"29257a26-bdbe-4537-b5b3-5b54d350774f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":58}`

### Colas finales sin pendientes inesperados iter 58/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":58}`

### D1c redelivery concurrente idempotente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121899041-l8aztn","productId":"6c3d1c4f-dd54-485c-9be8-3566d91be1d9","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":59}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 59/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121904477-ba0ss1","productId":"0970ee4a-56f8-4ad1-aa11-2ec12b038d30","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":59}`

### Colas finales sin pendientes inesperados iter 59/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":59}`

### D1c redelivery concurrente idempotente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121911181-cv9zeb","productId":"7fa960e3-78d2-47ce-9c5e-48a281fe2c64","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":60}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 60/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121916345-49xig7","productId":"d8bc12f5-8f74-45df-894a-344d3abc7c13","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":60}`

### Colas finales sin pendientes inesperados iter 60/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":60}`

### D1c redelivery concurrente idempotente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121922112-wu6j2h","productId":"88ab3d57-349f-465a-b27d-ffe27d246e5c","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":61}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 61/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121927156-wuxpnu","productId":"57bda879-4168-4863-a2c3-fb9298958ac9","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":61}`

### Colas finales sin pendientes inesperados iter 61/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":61}`

### D1c redelivery concurrente idempotente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121933462-kl93mu","productId":"c09e8c99-2452-4fa9-bf04-4075a6f34526","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":62}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 62/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121938200-umkuij","productId":"81b7567a-10ee-4120-8dcd-320a8d4c7d13","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":62}`

### Colas finales sin pendientes inesperados iter 62/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":62}`

### D1c redelivery concurrente idempotente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121944054-jor3tu","productId":"98db97b6-c67c-4ca9-b595-30312d74d03a","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":63}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 63/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121949118-bvmf4a","productId":"dbe4ebec-77e0-4dbb-9894-e5fa65b1cb00","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":63}`

### Colas finales sin pendientes inesperados iter 63/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":63}`

### D1c redelivery concurrente idempotente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121955436-53pu5p","productId":"56495af8-df0e-4e40-8ee6-27974d3de0b7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":64}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 64/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121960060-zufmpj","productId":"89708f3b-dad3-406e-9458-ba4508822574","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":64}`

### Colas finales sin pendientes inesperados iter 64/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":64}`

### D1c redelivery concurrente idempotente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121966370-7qnvv2","productId":"8d54a29e-6b0f-4cc1-9cc0-9620140a7b0b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":65}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 65/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121971038-j0e05t","productId":"0b0082a9-2cb8-431b-b08b-2af826adf209","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":65}`

### Colas finales sin pendientes inesperados iter 65/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":65}`

### D1c redelivery concurrente idempotente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121977345-e9g741","productId":"18b119d9-9d4f-47a8-a49f-ac89fe858cf7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":66}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 66/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121982413-vhd4z5","productId":"bb6e0770-f8e4-41de-aaa3-7981882e309c","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":66}`

### Colas finales sin pendientes inesperados iter 66/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":66}`

### D1c redelivery concurrente idempotente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780121989108-9y6vuz","productId":"3a69f03b-52a4-4776-a9aa-7facdea38e93","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":67}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 67/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780121994362-vjqkns","productId":"36d7e200-c872-4acc-ac16-1d6a25f286d5","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":67}`

### Colas finales sin pendientes inesperados iter 67/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":67}`

### D1c redelivery concurrente idempotente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122000169-lov24w","productId":"d85c1b78-82f3-4f18-8009-b21d71907826","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":68}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 68/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122005387-2y08c4","productId":"35c90312-0234-4717-b2e4-13f4b127cd34","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":68}`

### Colas finales sin pendientes inesperados iter 68/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":68}`

### D1c redelivery concurrente idempotente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122011242-4lyy8j","productId":"3c5488c7-710a-465b-9587-ee8c98ebd3b2","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":69}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 69/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122016415-u0fe3a","productId":"6f8d016d-3032-4166-9119-cd66e37fc822","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":69}`

### Colas finales sin pendientes inesperados iter 69/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":69}`

### D1c redelivery concurrente idempotente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122023179-e2khw4","productId":"4e1bbf60-920f-472f-919e-792068671ae7","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":70}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 70/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122028399-tezwqm","productId":"0d822f8e-02e9-49b2-bdaa-3e9d7f106d06","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":70}`

### Colas finales sin pendientes inesperados iter 70/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":70}`

### D1c redelivery concurrente idempotente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122035465-d2gjgg","productId":"bed6e976-323c-4932-a011-123f7438eb7e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":71}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 71/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122040126-n2mst0","productId":"8e9fb26d-66d5-49e8-891d-2571b6dfc1dc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":71}`

### Colas finales sin pendientes inesperados iter 71/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":71}`

### D1c redelivery concurrente idempotente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122046224-mjpvr2","productId":"92c6080f-bfb8-49b5-9e83-38633ea8133b","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":72}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 72/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122051074-wijxkt","productId":"c4bc97cf-37aa-4a01-8eff-1b108f0aadfe","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":72}`

### Colas finales sin pendientes inesperados iter 72/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":72}`

### D1c redelivery concurrente idempotente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122057186-npfjug","productId":"643e5d79-f442-46e4-a8cc-5af6a5ca3a7e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":73}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 73/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122062276-9hrpcr","productId":"c0ab426e-9129-4a1b-b642-f3cf83285d1f","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":73}`

### Colas finales sin pendientes inesperados iter 73/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":73}`

### D1c redelivery concurrente idempotente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122069074-qzr5ya","productId":"f05d64b0-e9fb-490d-8f8f-b46ce6271870","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":74}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 74/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122074165-f3ar6c","productId":"e07bbacc-bf36-449b-96bd-56580adddec4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":74}`

### Colas finales sin pendientes inesperados iter 74/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":74}`

### D1c redelivery concurrente idempotente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122080446-hd74bb","productId":"b34e72d4-76ef-4963-a438-7180beb64b78","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":75}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 75/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122085236-nze8eb","productId":"aaf8bb51-a970-4ac1-804d-4833843a7eff","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":75}`

### Colas finales sin pendientes inesperados iter 75/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":75}`

### D1c redelivery concurrente idempotente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122091106-6saej2","productId":"b053742a-70bf-4d9f-8f1d-99f6218a787f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":76}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 76/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122096291-s2l1kl","productId":"8a43178f-44e2-46e6-b479-36248c5dfc64","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":76}`

### Colas finales sin pendientes inesperados iter 76/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":76}`

### D1c redelivery concurrente idempotente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122103334-ca2pd2","productId":"4debcc9a-ac20-4033-a6bb-012c91a39bb3","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":77}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 77/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122108168-3iu5ee","productId":"7184252a-270c-41fb-9fbf-dff2fda7b0f0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":77}`

### Colas finales sin pendientes inesperados iter 77/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":77}`

### D1c redelivery concurrente idempotente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122114365-vcbe9m","productId":"9d10d447-f775-4bbf-a08f-727d7551c070","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":78}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 78/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122119398-s6tmvt","productId":"72e9e981-5a34-45b6-ab52-700571fdd9d2","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":78}`

### Colas finales sin pendientes inesperados iter 78/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":78}`

### D1c redelivery concurrente idempotente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122125062-zky17t","productId":"c81acfea-040d-413f-a333-7308f69cdd31","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":79}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 79/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122129129-yf6vvm","productId":"cd76de2d-fcb7-4842-8eb3-b8f34d3e5575","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":79}`

### Colas finales sin pendientes inesperados iter 79/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":79}`

### D1c redelivery concurrente idempotente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122135228-76cvfb","productId":"498dffaa-aec2-4024-896b-dfab06dd11f8","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":80}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 80/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122140156-wzt0g4","productId":"6f4af886-0eee-4a71-a9df-e679290c7e56","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":80}`

### Colas finales sin pendientes inesperados iter 80/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":80}`

### D1c redelivery concurrente idempotente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122148209-0tanma","productId":"d8b1ccd0-d3e1-48c2-afad-0d7139bbbf66","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":81}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 81/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122153195-9uhew1","productId":"1ed1c8d0-5d7e-4b93-ab69-9b99206c71fd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":81}`

### Colas finales sin pendientes inesperados iter 81/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":81}`

### D1c redelivery concurrente idempotente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122159078-92j4hu","productId":"a9da4909-3496-404f-bf67-798db41a9193","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":82}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 82/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122164132-oz92pa","productId":"c77fe2cd-e7cb-49ee-afaa-12066cf8e005","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":82}`

### Colas finales sin pendientes inesperados iter 82/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":82}`

### D1c redelivery concurrente idempotente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122171375-tiznpg","productId":"e9fd0cb5-a3b9-42b8-a61e-7437db2d4829","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":83}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 83/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122176249-lk4j7b","productId":"5b0e53c9-6aad-409b-8dcf-a7e2fe1cf9bc","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":83}`

### Colas finales sin pendientes inesperados iter 83/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":83}`

### D1c redelivery concurrente idempotente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122183376-q5g70w","productId":"0dd62302-4be8-4e59-af1f-67b0baad963e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":84}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 84/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122188335-7x7d8m","productId":"532c7b6f-7b6c-4047-99be-1a033ed3ac02","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":84}`

### Colas finales sin pendientes inesperados iter 84/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":84}`

### D1c redelivery concurrente idempotente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122195118-fl2j02","productId":"b2c874da-f149-4bfe-b001-1ba5169b05c0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":85}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 85/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122201475-nggcn8","productId":"33da17cb-2ac2-4769-a835-288dbbffe331","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":85}`

### Colas finales sin pendientes inesperados iter 85/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":85}`

### D1c redelivery concurrente idempotente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122208212-q0zstm","productId":"972be584-edd9-4a42-9e7f-313e31df2f1f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":86}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 86/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122213439-rt8b00","productId":"9d41ef5c-83aa-4df2-b9e0-ac042b8cab72","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":86}`

### Colas finales sin pendientes inesperados iter 86/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":86}`

### D1c redelivery concurrente idempotente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122219172-ikbbhh","productId":"577c9670-6287-41d1-becf-1eeabe110e51","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":87}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 87/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122224244-q6q5rn","productId":"8705cab4-94ab-4f3b-bd5d-2c27e16b20f7","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":87}`

### Colas finales sin pendientes inesperados iter 87/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":87}`

### D1c redelivery concurrente idempotente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122230330-h9ogks","productId":"02a28a70-6faf-43ca-bb6f-4f61dcd960fb","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":88}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 88/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122235363-twkak4","productId":"14ab4e40-25b8-489b-84dd-40bcd9f4e417","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":88}`

### Colas finales sin pendientes inesperados iter 88/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":88}`

### D1c redelivery concurrente idempotente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122242059-fhfmbs","productId":"a8437cb4-6af5-4309-b739-7182ef291cf4","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":89}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 89/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122247056-43bmnm","productId":"e40fb497-fa28-4b0f-9bd7-51ef943c7420","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":89}`

### Colas finales sin pendientes inesperados iter 89/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":89}`

### D1c redelivery concurrente idempotente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122253287-yzu8tg","productId":"6358a52e-032a-49f6-804c-aa0cafe3441f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":90}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 90/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122258267-iudbd8","productId":"e346090e-1262-4746-ab95-d92a294610e1","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":90}`

### Colas finales sin pendientes inesperados iter 90/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":90}`

### D1c redelivery concurrente idempotente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122265339-ez1577","productId":"55f72e92-59fb-4fe3-bf00-1a1ea57d5614","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":91}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 91/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122270291-w5uf6g","productId":"cc7c2073-2664-437e-8500-41b02c7000e0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":91}`

### Colas finales sin pendientes inesperados iter 91/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":91}`

### D1c redelivery concurrente idempotente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122277045-pr2ct8","productId":"11896619-b8be-474a-a05e-79cf6feee1e5","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":92}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 92/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122282291-jmaljk","productId":"eb885656-c606-4e8d-999f-7cb2bbf15be4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":92}`

### Colas finales sin pendientes inesperados iter 92/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":92}`

### D1c redelivery concurrente idempotente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122288233-fhkjkf","productId":"9fb8eb3d-6460-45a1-bb3a-d4afcc4c3d52","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":93}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 93/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122293380-qqzjvt","productId":"b3df8985-d86e-400a-8428-801c8e04565b","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":93}`

### Colas finales sin pendientes inesperados iter 93/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":93}`

### D1c redelivery concurrente idempotente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122300199-e04n65","productId":"0bcbd28e-deaa-4e2d-bcc7-8c140c338474","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":94}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 94/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122305448-6epenq","productId":"384a0ba7-5772-4f77-8eed-8bae3e48a2fb","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":94}`

### Colas finales sin pendientes inesperados iter 94/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":94}`

### D1c redelivery concurrente idempotente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122312197-ue3422","productId":"a1987b6a-64c2-4b5f-b08a-1db8cc2d453f","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":95}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 95/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122317447-u6cjbb","productId":"70de50ac-b558-4921-b07d-011a791119e4","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":95}`

### Colas finales sin pendientes inesperados iter 95/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":95}`

### D1c redelivery concurrente idempotente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122324509-35iqnd","productId":"1d3f4a12-6e8b-4714-a2ea-7ad10bc61393","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":96}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 96/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122330117-uxv3yk","productId":"266ede31-41a9-42cf-b2b7-cd6830021fc8","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":96}`

### Colas finales sin pendientes inesperados iter 96/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":96}`

### D1c redelivery concurrente idempotente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122337322-be2dlc","productId":"463ce314-c704-4bec-a8b0-627747071138","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":97}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 97/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122343189-fy7790","productId":"bfe50765-93a3-4e56-b113-762335e400ab","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":97}`

### Colas finales sin pendientes inesperados iter 97/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":97}`

### D1c redelivery concurrente idempotente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122350277-js8n65","productId":"e577b4ae-bccf-4825-99f1-e2d9b56ffe02","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":98}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 98/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122355346-fef5yh","productId":"5dba5f16-43d0-477c-ba01-45aebcddc92d","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":98}`

### Colas finales sin pendientes inesperados iter 98/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":98}`

### D1c redelivery concurrente idempotente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122362296-5xylc1","productId":"0bbe270a-0c58-4d5e-bca8-51756f88a9d0","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":99}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 99/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122367174-5iynia","productId":"06ec866b-6047-4040-af51-420ecb870672","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":99}`

### Colas finales sin pendientes inesperados iter 99/100

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":99}`

### D1c redelivery concurrente idempotente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"pedidoId":"pedido-d1c-1780122374252-zuwea6","productId":"b3bd37db-eee9-4596-8e4f-2a237d58672e","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":100}`

### R1 reposicion inversa idempotente secuencial y concurrente iter 100/100

- Invariante: OK
- Detalle: `{"duplicateCount":200,"eventId":"repo-r1-1780122379319-rc4j3t","productId":"3e72ac2f-fde8-43e5-bed9-3d3f068e94e0","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":100}`

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

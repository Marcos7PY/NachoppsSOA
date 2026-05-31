# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-30T23:44:10.714Z
- Base URL: http://localhost:8000
- Rama: codex/stock-idempotency-dlq
- Commit: bfd9ff0 Merge pull request #4 from Marcos7PY/codex/security-and-limit-tests
- Concurrencia base: 200
- Iteraciones: 100
- Resultado: 300/300 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/100 | OK | 200 | {"201":1,"400":199} | 2813ms | 67.96 |
| C6 stock compartido iter 1/100 | OK | 240 | {"201":200,"400":40} | 3176ms | 72.88 |
| C7 reservas mismo slot iter 1/100 | OK | 200 | {"201":1,"409":199} | 1115ms | 171.09 |
| C5 pago duplicado concurrente iter 2/100 | OK | 200 | {"201":1,"400":193,"502":6} | 2092ms | 91.49 |
| C6 stock compartido iter 2/100 | OK | 240 | {"201":200,"400":40} | 3224ms | 72.07 |
| C7 reservas mismo slot iter 2/100 | OK | 200 | {"201":1,"409":199} | 1037ms | 185.01 |
| C5 pago duplicado concurrente iter 3/100 | OK | 200 | {"0":13,"201":1,"400":186} | 60005ms | 3.33 |
| C6 stock compartido iter 3/100 | OK | 240 | {"201":200,"400":40} | 2813ms | 82.64 |
| C7 reservas mismo slot iter 3/100 | OK | 200 | {"201":1,"409":199} | 1165ms | 165.02 |
| C5 pago duplicado concurrente iter 4/100 | OK | 200 | {"0":3,"201":1,"400":191,"502":5} | 1746ms | 3.33 |
| C6 stock compartido iter 4/100 | OK | 240 | {"201":200,"400":40} | 2997ms | 77.82 |
| C7 reservas mismo slot iter 4/100 | OK | 200 | {"201":1,"409":199} | 995ms | 192.86 |
| C5 pago duplicado concurrente iter 5/100 | OK | 200 | {"201":1,"400":199} | 2019ms | 94.83 |
| C6 stock compartido iter 5/100 | OK | 240 | {"201":200,"400":40} | 2858ms | 80.89 |
| C7 reservas mismo slot iter 5/100 | OK | 200 | {"201":1,"409":199} | 807ms | 237.53 |
| C5 pago duplicado concurrente iter 6/100 | OK | 200 | {"201":1,"400":199} | 1953ms | 99.01 |
| C6 stock compartido iter 6/100 | OK | 240 | {"201":200,"400":40} | 2933ms | 80.16 |
| C7 reservas mismo slot iter 6/100 | OK | 200 | {"201":1,"409":199} | 705ms | 271 |
| C5 pago duplicado concurrente iter 7/100 | OK | 200 | {"201":1,"400":199} | 1944ms | 99.26 |
| C6 stock compartido iter 7/100 | OK | 240 | {"201":200,"400":40} | 2848ms | 81.8 |
| C7 reservas mismo slot iter 7/100 | OK | 200 | {"201":1,"409":199} | 1229ms | 156.37 |
| C5 pago duplicado concurrente iter 8/100 | OK | 200 | {"201":1,"400":199} | 1960ms | 98.47 |
| C6 stock compartido iter 8/100 | OK | 240 | {"201":200,"400":40} | 2776ms | 84.36 |
| C7 reservas mismo slot iter 8/100 | OK | 200 | {"201":1,"409":199} | 885ms | 10.18 |
| C5 pago duplicado concurrente iter 9/100 | OK | 200 | {"201":1,"400":199} | 2139ms | 90.58 |
| C6 stock compartido iter 9/100 | OK | 240 | {"201":200,"400":40} | 2772ms | 83.25 |
| C7 reservas mismo slot iter 9/100 | OK | 200 | {"201":1,"409":199} | 782ms | 244.8 |
| C5 pago duplicado concurrente iter 10/100 | OK | 200 | {"201":1,"400":199} | 2157ms | 90.09 |
| C6 stock compartido iter 10/100 | OK | 240 | {"201":200,"400":40} | 2937ms | 79.84 |
| C7 reservas mismo slot iter 10/100 | OK | 200 | {"201":1,"409":199} | 972ms | 197.43 |
| C5 pago duplicado concurrente iter 11/100 | OK | 200 | {"201":1,"400":190,"502":9} | 2057ms | 93.46 |
| C6 stock compartido iter 11/100 | OK | 240 | {"201":200,"400":40} | 3077ms | 74.93 |
| C7 reservas mismo slot iter 11/100 | OK | 200 | {"201":1,"409":199} | 1054ms | 182.32 |
| C5 pago duplicado concurrente iter 12/100 | OK | 200 | {"201":1,"400":193,"502":6} | 19562ms | 10.18 |
| C6 stock compartido iter 12/100 | OK | 240 | {"201":200,"400":40} | 3108ms | 75.47 |
| C7 reservas mismo slot iter 12/100 | OK | 200 | {"201":1,"409":199} | 1012ms | 190.29 |
| C5 pago duplicado concurrente iter 13/100 | OK | 200 | {"201":1,"400":197,"502":2} | 1774ms | 108.05 |
| C6 stock compartido iter 13/100 | OK | 240 | {"201":200,"400":40} | 3429ms | 68.09 |
| C7 reservas mismo slot iter 13/100 | OK | 200 | {"201":1,"409":199} | 1271ms | 152.32 |
| C5 pago duplicado concurrente iter 14/100 | OK | 200 | {"201":1,"400":199} | 20038ms | 9.93 |
| C6 stock compartido iter 14/100 | OK | 240 | {"201":200,"400":40} | 3629ms | 64.53 |
| C7 reservas mismo slot iter 14/100 | OK | 200 | {"201":1,"409":199} | 1388ms | 140.15 |
| C5 pago duplicado concurrente iter 15/100 | OK | 200 | {"0":9,"201":1,"400":189,"502":1} | 11277ms | 3.33 |
| C6 stock compartido iter 15/100 | OK | 240 | {"201":200,"400":40} | 3181ms | 72.68 |
| C7 reservas mismo slot iter 15/100 | OK | 200 | {"201":1,"409":199} | 1508ms | 127.47 |
| C5 pago duplicado concurrente iter 16/100 | OK | 200 | {"201":1,"400":199} | 2264ms | 84.93 |
| C6 stock compartido iter 16/100 | OK | 240 | {"201":200,"400":40} | 3691ms | 63.29 |
| C7 reservas mismo slot iter 16/100 | OK | 200 | {"201":1,"409":199} | 1016ms | 189.21 |
| C5 pago duplicado concurrente iter 17/100 | OK | 200 | {"201":1,"400":199} | 2300ms | 83.58 |
| C6 stock compartido iter 17/100 | OK | 240 | {"201":200,"400":40} | 3016ms | 77.44 |
| C7 reservas mismo slot iter 17/100 | OK | 200 | {"201":1,"409":199} | 1398ms | 136.15 |
| C5 pago duplicado concurrente iter 18/100 | OK | 200 | {"201":1,"400":192,"502":7} | 2036ms | 94.92 |
| C6 stock compartido iter 18/100 | OK | 240 | {"201":200,"400":40} | 3434ms | 67.66 |
| C7 reservas mismo slot iter 18/100 | OK | 200 | {"201":1,"409":199} | 1243ms | 155.52 |
| C5 pago duplicado concurrente iter 19/100 | OK | 200 | {"201":1,"400":199} | 2425ms | 79.62 |
| C6 stock compartido iter 19/100 | OK | 240 | {"201":200,"400":40} | 3180ms | 6.67 |
| C7 reservas mismo slot iter 19/100 | OK | 200 | {"201":1,"409":199} | 1150ms | 167.36 |
| C5 pago duplicado concurrente iter 20/100 | OK | 200 | {"201":1,"400":199} | 2157ms | 87.8 |
| C6 stock compartido iter 20/100 | OK | 240 | {"201":200,"400":40} | 3309ms | 69.42 |
| C7 reservas mismo slot iter 20/100 | OK | 200 | {"201":1,"409":199} | 888ms | 216.22 |
| C5 pago duplicado concurrente iter 21/100 | OK | 200 | {"201":1,"400":199} | 2090ms | 91.58 |
| C6 stock compartido iter 21/100 | OK | 240 | {"201":200,"400":40} | 3409ms | 68.03 |
| C7 reservas mismo slot iter 21/100 | OK | 200 | {"201":1,"409":199} | 1286ms | 149.59 |
| C5 pago duplicado concurrente iter 22/100 | OK | 200 | {"201":1,"400":194,"502":5} | 2103ms | 90.5 |
| C6 stock compartido iter 22/100 | OK | 240 | {"201":200,"400":40} | 4718ms | 48.7 |
| C7 reservas mismo slot iter 22/100 | OK | 200 | {"201":1,"409":199} | 1946ms | 100.4 |
| C5 pago duplicado concurrente iter 23/100 | OK | 200 | {"201":1,"400":199} | 4433ms | 44.26 |
| C6 stock compartido iter 23/100 | OK | 240 | {"201":200,"400":40} | 4619ms | 50.73 |
| C7 reservas mismo slot iter 23/100 | OK | 200 | {"201":1,"409":199} | 1646ms | 116.89 |
| C5 pago duplicado concurrente iter 24/100 | OK | 200 | {"201":1,"400":199} | 2439ms | 78.93 |
| C6 stock compartido iter 24/100 | OK | 240 | {"201":200,"400":40} | 3517ms | 66.23 |
| C7 reservas mismo slot iter 24/100 | OK | 200 | {"201":1,"409":199} | 1445ms | 17.68 |
| C5 pago duplicado concurrente iter 25/100 | OK | 200 | {"201":1,"400":199} | 2659ms | 72.36 |
| C6 stock compartido iter 25/100 | OK | 240 | {"201":200,"400":40} | 3533ms | 65.79 |
| C7 reservas mismo slot iter 25/100 | OK | 200 | {"201":1,"409":199} | 1131ms | 169.78 |
| C5 pago duplicado concurrente iter 26/100 | OK | 200 | {"201":1,"400":193,"502":6} | 2419ms | 79.74 |
| C6 stock compartido iter 26/100 | OK | 240 | {"201":200,"400":40} | 3318ms | 69.22 |
| C7 reservas mismo slot iter 26/100 | OK | 200 | {"201":1,"409":199} | 1220ms | 157.98 |
| C5 pago duplicado concurrente iter 27/100 | OK | 200 | {"201":1,"400":199} | 2510ms | 76.8 |
| C6 stock compartido iter 27/100 | OK | 240 | {"201":200,"400":40} | 3260ms | 70.88 |
| C7 reservas mismo slot iter 27/100 | OK | 200 | {"201":1,"409":199} | 967ms | 200.4 |
| C5 pago duplicado concurrente iter 28/100 | OK | 200 | {"201":1,"400":199} | 2474ms | 77.34 |
| C6 stock compartido iter 28/100 | OK | 240 | {"201":200,"400":40} | 3906ms | 60 |
| C7 reservas mismo slot iter 28/100 | OK | 200 | {"201":1,"409":199} | 1441ms | 132.19 |
| C5 pago duplicado concurrente iter 29/100 | OK | 200 | {"201":1,"400":199} | 2596ms | 74.79 |
| C6 stock compartido iter 29/100 | OK | 240 | {"201":200,"400":40} | 3601ms | 64.78 |
| C7 reservas mismo slot iter 29/100 | OK | 200 | {"201":1,"409":199} | 1209ms | 159.62 |
| C5 pago duplicado concurrente iter 30/100 | OK | 200 | {"201":1,"400":199} | 11622ms | 10.15 |
| C6 stock compartido iter 30/100 | OK | 240 | {"201":200,"400":40} | 3719ms | 62.32 |
| C7 reservas mismo slot iter 30/100 | OK | 200 | {"201":1,"409":199} | 1353ms | 142.45 |
| C5 pago duplicado concurrente iter 31/100 | OK | 200 | {"201":1,"400":191,"502":8} | 2416ms | 79.87 |
| C6 stock compartido iter 31/100 | OK | 240 | {"201":200,"400":40} | 3829ms | 61.35 |
| C7 reservas mismo slot iter 31/100 | OK | 200 | {"201":1,"409":199} | 2038ms | 94.21 |
| C5 pago duplicado concurrente iter 32/100 | OK | 200 | {"201":1,"400":166,"500":33} | 3357ms | 14.92 |
| C6 stock compartido iter 32/100 | OK | 240 | {"201":200,"400":40} | 4158ms | 55.78 |
| C7 reservas mismo slot iter 32/100 | OK | 200 | {"201":1,"409":199} | 1236ms | 156.37 |
| C5 pago duplicado concurrente iter 33/100 | OK | 200 | {"201":1,"400":199} | 2288ms | 84.42 |
| C6 stock compartido iter 33/100 | OK | 240 | {"201":200,"400":40} | 3313ms | 70.24 |
| C7 reservas mismo slot iter 33/100 | OK | 200 | {"201":1,"409":199} | 1312ms | 147.49 |
| C5 pago duplicado concurrente iter 34/100 | OK | 200 | {"201":1,"400":199} | 2494ms | 77.52 |
| C6 stock compartido iter 34/100 | OK | 240 | {"201":200,"400":40} | 19694ms | 12.16 |
| C7 reservas mismo slot iter 34/100 | OK | 200 | {"201":1,"409":199} | 1928ms | 99.55 |
| C5 pago duplicado concurrente iter 35/100 | OK | 200 | {"201":1,"400":199} | 2486ms | 76.98 |
| C6 stock compartido iter 35/100 | OK | 240 | {"201":200,"400":40} | 3189ms | 12.2 |
| C7 reservas mismo slot iter 35/100 | OK | 200 | {"201":1,"409":199} | 1136ms | 170.5 |
| C5 pago duplicado concurrente iter 36/100 | OK | 200 | {"201":1,"400":180,"502":19} | 1888ms | 98.52 |
| C6 stock compartido iter 36/100 | OK | 240 | {"201":200,"400":40} | 3353ms | 69.59 |
| C7 reservas mismo slot iter 36/100 | OK | 200 | {"201":1,"409":199} | 1383ms | 138.03 |
| C5 pago duplicado concurrente iter 37/100 | OK | 200 | {"201":1,"400":199} | 2607ms | 74.05 |
| C6 stock compartido iter 37/100 | OK | 240 | {"201":200,"400":40} | 3387ms | 68.14 |
| C7 reservas mismo slot iter 37/100 | OK | 200 | {"201":1,"409":199} | 856ms | 219.3 |
| C5 pago duplicado concurrente iter 38/100 | OK | 200 | {"201":1,"400":199} | 2085ms | 89.93 |
| C6 stock compartido iter 38/100 | OK | 240 | {"201":200,"400":40} | 4733ms | 48.54 |
| C7 reservas mismo slot iter 38/100 | OK | 200 | {"201":1,"409":199} | 1635ms | 117.3 |
| C5 pago duplicado concurrente iter 39/100 | OK | 200 | {"201":1,"400":199} | 3665ms | 26.98 |
| C6 stock compartido iter 39/100 | OK | 240 | {"201":200,"400":40} | 5761ms | 40.67 |
| C7 reservas mismo slot iter 39/100 | OK | 200 | {"201":1,"409":199} | 2236ms | 84.93 |
| C5 pago duplicado concurrente iter 40/100 | OK | 200 | {"0":6,"201":1,"400":159,"500":34} | 3073ms | 3.33 |
| C6 stock compartido iter 40/100 | OK | 240 | {"201":200,"400":40} | 3309ms | 69.59 |
| C7 reservas mismo slot iter 40/100 | OK | 200 | {"201":1,"409":199} | 1086ms | 176.06 |
| C5 pago duplicado concurrente iter 41/100 | OK | 200 | {"0":13,"201":1,"400":182,"502":4} | 30099ms | 6.64 |
| C6 stock compartido iter 41/100 | OK | 240 | {"201":200,"400":40} | 3885ms | 60.09 |
| C7 reservas mismo slot iter 41/100 | OK | 200 | {"201":1,"409":199} | 883ms | 214.36 |
| C5 pago duplicado concurrente iter 42/100 | OK | 200 | {"201":1,"400":199} | 2081ms | 92.85 |
| C6 stock compartido iter 42/100 | OK | 240 | {"201":200,"400":40} | 3204ms | 72.53 |
| C7 reservas mismo slot iter 42/100 | OK | 200 | {"201":1,"409":199} | 726ms | 261.1 |
| C5 pago duplicado concurrente iter 43/100 | OK | 200 | {"201":1,"400":199} | 1863ms | 100.91 |
| C6 stock compartido iter 43/100 | OK | 240 | {"201":200,"400":40} | 4362ms | 53.31 |
| C7 reservas mismo slot iter 43/100 | OK | 200 | {"201":1,"409":199} | 804ms | 238.38 |
| C5 pago duplicado concurrente iter 44/100 | OK | 200 | {"201":1,"400":199} | 2036ms | 93.07 |
| C6 stock compartido iter 44/100 | OK | 240 | {"201":200,"400":20,"500":20} | 3786ms | 59.36 |
| C7 reservas mismo slot iter 44/100 | OK | 200 | {"201":1,"409":199} | 1314ms | 146.63 |
| C5 pago duplicado concurrente iter 45/100 | OK | 200 | {"201":1,"400":199} | 2187ms | 88.11 |
| C6 stock compartido iter 45/100 | OK | 240 | {"201":200,"400":40} | 3493ms | 66.43 |
| C7 reservas mismo slot iter 45/100 | OK | 200 | {"201":1,"409":199} | 1386ms | 141.04 |
| C5 pago duplicado concurrente iter 46/100 | OK | 200 | {"201":1,"400":199} | 2143ms | 89.17 |
| C6 stock compartido iter 46/100 | OK | 240 | {"201":200,"400":40} | 3563ms | 65.13 |
| C7 reservas mismo slot iter 46/100 | OK | 200 | {"201":1,"409":199} | 1598ms | 121.07 |
| C5 pago duplicado concurrente iter 47/100 | OK | 200 | {"201":1,"400":199} | 1954ms | 98.14 |
| C6 stock compartido iter 47/100 | OK | 240 | {"201":200,"400":40} | 4228ms | 54.08 |
| C7 reservas mismo slot iter 47/100 | OK | 200 | {"201":1,"409":199} | 1347ms | 142.05 |
| C5 pago duplicado concurrente iter 48/100 | OK | 200 | {"201":1,"400":196,"502":3} | 2809ms | 68.78 |
| C6 stock compartido iter 48/100 | OK | 240 | {"201":200,"400":40} | 3574ms | 65.45 |
| C7 reservas mismo slot iter 48/100 | OK | 200 | {"201":1,"409":199} | 1145ms | 164.34 |
| C5 pago duplicado concurrente iter 49/100 | OK | 200 | {"201":1,"400":199} | 2653ms | 72.86 |
| C6 stock compartido iter 49/100 | OK | 240 | {"201":200,"400":40} | 4059ms | 57.58 |
| C7 reservas mismo slot iter 49/100 | OK | 200 | {"201":1,"409":199} | 1389ms | 137.84 |
| C5 pago duplicado concurrente iter 50/100 | OK | 200 | {"201":1,"400":199} | 7535ms | 17.08 |
| C6 stock compartido iter 50/100 | OK | 240 | {"201":200,"400":40} | 3115ms | 74.88 |
| C7 reservas mismo slot iter 50/100 | OK | 200 | {"201":1,"409":199} | 1188ms | 159.74 |
| C5 pago duplicado concurrente iter 51/100 | OK | 200 | {"201":1,"400":197,"502":2} | 2805ms | 68.97 |
| C6 stock compartido iter 51/100 | OK | 240 | {"201":200,"400":40} | 3864ms | 60.88 |
| C7 reservas mismo slot iter 51/100 | OK | 200 | {"201":1,"409":199} | 1436ms | 134.95 |
| C5 pago duplicado concurrente iter 52/100 | OK | 200 | {"201":1,"400":199} | 2572ms | 74.32 |
| C6 stock compartido iter 52/100 | OK | 240 | {"201":200,"400":40} | 11634ms | 12.14 |
| C7 reservas mismo slot iter 52/100 | OK | 200 | {"201":1,"409":199} | 1050ms | 182.98 |
| C5 pago duplicado concurrente iter 53/100 | OK | 200 | {"201":1,"400":199} | 2924ms | 66.45 |
| C6 stock compartido iter 53/100 | OK | 240 | {"201":200,"400":40} | 2731ms | 85.62 |
| C7 reservas mismo slot iter 53/100 | OK | 200 | {"201":1,"409":199} | 1108ms | 173.01 |
| C5 pago duplicado concurrente iter 54/100 | OK | 200 | {"201":1,"400":199} | 2053ms | 93.94 |
| C6 stock compartido iter 54/100 | OK | 240 | {"201":200,"400":40} | 3102ms | 75.09 |
| C7 reservas mismo slot iter 54/100 | OK | 200 | {"201":1,"409":199} | 11377ms | 17.16 |
| C5 pago duplicado concurrente iter 55/100 | OK | 200 | {"0":15,"201":1,"400":184} | 60010ms | 3.33 |
| C6 stock compartido iter 55/100 | OK | 240 | {"201":200,"400":40} | 4019ms | 58.06 |
| C7 reservas mismo slot iter 55/100 | OK | 200 | {"201":1,"409":199} | 1849ms | 103.73 |
| C5 pago duplicado concurrente iter 56/100 | OK | 200 | {"201":1,"400":199} | 2797ms | 65.68 |
| C6 stock compartido iter 56/100 | OK | 240 | {"201":200,"400":40} | 3717ms | 61.95 |
| C7 reservas mismo slot iter 56/100 | OK | 200 | {"201":1,"409":199} | 1310ms | 146.2 |
| C5 pago duplicado concurrente iter 57/100 | OK | 200 | {"201":1,"400":199} | 2118ms | 91.53 |
| C6 stock compartido iter 57/100 | OK | 240 | {"201":200,"400":40} | 3684ms | 63.09 |
| C7 reservas mismo slot iter 57/100 | OK | 200 | {"201":1,"409":199} | 1248ms | 154.92 |
| C5 pago duplicado concurrente iter 58/100 | OK | 200 | {"201":1,"400":199} | 2464ms | 77.34 |
| C6 stock compartido iter 58/100 | OK | 240 | {"201":200,"400":40} | 3939ms | 59.23 |
| C7 reservas mismo slot iter 58/100 | OK | 200 | {"201":1,"409":199} | 996ms | 191.57 |
| C5 pago duplicado concurrente iter 59/100 | OK | 200 | {"201":1,"400":199} | 2143ms | 89.41 |
| C6 stock compartido iter 59/100 | OK | 240 | {"201":200,"400":40} | 3236ms | 72.33 |
| C7 reservas mismo slot iter 59/100 | OK | 200 | {"201":1,"409":199} | 1322ms | 145.99 |
| C5 pago duplicado concurrente iter 60/100 | OK | 200 | {"201":1,"400":199} | 2171ms | 87.87 |
| C6 stock compartido iter 60/100 | OK | 240 | {"201":200,"400":40} | 3120ms | 73.73 |
| C7 reservas mismo slot iter 60/100 | OK | 200 | {"201":1,"409":199} | 944ms | 204.08 |
| C5 pago duplicado concurrente iter 61/100 | OK | 200 | {"0":20,"201":1,"400":174,"502":5} | 30089ms | 6.64 |
| C6 stock compartido iter 61/100 | OK | 240 | {"201":200,"400":40} | 3307ms | 69.71 |
| C7 reservas mismo slot iter 61/100 | OK | 200 | {"201":1,"409":199} | 935ms | 204.5 |
| C5 pago duplicado concurrente iter 62/100 | OK | 200 | {"201":1,"400":199} | 2337ms | 82.64 |
| C6 stock compartido iter 62/100 | OK | 240 | {"201":200,"400":40} | 3160ms | 73.98 |
| C7 reservas mismo slot iter 62/100 | OK | 200 | {"201":1,"409":199} | 1138ms | 166.53 |
| C5 pago duplicado concurrente iter 63/100 | OK | 200 | {"201":1,"400":199} | 2280ms | 84.35 |
| C6 stock compartido iter 63/100 | OK | 240 | {"201":200,"400":40} | 3149ms | 74.42 |
| C7 reservas mismo slot iter 63/100 | OK | 200 | {"201":1,"409":199} | 796ms | 239.52 |
| C5 pago duplicado concurrente iter 64/100 | OK | 200 | {"201":1,"400":199} | 1990ms | 96.9 |
| C6 stock compartido iter 64/100 | OK | 240 | {"201":200,"400":40} | 2769ms | 6.72 |
| C7 reservas mismo slot iter 64/100 | OK | 200 | {"201":1,"409":199} | 1427ms | 134.77 |
| C5 pago duplicado concurrente iter 65/100 | OK | 200 | {"201":1,"400":191,"502":8} | 2350ms | 81.9 |
| C6 stock compartido iter 65/100 | OK | 240 | {"201":200,"400":40} | 3507ms | 65.7 |
| C7 reservas mismo slot iter 65/100 | OK | 200 | {"201":1,"409":199} | 1126ms | 169.49 |
| C5 pago duplicado concurrente iter 66/100 | OK | 200 | {"201":1,"400":199} | 2187ms | 88.61 |
| C6 stock compartido iter 66/100 | OK | 240 | {"201":200,"400":40} | 3352ms | 69.65 |
| C7 reservas mismo slot iter 66/100 | OK | 200 | {"201":1,"409":199} | 971ms | 194.55 |
| C5 pago duplicado concurrente iter 67/100 | OK | 200 | {"201":1,"400":199} | 2263ms | 85.65 |
| C6 stock compartido iter 67/100 | OK | 240 | {"201":200,"400":40} | 3304ms | 71.07 |
| C7 reservas mismo slot iter 67/100 | OK | 200 | {"201":1,"409":199} | 1224ms | 157.48 |
| C5 pago duplicado concurrente iter 68/100 | OK | 200 | {"201":1,"400":198,"502":1} | 2318ms | 83.61 |
| C6 stock compartido iter 68/100 | OK | 240 | {"201":200,"400":40} | 3442ms | 67.97 |
| C7 reservas mismo slot iter 68/100 | OK | 200 | {"201":1,"409":199} | 1183ms | 162.6 |
| C5 pago duplicado concurrente iter 69/100 | OK | 200 | {"201":1,"400":199} | 2295ms | 83.65 |
| C6 stock compartido iter 69/100 | OK | 240 | {"201":200,"400":40} | 19855ms | 12.06 |
| C7 reservas mismo slot iter 69/100 | OK | 200 | {"201":1,"409":199} | 984ms | 193.61 |
| C5 pago duplicado concurrente iter 70/100 | OK | 200 | {"201":1,"400":198,"502":1} | 2448ms | 78.28 |
| C6 stock compartido iter 70/100 | OK | 240 | {"201":200,"400":40} | 3268ms | 71.62 |
| C7 reservas mismo slot iter 70/100 | OK | 200 | {"201":1,"409":199} | 1029ms | 185.01 |
| C5 pago duplicado concurrente iter 71/100 | OK | 200 | {"201":1,"400":199} | 19734ms | 10.09 |
| C6 stock compartido iter 71/100 | OK | 240 | {"201":200,"400":40} | 3442ms | 67.68 |
| C7 reservas mismo slot iter 71/100 | OK | 200 | {"201":1,"409":199} | 1804ms | 107.12 |
| C5 pago duplicado concurrente iter 72/100 | OK | 200 | {"201":1,"400":199} | 2145ms | 89.09 |
| C6 stock compartido iter 72/100 | OK | 240 | {"201":200,"400":40} | 3505ms | 67 |
| C7 reservas mismo slot iter 72/100 | OK | 200 | {"201":1,"409":199} | 805ms | 236.13 |
| C5 pago duplicado concurrente iter 73/100 | OK | 200 | {"201":1,"400":199} | 2125ms | 90.74 |
| C6 stock compartido iter 73/100 | OK | 240 | {"201":200,"400":40} | 3264ms | 71.2 |
| C7 reservas mismo slot iter 73/100 | OK | 200 | {"201":1,"409":199} | 1233ms | 154.2 |
| C5 pago duplicado concurrente iter 74/100 | OK | 200 | {"201":1,"400":199} | 2136ms | 90.25 |
| C6 stock compartido iter 74/100 | OK | 240 | {"201":200,"400":40} | 3397ms | 68.51 |
| C7 reservas mismo slot iter 74/100 | OK | 200 | {"201":1,"409":199} | 11323ms | 17.32 |
| C5 pago duplicado concurrente iter 75/100 | OK | 200 | {"201":1,"400":199} | 2241ms | 81.14 |
| C6 stock compartido iter 75/100 | OK | 240 | {"201":200,"400":40} | 3269ms | 71.36 |
| C7 reservas mismo slot iter 75/100 | OK | 200 | {"201":1,"409":199} | 1109ms | 173.76 |
| C5 pago duplicado concurrente iter 76/100 | OK | 200 | {"201":1,"400":199} | 2075ms | 93.07 |
| C6 stock compartido iter 76/100 | OK | 240 | {"201":200,"400":40} | 3035ms | 76.02 |
| C7 reservas mismo slot iter 76/100 | OK | 200 | {"201":1,"409":199} | 19683ms | 10.14 |
| C5 pago duplicado concurrente iter 77/100 | OK | 200 | {"201":1,"400":199} | 2209ms | 86.81 |
| C6 stock compartido iter 77/100 | OK | 240 | {"201":200,"400":40} | 3192ms | 73.13 |
| C7 reservas mismo slot iter 77/100 | OK | 200 | {"201":1,"409":199} | 1040ms | 10.24 |
| C5 pago duplicado concurrente iter 78/100 | OK | 200 | {"0":4,"201":1,"400":195} | 2271ms | 3.33 |
| C6 stock compartido iter 78/100 | OK | 240 | {"201":200,"400":40} | 2810ms | 82.73 |
| C7 reservas mismo slot iter 78/100 | OK | 200 | {"201":1,"409":199} | 1133ms | 169.92 |
| C5 pago duplicado concurrente iter 79/100 | OK | 200 | {"201":1,"400":199} | 2016ms | 95.6 |
| C6 stock compartido iter 79/100 | OK | 240 | {"201":200,"400":40} | 2995ms | 77.17 |
| C7 reservas mismo slot iter 79/100 | OK | 200 | {"201":1,"409":199} | 809ms | 235.02 |
| C5 pago duplicado concurrente iter 80/100 | OK | 200 | {"0":3,"201":1,"400":196} | 1839ms | 3.33 |
| C6 stock compartido iter 80/100 | OK | 240 | {"201":200,"400":40} | 2784ms | 83.89 |
| C7 reservas mismo slot iter 80/100 | OK | 200 | {"201":1,"409":199} | 1194ms | 159.11 |
| C5 pago duplicado concurrente iter 81/100 | OK | 200 | {"0":7,"201":1,"400":192} | 2093ms | 3.33 |
| C6 stock compartido iter 81/100 | OK | 240 | {"201":200,"400":40} | 3019ms | 77.67 |
| C7 reservas mismo slot iter 81/100 | OK | 200 | {"201":1,"409":199} | 867ms | 219.54 |
| C5 pago duplicado concurrente iter 82/100 | OK | 200 | {"0":9,"201":1,"400":186,"502":4} | 2019ms | 6.64 |
| C6 stock compartido iter 82/100 | OK | 240 | {"201":200,"400":40} | 2848ms | 81.41 |
| C7 reservas mismo slot iter 82/100 | OK | 200 | {"201":1,"409":199} | 865ms | 221.24 |
| C5 pago duplicado concurrente iter 83/100 | OK | 200 | {"201":1,"400":199} | 1948ms | 98.77 |
| C6 stock compartido iter 83/100 | OK | 240 | {"201":200,"400":40} | 3122ms | 73.8 |
| C7 reservas mismo slot iter 83/100 | OK | 200 | {"201":1,"409":199} | 867ms | 222.47 |
| C5 pago duplicado concurrente iter 84/100 | OK | 200 | {"201":1,"400":199} | 2225ms | 86.32 |
| C6 stock compartido iter 84/100 | OK | 240 | {"201":200,"400":40} | 19666ms | 6.71 |
| C7 reservas mismo slot iter 84/100 | OK | 200 | {"201":1,"409":199} | 905ms | 207.04 |
| C5 pago duplicado concurrente iter 85/100 | OK | 200 | {"201":1,"400":199} | 2045ms | 93.28 |
| C6 stock compartido iter 85/100 | OK | 240 | {"201":200,"400":40} | 2844ms | 81.94 |
| C7 reservas mismo slot iter 85/100 | OK | 200 | {"201":1,"409":199} | 760ms | 250.94 |
| C5 pago duplicado concurrente iter 86/100 | OK | 200 | {"201":1,"400":199} | 1799ms | 106.5 |
| C6 stock compartido iter 86/100 | OK | 240 | {"201":200,"400":40} | 2804ms | 82.84 |
| C7 reservas mismo slot iter 86/100 | OK | 200 | {"201":1,"409":199} | 790ms | 238.38 |
| C5 pago duplicado concurrente iter 87/100 | OK | 200 | {"201":1,"400":199} | 1903ms | 100.86 |
| C6 stock compartido iter 87/100 | OK | 240 | {"201":200,"400":40} | 2929ms | 79.89 |
| C7 reservas mismo slot iter 87/100 | OK | 200 | {"201":1,"409":199} | 1271ms | 152.21 |
| C5 pago duplicado concurrente iter 88/100 | OK | 200 | {"201":1,"400":199} | 1939ms | 98.67 |
| C6 stock compartido iter 88/100 | OK | 240 | {"201":200,"400":40} | 2933ms | 79.84 |
| C7 reservas mismo slot iter 88/100 | OK | 200 | {"201":1,"409":199} | 926ms | 208.55 |
| C5 pago duplicado concurrente iter 89/100 | OK | 200 | {"201":1,"400":196,"502":3} | 19840ms | 10.04 |
| C6 stock compartido iter 89/100 | OK | 240 | {"201":200,"400":40} | 2732ms | 82.22 |
| C7 reservas mismo slot iter 89/100 | OK | 200 | {"201":1,"409":199} | 918ms | 205.13 |
| C5 pago duplicado concurrente iter 90/100 | OK | 200 | {"201":1,"400":199} | 2040ms | 94.21 |
| C6 stock compartido iter 90/100 | OK | 240 | {"201":200,"400":40} | 2740ms | 85.17 |
| C7 reservas mismo slot iter 90/100 | OK | 200 | {"201":1,"409":199} | 937ms | 204.29 |
| C5 pago duplicado concurrente iter 91/100 | OK | 200 | {"201":1,"400":199} | 1852ms | 102.67 |
| C6 stock compartido iter 91/100 | OK | 240 | {"201":200,"400":40} | 2884ms | 6.69 |
| C7 reservas mismo slot iter 91/100 | OK | 200 | {"201":1,"409":199} | 827ms | 235.02 |
| C5 pago duplicado concurrente iter 92/100 | OK | 200 | {"201":1,"400":199} | 1857ms | 103.09 |
| C6 stock compartido iter 92/100 | OK | 240 | {"201":200,"400":40} | 2959ms | 78.1 |
| C7 reservas mismo slot iter 92/100 | OK | 200 | {"201":1,"409":199} | 19668ms | 10.15 |
| C5 pago duplicado concurrente iter 93/100 | OK | 200 | {"201":1,"400":199} | 1991ms | 95.92 |
| C6 stock compartido iter 93/100 | OK | 240 | {"201":200,"400":40} | 2864ms | 81.83 |
| C7 reservas mismo slot iter 93/100 | OK | 200 | {"201":1,"409":199} | 923ms | 209.21 |
| C5 pago duplicado concurrente iter 94/100 | OK | 200 | {"201":1,"400":198,"502":1} | 1921ms | 97.85 |
| C6 stock compartido iter 94/100 | OK | 240 | {"201":200,"400":40} | 2997ms | 77.87 |
| C7 reservas mismo slot iter 94/100 | OK | 200 | {"201":1,"409":199} | 877ms | 216.22 |
| C5 pago duplicado concurrente iter 95/100 | OK | 200 | {"201":1,"400":199} | 1950ms | 98.91 |
| C6 stock compartido iter 95/100 | OK | 240 | {"201":200,"400":40} | 2934ms | 79.92 |
| C7 reservas mismo slot iter 95/100 | OK | 200 | {"201":1,"409":199} | 970ms | 195.89 |
| C5 pago duplicado concurrente iter 96/100 | OK | 200 | {"201":1,"400":198,"502":1} | 2134ms | 90.46 |
| C6 stock compartido iter 96/100 | OK | 240 | {"201":200,"400":40} | 2959ms | 79.13 |
| C7 reservas mismo slot iter 96/100 | OK | 200 | {"201":1,"409":199} | 1154ms | 167.36 |
| C5 pago duplicado concurrente iter 97/100 | OK | 200 | {"201":1,"400":199} | 1952ms | 99.26 |
| C6 stock compartido iter 97/100 | OK | 240 | {"201":200,"400":40} | 2978ms | 78.64 |
| C7 reservas mismo slot iter 97/100 | OK | 200 | {"201":1,"409":199} | 954ms | 200.8 |
| C5 pago duplicado concurrente iter 98/100 | OK | 200 | {"201":1,"400":199} | 1954ms | 97.37 |
| C6 stock compartido iter 98/100 | OK | 240 | {"201":200,"400":40} | 19692ms | 6.67 |
| C7 reservas mismo slot iter 98/100 | OK | 200 | {"201":1,"409":199} | 871ms | 221.73 |
| C5 pago duplicado concurrente iter 99/100 | OK | 200 | {"201":1,"400":199} | 2061ms | 92 |
| C6 stock compartido iter 99/100 | OK | 240 | {"201":200,"400":40} | 2881ms | 6.75 |
| C7 reservas mismo slot iter 99/100 | OK | 200 | {"201":1,"409":199} | 787ms | 241.84 |
| C5 pago duplicado concurrente iter 100/100 | OK | 200 | {"201":1,"400":199} | 1759ms | 108.99 |
| C6 stock compartido iter 100/100 | OK | 240 | {"201":200,"400":40} | 2975ms | 78.9 |
| C7 reservas mismo slot iter 100/100 | OK | 200 | {"201":1,"409":199} | 19560ms | 10.21 |

## Detalle

### C5 pago duplicado concurrente iter 1/100

- Invariante: OK
- Duracion: 2943ms
- Latencia: p50=1617ms, p95=2813ms, p99=2905ms, max=2915ms
- Detalle: `{"cuentaId":"2f288a3e-065e-43e1-8f45-fb2cc10ceae5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":1}`

### C6 stock compartido iter 1/100

- Invariante: OK
- Duracion: 3293ms
- Latencia: p50=2143ms, p95=3176ms, p99=3200ms, max=3230ms
- Detalle: `{"productId":"e25290eb-8d34-47e1-9ab0-2f214b755589","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":1}`

### C7 reservas mismo slot iter 1/100

- Invariante: OK
- Duracion: 1169ms
- Latencia: p50=765ms, p95=1115ms, p99=1143ms, max=1144ms
- Detalle: `{"fecha":"2281-12-28","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/100

- Invariante: OK
- Duracion: 2186ms
- Latencia: p50=1447ms, p95=2092ms, p99=2159ms, max=2166ms
- Detalle: `{"cuentaId":"bbda08d9-695f-494f-a7d2-9a90d52e87a1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":193,"502":6},"iteration":2}`

### C6 stock compartido iter 2/100

- Invariante: OK
- Duracion: 3330ms
- Latencia: p50=2149ms, p95=3224ms, p99=3267ms, max=3289ms
- Detalle: `{"productId":"4ed209f9-667c-4e6f-bad3-eff9909273c6","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":73,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":127,"statuses":{"201":200,"400":40},"iteration":2}`

### C7 reservas mismo slot iter 2/100

- Invariante: OK
- Duracion: 1081ms
- Latencia: p50=589ms, p95=1037ms, p99=1062ms, max=1067ms
- Detalle: `{"fecha":"2281-12-29","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/100

- Invariante: OK
- Duracion: 60016ms
- Latencia: p50=1257ms, p95=60005ms, p99=60007ms, max=60007ms
- Detalle: `{"cuentaId":"21d2d5a1-cfd6-4468-8da5-42cccc3d7e86","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":13,"201":1,"400":186},"iteration":3}`

### C6 stock compartido iter 3/100

- Invariante: OK
- Duracion: 2904ms
- Latencia: p50=1838ms, p95=2813ms, p99=2838ms, max=2851ms
- Detalle: `{"productId":"eaaca835-d619-454d-a64f-4c2cffd8275e","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":3}`

### C7 reservas mismo slot iter 3/100

- Invariante: OK
- Duracion: 1212ms
- Latencia: p50=785ms, p95=1165ms, p99=1197ms, max=1197ms
- Detalle: `{"fecha":"2281-12-30","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

### C5 pago duplicado concurrente iter 4/100

- Invariante: OK
- Duracion: 60008ms
- Latencia: p50=1120ms, p95=1746ms, p99=60002ms, max=60002ms
- Detalle: `{"cuentaId":"7e8cd191-5ff7-4575-8f4d-c9324a95e79c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":3,"201":1,"400":191,"502":5},"iteration":4}`

### C6 stock compartido iter 4/100

- Invariante: OK
- Duracion: 3084ms
- Latencia: p50=1941ms, p95=2997ms, p99=3023ms, max=3042ms
- Detalle: `{"productId":"85f17505-3050-4e4a-ae5f-4d1da214cb62","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":4}`

### C7 reservas mismo slot iter 4/100

- Invariante: OK
- Duracion: 1037ms
- Latencia: p50=630ms, p95=995ms, p99=1026ms, max=1028ms
- Detalle: `{"fecha":"2281-12-31","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":4}`

### C5 pago duplicado concurrente iter 5/100

- Invariante: OK
- Duracion: 2109ms
- Latencia: p50=1263ms, p95=2019ms, p99=2090ms, max=2099ms
- Detalle: `{"cuentaId":"33e166e9-eb3a-4955-92f0-cc8c448e644f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":5}`

### C6 stock compartido iter 5/100

- Invariante: OK
- Duracion: 2967ms
- Latencia: p50=1928ms, p95=2858ms, p99=2890ms, max=2899ms
- Detalle: `{"productId":"87410492-8ef9-413e-8809-4e31b468546e","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":5}`

### C7 reservas mismo slot iter 5/100

- Invariante: OK
- Duracion: 842ms
- Latencia: p50=524ms, p95=807ms, p99=829ms, max=830ms
- Detalle: `{"fecha":"2282-01-01","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":5}`

### C5 pago duplicado concurrente iter 6/100

- Invariante: OK
- Duracion: 2020ms
- Latencia: p50=1234ms, p95=1953ms, p99=2002ms, max=2011ms
- Detalle: `{"cuentaId":"6dc537cd-2f85-44dc-8a17-c7d8ffaf5f04","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":6}`

### C6 stock compartido iter 6/100

- Invariante: OK
- Duracion: 2994ms
- Latencia: p50=1904ms, p95=2933ms, p99=2966ms, max=2970ms
- Detalle: `{"productId":"8e0e6a23-3670-4b53-818e-cc3850ab5e20","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":6}`

### C7 reservas mismo slot iter 6/100

- Invariante: OK
- Duracion: 738ms
- Latencia: p50=485ms, p95=705ms, p99=723ms, max=723ms
- Detalle: `{"fecha":"2282-01-02","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":6}`

### C5 pago duplicado concurrente iter 7/100

- Invariante: OK
- Duracion: 2015ms
- Latencia: p50=1282ms, p95=1944ms, p99=2000ms, max=2004ms
- Detalle: `{"cuentaId":"bb299a04-114f-4f52-80f8-70d728da08ff","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":7}`

### C6 stock compartido iter 7/100

- Invariante: OK
- Duracion: 2934ms
- Latencia: p50=1867ms, p95=2848ms, p99=2882ms, max=2887ms
- Detalle: `{"productId":"ad780b0c-2985-42e8-a9ef-f4b2bda824e1","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":7}`

### C7 reservas mismo slot iter 7/100

- Invariante: OK
- Duracion: 1279ms
- Latencia: p50=624ms, p95=1229ms, p99=1266ms, max=1268ms
- Detalle: `{"fecha":"2282-01-03","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":7}`

### C5 pago duplicado concurrente iter 8/100

- Invariante: OK
- Duracion: 2031ms
- Latencia: p50=1273ms, p95=1960ms, p99=2011ms, max=2015ms
- Detalle: `{"cuentaId":"cc7cc595-04fd-4e2c-a751-1df954d2a8cd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":8}`

### C6 stock compartido iter 8/100

- Invariante: OK
- Duracion: 2845ms
- Latencia: p50=1776ms, p95=2776ms, p99=2816ms, max=2821ms
- Detalle: `{"productId":"a9849f18-3b39-496a-bc07-152c4381fd2c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":69,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":131,"statuses":{"201":200,"400":40},"iteration":8}`

### C7 reservas mismo slot iter 8/100

- Invariante: OK
- Duracion: 19639ms
- Latencia: p50=588ms, p95=885ms, p99=19627ms, max=19631ms
- Detalle: `{"fecha":"2282-01-04","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":8}`

### C5 pago duplicado concurrente iter 9/100

- Invariante: OK
- Duracion: 2208ms
- Latencia: p50=1439ms, p95=2139ms, p99=2191ms, max=2196ms
- Detalle: `{"cuentaId":"33772348-7ac9-455d-8446-ee3fa544f194","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":9}`

### C6 stock compartido iter 9/100

- Invariante: OK
- Duracion: 2883ms
- Latencia: p50=1823ms, p95=2772ms, p99=2807ms, max=2812ms
- Detalle: `{"productId":"c23e3914-a7aa-4365-9aab-de31f929226c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":79,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":121,"statuses":{"201":200,"400":40},"iteration":9}`

### C7 reservas mismo slot iter 9/100

- Invariante: OK
- Duracion: 817ms
- Latencia: p50=523ms, p95=782ms, p99=803ms, max=803ms
- Detalle: `{"fecha":"2282-01-05","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":9}`

### C5 pago duplicado concurrente iter 10/100

- Invariante: OK
- Duracion: 2220ms
- Latencia: p50=1500ms, p95=2157ms, p99=2203ms, max=2211ms
- Detalle: `{"cuentaId":"a776e0c9-6d92-4d24-a848-48f993226498","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":10}`

### C6 stock compartido iter 10/100

- Invariante: OK
- Duracion: 3006ms
- Latencia: p50=1887ms, p95=2937ms, p99=2957ms, max=2986ms
- Detalle: `{"productId":"226129ca-a969-4f6f-9c33-97dc7db2eef6","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":10}`

### C7 reservas mismo slot iter 10/100

- Invariante: OK
- Duracion: 1013ms
- Latencia: p50=526ms, p95=972ms, p99=1000ms, max=1002ms
- Detalle: `{"fecha":"2282-01-06","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":10}`

### C5 pago duplicado concurrente iter 11/100

- Invariante: OK
- Duracion: 2140ms
- Latencia: p50=1320ms, p95=2057ms, p99=2124ms, max=2129ms
- Detalle: `{"cuentaId":"a4617d70-cea8-4715-9ab9-101fe3aeefd7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":190,"502":9},"iteration":11}`

### C6 stock compartido iter 11/100

- Invariante: OK
- Duracion: 3203ms
- Latencia: p50=1953ms, p95=3077ms, p99=3150ms, max=3161ms
- Detalle: `{"productId":"ec566599-b7a5-444d-8bc2-4c99166720b1","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":68,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":132,"statuses":{"201":200,"400":40},"iteration":11}`

### C7 reservas mismo slot iter 11/100

- Invariante: OK
- Duracion: 1097ms
- Latencia: p50=736ms, p95=1054ms, p99=1082ms, max=1085ms
- Detalle: `{"fecha":"2282-01-07","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":11}`

### C5 pago duplicado concurrente iter 12/100

- Invariante: OK
- Duracion: 19649ms
- Latencia: p50=1621ms, p95=19562ms, p99=19639ms, max=19644ms
- Detalle: `{"cuentaId":"4d28f47d-411e-492a-9ae1-7ed173d9b957","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":193,"502":6},"iteration":12}`

### C6 stock compartido iter 12/100

- Invariante: OK
- Duracion: 3180ms
- Latencia: p50=2057ms, p95=3108ms, p99=3137ms, max=3148ms
- Detalle: `{"productId":"bf121a96-9628-400c-ae83-199111817453","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":12}`

### C7 reservas mismo slot iter 12/100

- Invariante: OK
- Duracion: 1051ms
- Latencia: p50=653ms, p95=1012ms, p99=1037ms, max=1037ms
- Detalle: `{"fecha":"2282-01-08","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":12}`

### C5 pago duplicado concurrente iter 13/100

- Invariante: OK
- Duracion: 1851ms
- Latencia: p50=1095ms, p95=1774ms, p99=1836ms, max=1842ms
- Detalle: `{"cuentaId":"77666930-68fc-4385-81cb-cdd1eee00eaa","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":197,"502":2},"iteration":13}`

### C6 stock compartido iter 13/100

- Invariante: OK
- Duracion: 3525ms
- Latencia: p50=2244ms, p95=3429ms, p99=3483ms, max=3499ms
- Detalle: `{"productId":"99b7314b-d8d0-42d1-84de-4a25e866e883","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":13}`

### C7 reservas mismo slot iter 13/100

- Invariante: OK
- Duracion: 1313ms
- Latencia: p50=961ms, p95=1271ms, p99=1293ms, max=1296ms
- Detalle: `{"fecha":"2282-01-09","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":13}`

### C5 pago duplicado concurrente iter 14/100

- Invariante: OK
- Duracion: 20135ms
- Latencia: p50=1548ms, p95=20038ms, p99=20121ms, max=20129ms
- Detalle: `{"cuentaId":"ca3a1a1b-5970-4e00-ab2e-d6da3e7f28d1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":14}`

### C6 stock compartido iter 14/100

- Invariante: OK
- Duracion: 3719ms
- Latencia: p50=2298ms, p95=3629ms, p99=3678ms, max=3689ms
- Detalle: `{"productId":"290b4d55-0c1d-47d0-87da-7346dba215c5","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":76,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":124,"statuses":{"201":200,"400":40},"iteration":14}`

### C7 reservas mismo slot iter 14/100

- Invariante: OK
- Duracion: 1427ms
- Latencia: p50=830ms, p95=1388ms, p99=1419ms, max=1420ms
- Detalle: `{"fecha":"2282-01-10","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":14}`

### C5 pago duplicado concurrente iter 15/100

- Invariante: OK
- Duracion: 60016ms
- Latencia: p50=1306ms, p95=11277ms, p99=60007ms, max=60008ms
- Detalle: `{"cuentaId":"e63fbdd2-f12e-4e66-bd22-6dffee9a18fd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":9,"201":1,"400":189,"502":1},"iteration":15}`

### C6 stock compartido iter 15/100

- Invariante: OK
- Duracion: 3302ms
- Latencia: p50=2062ms, p95=3181ms, p99=3231ms, max=3240ms
- Detalle: `{"productId":"a3f3a5ae-45d1-4508-b013-18d94a7f89d0","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":15}`

### C7 reservas mismo slot iter 15/100

- Invariante: OK
- Duracion: 1569ms
- Latencia: p50=823ms, p95=1508ms, p99=1552ms, max=1554ms
- Detalle: `{"fecha":"2282-01-11","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":15}`

### C5 pago duplicado concurrente iter 16/100

- Invariante: OK
- Duracion: 2355ms
- Latencia: p50=1579ms, p95=2264ms, p99=2339ms, max=2343ms
- Detalle: `{"cuentaId":"a28fbe69-5813-4bb6-bd9d-27ae22d8056e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":16}`

### C6 stock compartido iter 16/100

- Invariante: OK
- Duracion: 3792ms
- Latencia: p50=2399ms, p95=3691ms, p99=3732ms, max=3755ms
- Detalle: `{"productId":"6d8f0f93-1862-43cb-b7e0-f9f47284292c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":65,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":135,"statuses":{"201":200,"400":40},"iteration":16}`

### C7 reservas mismo slot iter 16/100

- Invariante: OK
- Duracion: 1057ms
- Latencia: p50=670ms, p95=1016ms, p99=1044ms, max=1045ms
- Detalle: `{"fecha":"2282-01-12","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":16}`

### C5 pago duplicado concurrente iter 17/100

- Invariante: OK
- Duracion: 2393ms
- Latencia: p50=1495ms, p95=2300ms, p99=2376ms, max=2383ms
- Detalle: `{"cuentaId":"936c6dfd-4c2d-4b1e-90d2-cf642fb97ade","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":17}`

### C6 stock compartido iter 17/100

- Invariante: OK
- Duracion: 3099ms
- Latencia: p50=1970ms, p95=3016ms, p99=3054ms, max=3069ms
- Detalle: `{"productId":"12d8e3c6-38de-4b60-b39b-5080cf970de5","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":17}`

### C7 reservas mismo slot iter 17/100

- Invariante: OK
- Duracion: 1469ms
- Latencia: p50=872ms, p95=1398ms, p99=1445ms, max=1447ms
- Detalle: `{"fecha":"2282-01-13","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":17}`

### C5 pago duplicado concurrente iter 18/100

- Invariante: OK
- Duracion: 2107ms
- Latencia: p50=1351ms, p95=2036ms, p99=2092ms, max=2096ms
- Detalle: `{"cuentaId":"69a4e01c-2b4b-455d-adea-553c6299d331","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":192,"502":7},"iteration":18}`

### C6 stock compartido iter 18/100

- Invariante: OK
- Duracion: 3547ms
- Latencia: p50=2221ms, p95=3434ms, p99=3510ms, max=3532ms
- Detalle: `{"productId":"ac666b4f-21ca-4145-b3b4-73ec48b4a5ca","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":18}`

### C7 reservas mismo slot iter 18/100

- Invariante: OK
- Duracion: 1286ms
- Latencia: p50=759ms, p95=1243ms, p99=1264ms, max=1265ms
- Detalle: `{"fecha":"2282-01-14","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":18}`

### C5 pago duplicado concurrente iter 19/100

- Invariante: OK
- Duracion: 2512ms
- Latencia: p50=1631ms, p95=2425ms, p99=2495ms, max=2498ms
- Detalle: `{"cuentaId":"5f125419-37f0-4257-b73d-d60e53f49810","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":19}`

### C6 stock compartido iter 19/100

- Invariante: OK
- Duracion: 35969ms
- Latencia: p50=2063ms, p95=3180ms, p99=19851ms, max=35960ms
- Detalle: `{"productId":"bf07f9b4-973a-4531-bf0c-33ffd591eb35","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":19}`

### C7 reservas mismo slot iter 19/100

- Invariante: OK
- Duracion: 1195ms
- Latencia: p50=803ms, p95=1150ms, p99=1186ms, max=1187ms
- Detalle: `{"fecha":"2282-01-15","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":19}`

### C5 pago duplicado concurrente iter 20/100

- Invariante: OK
- Duracion: 2278ms
- Latencia: p50=1241ms, p95=2157ms, p99=2260ms, max=2271ms
- Detalle: `{"cuentaId":"c0a311bb-cd08-4cf1-8bae-82a0dfd810b9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":20}`

### C6 stock compartido iter 20/100

- Invariante: OK
- Duracion: 3457ms
- Latencia: p50=2133ms, p95=3309ms, p99=3344ms, max=3351ms
- Detalle: `{"productId":"78e08ba1-0a26-4d15-9b54-5ef7595c4615","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":73,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":127,"statuses":{"201":200,"400":40},"iteration":20}`

### C7 reservas mismo slot iter 20/100

- Invariante: OK
- Duracion: 925ms
- Latencia: p50=651ms, p95=888ms, p99=906ms, max=906ms
- Detalle: `{"fecha":"2282-01-16","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":20}`

### C5 pago duplicado concurrente iter 21/100

- Invariante: OK
- Duracion: 2184ms
- Latencia: p50=1284ms, p95=2090ms, p99=2169ms, max=2171ms
- Detalle: `{"cuentaId":"73f499fe-e73d-4ee0-a8d2-9220b76cbe37","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":21}`

### C6 stock compartido iter 21/100

- Invariante: OK
- Duracion: 3528ms
- Latencia: p50=2191ms, p95=3409ms, p99=3486ms, max=3490ms
- Detalle: `{"productId":"45711154-5d5c-460e-9a9d-9248daf8e645","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":56,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":144,"statuses":{"201":200,"400":40},"iteration":21}`

### C7 reservas mismo slot iter 21/100

- Invariante: OK
- Duracion: 1337ms
- Latencia: p50=862ms, p95=1286ms, p99=1319ms, max=1320ms
- Detalle: `{"fecha":"2282-01-17","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":21}`

### C5 pago duplicado concurrente iter 22/100

- Invariante: OK
- Duracion: 2210ms
- Latencia: p50=1277ms, p95=2103ms, p99=2191ms, max=2200ms
- Detalle: `{"cuentaId":"5dd9299d-1d24-4005-8845-f5b6d03cb582","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":194,"502":5},"iteration":22}`

### C6 stock compartido iter 22/100

- Invariante: OK
- Duracion: 4928ms
- Latencia: p50=2875ms, p95=4718ms, p99=4778ms, max=4803ms
- Detalle: `{"productId":"a5176179-4a2a-4e7e-a5e7-8e13855a451b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":62,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":138,"statuses":{"201":200,"400":40},"iteration":22}`

### C7 reservas mismo slot iter 22/100

- Invariante: OK
- Duracion: 1992ms
- Latencia: p50=1178ms, p95=1946ms, p99=1980ms, max=1981ms
- Detalle: `{"fecha":"2282-01-18","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":22}`

### C5 pago duplicado concurrente iter 23/100

- Invariante: OK
- Duracion: 4519ms
- Latencia: p50=1561ms, p95=4433ms, p99=4503ms, max=4512ms
- Detalle: `{"cuentaId":"865bb30d-0616-49a7-9d38-48a4d0cfe123","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":23}`

### C6 stock compartido iter 23/100

- Invariante: OK
- Duracion: 4731ms
- Latencia: p50=3379ms, p95=4619ms, p99=4647ms, max=4656ms
- Detalle: `{"productId":"2235dfe7-fafe-4942-bd17-364e29e96cc4","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":77,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":123,"statuses":{"201":200,"400":40},"iteration":23}`

### C7 reservas mismo slot iter 23/100

- Invariante: OK
- Duracion: 1711ms
- Latencia: p50=863ms, p95=1646ms, p99=1697ms, max=1697ms
- Detalle: `{"fecha":"2282-01-19","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":23}`

### C5 pago duplicado concurrente iter 24/100

- Invariante: OK
- Duracion: 2534ms
- Latencia: p50=1776ms, p95=2439ms, p99=2504ms, max=2511ms
- Detalle: `{"cuentaId":"6079bb06-668b-4741-8ed3-741ac7d3cc37","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":24}`

### C6 stock compartido iter 24/100

- Invariante: OK
- Duracion: 3624ms
- Latencia: p50=2332ms, p95=3517ms, p99=3543ms, max=3569ms
- Detalle: `{"productId":"41a79323-09d5-4ae0-a609-e3dec1d33426","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":64,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":136,"statuses":{"201":200,"400":40},"iteration":24}`

### C7 reservas mismo slot iter 24/100

- Invariante: OK
- Duracion: 11313ms
- Latencia: p50=751ms, p95=1445ms, p99=11297ms, max=11312ms
- Detalle: `{"fecha":"2282-01-20","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":24}`

### C5 pago duplicado concurrente iter 25/100

- Invariante: OK
- Duracion: 2764ms
- Latencia: p50=1826ms, p95=2659ms, p99=2732ms, max=2739ms
- Detalle: `{"cuentaId":"5d93cf20-9d3f-4588-952e-233e49701036","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":25}`

### C6 stock compartido iter 25/100

- Invariante: OK
- Duracion: 3648ms
- Latencia: p50=2275ms, p95=3533ms, p99=3602ms, max=3613ms
- Detalle: `{"productId":"59fe5ec8-2b1f-45e6-a1d4-637387fc9dbc","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":58,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":142,"statuses":{"201":200,"400":40},"iteration":25}`

### C7 reservas mismo slot iter 25/100

- Invariante: OK
- Duracion: 1178ms
- Latencia: p50=646ms, p95=1131ms, p99=1164ms, max=1167ms
- Detalle: `{"fecha":"2282-01-21","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":25}`

### C5 pago duplicado concurrente iter 26/100

- Invariante: OK
- Duracion: 2508ms
- Latencia: p50=1638ms, p95=2419ms, p99=2485ms, max=2504ms
- Detalle: `{"cuentaId":"5e66017f-fd69-497e-ad45-e33c678285e1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":193,"502":6},"iteration":26}`

### C6 stock compartido iter 26/100

- Invariante: OK
- Duracion: 3467ms
- Latencia: p50=2141ms, p95=3318ms, p99=3364ms, max=3377ms
- Detalle: `{"productId":"9982d1cd-d35c-4e8c-9e3b-aaa73839797e","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":71,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":129,"statuses":{"201":200,"400":40},"iteration":26}`

### C7 reservas mismo slot iter 26/100

- Invariante: OK
- Duracion: 1266ms
- Latencia: p50=787ms, p95=1220ms, p99=1247ms, max=1250ms
- Detalle: `{"fecha":"2282-01-22","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":26}`

### C5 pago duplicado concurrente iter 27/100

- Invariante: OK
- Duracion: 2604ms
- Latencia: p50=1669ms, p95=2510ms, p99=2586ms, max=2595ms
- Detalle: `{"cuentaId":"d7702856-cd6e-493d-967a-4a2870c69bfd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":27}`

### C6 stock compartido iter 27/100

- Invariante: OK
- Duracion: 3386ms
- Latencia: p50=2066ms, p95=3260ms, p99=3340ms, max=3355ms
- Detalle: `{"productId":"e24ef418-1bea-4d5d-8827-b8560349cdd3","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":27}`

### C7 reservas mismo slot iter 27/100

- Invariante: OK
- Duracion: 998ms
- Latencia: p50=662ms, p95=967ms, p99=983ms, max=985ms
- Detalle: `{"fecha":"2282-01-23","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":27}`

### C5 pago duplicado concurrente iter 28/100

- Invariante: OK
- Duracion: 2586ms
- Latencia: p50=1378ms, p95=2474ms, p99=2568ms, max=2579ms
- Detalle: `{"cuentaId":"45bf63d6-c6e3-437e-b380-63726ef80861","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":28}`

### C6 stock compartido iter 28/100

- Invariante: OK
- Duracion: 4000ms
- Latencia: p50=2404ms, p95=3906ms, p99=3954ms, max=3962ms
- Detalle: `{"productId":"df900fdd-2e4f-403c-b62e-5e9a9ebba2a5","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":66,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":134,"statuses":{"201":200,"400":40},"iteration":28}`

### C7 reservas mismo slot iter 28/100

- Invariante: OK
- Duracion: 1513ms
- Latencia: p50=942ms, p95=1441ms, p99=1493ms, max=1493ms
- Detalle: `{"fecha":"2282-01-24","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":28}`

### C5 pago duplicado concurrente iter 29/100

- Invariante: OK
- Duracion: 2674ms
- Latencia: p50=1907ms, p95=2596ms, p99=2658ms, max=2664ms
- Detalle: `{"cuentaId":"04e58d27-bb5c-45ae-8919-7e792e41b692","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":29}`

### C6 stock compartido iter 29/100

- Invariante: OK
- Duracion: 3705ms
- Latencia: p50=2287ms, p95=3601ms, p99=3640ms, max=3654ms
- Detalle: `{"productId":"28404c0f-a914-46ea-9968-2736aca64725","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":77,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":123,"statuses":{"201":200,"400":40},"iteration":29}`

### C7 reservas mismo slot iter 29/100

- Invariante: OK
- Duracion: 1253ms
- Latencia: p50=870ms, p95=1209ms, p99=1235ms, max=1239ms
- Detalle: `{"fecha":"2282-01-25","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":29}`

### C5 pago duplicado concurrente iter 30/100

- Invariante: OK
- Duracion: 19701ms
- Latencia: p50=1385ms, p95=11622ms, p99=19687ms, max=19700ms
- Detalle: `{"cuentaId":"81692080-8d8c-4231-b3e2-569897b7f749","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":30}`

### C6 stock compartido iter 30/100

- Invariante: OK
- Duracion: 3851ms
- Latencia: p50=2541ms, p95=3719ms, p99=3757ms, max=3766ms
- Detalle: `{"productId":"685601b9-aaac-4e37-8759-5c2c6464f48c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":30}`

### C7 reservas mismo slot iter 30/100

- Invariante: OK
- Duracion: 1404ms
- Latencia: p50=808ms, p95=1353ms, p99=1385ms, max=1386ms
- Detalle: `{"fecha":"2282-01-26","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":30}`

### C5 pago duplicado concurrente iter 31/100

- Invariante: OK
- Duracion: 2504ms
- Latencia: p50=1650ms, p95=2416ms, p99=2475ms, max=2487ms
- Detalle: `{"cuentaId":"8463bbe9-e60d-4e94-86ea-379e32418af2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":191,"502":8},"iteration":31}`

### C6 stock compartido iter 31/100

- Invariante: OK
- Duracion: 3912ms
- Latencia: p50=2593ms, p95=3829ms, p99=3879ms, max=3890ms
- Detalle: `{"productId":"ecc210bc-c21e-4e73-8c60-9021cb63914d","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":64,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":136,"statuses":{"201":200,"400":40},"iteration":31}`

### C7 reservas mismo slot iter 31/100

- Invariante: OK
- Duracion: 2123ms
- Latencia: p50=1157ms, p95=2038ms, p99=2105ms, max=2107ms
- Detalle: `{"fecha":"2282-01-27","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":31}`

### C5 pago duplicado concurrente iter 32/100

- Invariante: OK
- Duracion: 13408ms
- Latencia: p50=2516ms, p95=3357ms, p99=13399ms, max=13403ms
- Detalle: `{"cuentaId":"6eb27d74-7106-4550-9c1c-9f9b2aade932","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":166,"500":33},"iteration":32}`

### C6 stock compartido iter 32/100

- Invariante: OK
- Duracion: 4303ms
- Latencia: p50=2603ms, p95=4158ms, p99=4247ms, max=4253ms
- Detalle: `{"productId":"eafdb934-ec02-44e2-bb0c-02b5caa25df6","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":32}`

### C7 reservas mismo slot iter 32/100

- Invariante: OK
- Duracion: 1279ms
- Latencia: p50=874ms, p95=1236ms, p99=1270ms, max=1271ms
- Detalle: `{"fecha":"2282-01-28","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":32}`

### C5 pago duplicado concurrente iter 33/100

- Invariante: OK
- Duracion: 2369ms
- Latencia: p50=1467ms, p95=2288ms, p99=2353ms, max=2361ms
- Detalle: `{"cuentaId":"01cf74ee-1416-48a8-8a8f-afd3248bbefe","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":33}`

### C6 stock compartido iter 33/100

- Invariante: OK
- Duracion: 3417ms
- Latencia: p50=2188ms, p95=3313ms, p99=3381ms, max=3388ms
- Detalle: `{"productId":"d353d833-bcb8-4fd8-a861-dfe525ff8371","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":50,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":150,"statuses":{"201":200,"400":40},"iteration":33}`

### C7 reservas mismo slot iter 33/100

- Invariante: OK
- Duracion: 1356ms
- Latencia: p50=921ms, p95=1312ms, p99=1341ms, max=1343ms
- Detalle: `{"fecha":"2282-01-29","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":33}`

### C5 pago duplicado concurrente iter 34/100

- Invariante: OK
- Duracion: 2580ms
- Latencia: p50=1455ms, p95=2494ms, p99=2559ms, max=2566ms
- Detalle: `{"cuentaId":"5c80225b-fc66-4180-a626-445f14f6b4a4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":34}`

### C6 stock compartido iter 34/100

- Invariante: OK
- Duracion: 19744ms
- Latencia: p50=2065ms, p95=19694ms, p99=19732ms, max=19738ms
- Detalle: `{"productId":"1a940ead-a71f-4cbd-b97c-4d8100dde9e5","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":34}`

### C7 reservas mismo slot iter 34/100

- Invariante: OK
- Duracion: 2009ms
- Latencia: p50=1210ms, p95=1928ms, p99=1994ms, max=2000ms
- Detalle: `{"fecha":"2282-01-30","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":34}`

### C5 pago duplicado concurrente iter 35/100

- Invariante: OK
- Duracion: 2598ms
- Latencia: p50=1390ms, p95=2486ms, p99=2576ms, max=2584ms
- Detalle: `{"cuentaId":"c350f0dd-c902-4908-9062-6500756243e3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":35}`

### C6 stock compartido iter 35/100

- Invariante: OK
- Duracion: 19672ms
- Latencia: p50=2094ms, p95=3189ms, p99=19665ms, max=19667ms
- Detalle: `{"productId":"2384c2ca-42d5-44db-895a-204a5ceafab9","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":35}`

### C7 reservas mismo slot iter 35/100

- Invariante: OK
- Duracion: 1173ms
- Latencia: p50=740ms, p95=1136ms, p99=1157ms, max=1158ms
- Detalle: `{"fecha":"2282-01-31","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":35}`

### C5 pago duplicado concurrente iter 36/100

- Invariante: OK
- Duracion: 2030ms
- Latencia: p50=1001ms, p95=1888ms, p99=2003ms, max=2019ms
- Detalle: `{"cuentaId":"3e6dfe70-4404-44aa-a473-21aae16001e8","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":180,"502":19},"iteration":36}`

### C6 stock compartido iter 36/100

- Invariante: OK
- Duracion: 3449ms
- Latencia: p50=2179ms, p95=3353ms, p99=3404ms, max=3415ms
- Detalle: `{"productId":"af348391-f9e0-4dd4-90d1-8966816e7371","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":36}`

### C7 reservas mismo slot iter 36/100

- Invariante: OK
- Duracion: 1449ms
- Latencia: p50=924ms, p95=1383ms, p99=1417ms, max=1417ms
- Detalle: `{"fecha":"2282-02-01","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":36}`

### C5 pago duplicado concurrente iter 37/100

- Invariante: OK
- Duracion: 2701ms
- Latencia: p50=1789ms, p95=2607ms, p99=2657ms, max=2688ms
- Detalle: `{"cuentaId":"b0305705-c1c8-4555-969f-6e7029293319","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":37}`

### C6 stock compartido iter 37/100

- Invariante: OK
- Duracion: 3522ms
- Latencia: p50=2159ms, p95=3387ms, p99=3432ms, max=3463ms
- Detalle: `{"productId":"a64cab01-5030-4bf7-97c6-47d3e7b7ecd4","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":53,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":147,"statuses":{"201":200,"400":40},"iteration":37}`

### C7 reservas mismo slot iter 37/100

- Invariante: OK
- Duracion: 912ms
- Latencia: p50=535ms, p95=856ms, p99=899ms, max=901ms
- Detalle: `{"fecha":"2282-02-02","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":37}`

### C5 pago duplicado concurrente iter 38/100

- Invariante: OK
- Duracion: 2224ms
- Latencia: p50=1278ms, p95=2085ms, p99=2199ms, max=2213ms
- Detalle: `{"cuentaId":"03801bde-b963-47ad-a6f1-caddbd86d755","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":38}`

### C6 stock compartido iter 38/100

- Invariante: OK
- Duracion: 4944ms
- Latencia: p50=3324ms, p95=4733ms, p99=4794ms, max=4850ms
- Detalle: `{"productId":"eb971042-e5dd-4bbf-977a-1ff8ee274012","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":76,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":124,"statuses":{"201":200,"400":40},"iteration":38}`

### C7 reservas mismo slot iter 38/100

- Invariante: OK
- Duracion: 1705ms
- Latencia: p50=980ms, p95=1635ms, p99=1696ms, max=1698ms
- Detalle: `{"fecha":"2282-02-03","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":38}`

### C5 pago duplicado concurrente iter 39/100

- Invariante: OK
- Duracion: 7412ms
- Latencia: p50=2401ms, p95=3665ms, p99=3774ms, max=7409ms
- Detalle: `{"cuentaId":"ca8600ac-4d5f-4ad3-8f51-830e330be3d8","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":39}`

### C6 stock compartido iter 39/100

- Invariante: OK
- Duracion: 5901ms
- Latencia: p50=3815ms, p95=5761ms, p99=5808ms, max=5814ms
- Detalle: `{"productId":"6253284d-e997-4a71-94d2-ecb5ae64f2ac","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":71,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":129,"statuses":{"201":200,"400":40},"iteration":39}`

### C7 reservas mismo slot iter 39/100

- Invariante: OK
- Duracion: 2355ms
- Latencia: p50=1523ms, p95=2236ms, p99=2302ms, max=2318ms
- Detalle: `{"fecha":"2282-02-04","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":39}`

### C5 pago duplicado concurrente iter 40/100

- Invariante: OK
- Duracion: 60026ms
- Latencia: p50=2149ms, p95=3073ms, p99=60014ms, max=60015ms
- Detalle: `{"cuentaId":"ce717638-fd56-4cb0-a10c-d9cee9544cf1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":6,"201":1,"400":159,"500":34},"iteration":40}`

### C6 stock compartido iter 40/100

- Invariante: OK
- Duracion: 3449ms
- Latencia: p50=2135ms, p95=3309ms, p99=3350ms, max=3360ms
- Detalle: `{"productId":"d294ac87-42cd-44fb-813c-f838405c0067","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":75,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":125,"statuses":{"201":200,"400":40},"iteration":40}`

### C7 reservas mismo slot iter 40/100

- Invariante: OK
- Duracion: 1136ms
- Latencia: p50=632ms, p95=1086ms, p99=1115ms, max=1127ms
- Detalle: `{"fecha":"2282-02-05","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":40}`

### C5 pago duplicado concurrente iter 41/100

- Invariante: OK
- Duracion: 30118ms
- Latencia: p50=1269ms, p95=30099ms, p99=30112ms, max=30112ms
- Detalle: `{"cuentaId":"054373e3-cb76-4cf6-926e-a9274e495063","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":13,"201":1,"400":182,"502":4},"iteration":41}`

### C6 stock compartido iter 41/100

- Invariante: OK
- Duracion: 3994ms
- Latencia: p50=2532ms, p95=3885ms, p99=3943ms, max=3953ms
- Detalle: `{"productId":"c9a7ada8-3629-433e-8228-856330999979","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":41}`

### C7 reservas mismo slot iter 41/100

- Invariante: OK
- Duracion: 933ms
- Latencia: p50=558ms, p95=883ms, p99=920ms, max=921ms
- Detalle: `{"fecha":"2282-02-06","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":41}`

### C5 pago duplicado concurrente iter 42/100

- Invariante: OK
- Duracion: 2154ms
- Latencia: p50=1286ms, p95=2081ms, p99=2136ms, max=2142ms
- Detalle: `{"cuentaId":"1bc075de-c4b7-4890-8db4-9c068b4d5448","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":42}`

### C6 stock compartido iter 42/100

- Invariante: OK
- Duracion: 3309ms
- Latencia: p50=2057ms, p95=3204ms, p99=3226ms, max=3230ms
- Detalle: `{"productId":"512238ca-efd5-47c7-9931-7127b262bb7d","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":66,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":134,"statuses":{"201":200,"400":40},"iteration":42}`

### C7 reservas mismo slot iter 42/100

- Invariante: OK
- Duracion: 766ms
- Latencia: p50=487ms, p95=726ms, p99=746ms, max=747ms
- Detalle: `{"fecha":"2282-02-07","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":42}`

### C5 pago duplicado concurrente iter 43/100

- Invariante: OK
- Duracion: 1982ms
- Latencia: p50=1161ms, p95=1863ms, p99=1959ms, max=1968ms
- Detalle: `{"cuentaId":"f825b4db-f26c-4a89-b30b-dc67c71e0764","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":43}`

### C6 stock compartido iter 43/100

- Invariante: OK
- Duracion: 4502ms
- Latencia: p50=3062ms, p95=4362ms, p99=4437ms, max=4451ms
- Detalle: `{"productId":"734cafda-6684-4934-9a8e-a25f4f177183","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":69,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":131,"statuses":{"201":200,"400":40},"iteration":43}`

### C7 reservas mismo slot iter 43/100

- Invariante: OK
- Duracion: 839ms
- Latencia: p50=497ms, p95=804ms, p99=827ms, max=827ms
- Detalle: `{"fecha":"2282-02-08","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":43}`

### C5 pago duplicado concurrente iter 44/100

- Invariante: OK
- Duracion: 2149ms
- Latencia: p50=1275ms, p95=2036ms, p99=2126ms, max=2133ms
- Detalle: `{"cuentaId":"8699edfb-6ae2-4da3-93cb-849989e3d277","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":44}`

### C6 stock compartido iter 44/100

- Invariante: OK
- Duracion: 4043ms
- Latencia: p50=2551ms, p95=3786ms, p99=3892ms, max=3938ms
- Detalle: `{"productId":"bc2383c4-2edf-4309-839e-a01a56f2465f","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":138,"statuses":{"201":200,"400":20,"500":20},"iteration":44}`

### C7 reservas mismo slot iter 44/100

- Invariante: OK
- Duracion: 1364ms
- Latencia: p50=845ms, p95=1314ms, p99=1338ms, max=1339ms
- Detalle: `{"fecha":"2282-02-09","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":44}`

### C5 pago duplicado concurrente iter 45/100

- Invariante: OK
- Duracion: 2270ms
- Latencia: p50=1430ms, p95=2187ms, p99=2254ms, max=2261ms
- Detalle: `{"cuentaId":"ab02cb4b-8b70-4144-a1cb-1cc1df27f5de","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":45}`

### C6 stock compartido iter 45/100

- Invariante: OK
- Duracion: 3613ms
- Latencia: p50=2216ms, p95=3493ms, p99=3531ms, max=3541ms
- Detalle: `{"productId":"de06b967-5e0d-4025-b629-4dbefb92722c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":45}`

### C7 reservas mismo slot iter 45/100

- Invariante: OK
- Duracion: 1418ms
- Latencia: p50=1024ms, p95=1386ms, p99=1406ms, max=1406ms
- Detalle: `{"fecha":"2282-02-10","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":45}`

### C5 pago duplicado concurrente iter 46/100

- Invariante: OK
- Duracion: 2243ms
- Latencia: p50=1444ms, p95=2143ms, p99=2215ms, max=2230ms
- Detalle: `{"cuentaId":"ef216b4d-66ae-4133-850b-10877db9dd31","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":46}`

### C6 stock compartido iter 46/100

- Invariante: OK
- Duracion: 3685ms
- Latencia: p50=2358ms, p95=3563ms, p99=3586ms, max=3607ms
- Detalle: `{"productId":"de920c9e-b964-4a03-9fbd-ee6a1be3b443","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":77,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":123,"statuses":{"201":200,"400":40},"iteration":46}`

### C7 reservas mismo slot iter 46/100

- Invariante: OK
- Duracion: 1652ms
- Latencia: p50=1146ms, p95=1598ms, p99=1628ms, max=1635ms
- Detalle: `{"fecha":"2282-02-11","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":46}`

### C5 pago duplicado concurrente iter 47/100

- Invariante: OK
- Duracion: 2038ms
- Latencia: p50=1203ms, p95=1954ms, p99=2021ms, max=2034ms
- Detalle: `{"cuentaId":"755a2f51-2beb-4d91-9e7a-e18262d092f9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":47}`

### C6 stock compartido iter 47/100

- Invariante: OK
- Duracion: 4438ms
- Latencia: p50=2862ms, p95=4228ms, p99=4285ms, max=4321ms
- Detalle: `{"productId":"075a7eec-daf4-407d-afaa-568338f2de0d","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":47}`

### C7 reservas mismo slot iter 47/100

- Invariante: OK
- Duracion: 1408ms
- Latencia: p50=774ms, p95=1347ms, p99=1388ms, max=1389ms
- Detalle: `{"fecha":"2282-02-12","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":47}`

### C5 pago duplicado concurrente iter 48/100

- Invariante: OK
- Duracion: 2908ms
- Latencia: p50=1634ms, p95=2809ms, p99=2890ms, max=2895ms
- Detalle: `{"cuentaId":"66e59a5b-88fb-4db2-b7e1-ae05b6d2c75a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":196,"502":3},"iteration":48}`

### C6 stock compartido iter 48/100

- Invariante: OK
- Duracion: 3667ms
- Latencia: p50=2268ms, p95=3574ms, p99=3613ms, max=3632ms
- Detalle: `{"productId":"619b4da2-66f8-4602-8cdb-dd7d8f2f60b5","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":48}`

### C7 reservas mismo slot iter 48/100

- Invariante: OK
- Duracion: 1217ms
- Latencia: p50=694ms, p95=1145ms, p99=1196ms, max=1204ms
- Detalle: `{"fecha":"2282-02-13","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":48}`

### C5 pago duplicado concurrente iter 49/100

- Invariante: OK
- Duracion: 2745ms
- Latencia: p50=1629ms, p95=2653ms, p99=2728ms, max=2732ms
- Detalle: `{"cuentaId":"e268b5ac-68b0-41f8-87b7-82b9a27e2f20","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":49}`

### C6 stock compartido iter 49/100

- Invariante: OK
- Duracion: 4168ms
- Latencia: p50=2657ms, p95=4059ms, p99=4110ms, max=4119ms
- Detalle: `{"productId":"e0a26d59-7226-49af-83fd-4fd8286e6baf","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":69,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":131,"statuses":{"201":200,"400":40},"iteration":49}`

### C7 reservas mismo slot iter 49/100

- Invariante: OK
- Duracion: 1451ms
- Latencia: p50=977ms, p95=1389ms, p99=1422ms, max=1430ms
- Detalle: `{"fecha":"2282-02-14","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":49}`

### C5 pago duplicado concurrente iter 50/100

- Invariante: OK
- Duracion: 11708ms
- Latencia: p50=1575ms, p95=7535ms, p99=11695ms, max=11698ms
- Detalle: `{"cuentaId":"d60294aa-96a1-4951-be3e-7a7a6ed45d30","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":50}`

### C6 stock compartido iter 50/100

- Invariante: OK
- Duracion: 3205ms
- Latencia: p50=2022ms, p95=3115ms, p99=3137ms, max=3142ms
- Detalle: `{"productId":"87817adb-d304-4226-97b1-25b98a67877e","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":50}`

### C7 reservas mismo slot iter 50/100

- Invariante: OK
- Duracion: 1252ms
- Latencia: p50=884ms, p95=1188ms, p99=1228ms, max=1233ms
- Detalle: `{"fecha":"2282-02-15","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":50}`

### C5 pago duplicado concurrente iter 51/100

- Invariante: OK
- Duracion: 2900ms
- Latencia: p50=1831ms, p95=2805ms, p99=2883ms, max=2896ms
- Detalle: `{"cuentaId":"9cc32901-c1a7-4854-a4ff-cd7f98e5b5a0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":197,"502":2},"iteration":51}`

### C6 stock compartido iter 51/100

- Invariante: OK
- Duracion: 3942ms
- Latencia: p50=2453ms, p95=3864ms, p99=3917ms, max=3929ms
- Detalle: `{"productId":"0388a550-ba3e-4085-abaa-50cf954e8e0a","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":54,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":146,"statuses":{"201":200,"400":40},"iteration":51}`

### C7 reservas mismo slot iter 51/100

- Invariante: OK
- Duracion: 1482ms
- Latencia: p50=939ms, p95=1436ms, p99=1472ms, max=1473ms
- Detalle: `{"fecha":"2282-02-16","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":51}`

### C5 pago duplicado concurrente iter 52/100

- Invariante: OK
- Duracion: 2691ms
- Latencia: p50=1582ms, p95=2572ms, p99=2667ms, max=2679ms
- Detalle: `{"cuentaId":"fc47d690-4ed2-48e8-8cac-3b0f68a64f91","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":52}`

### C6 stock compartido iter 52/100

- Invariante: OK
- Duracion: 19777ms
- Latencia: p50=2263ms, p95=11634ms, p99=11665ms, max=19767ms
- Detalle: `{"productId":"b4956b3f-e010-4c47-ad77-acf499b49bc4","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":52}`

### C7 reservas mismo slot iter 52/100

- Invariante: OK
- Duracion: 1093ms
- Latencia: p50=657ms, p95=1050ms, p99=1075ms, max=1077ms
- Detalle: `{"fecha":"2282-02-17","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":52}`

### C5 pago duplicado concurrente iter 53/100

- Invariante: OK
- Duracion: 3010ms
- Latencia: p50=2045ms, p95=2924ms, p99=2988ms, max=2994ms
- Detalle: `{"cuentaId":"64b04bf7-d703-40ab-a93a-c8dcb1204a4e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":53}`

### C6 stock compartido iter 53/100

- Invariante: OK
- Duracion: 2803ms
- Latencia: p50=1751ms, p95=2731ms, p99=2773ms, max=2778ms
- Detalle: `{"productId":"ab5f8208-0c80-41b9-8c1e-dd627e7df597","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":57,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":143,"statuses":{"201":200,"400":40},"iteration":53}`

### C7 reservas mismo slot iter 53/100

- Invariante: OK
- Duracion: 1156ms
- Latencia: p50=704ms, p95=1108ms, p99=1133ms, max=1133ms
- Detalle: `{"fecha":"2282-02-18","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":53}`

### C5 pago duplicado concurrente iter 54/100

- Invariante: OK
- Duracion: 2129ms
- Latencia: p50=1216ms, p95=2053ms, p99=2113ms, max=2120ms
- Detalle: `{"cuentaId":"f1094711-df98-498f-9db3-bc31f8e0aff6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":54}`

### C6 stock compartido iter 54/100

- Invariante: OK
- Duracion: 3196ms
- Latencia: p50=2022ms, p95=3102ms, p99=3149ms, max=3165ms
- Detalle: `{"productId":"821a1594-5e74-4d0a-8560-e490916b5bbd","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":54}`

### C7 reservas mismo slot iter 54/100

- Invariante: OK
- Duracion: 11652ms
- Latencia: p50=1169ms, p95=11377ms, p99=11413ms, max=11605ms
- Detalle: `{"fecha":"2282-02-19","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":54}`

### C5 pago duplicado concurrente iter 55/100

- Invariante: OK
- Duracion: 60037ms
- Latencia: p50=1404ms, p95=60010ms, p99=60014ms, max=60014ms
- Detalle: `{"cuentaId":"481fb8d4-e046-474f-921c-c89bf2d58bea","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":15,"201":1,"400":184},"iteration":55}`

### C6 stock compartido iter 55/100

- Invariante: OK
- Duracion: 4134ms
- Latencia: p50=2525ms, p95=4019ms, p99=4079ms, max=4095ms
- Detalle: `{"productId":"759958a4-d540-431b-bf41-340983d18bbf","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":69,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":131,"statuses":{"201":200,"400":40},"iteration":55}`

### C7 reservas mismo slot iter 55/100

- Invariante: OK
- Duracion: 1928ms
- Latencia: p50=1388ms, p95=1849ms, p99=1897ms, max=1914ms
- Detalle: `{"fecha":"2282-02-20","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":55}`

### C5 pago duplicado concurrente iter 56/100

- Invariante: OK
- Duracion: 3045ms
- Latencia: p50=1660ms, p95=2797ms, p99=3016ms, max=3024ms
- Detalle: `{"cuentaId":"f6095361-1ac4-48cf-aa47-844dbe231764","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":56}`

### C6 stock compartido iter 56/100

- Invariante: OK
- Duracion: 3874ms
- Latencia: p50=2397ms, p95=3717ms, p99=3760ms, max=3797ms
- Detalle: `{"productId":"880b224d-d84a-483c-9df3-969d656d27fd","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":54,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":146,"statuses":{"201":200,"400":40},"iteration":56}`

### C7 reservas mismo slot iter 56/100

- Invariante: OK
- Duracion: 1368ms
- Latencia: p50=930ms, p95=1310ms, p99=1333ms, max=1338ms
- Detalle: `{"fecha":"2282-02-21","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":56}`

### C5 pago duplicado concurrente iter 57/100

- Invariante: OK
- Duracion: 2185ms
- Latencia: p50=1281ms, p95=2118ms, p99=2170ms, max=2171ms
- Detalle: `{"cuentaId":"a0a5f4aa-87ca-42b0-8408-2a3c27383647","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":57}`

### C6 stock compartido iter 57/100

- Invariante: OK
- Duracion: 3804ms
- Latencia: p50=2371ms, p95=3684ms, p99=3715ms, max=3728ms
- Detalle: `{"productId":"adebf08a-5f3c-4f82-813a-ca3861d71165","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":76,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":124,"statuses":{"201":200,"400":40},"iteration":57}`

### C7 reservas mismo slot iter 57/100

- Invariante: OK
- Duracion: 1291ms
- Latencia: p50=656ms, p95=1248ms, p99=1275ms, max=1276ms
- Detalle: `{"fecha":"2282-02-22","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":57}`

### C5 pago duplicado concurrente iter 58/100

- Invariante: OK
- Duracion: 2586ms
- Latencia: p50=1585ms, p95=2464ms, p99=2547ms, max=2553ms
- Detalle: `{"cuentaId":"f7cb87af-fe8b-47d6-8a16-9e93ed1b281f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":58}`

### C6 stock compartido iter 58/100

- Invariante: OK
- Duracion: 4052ms
- Latencia: p50=2741ms, p95=3939ms, p99=3984ms, max=4011ms
- Detalle: `{"productId":"eeb1fef0-a979-49e5-a18c-87cc7d26be9b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":56,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":144,"statuses":{"201":200,"400":40},"iteration":58}`

### C7 reservas mismo slot iter 58/100

- Invariante: OK
- Duracion: 1044ms
- Latencia: p50=726ms, p95=996ms, p99=1023ms, max=1023ms
- Detalle: `{"fecha":"2282-02-23","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":58}`

### C5 pago duplicado concurrente iter 59/100

- Invariante: OK
- Duracion: 2237ms
- Latencia: p50=1374ms, p95=2143ms, p99=2212ms, max=2219ms
- Detalle: `{"cuentaId":"25d108ff-05dc-4d22-bea9-71556502c80c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":59}`

### C6 stock compartido iter 59/100

- Invariante: OK
- Duracion: 3318ms
- Latencia: p50=2070ms, p95=3236ms, p99=3258ms, max=3264ms
- Detalle: `{"productId":"f04cb542-7320-459f-ac54-d27bd2f7ed2a","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":73,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":127,"statuses":{"201":200,"400":40},"iteration":59}`

### C7 reservas mismo slot iter 59/100

- Invariante: OK
- Duracion: 1370ms
- Latencia: p50=772ms, p95=1322ms, p99=1357ms, max=1359ms
- Detalle: `{"fecha":"2282-02-24","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":59}`

### C5 pago duplicado concurrente iter 60/100

- Invariante: OK
- Duracion: 2276ms
- Latencia: p50=1306ms, p95=2171ms, p99=2248ms, max=2256ms
- Detalle: `{"cuentaId":"271236de-8ef3-40ac-a2ae-a5f33d382240","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":60}`

### C6 stock compartido iter 60/100

- Invariante: OK
- Duracion: 3255ms
- Latencia: p50=2009ms, p95=3120ms, p99=3155ms, max=3165ms
- Detalle: `{"productId":"09f58c90-e4d3-45f1-958a-f25b3444f157","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":60}`

### C7 reservas mismo slot iter 60/100

- Invariante: OK
- Duracion: 980ms
- Latencia: p50=593ms, p95=944ms, p99=971ms, max=972ms
- Detalle: `{"fecha":"2282-02-25","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":60}`

### C5 pago duplicado concurrente iter 61/100

- Invariante: OK
- Duracion: 30101ms
- Latencia: p50=1099ms, p95=30089ms, p99=30091ms, max=30091ms
- Detalle: `{"cuentaId":"f764a4ac-e83d-45f5-97ce-463e683979b0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":20,"201":1,"400":174,"502":5},"iteration":61}`

### C6 stock compartido iter 61/100

- Invariante: OK
- Duracion: 3443ms
- Latencia: p50=2196ms, p95=3307ms, p99=3342ms, max=3353ms
- Detalle: `{"productId":"1793b81a-e4b6-4463-aab2-69dd8674b201","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":75,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":125,"statuses":{"201":200,"400":40},"iteration":61}`

### C7 reservas mismo slot iter 61/100

- Invariante: OK
- Duracion: 978ms
- Latencia: p50=644ms, p95=935ms, p99=965ms, max=966ms
- Detalle: `{"fecha":"2282-02-26","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":61}`

### C5 pago duplicado concurrente iter 62/100

- Invariante: OK
- Duracion: 2420ms
- Latencia: p50=1603ms, p95=2337ms, p99=2388ms, max=2400ms
- Detalle: `{"cuentaId":"91fd3756-53d8-44ae-ad90-890ab0cb61a1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":62}`

### C6 stock compartido iter 62/100

- Invariante: OK
- Duracion: 3244ms
- Latencia: p50=2080ms, p95=3160ms, p99=3208ms, max=3220ms
- Detalle: `{"productId":"9fc9037c-d40a-4708-8f3c-2a7a31d3e254","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":62}`

### C7 reservas mismo slot iter 62/100

- Invariante: OK
- Duracion: 1201ms
- Latencia: p50=828ms, p95=1138ms, p99=1179ms, max=1182ms
- Detalle: `{"fecha":"2282-02-27","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":62}`

### C5 pago duplicado concurrente iter 63/100

- Invariante: OK
- Duracion: 2371ms
- Latencia: p50=1506ms, p95=2280ms, p99=2351ms, max=2359ms
- Detalle: `{"cuentaId":"cecd1f9f-ad9e-48dc-a393-18e90fbece0b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":63}`

### C6 stock compartido iter 63/100

- Invariante: OK
- Duracion: 3225ms
- Latencia: p50=2008ms, p95=3149ms, p99=3179ms, max=3202ms
- Detalle: `{"productId":"18cdff8b-ffae-4b79-8a02-448733ce56c1","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":63}`

### C7 reservas mismo slot iter 63/100

- Invariante: OK
- Duracion: 835ms
- Latencia: p50=552ms, p95=796ms, p99=817ms, max=818ms
- Detalle: `{"fecha":"2282-02-28","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":63}`

### C5 pago duplicado concurrente iter 64/100

- Invariante: OK
- Duracion: 2064ms
- Latencia: p50=1227ms, p95=1990ms, p99=2047ms, max=2056ms
- Detalle: `{"cuentaId":"7bfcedb3-5d7f-43ca-bb39-328aa006b570","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":64}`

### C6 stock compartido iter 64/100

- Invariante: OK
- Duracion: 35718ms
- Latencia: p50=1764ms, p95=2769ms, p99=2801ms, max=35708ms
- Detalle: `{"productId":"cd5985c6-7ce3-4989-83b0-00762e1d7839","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":64}`

### C7 reservas mismo slot iter 64/100

- Invariante: OK
- Duracion: 1484ms
- Latencia: p50=699ms, p95=1427ms, p99=1470ms, max=1473ms
- Detalle: `{"fecha":"2282-03-01","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":64}`

### C5 pago duplicado concurrente iter 65/100

- Invariante: OK
- Duracion: 2442ms
- Latencia: p50=1417ms, p95=2350ms, p99=2411ms, max=2420ms
- Detalle: `{"cuentaId":"b97cd2ff-ef17-4d5f-a5d8-387bcc7cb927","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":191,"502":8},"iteration":65}`

### C6 stock compartido iter 65/100

- Invariante: OK
- Duracion: 3653ms
- Latencia: p50=2212ms, p95=3507ms, p99=3557ms, max=3586ms
- Detalle: `{"productId":"a05e80c0-d7cd-4f8a-b1c8-b03fc0f113d9","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":76,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":124,"statuses":{"201":200,"400":40},"iteration":65}`

### C7 reservas mismo slot iter 65/100

- Invariante: OK
- Duracion: 1180ms
- Latencia: p50=791ms, p95=1126ms, p99=1158ms, max=1158ms
- Detalle: `{"fecha":"2282-03-02","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":65}`

### C5 pago duplicado concurrente iter 66/100

- Invariante: OK
- Duracion: 2257ms
- Latencia: p50=1442ms, p95=2187ms, p99=2243ms, max=2249ms
- Detalle: `{"cuentaId":"b4266fb9-c3a3-4962-8079-97c6b1778eb9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":66}`

### C6 stock compartido iter 66/100

- Invariante: OK
- Duracion: 3446ms
- Latencia: p50=2151ms, p95=3352ms, p99=3391ms, max=3396ms
- Detalle: `{"productId":"6c0630f3-6822-401e-acb1-d9f700b1b052","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":75,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":125,"statuses":{"201":200,"400":40},"iteration":66}`

### C7 reservas mismo slot iter 66/100

- Invariante: OK
- Duracion: 1028ms
- Latencia: p50=547ms, p95=971ms, p99=1009ms, max=1013ms
- Detalle: `{"fecha":"2282-03-03","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":66}`

### C5 pago duplicado concurrente iter 67/100

- Invariante: OK
- Duracion: 2335ms
- Latencia: p50=1514ms, p95=2263ms, p99=2320ms, max=2328ms
- Detalle: `{"cuentaId":"e205e085-6f7e-41cc-bd0d-bb2fed2a68e5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":67}`

### C6 stock compartido iter 67/100

- Invariante: OK
- Duracion: 3377ms
- Latencia: p50=2191ms, p95=3304ms, p99=3349ms, max=3356ms
- Detalle: `{"productId":"44b0b15d-2056-4b2a-8250-c2f151fde3dc","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":67}`

### C7 reservas mismo slot iter 67/100

- Invariante: OK
- Duracion: 1270ms
- Latencia: p50=821ms, p95=1224ms, p99=1252ms, max=1253ms
- Detalle: `{"fecha":"2282-03-04","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":67}`

### C5 pago duplicado concurrente iter 68/100

- Invariante: OK
- Duracion: 2392ms
- Latencia: p50=1542ms, p95=2318ms, p99=2374ms, max=2380ms
- Detalle: `{"cuentaId":"23b0e8a9-0385-4373-8072-c038fae15d27","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":198,"502":1},"iteration":68}`

### C6 stock compartido iter 68/100

- Invariante: OK
- Duracion: 3531ms
- Latencia: p50=2281ms, p95=3442ms, p99=3472ms, max=3490ms
- Detalle: `{"productId":"d8f247ac-ea3f-4d4b-a571-e2493b9a9a8b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":62,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":138,"statuses":{"201":200,"400":40},"iteration":68}`

### C7 reservas mismo slot iter 68/100

- Invariante: OK
- Duracion: 1230ms
- Latencia: p50=845ms, p95=1183ms, p99=1208ms, max=1209ms
- Detalle: `{"fecha":"2282-03-05","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":68}`

### C5 pago duplicado concurrente iter 69/100

- Invariante: OK
- Duracion: 2391ms
- Latencia: p50=1321ms, p95=2295ms, p99=2371ms, max=2380ms
- Detalle: `{"cuentaId":"eacef6df-1361-462f-8631-1d984bce8b4b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":69}`

### C6 stock compartido iter 69/100

- Invariante: OK
- Duracion: 19908ms
- Latencia: p50=2207ms, p95=19855ms, p99=19890ms, max=19896ms
- Detalle: `{"productId":"218cdb19-e793-459d-b1d2-dee6aa25e9cd","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":69}`

### C7 reservas mismo slot iter 69/100

- Invariante: OK
- Duracion: 1033ms
- Latencia: p50=575ms, p95=984ms, p99=1022ms, max=1023ms
- Detalle: `{"fecha":"2282-03-06","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":69}`

### C5 pago duplicado concurrente iter 70/100

- Invariante: OK
- Duracion: 2555ms
- Latencia: p50=1512ms, p95=2448ms, p99=2536ms, max=2542ms
- Detalle: `{"cuentaId":"20fcd00c-3e9c-4892-908a-c86799b1c815","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":198,"502":1},"iteration":70}`

### C6 stock compartido iter 70/100

- Invariante: OK
- Duracion: 3351ms
- Latencia: p50=2063ms, p95=3268ms, p99=3305ms, max=3320ms
- Detalle: `{"productId":"f20998a2-8ba0-483c-b9f4-ef44a7cf20db","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":49,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":151,"statuses":{"201":200,"400":40},"iteration":70}`

### C7 reservas mismo slot iter 70/100

- Invariante: OK
- Duracion: 1081ms
- Latencia: p50=610ms, p95=1029ms, p99=1056ms, max=1074ms
- Detalle: `{"fecha":"2282-03-07","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":70}`

### C5 pago duplicado concurrente iter 71/100

- Invariante: OK
- Duracion: 19823ms
- Latencia: p50=1451ms, p95=19734ms, p99=19811ms, max=19820ms
- Detalle: `{"cuentaId":"0a55f312-cd35-4568-8b47-4f6cb8e39d24","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":71}`

### C6 stock compartido iter 71/100

- Invariante: OK
- Duracion: 3546ms
- Latencia: p50=2339ms, p95=3442ms, p99=3465ms, max=3471ms
- Detalle: `{"productId":"429ecb87-59e4-4de9-8abc-9976f457f57c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":57,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":143,"statuses":{"201":200,"400":40},"iteration":71}`

### C7 reservas mismo slot iter 71/100

- Invariante: OK
- Duracion: 1867ms
- Latencia: p50=1241ms, p95=1804ms, p99=1850ms, max=1853ms
- Detalle: `{"fecha":"2282-03-08","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":71}`

### C5 pago duplicado concurrente iter 72/100

- Invariante: OK
- Duracion: 2245ms
- Latencia: p50=1245ms, p95=2145ms, p99=2223ms, max=2230ms
- Detalle: `{"cuentaId":"3b51e87a-1a4e-4bdf-98ca-c51f7bbe8449","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":72}`

### C6 stock compartido iter 72/100

- Invariante: OK
- Duracion: 3582ms
- Latencia: p50=2232ms, p95=3505ms, p99=3530ms, max=3536ms
- Detalle: `{"productId":"941bc4b9-b667-43c9-90bf-abc99f7a42a2","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":51,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":149,"statuses":{"201":200,"400":40},"iteration":72}`

### C7 reservas mismo slot iter 72/100

- Invariante: OK
- Duracion: 847ms
- Latencia: p50=515ms, p95=805ms, p99=834ms, max=835ms
- Detalle: `{"fecha":"2282-03-09","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":72}`

### C5 pago duplicado concurrente iter 73/100

- Invariante: OK
- Duracion: 2204ms
- Latencia: p50=1360ms, p95=2125ms, p99=2187ms, max=2194ms
- Detalle: `{"cuentaId":"f22af80d-8d13-4fa8-817e-63a29aa22d88","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":73}`

### C6 stock compartido iter 73/100

- Invariante: OK
- Duracion: 3371ms
- Latencia: p50=2134ms, p95=3264ms, p99=3286ms, max=3292ms
- Detalle: `{"productId":"2476023e-2d0e-4d34-95ee-0cbdd81fd95f","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":72,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":128,"statuses":{"201":200,"400":40},"iteration":73}`

### C7 reservas mismo slot iter 73/100

- Invariante: OK
- Duracion: 1297ms
- Latencia: p50=663ms, p95=1233ms, p99=1282ms, max=1286ms
- Detalle: `{"fecha":"2282-03-10","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":73}`

### C5 pago duplicado concurrente iter 74/100

- Invariante: OK
- Duracion: 2216ms
- Latencia: p50=1425ms, p95=2136ms, p99=2191ms, max=2196ms
- Detalle: `{"cuentaId":"ee532c1e-8a34-446f-9f3d-f98ef450edef","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":74}`

### C6 stock compartido iter 74/100

- Invariante: OK
- Duracion: 3503ms
- Latencia: p50=2240ms, p95=3397ms, p99=3429ms, max=3444ms
- Detalle: `{"productId":"0e417ea9-a76c-4947-8fbe-7f118a219d3b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":58,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":142,"statuses":{"201":200,"400":40},"iteration":74}`

### C7 reservas mismo slot iter 74/100

- Invariante: OK
- Duracion: 11549ms
- Latencia: p50=654ms, p95=11323ms, p99=11537ms, max=11538ms
- Detalle: `{"fecha":"2282-03-11","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":74}`

### C5 pago duplicado concurrente iter 75/100

- Invariante: OK
- Duracion: 2465ms
- Latencia: p50=1515ms, p95=2241ms, p99=2438ms, max=2445ms
- Detalle: `{"cuentaId":"a43d8b26-e964-441b-832d-ef6e6c0f1089","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":75}`

### C6 stock compartido iter 75/100

- Invariante: OK
- Duracion: 3363ms
- Latencia: p50=2124ms, p95=3269ms, p99=3327ms, max=3338ms
- Detalle: `{"productId":"b0580645-acf7-4ea9-be1c-ddd9196161cc","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":75}`

### C7 reservas mismo slot iter 75/100

- Invariante: OK
- Duracion: 1151ms
- Latencia: p50=593ms, p95=1109ms, p99=1138ms, max=1139ms
- Detalle: `{"fecha":"2282-03-12","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":75}`

### C5 pago duplicado concurrente iter 76/100

- Invariante: OK
- Duracion: 2149ms
- Latencia: p50=1399ms, p95=2075ms, p99=2132ms, max=2141ms
- Detalle: `{"cuentaId":"8c99b4c1-1854-4be0-8471-97754f59b94e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":76}`

### C6 stock compartido iter 76/100

- Invariante: OK
- Duracion: 3157ms
- Latencia: p50=1982ms, p95=3035ms, p99=3066ms, max=3071ms
- Detalle: `{"productId":"7cc36975-4072-4f50-9149-82a7e9c2d88b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":76}`

### C7 reservas mismo slot iter 76/100

- Invariante: OK
- Duracion: 19722ms
- Latencia: p50=834ms, p95=19683ms, p99=19709ms, max=19711ms
- Detalle: `{"fecha":"2282-03-13","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":76}`

### C5 pago duplicado concurrente iter 77/100

- Invariante: OK
- Duracion: 2304ms
- Latencia: p50=1409ms, p95=2209ms, p99=2284ms, max=2294ms
- Detalle: `{"cuentaId":"36d4b844-77f9-4c1a-9e6f-e9bb9bc657a3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":77}`

### C6 stock compartido iter 77/100

- Invariante: OK
- Duracion: 3282ms
- Latencia: p50=2081ms, p95=3192ms, p99=3213ms, max=3223ms
- Detalle: `{"productId":"02b276e1-7464-4447-a006-9a0eaaea891c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":77}`

### C7 reservas mismo slot iter 77/100

- Invariante: OK
- Duracion: 19532ms
- Latencia: p50=584ms, p95=1040ms, p99=19525ms, max=19526ms
- Detalle: `{"fecha":"2282-03-14","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":77}`

### C5 pago duplicado concurrente iter 78/100

- Invariante: OK
- Duracion: 60014ms
- Latencia: p50=1533ms, p95=2271ms, p99=60013ms, max=60013ms
- Detalle: `{"cuentaId":"97e64b3c-c0a7-4451-9ab4-c1e60ef3b0c1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":4,"201":1,"400":195},"iteration":78}`

### C6 stock compartido iter 78/100

- Invariante: OK
- Duracion: 2901ms
- Latencia: p50=1810ms, p95=2810ms, p99=2845ms, max=2874ms
- Detalle: `{"productId":"779b19ae-2181-44ec-97d2-1aeb014bac40","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":59,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":141,"statuses":{"201":200,"400":40},"iteration":78}`

### C7 reservas mismo slot iter 78/100

- Invariante: OK
- Duracion: 1177ms
- Latencia: p50=740ms, p95=1133ms, p99=1161ms, max=1162ms
- Detalle: `{"fecha":"2282-03-15","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":78}`

### C5 pago duplicado concurrente iter 79/100

- Invariante: OK
- Duracion: 2092ms
- Latencia: p50=1163ms, p95=2016ms, p99=2078ms, max=2084ms
- Detalle: `{"cuentaId":"18921f84-7143-45cf-9cb2-ea3867f30875","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":79}`

### C6 stock compartido iter 79/100

- Invariante: OK
- Duracion: 3110ms
- Latencia: p50=1908ms, p95=2995ms, p99=3047ms, max=3078ms
- Detalle: `{"productId":"80ae59cd-88d9-4404-aa39-9f4a3ecbffa2","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":60,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":140,"statuses":{"201":200,"400":40},"iteration":79}`

### C7 reservas mismo slot iter 79/100

- Invariante: OK
- Duracion: 851ms
- Latencia: p50=571ms, p95=809ms, p99=831ms, max=831ms
- Detalle: `{"fecha":"2282-03-16","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":79}`

### C5 pago duplicado concurrente iter 80/100

- Invariante: OK
- Duracion: 60015ms
- Latencia: p50=1141ms, p95=1839ms, p99=60001ms, max=60009ms
- Detalle: `{"cuentaId":"e12256d2-41ba-42f8-b522-15a686bc52ee","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":3,"201":1,"400":196},"iteration":80}`

### C6 stock compartido iter 80/100

- Invariante: OK
- Duracion: 2861ms
- Latencia: p50=1839ms, p95=2784ms, p99=2820ms, max=2827ms
- Detalle: `{"productId":"1e9c5da6-c5ca-48f0-8a29-43362d89f92d","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":59,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":141,"statuses":{"201":200,"400":40},"iteration":80}`

### C7 reservas mismo slot iter 80/100

- Invariante: OK
- Duracion: 1257ms
- Latencia: p50=771ms, p95=1194ms, p99=1233ms, max=1237ms
- Detalle: `{"fecha":"2282-03-17","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":80}`

### C5 pago duplicado concurrente iter 81/100

- Invariante: OK
- Duracion: 60016ms
- Latencia: p50=1331ms, p95=2093ms, p99=60015ms, max=60015ms
- Detalle: `{"cuentaId":"06e9eaf4-e343-4bd0-804b-bf93c2461b22","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":7,"201":1,"400":192},"iteration":81}`

### C6 stock compartido iter 81/100

- Invariante: OK
- Duracion: 3090ms
- Latencia: p50=1893ms, p95=3019ms, p99=3047ms, max=3052ms
- Detalle: `{"productId":"2a058150-acb5-4220-8399-a3fc218a9b12","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":81}`

### C7 reservas mismo slot iter 81/100

- Invariante: OK
- Duracion: 911ms
- Latencia: p50=580ms, p95=867ms, p99=892ms, max=896ms
- Detalle: `{"fecha":"2282-03-18","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":81}`

### C5 pago duplicado concurrente iter 82/100

- Invariante: OK
- Duracion: 30104ms
- Latencia: p50=1313ms, p95=2019ms, p99=30095ms, max=30096ms
- Detalle: `{"cuentaId":"63277bf2-2f1c-4775-9781-daba8330e249","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":9,"201":1,"400":186,"502":4},"iteration":82}`

### C6 stock compartido iter 82/100

- Invariante: OK
- Duracion: 2948ms
- Latencia: p50=1850ms, p95=2848ms, p99=2874ms, max=2879ms
- Detalle: `{"productId":"61745c37-f9a3-4b8a-8338-9b0c9371d1a1","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":67,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":133,"statuses":{"201":200,"400":40},"iteration":82}`

### C7 reservas mismo slot iter 82/100

- Invariante: OK
- Duracion: 904ms
- Latencia: p50=563ms, p95=865ms, p99=884ms, max=884ms
- Detalle: `{"fecha":"2282-03-19","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":82}`

### C5 pago duplicado concurrente iter 83/100

- Invariante: OK
- Duracion: 2025ms
- Latencia: p50=1248ms, p95=1948ms, p99=2004ms, max=2011ms
- Detalle: `{"cuentaId":"6f770cb2-afd2-4c68-9bd5-3314e29d58f8","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":83}`

### C6 stock compartido iter 83/100

- Invariante: OK
- Duracion: 3252ms
- Latencia: p50=2151ms, p95=3122ms, p99=3163ms, max=3167ms
- Detalle: `{"productId":"811c2dd8-3f42-40b3-b80b-37cf197d3672","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":70,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":130,"statuses":{"201":200,"400":40},"iteration":83}`

### C7 reservas mismo slot iter 83/100

- Invariante: OK
- Duracion: 899ms
- Latencia: p50=595ms, p95=867ms, p99=892ms, max=892ms
- Detalle: `{"fecha":"2282-03-20","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":83}`

### C5 pago duplicado concurrente iter 84/100

- Invariante: OK
- Duracion: 2317ms
- Latencia: p50=1480ms, p95=2225ms, p99=2288ms, max=2293ms
- Detalle: `{"cuentaId":"0589447e-4ae6-4f18-9a74-823139d6883f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":84}`

### C6 stock compartido iter 84/100

- Invariante: OK
- Duracion: 35746ms
- Latencia: p50=1751ms, p95=19666ms, p99=19702ms, max=35735ms
- Detalle: `{"productId":"5db4472c-eb01-4aeb-ab58-02786739138e","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":84}`

### C7 reservas mismo slot iter 84/100

- Invariante: OK
- Duracion: 966ms
- Latencia: p50=524ms, p95=905ms, p99=954ms, max=958ms
- Detalle: `{"fecha":"2282-03-21","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":84}`

### C5 pago duplicado concurrente iter 85/100

- Invariante: OK
- Duracion: 2144ms
- Latencia: p50=1291ms, p95=2045ms, p99=2119ms, max=2137ms
- Detalle: `{"cuentaId":"a59695ab-dcd0-4a99-9de4-1869e1bd0f6e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":85}`

### C6 stock compartido iter 85/100

- Invariante: OK
- Duracion: 2929ms
- Latencia: p50=1831ms, p95=2844ms, p99=2866ms, max=2875ms
- Detalle: `{"productId":"f40984ac-453f-4d6c-a569-71a2f1093acd","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":61,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":139,"statuses":{"201":200,"400":40},"iteration":85}`

### C7 reservas mismo slot iter 85/100

- Invariante: OK
- Duracion: 797ms
- Latencia: p50=504ms, p95=760ms, p99=785ms, max=785ms
- Detalle: `{"fecha":"2282-03-22","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":85}`

### C5 pago duplicado concurrente iter 86/100

- Invariante: OK
- Duracion: 1878ms
- Latencia: p50=1098ms, p95=1799ms, p99=1860ms, max=1867ms
- Detalle: `{"cuentaId":"cd958afd-cb5b-446e-bd65-65f60aa832e6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":86}`

### C6 stock compartido iter 86/100

- Invariante: OK
- Duracion: 2897ms
- Latencia: p50=1853ms, p95=2804ms, p99=2828ms, max=2838ms
- Detalle: `{"productId":"4e813daf-12b7-4445-a183-27250f4747b4","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":59,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":141,"statuses":{"201":200,"400":40},"iteration":86}`

### C7 reservas mismo slot iter 86/100

- Invariante: OK
- Duracion: 839ms
- Latencia: p50=557ms, p95=790ms, p99=814ms, max=815ms
- Detalle: `{"fecha":"2282-03-23","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":86}`

### C5 pago duplicado concurrente iter 87/100

- Invariante: OK
- Duracion: 1983ms
- Latencia: p50=1181ms, p95=1903ms, p99=1960ms, max=1966ms
- Detalle: `{"cuentaId":"bf49665d-b29e-459f-b2f7-de96aee422bb","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":87}`

### C6 stock compartido iter 87/100

- Invariante: OK
- Duracion: 3004ms
- Latencia: p50=1900ms, p95=2929ms, p99=2963ms, max=2975ms
- Detalle: `{"productId":"8fbdd05d-ba1a-4209-87f2-2b8db564840c","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":69,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":131,"statuses":{"201":200,"400":40},"iteration":87}`

### C7 reservas mismo slot iter 87/100

- Invariante: OK
- Duracion: 1314ms
- Latencia: p50=810ms, p95=1271ms, p99=1298ms, max=1298ms
- Detalle: `{"fecha":"2282-03-24","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":87}`

### C5 pago duplicado concurrente iter 88/100

- Invariante: OK
- Duracion: 2027ms
- Latencia: p50=1231ms, p95=1939ms, p99=2008ms, max=2019ms
- Detalle: `{"cuentaId":"5c072a04-7aad-4206-b570-868aa1c2ed26","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":88}`

### C6 stock compartido iter 88/100

- Invariante: OK
- Duracion: 3006ms
- Latencia: p50=1902ms, p95=2933ms, p99=2971ms, max=2978ms
- Detalle: `{"productId":"a888d8b5-731a-41f0-bbd2-739dfc26f6da","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":68,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":132,"statuses":{"201":200,"400":40},"iteration":88}`

### C7 reservas mismo slot iter 88/100

- Invariante: OK
- Duracion: 959ms
- Latencia: p50=563ms, p95=926ms, p99=945ms, max=949ms
- Detalle: `{"fecha":"2282-03-25","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":88}`

### C5 pago duplicado concurrente iter 89/100

- Invariante: OK
- Duracion: 19926ms
- Latencia: p50=1161ms, p95=19840ms, p99=19912ms, max=19924ms
- Detalle: `{"cuentaId":"2855ca7f-85bf-41ac-851a-07b6fa7f14b2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":196,"502":3},"iteration":89}`

### C6 stock compartido iter 89/100

- Invariante: OK
- Duracion: 2919ms
- Latencia: p50=1846ms, p95=2732ms, p99=2776ms, max=2796ms
- Detalle: `{"productId":"989e4eb1-7b27-4b5e-94eb-549c797c96b1","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":75,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":125,"statuses":{"201":200,"400":40},"iteration":89}`

### C7 reservas mismo slot iter 89/100

- Invariante: OK
- Duracion: 975ms
- Latencia: p50=558ms, p95=918ms, p99=948ms, max=951ms
- Detalle: `{"fecha":"2282-03-26","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":89}`

### C5 pago duplicado concurrente iter 90/100

- Invariante: OK
- Duracion: 2123ms
- Latencia: p50=1285ms, p95=2040ms, p99=2104ms, max=2105ms
- Detalle: `{"cuentaId":"ad191738-c34b-4358-89d4-d7a25d85bbad","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":90}`

### C6 stock compartido iter 90/100

- Invariante: OK
- Duracion: 2818ms
- Latencia: p50=1753ms, p95=2740ms, p99=2777ms, max=2784ms
- Detalle: `{"productId":"93d0cd5f-607b-48ec-b4c8-17973d8693e4","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":58,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":142,"statuses":{"201":200,"400":40},"iteration":90}`

### C7 reservas mismo slot iter 90/100

- Invariante: OK
- Duracion: 979ms
- Latencia: p50=516ms, p95=937ms, p99=970ms, max=971ms
- Detalle: `{"fecha":"2282-03-27","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":90}`

### C5 pago duplicado concurrente iter 91/100

- Invariante: OK
- Duracion: 1948ms
- Latencia: p50=1137ms, p95=1852ms, p99=1931ms, max=1940ms
- Detalle: `{"cuentaId":"c086ff4b-bc6a-400f-a89e-504a237f0046","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":91}`

### C6 stock compartido iter 91/100

- Invariante: OK
- Duracion: 35854ms
- Latencia: p50=1878ms, p95=2884ms, p99=2935ms, max=35844ms
- Detalle: `{"productId":"09853f59-5099-47b9-ac12-31cb0d88eafb","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":91}`

### C7 reservas mismo slot iter 91/100

- Invariante: OK
- Duracion: 851ms
- Latencia: p50=525ms, p95=827ms, p99=845ms, max=845ms
- Detalle: `{"fecha":"2282-03-28","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":91}`

### C5 pago duplicado concurrente iter 92/100

- Invariante: OK
- Duracion: 1940ms
- Latencia: p50=1193ms, p95=1857ms, p99=1924ms, max=1932ms
- Detalle: `{"cuentaId":"7102c15d-c1cd-4697-9603-82cb639238c3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":92}`

### C6 stock compartido iter 92/100

- Invariante: OK
- Duracion: 3073ms
- Latencia: p50=1976ms, p95=2959ms, p99=2974ms, max=2982ms
- Detalle: `{"productId":"14260c62-2451-4e89-82f9-b1791dd507ac","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":74,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":126,"statuses":{"201":200,"400":40},"iteration":92}`

### C7 reservas mismo slot iter 92/100

- Invariante: OK
- Duracion: 19702ms
- Latencia: p50=575ms, p95=19668ms, p99=19693ms, max=19696ms
- Detalle: `{"fecha":"2282-03-29","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":92}`

### C5 pago duplicado concurrente iter 93/100

- Invariante: OK
- Duracion: 2085ms
- Latencia: p50=1244ms, p95=1991ms, p99=2060ms, max=2067ms
- Detalle: `{"cuentaId":"96b59f2a-19de-46ff-9f7b-0f2ca1716cb2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":93}`

### C6 stock compartido iter 93/100

- Invariante: OK
- Duracion: 2933ms
- Latencia: p50=1836ms, p95=2864ms, p99=2893ms, max=2897ms
- Detalle: `{"productId":"fa4a9b45-b606-4885-be76-08c83b18c38b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":58,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":142,"statuses":{"201":200,"400":40},"iteration":93}`

### C7 reservas mismo slot iter 93/100

- Invariante: OK
- Duracion: 956ms
- Latencia: p50=616ms, p95=923ms, p99=944ms, max=944ms
- Detalle: `{"fecha":"2282-03-30","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":93}`

### C5 pago duplicado concurrente iter 94/100

- Invariante: OK
- Duracion: 2044ms
- Latencia: p50=1201ms, p95=1921ms, p99=2020ms, max=2037ms
- Detalle: `{"cuentaId":"3de1cbc8-e95b-4dd2-8d68-bf268d9b5f26","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":198,"502":1},"iteration":94}`

### C6 stock compartido iter 94/100

- Invariante: OK
- Duracion: 3082ms
- Latencia: p50=1929ms, p95=2997ms, p99=3016ms, max=3031ms
- Detalle: `{"productId":"1f65e07b-9bd2-4c59-abff-57e074d6ef42","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":94}`

### C7 reservas mismo slot iter 94/100

- Invariante: OK
- Duracion: 925ms
- Latencia: p50=528ms, p95=877ms, p99=903ms, max=904ms
- Detalle: `{"fecha":"2282-03-31","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":94}`

### C5 pago duplicado concurrente iter 95/100

- Invariante: OK
- Duracion: 2022ms
- Latencia: p50=1251ms, p95=1950ms, p99=2000ms, max=2006ms
- Detalle: `{"cuentaId":"fa8802d8-fa02-4eb9-850a-35730ee3c0d9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":95}`

### C6 stock compartido iter 95/100

- Invariante: OK
- Duracion: 3003ms
- Latencia: p50=1921ms, p95=2934ms, p99=2975ms, max=2980ms
- Detalle: `{"productId":"a56e2add-f7b8-4edf-b6f1-b304d836821b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":57,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":143,"statuses":{"201":200,"400":40},"iteration":95}`

### C7 reservas mismo slot iter 95/100

- Invariante: OK
- Duracion: 1021ms
- Latencia: p50=543ms, p95=970ms, p99=998ms, max=1010ms
- Detalle: `{"fecha":"2282-04-01","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":95}`

### C5 pago duplicado concurrente iter 96/100

- Invariante: OK
- Duracion: 2211ms
- Latencia: p50=1437ms, p95=2134ms, p99=2190ms, max=2196ms
- Detalle: `{"cuentaId":"79df0554-07d7-48b0-b96f-f6e7a5624fe7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":198,"502":1},"iteration":96}`

### C6 stock compartido iter 96/100

- Invariante: OK
- Duracion: 3033ms
- Latencia: p50=1927ms, p95=2959ms, p99=2997ms, max=3020ms
- Detalle: `{"productId":"7b2d0226-6d8d-4913-90f8-84d9292d552b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":60,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":140,"statuses":{"201":200,"400":40},"iteration":96}`

### C7 reservas mismo slot iter 96/100

- Invariante: OK
- Duracion: 1195ms
- Latencia: p50=824ms, p95=1154ms, p99=1185ms, max=1186ms
- Detalle: `{"fecha":"2282-04-02","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":96}`

### C5 pago duplicado concurrente iter 97/100

- Invariante: OK
- Duracion: 2015ms
- Latencia: p50=1282ms, p95=1952ms, p99=2006ms, max=2010ms
- Detalle: `{"cuentaId":"d43acdf6-4279-4dfe-8ec6-546851fd1f4c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":97}`

### C6 stock compartido iter 97/100

- Invariante: OK
- Duracion: 3052ms
- Latencia: p50=1946ms, p95=2978ms, p99=3018ms, max=3031ms
- Detalle: `{"productId":"2c1a302d-abec-48f4-a51f-bd3791bc3acf","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":63,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":137,"statuses":{"201":200,"400":40},"iteration":97}`

### C7 reservas mismo slot iter 97/100

- Invariante: OK
- Duracion: 996ms
- Latencia: p50=655ms, p95=954ms, p99=979ms, max=980ms
- Detalle: `{"fecha":"2282-04-03","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":97}`

### C5 pago duplicado concurrente iter 98/100

- Invariante: OK
- Duracion: 2054ms
- Latencia: p50=1240ms, p95=1954ms, p99=2033ms, max=2042ms
- Detalle: `{"cuentaId":"9d2f5c21-65d4-48f3-b70e-95e1f44e0499","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":98}`

### C6 stock compartido iter 98/100

- Invariante: OK
- Duracion: 35982ms
- Latencia: p50=1867ms, p95=19692ms, p99=35727ms, max=35969ms
- Detalle: `{"productId":"778f6621-a9aa-40f3-88c1-dd72287b54b8","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":98}`

### C7 reservas mismo slot iter 98/100

- Invariante: OK
- Duracion: 902ms
- Latencia: p50=569ms, p95=871ms, p99=892ms, max=894ms
- Detalle: `{"fecha":"2282-04-04","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":98}`

### C5 pago duplicado concurrente iter 99/100

- Invariante: OK
- Duracion: 2174ms
- Latencia: p50=1282ms, p95=2061ms, p99=2155ms, max=2163ms
- Detalle: `{"cuentaId":"11407724-2fd3-460e-a703-3ee718576cd0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":99}`

### C6 stock compartido iter 99/100

- Invariante: OK
- Duracion: 35561ms
- Latencia: p50=1869ms, p95=2881ms, p99=2908ms, max=35560ms
- Detalle: `{"productId":"bd410a02-be28-4b3b-9bb2-73ea748338f7","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":200,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":0,"statuses":{"201":200,"400":40},"iteration":99}`

### C7 reservas mismo slot iter 99/100

- Invariante: OK
- Duracion: 827ms
- Latencia: p50=460ms, p95=787ms, p99=815ms, max=819ms
- Detalle: `{"fecha":"2282-04-05","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":99}`

### C5 pago duplicado concurrente iter 100/100

- Invariante: OK
- Duracion: 1835ms
- Latencia: p50=1124ms, p95=1759ms, p99=1816ms, max=1830ms
- Detalle: `{"cuentaId":"b65a87c1-c649-49e1-a7a4-c4df57f9a411","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":199},"iteration":100}`

### C6 stock compartido iter 100/100

- Invariante: OK
- Duracion: 3042ms
- Latencia: p50=1947ms, p95=2975ms, p99=3011ms, max=3016ms
- Detalle: `{"productId":"3ed2cbd1-3d9a-4af3-b204-9bb2e9248e4b","stockInicial":200,"attempts":240,"successfulPedidos":200,"effectiveSuccessfulPedidos":68,"rejectedPedidos":40,"clientTimeouts":0,"stockActual":132,"statuses":{"201":200,"400":40},"iteration":100}`

### C7 reservas mismo slot iter 100/100

- Invariante: OK
- Duracion: 19584ms
- Latencia: p50=846ms, p95=19560ms, p99=19579ms, max=19581ms
- Detalle: `{"fecha":"2282-04-06","hora":"18:15","successCount":1,"conflictCount":199,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":100}`

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

## Decision

- Aceptado: la corrida focalizada no encontro inconsistencias con la concurrencia configurada.

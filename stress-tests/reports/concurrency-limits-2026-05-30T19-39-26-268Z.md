# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-30T19:39:26.268Z
- Base URL: http://localhost:8000
- Rama: codex/stock-idempotency-dlq
- Commit: bfd9ff0 Merge pull request #4 from Marcos7PY/codex/security-and-limit-tests
- Concurrencia base: 100
- Iteraciones: 100
- Resultado: 300/300 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/100 | OK | 100 | {"201":1,"400":99} | 1629ms | 58.93 |
| C6 stock compartido iter 1/100 | OK | 120 | {"201":100,"400":20} | 1514ms | 77.07 |
| C7 reservas mismo slot iter 1/100 | OK | 100 | {"201":1,"409":99} | 460ms | 208.77 |
| C5 pago duplicado concurrente iter 2/100 | OK | 100 | {"201":1,"400":99} | 1086ms | 89.29 |
| C6 stock compartido iter 2/100 | OK | 120 | {"201":100,"400":20} | 1483ms | 78.79 |
| C7 reservas mismo slot iter 2/100 | OK | 100 | {"201":1,"409":99} | 710ms | 136.24 |
| C5 pago duplicado concurrente iter 3/100 | OK | 100 | {"201":1,"400":99} | 1156ms | 83.54 |
| C6 stock compartido iter 3/100 | OK | 120 | {"201":100,"400":20} | 1466ms | 80.27 |
| C7 reservas mismo slot iter 3/100 | OK | 100 | {"201":1,"409":99} | 523ms | 182.82 |
| C5 pago duplicado concurrente iter 4/100 | OK | 100 | {"201":1,"400":99} | 1020ms | 2.8 |
| C6 stock compartido iter 4/100 | OK | 120 | {"201":100,"400":20} | 1536ms | 76.58 |
| C7 reservas mismo slot iter 4/100 | OK | 100 | {"201":1,"409":99} | 533ms | 180.51 |
| C5 pago duplicado concurrente iter 5/100 | OK | 100 | {"201":1,"400":99} | 1099ms | 88.18 |
| C6 stock compartido iter 5/100 | OK | 120 | {"201":100,"400":20} | 1438ms | 81.41 |
| C7 reservas mismo slot iter 5/100 | OK | 100 | {"201":1,"409":99} | 634ms | 151.98 |
| C5 pago duplicado concurrente iter 6/100 | OK | 100 | {"201":1,"400":99} | 1034ms | 93.72 |
| C6 stock compartido iter 6/100 | OK | 120 | {"201":100,"400":20} | 1449ms | 81.86 |
| C7 reservas mismo slot iter 6/100 | OK | 100 | {"201":1,"409":99} | 726ms | 133.69 |
| C5 pago duplicado concurrente iter 7/100 | OK | 100 | {"201":1,"400":99} | 35705ms | 2.8 |
| C6 stock compartido iter 7/100 | OK | 120 | {"201":100,"400":20} | 1283ms | 91.05 |
| C7 reservas mismo slot iter 7/100 | OK | 100 | {"201":1,"409":99} | 574ms | 168.92 |
| C5 pago duplicado concurrente iter 8/100 | OK | 100 | {"201":1,"400":99} | 1127ms | 86.28 |
| C6 stock compartido iter 8/100 | OK | 120 | {"0":10,"201":100,"400":10} | 60004ms | 2 |
| C7 reservas mismo slot iter 8/100 | OK | 100 | {"201":1,"409":99} | 506ms | 190.11 |
| C5 pago duplicado concurrente iter 9/100 | OK | 100 | {"201":1,"400":99} | 1146ms | 84.53 |
| C6 stock compartido iter 9/100 | OK | 120 | {"201":100,"400":20} | 1202ms | 97.32 |
| C7 reservas mismo slot iter 9/100 | OK | 100 | {"201":1,"409":99} | 611ms | 156.49 |
| C5 pago duplicado concurrente iter 10/100 | OK | 100 | {"201":1,"400":99} | 1159ms | 84.1 |
| C6 stock compartido iter 10/100 | OK | 120 | {"201":100,"400":20} | 1241ms | 95.24 |
| C7 reservas mismo slot iter 10/100 | OK | 100 | {"201":1,"409":99} | 414ms | 230.41 |
| C5 pago duplicado concurrente iter 11/100 | OK | 100 | {"201":1,"400":99} | 886ms | 23.72 |
| C6 stock compartido iter 11/100 | OK | 120 | {"201":100,"400":20} | 1610ms | 73.17 |
| C7 reservas mismo slot iter 11/100 | OK | 100 | {"201":1,"409":99} | 589ms | 163.4 |
| C5 pago duplicado concurrente iter 12/100 | OK | 100 | {"201":1,"400":99} | 1185ms | 82.24 |
| C6 stock compartido iter 12/100 | OK | 120 | {"201":100,"400":20} | 1425ms | 82.19 |
| C7 reservas mismo slot iter 12/100 | OK | 100 | {"201":1,"409":99} | 435ms | 223.21 |
| C5 pago duplicado concurrente iter 13/100 | OK | 100 | {"201":1,"400":99} | 1190ms | 81.5 |
| C6 stock compartido iter 13/100 | OK | 120 | {"0":9,"201":100,"400":11} | 60004ms | 2 |
| C7 reservas mismo slot iter 13/100 | OK | 100 | {"201":1,"409":99} | 504ms | 190.84 |
| C5 pago duplicado concurrente iter 14/100 | OK | 100 | {"201":1,"400":99} | 1056ms | 91.91 |
| C6 stock compartido iter 14/100 | OK | 120 | {"201":100,"400":20} | 1333ms | 87.53 |
| C7 reservas mismo slot iter 14/100 | OK | 100 | {"201":1,"409":99} | 496ms | 196.08 |
| C5 pago duplicado concurrente iter 15/100 | OK | 100 | {"201":1,"400":99} | 993ms | 97.56 |
| C6 stock compartido iter 15/100 | OK | 120 | {"201":100,"400":20} | 7204ms | 10.64 |
| C7 reservas mismo slot iter 15/100 | OK | 100 | {"201":1,"409":99} | 542ms | 178.89 |
| C5 pago duplicado concurrente iter 16/100 | OK | 100 | {"201":1,"400":99} | 1037ms | 92.59 |
| C6 stock compartido iter 16/100 | OK | 120 | {"201":100,"400":20} | 1427ms | 81.63 |
| C7 reservas mismo slot iter 16/100 | OK | 100 | {"201":1,"409":99} | 482ms | 202.02 |
| C5 pago duplicado concurrente iter 17/100 | OK | 100 | {"201":1,"400":99} | 1038ms | 93.02 |
| C6 stock compartido iter 17/100 | OK | 120 | {"201":100,"400":20} | 1641ms | 71.99 |
| C7 reservas mismo slot iter 17/100 | OK | 100 | {"201":1,"409":99} | 793ms | 122.1 |
| C5 pago duplicado concurrente iter 18/100 | OK | 100 | {"201":1,"400":99} | 1144ms | 84.82 |
| C6 stock compartido iter 18/100 | OK | 120 | {"201":100,"400":20} | 1638ms | 72.29 |
| C7 reservas mismo slot iter 18/100 | OK | 100 | {"201":1,"409":99} | 430ms | 219.78 |
| C5 pago duplicado concurrente iter 19/100 | OK | 100 | {"201":1,"400":99} | 1128ms | 85.76 |
| C6 stock compartido iter 19/100 | OK | 120 | {"201":100,"400":20} | 1745ms | 67.04 |
| C7 reservas mismo slot iter 19/100 | OK | 100 | {"201":1,"409":99} | 474ms | 198.02 |
| C5 pago duplicado concurrente iter 20/100 | OK | 100 | {"201":1,"400":99} | 1073ms | 90.25 |
| C6 stock compartido iter 20/100 | OK | 120 | {"201":100,"400":20} | 1575ms | 74.67 |
| C7 reservas mismo slot iter 20/100 | OK | 100 | {"201":1,"409":99} | 645ms | 150.6 |
| C5 pago duplicado concurrente iter 21/100 | OK | 100 | {"201":1,"400":99} | 1041ms | 92.76 |
| C6 stock compartido iter 21/100 | OK | 120 | {"201":100,"400":20} | 1734ms | 67.45 |
| C7 reservas mismo slot iter 21/100 | OK | 100 | {"201":1,"409":99} | 563ms | 170.94 |
| C5 pago duplicado concurrente iter 22/100 | OK | 100 | {"201":1,"400":99} | 1204ms | 80.91 |
| C6 stock compartido iter 22/100 | OK | 120 | {"201":100,"400":20} | 1577ms | 74.3 |
| C7 reservas mismo slot iter 22/100 | OK | 100 | {"201":1,"409":99} | 438ms | 218.82 |
| C5 pago duplicado concurrente iter 23/100 | OK | 100 | {"201":1,"400":99} | 1038ms | 93.46 |
| C6 stock compartido iter 23/100 | OK | 120 | {"201":100,"400":20} | 1646ms | 71.47 |
| C7 reservas mismo slot iter 23/100 | OK | 100 | {"201":1,"409":99} | 459ms | 210.97 |
| C5 pago duplicado concurrente iter 24/100 | OK | 100 | {"201":1,"400":99} | 1184ms | 82.17 |
| C6 stock compartido iter 24/100 | OK | 120 | {"201":100,"400":20} | 1550ms | 76.14 |
| C7 reservas mismo slot iter 24/100 | OK | 100 | {"201":1,"409":99} | 35645ms | 2.8 |
| C5 pago duplicado concurrente iter 25/100 | OK | 100 | {"201":1,"400":99} | 1188ms | 81.83 |
| C6 stock compartido iter 25/100 | OK | 120 | {"201":100,"400":20} | 1640ms | 71.17 |
| C7 reservas mismo slot iter 25/100 | OK | 100 | {"201":1,"409":99} | 610ms | 159.49 |
| C5 pago duplicado concurrente iter 26/100 | OK | 100 | {"201":1,"400":99} | 35639ms | 2.8 |
| C6 stock compartido iter 26/100 | OK | 120 | {"201":100,"400":20} | 1539ms | 23.43 |
| C7 reservas mismo slot iter 26/100 | OK | 100 | {"201":1,"409":99} | 493ms | 194.93 |
| C5 pago duplicado concurrente iter 27/100 | OK | 100 | {"201":1,"400":98,"502":1} | 1155ms | 84.25 |
| C6 stock compartido iter 27/100 | OK | 120 | {"201":100,"400":20} | 1559ms | 74.81 |
| C7 reservas mismo slot iter 27/100 | OK | 100 | {"201":1,"409":99} | 427ms | 223.21 |
| C5 pago duplicado concurrente iter 28/100 | OK | 100 | {"201":1,"400":99} | 1144ms | 84.25 |
| C6 stock compartido iter 28/100 | OK | 120 | {"201":100,"400":20} | 1752ms | 67.53 |
| C7 reservas mismo slot iter 28/100 | OK | 100 | {"201":1,"409":99} | 466ms | 206.19 |
| C5 pago duplicado concurrente iter 29/100 | OK | 100 | {"201":1,"400":99} | 1041ms | 93.02 |
| C6 stock compartido iter 29/100 | OK | 120 | {"201":100,"400":20} | 1465ms | 80.54 |
| C7 reservas mismo slot iter 29/100 | OK | 100 | {"201":1,"409":99} | 426ms | 228.31 |
| C5 pago duplicado concurrente iter 30/100 | OK | 100 | {"201":1,"400":99} | 883ms | 108.11 |
| C6 stock compartido iter 30/100 | OK | 120 | {"201":100,"400":20} | 11374ms | 10.54 |
| C7 reservas mismo slot iter 30/100 | OK | 100 | {"201":1,"409":99} | 385ms | 250.63 |
| C5 pago duplicado concurrente iter 31/100 | OK | 100 | {"201":1,"400":99} | 1203ms | 80.52 |
| C6 stock compartido iter 31/100 | OK | 120 | {"201":100,"400":20} | 1351ms | 87.59 |
| C7 reservas mismo slot iter 31/100 | OK | 100 | {"201":1,"409":99} | 474ms | 201.61 |
| C5 pago duplicado concurrente iter 32/100 | OK | 100 | {"201":1,"400":99} | 1021ms | 95.24 |
| C6 stock compartido iter 32/100 | OK | 120 | {"201":100,"400":20} | 1363ms | 86.96 |
| C7 reservas mismo slot iter 32/100 | OK | 100 | {"201":1,"409":99} | 450ms | 214.13 |
| C5 pago duplicado concurrente iter 33/100 | OK | 100 | {"201":1,"400":99} | 1062ms | 91.41 |
| C6 stock compartido iter 33/100 | OK | 120 | {"201":100,"400":20} | 1351ms | 87.21 |
| C7 reservas mismo slot iter 33/100 | OK | 100 | {"201":1,"409":99} | 553ms | 173.31 |
| C5 pago duplicado concurrente iter 34/100 | OK | 100 | {"0":2,"201":1,"400":97} | 896ms | 1.67 |
| C6 stock compartido iter 34/100 | OK | 120 | {"201":100,"400":20} | 1896ms | 62.14 |
| C7 reservas mismo slot iter 34/100 | OK | 100 | {"201":1,"409":99} | 601ms | 161.29 |
| C5 pago duplicado concurrente iter 35/100 | OK | 100 | {"201":1,"400":99} | 1340ms | 72.83 |
| C6 stock compartido iter 35/100 | OK | 120 | {"201":100,"400":20} | 1587ms | 73.62 |
| C7 reservas mismo slot iter 35/100 | OK | 100 | {"201":1,"409":99} | 496ms | 193.42 |
| C5 pago duplicado concurrente iter 36/100 | OK | 100 | {"201":1,"400":99} | 1105ms | 87.64 |
| C6 stock compartido iter 36/100 | OK | 120 | {"201":100,"400":20} | 1722ms | 68.03 |
| C7 reservas mismo slot iter 36/100 | OK | 100 | {"201":1,"409":99} | 561ms | 170.65 |
| C5 pago duplicado concurrente iter 37/100 | OK | 100 | {"201":1,"400":99} | 1126ms | 85.54 |
| C6 stock compartido iter 37/100 | OK | 120 | {"201":100,"400":20} | 1900ms | 62.24 |
| C7 reservas mismo slot iter 37/100 | OK | 100 | {"201":1,"409":99} | 611ms | 158.98 |
| C5 pago duplicado concurrente iter 38/100 | OK | 100 | {"201":1,"400":99} | 1024ms | 94.88 |
| C6 stock compartido iter 38/100 | OK | 120 | {"201":100,"400":20} | 1567ms | 75.42 |
| C7 reservas mismo slot iter 38/100 | OK | 100 | {"201":1,"409":99} | 429ms | 220.75 |
| C5 pago duplicado concurrente iter 39/100 | OK | 100 | {"201":1,"400":99} | 1277ms | 75.82 |
| C6 stock compartido iter 39/100 | OK | 120 | {"201":100,"400":20} | 1621ms | 72.42 |
| C7 reservas mismo slot iter 39/100 | OK | 100 | {"201":1,"409":99} | 496ms | 192.31 |
| C5 pago duplicado concurrente iter 40/100 | OK | 100 | {"201":1,"400":99} | 1338ms | 71.79 |
| C6 stock compartido iter 40/100 | OK | 120 | {"201":100,"400":20} | 1537ms | 76.24 |
| C7 reservas mismo slot iter 40/100 | OK | 100 | {"201":1,"409":99} | 545ms | 177.3 |
| C5 pago duplicado concurrente iter 41/100 | OK | 100 | {"201":1,"400":98,"502":1} | 982ms | 99.01 |
| C6 stock compartido iter 41/100 | OK | 120 | {"201":100,"400":20} | 1998ms | 58.22 |
| C7 reservas mismo slot iter 41/100 | OK | 100 | {"201":1,"409":99} | 557ms | 172.71 |
| C5 pago duplicado concurrente iter 42/100 | OK | 100 | {"201":1,"400":99} | 1162ms | 83.26 |
| C6 stock compartido iter 42/100 | OK | 120 | {"201":100,"400":20} | 1764ms | 67.04 |
| C7 reservas mismo slot iter 42/100 | OK | 100 | {"201":1,"409":99} | 515ms | 187.62 |
| C5 pago duplicado concurrente iter 43/100 | OK | 100 | {"201":1,"400":99} | 1064ms | 91.58 |
| C6 stock compartido iter 43/100 | OK | 120 | {"201":100,"400":20} | 1610ms | 73.35 |
| C7 reservas mismo slot iter 43/100 | OK | 100 | {"201":1,"409":99} | 35833ms | 2.79 |
| C5 pago duplicado concurrente iter 44/100 | OK | 100 | {"201":1,"400":99} | 1152ms | 83.96 |
| C6 stock compartido iter 44/100 | OK | 120 | {"201":100,"400":20} | 1665ms | 70.71 |
| C7 reservas mismo slot iter 44/100 | OK | 100 | {"201":1,"409":99} | 633ms | 153.85 |
| C5 pago duplicado concurrente iter 45/100 | OK | 100 | {"201":1,"400":99} | 1111ms | 86.96 |
| C6 stock compartido iter 45/100 | OK | 120 | {"201":100,"400":20} | 1582ms | 74.12 |
| C7 reservas mismo slot iter 45/100 | OK | 100 | {"201":1,"409":99} | 423ms | 229.89 |
| C5 pago duplicado concurrente iter 46/100 | OK | 100 | {"201":1,"400":99} | 1102ms | 87.87 |
| C6 stock compartido iter 46/100 | OK | 120 | {"201":100,"400":20} | 1629ms | 71.86 |
| C7 reservas mismo slot iter 46/100 | OK | 100 | {"201":1,"409":99} | 527ms | 184.84 |
| C5 pago duplicado concurrente iter 47/100 | OK | 100 | {"201":1,"400":99} | 1048ms | 92.76 |
| C6 stock compartido iter 47/100 | OK | 120 | {"201":100,"400":20} | 1570ms | 74.49 |
| C7 reservas mismo slot iter 47/100 | OK | 100 | {"201":1,"409":99} | 469ms | 205.76 |
| C5 pago duplicado concurrente iter 48/100 | OK | 100 | {"201":1,"400":99} | 1475ms | 66.14 |
| C6 stock compartido iter 48/100 | OK | 120 | {"201":100,"400":20} | 1718ms | 67.42 |
| C7 reservas mismo slot iter 48/100 | OK | 100 | {"201":1,"409":99} | 729ms | 132.8 |
| C5 pago duplicado concurrente iter 49/100 | OK | 100 | {"201":1,"400":99} | 1084ms | 88.97 |
| C6 stock compartido iter 49/100 | OK | 120 | {"201":100,"400":20} | 1520ms | 77.02 |
| C7 reservas mismo slot iter 49/100 | OK | 100 | {"201":1,"409":99} | 539ms | 179.21 |
| C5 pago duplicado concurrente iter 50/100 | OK | 100 | {"201":1,"400":99} | 1219ms | 79.87 |
| C6 stock compartido iter 50/100 | OK | 120 | {"201":100,"400":20} | 1772ms | 65.75 |
| C7 reservas mismo slot iter 50/100 | OK | 100 | {"201":1,"409":99} | 540ms | 177.94 |
| C5 pago duplicado concurrente iter 51/100 | OK | 100 | {"201":1,"400":99} | 1187ms | 81.77 |
| C6 stock compartido iter 51/100 | OK | 120 | {"201":100,"400":20} | 1990ms | 58.74 |
| C7 reservas mismo slot iter 51/100 | OK | 100 | {"201":1,"409":99} | 473ms | 204.5 |
| C5 pago duplicado concurrente iter 52/100 | OK | 100 | {"201":1,"400":99} | 962ms | 100.6 |
| C6 stock compartido iter 52/100 | OK | 120 | {"201":100,"400":20} | 1476ms | 78.79 |
| C7 reservas mismo slot iter 52/100 | OK | 100 | {"201":1,"409":99} | 466ms | 205.34 |
| C5 pago duplicado concurrente iter 53/100 | OK | 100 | {"201":1,"400":99} | 951ms | 101.63 |
| C6 stock compartido iter 53/100 | OK | 120 | {"201":100,"400":20} | 1401ms | 82.59 |
| C7 reservas mismo slot iter 53/100 | OK | 100 | {"201":1,"409":99} | 394ms | 245.7 |
| C5 pago duplicado concurrente iter 54/100 | OK | 100 | {"201":1,"400":99} | 885ms | 109.41 |
| C6 stock compartido iter 54/100 | OK | 120 | {"201":100,"400":20} | 1463ms | 80.75 |
| C7 reservas mismo slot iter 54/100 | OK | 100 | {"201":1,"409":99} | 428ms | 225.73 |
| C5 pago duplicado concurrente iter 55/100 | OK | 100 | {"201":1,"400":99} | 897ms | 107.07 |
| C6 stock compartido iter 55/100 | OK | 120 | {"201":100,"400":20} | 1327ms | 88.76 |
| C7 reservas mismo slot iter 55/100 | OK | 100 | {"201":1,"409":99} | 660ms | 145.14 |
| C5 pago duplicado concurrente iter 56/100 | OK | 100 | {"201":1,"400":99} | 1080ms | 89.85 |
| C6 stock compartido iter 56/100 | OK | 120 | {"201":100,"400":20} | 1434ms | 82.76 |
| C7 reservas mismo slot iter 56/100 | OK | 100 | {"201":1,"409":99} | 361ms | 265.25 |
| C5 pago duplicado concurrente iter 57/100 | OK | 100 | {"201":1,"400":99} | 960ms | 101.01 |
| C6 stock compartido iter 57/100 | OK | 120 | {"201":100,"400":20} | 1449ms | 82.02 |
| C7 reservas mismo slot iter 57/100 | OK | 100 | {"201":1,"409":99} | 621ms | 157.23 |
| C5 pago duplicado concurrente iter 58/100 | OK | 100 | {"201":1,"400":99} | 954ms | 101.94 |
| C6 stock compartido iter 58/100 | OK | 120 | {"201":100,"400":20} | 1379ms | 85.11 |
| C7 reservas mismo slot iter 58/100 | OK | 100 | {"201":1,"409":99} | 3098ms | 32.16 |
| C5 pago duplicado concurrente iter 59/100 | OK | 100 | {"201":1,"400":99} | 917ms | 2.8 |
| C6 stock compartido iter 59/100 | OK | 120 | {"201":100,"400":20} | 1425ms | 82.36 |
| C7 reservas mismo slot iter 59/100 | OK | 100 | {"201":1,"409":99} | 668ms | 145.77 |
| C5 pago duplicado concurrente iter 60/100 | OK | 100 | {"201":1,"400":99} | 902ms | 107.41 |
| C6 stock compartido iter 60/100 | OK | 120 | {"201":100,"400":20} | 1502ms | 77.87 |
| C7 reservas mismo slot iter 60/100 | OK | 100 | {"201":1,"409":99} | 573ms | 170.07 |
| C5 pago duplicado concurrente iter 61/100 | OK | 100 | {"201":1,"400":99} | 902ms | 107.3 |
| C6 stock compartido iter 61/100 | OK | 120 | {"201":100,"400":20} | 1574ms | 75.14 |
| C7 reservas mismo slot iter 61/100 | OK | 100 | {"201":1,"409":99} | 399ms | 240.96 |
| C5 pago duplicado concurrente iter 62/100 | OK | 100 | {"201":1,"400":99} | 1090ms | 88.73 |
| C6 stock compartido iter 62/100 | OK | 120 | {"201":100,"400":20} | 1498ms | 78.59 |
| C7 reservas mismo slot iter 62/100 | OK | 100 | {"201":1,"409":99} | 481ms | 2.79 |
| C5 pago duplicado concurrente iter 63/100 | OK | 100 | {"201":1,"400":99} | 970ms | 31 |
| C6 stock compartido iter 63/100 | OK | 120 | {"201":100,"400":20} | 1507ms | 77.67 |
| C7 reservas mismo slot iter 63/100 | OK | 100 | {"201":1,"409":99} | 395ms | 244.5 |
| C5 pago duplicado concurrente iter 64/100 | OK | 100 | {"201":1,"400":99} | 938ms | 103.31 |
| C6 stock compartido iter 64/100 | OK | 120 | {"201":100,"400":20} | 1549ms | 76.05 |
| C7 reservas mismo slot iter 64/100 | OK | 100 | {"201":1,"409":99} | 454ms | 212.77 |
| C5 pago duplicado concurrente iter 65/100 | OK | 100 | {"201":1,"400":99} | 917ms | 105.26 |
| C6 stock compartido iter 65/100 | OK | 120 | {"201":100,"400":20} | 1579ms | 75.28 |
| C7 reservas mismo slot iter 65/100 | OK | 100 | {"201":1,"409":99} | 528ms | 181.16 |
| C5 pago duplicado concurrente iter 66/100 | OK | 100 | {"201":1,"400":99} | 941ms | 103.2 |
| C6 stock compartido iter 66/100 | OK | 120 | {"201":100,"400":20} | 1432ms | 80.75 |
| C7 reservas mismo slot iter 66/100 | OK | 100 | {"201":1,"409":99} | 472ms | 200.8 |
| C5 pago duplicado concurrente iter 67/100 | OK | 100 | {"201":1,"400":99} | 967ms | 100.1 |
| C6 stock compartido iter 67/100 | OK | 120 | {"0":7,"201":100,"400":13} | 60015ms | 2 |
| C7 reservas mismo slot iter 67/100 | OK | 100 | {"201":1,"409":99} | 461ms | 209.64 |
| C5 pago duplicado concurrente iter 68/100 | OK | 100 | {"201":1,"400":99} | 989ms | 98.14 |
| C6 stock compartido iter 68/100 | OK | 120 | {"201":100,"400":20} | 1411ms | 83.22 |
| C7 reservas mismo slot iter 68/100 | OK | 100 | {"201":1,"409":99} | 433ms | 216.92 |
| C5 pago duplicado concurrente iter 69/100 | OK | 100 | {"201":1,"400":99} | 947ms | 102.25 |
| C6 stock compartido iter 69/100 | OK | 120 | {"201":100,"400":20} | 1466ms | 79.31 |
| C7 reservas mismo slot iter 69/100 | OK | 100 | {"201":1,"409":99} | 453ms | 210.53 |
| C5 pago duplicado concurrente iter 70/100 | OK | 100 | {"201":1,"400":99} | 951ms | 101.83 |
| C6 stock compartido iter 70/100 | OK | 120 | {"201":100,"400":20} | 1450ms | 81.69 |
| C7 reservas mismo slot iter 70/100 | OK | 100 | {"201":1,"409":99} | 588ms | 164.2 |
| C5 pago duplicado concurrente iter 71/100 | OK | 100 | {"201":1,"400":99} | 944ms | 102.88 |
| C6 stock compartido iter 71/100 | OK | 120 | {"201":100,"400":20} | 1374ms | 85.65 |
| C7 reservas mismo slot iter 71/100 | OK | 100 | {"201":1,"409":99} | 425ms | 227.79 |
| C5 pago duplicado concurrente iter 72/100 | OK | 100 | {"201":1,"400":99} | 912ms | 106.04 |
| C6 stock compartido iter 72/100 | OK | 120 | {"201":100,"400":20} | 1315ms | 89.49 |
| C7 reservas mismo slot iter 72/100 | OK | 100 | {"201":1,"409":99} | 377ms | 254.45 |
| C5 pago duplicado concurrente iter 73/100 | OK | 100 | {"201":1,"400":99} | 955ms | 100.3 |
| C6 stock compartido iter 73/100 | OK | 120 | {"201":100,"400":20} | 1293ms | 90.7 |
| C7 reservas mismo slot iter 73/100 | OK | 100 | {"201":1,"409":99} | 603ms | 160.77 |
| C5 pago duplicado concurrente iter 74/100 | OK | 100 | {"201":1,"400":99} | 1034ms | 93.98 |
| C6 stock compartido iter 74/100 | OK | 120 | {"201":100,"400":20} | 1320ms | 88.82 |
| C7 reservas mismo slot iter 74/100 | OK | 100 | {"201":1,"409":99} | 446ms | 213.68 |
| C5 pago duplicado concurrente iter 75/100 | OK | 100 | {"201":1,"400":99} | 1034ms | 93.98 |
| C6 stock compartido iter 75/100 | OK | 120 | {"201":100,"400":20} | 1421ms | 82.7 |
| C7 reservas mismo slot iter 75/100 | OK | 100 | {"201":1,"409":99} | 1111ms | 88.42 |
| C5 pago duplicado concurrente iter 76/100 | OK | 100 | {"201":1,"400":99} | 1116ms | 86.96 |
| C6 stock compartido iter 76/100 | OK | 120 | {"0":1,"201":100,"400":19} | 1509ms | 2 |
| C7 reservas mismo slot iter 76/100 | OK | 100 | {"201":1,"409":99} | 411ms | 235.85 |
| C5 pago duplicado concurrente iter 77/100 | OK | 100 | {"201":1,"400":99} | 1037ms | 93.81 |
| C6 stock compartido iter 77/100 | OK | 120 | {"201":100,"400":20} | 1281ms | 88.17 |
| C7 reservas mismo slot iter 77/100 | OK | 100 | {"201":1,"409":99} | 537ms | 180.18 |
| C5 pago duplicado concurrente iter 78/100 | OK | 100 | {"201":1,"400":99} | 1050ms | 92.34 |
| C6 stock compartido iter 78/100 | OK | 120 | {"201":100,"400":20} | 1398ms | 83.1 |
| C7 reservas mismo slot iter 78/100 | OK | 100 | {"201":1,"409":99} | 505ms | 193.05 |
| C5 pago duplicado concurrente iter 79/100 | OK | 100 | {"201":1,"400":99} | 896ms | 107.64 |
| C6 stock compartido iter 79/100 | OK | 120 | {"201":100,"400":20} | 1270ms | 92.02 |
| C7 reservas mismo slot iter 79/100 | OK | 100 | {"201":1,"409":99} | 659ms | 145.77 |
| C5 pago duplicado concurrente iter 80/100 | OK | 100 | {"201":1,"400":99} | 925ms | 104.71 |
| C6 stock compartido iter 80/100 | OK | 120 | {"201":100,"400":20} | 1197ms | 97.72 |
| C7 reservas mismo slot iter 80/100 | OK | 100 | {"201":1,"409":99} | 715ms | 135.69 |
| C5 pago duplicado concurrente iter 81/100 | OK | 100 | {"201":1,"400":99} | 913ms | 105.93 |
| C6 stock compartido iter 81/100 | OK | 120 | {"201":100,"400":20} | 1215ms | 96.46 |
| C7 reservas mismo slot iter 81/100 | OK | 100 | {"201":1,"409":99} | 495ms | 193.42 |
| C5 pago duplicado concurrente iter 82/100 | OK | 100 | {"201":1,"400":99} | 897ms | 108.11 |
| C6 stock compartido iter 82/100 | OK | 120 | {"0":12,"201":100,"400":8} | 60002ms | 2 |
| C7 reservas mismo slot iter 82/100 | OK | 100 | {"201":1,"409":99} | 555ms | 175.44 |
| C5 pago duplicado concurrente iter 83/100 | OK | 100 | {"201":1,"400":99} | 978ms | 99.01 |
| C6 stock compartido iter 83/100 | OK | 120 | {"201":100,"400":20} | 1239ms | 94.41 |
| C7 reservas mismo slot iter 83/100 | OK | 100 | {"201":1,"409":99} | 465ms | 205.76 |
| C5 pago duplicado concurrente iter 84/100 | OK | 100 | {"201":1,"400":99} | 883ms | 109.77 |
| C6 stock compartido iter 84/100 | OK | 120 | {"201":100,"400":20} | 1415ms | 80.75 |
| C7 reservas mismo slot iter 84/100 | OK | 100 | {"201":1,"409":99} | 424ms | 227.27 |
| C5 pago duplicado concurrente iter 85/100 | OK | 100 | {"201":1,"400":99} | 893ms | 108.58 |
| C6 stock compartido iter 85/100 | OK | 120 | {"201":100,"400":20} | 1204ms | 98.12 |
| C7 reservas mismo slot iter 85/100 | OK | 100 | {"201":1,"409":99} | 535ms | 181.82 |
| C5 pago duplicado concurrente iter 86/100 | OK | 100 | {"201":1,"400":99} | 909ms | 106.72 |
| C6 stock compartido iter 86/100 | OK | 120 | {"201":100,"400":20} | 1260ms | 92.45 |
| C7 reservas mismo slot iter 86/100 | OK | 100 | {"201":1,"409":99} | 608ms | 160 |
| C5 pago duplicado concurrente iter 87/100 | OK | 100 | {"201":1,"400":99} | 1007ms | 96.43 |
| C6 stock compartido iter 87/100 | OK | 120 | {"201":100,"400":20} | 1175ms | 99.42 |
| C7 reservas mismo slot iter 87/100 | OK | 100 | {"201":1,"409":99} | 449ms | 216.45 |
| C5 pago duplicado concurrente iter 88/100 | OK | 100 | {"201":1,"400":99} | 997ms | 97.47 |
| C6 stock compartido iter 88/100 | OK | 120 | {"201":100,"400":20} | 1295ms | 91.19 |
| C7 reservas mismo slot iter 88/100 | OK | 100 | {"201":1,"409":99} | 428ms | 221.73 |
| C5 pago duplicado concurrente iter 89/100 | OK | 100 | {"201":1,"400":99} | 1424ms | 68.78 |
| C6 stock compartido iter 89/100 | OK | 120 | {"201":100,"400":20} | 1405ms | 83.57 |
| C7 reservas mismo slot iter 89/100 | OK | 100 | {"201":1,"409":99} | 412ms | 232.02 |
| C5 pago duplicado concurrente iter 90/100 | OK | 100 | {"201":1,"400":99} | 1119ms | 86.36 |
| C6 stock compartido iter 90/100 | OK | 120 | {"201":100,"400":20} | 1663ms | 70.38 |
| C7 reservas mismo slot iter 90/100 | OK | 100 | {"201":1,"409":99} | 499ms | 194.17 |
| C5 pago duplicado concurrente iter 91/100 | OK | 100 | {"201":1,"400":99} | 997ms | 96.99 |
| C6 stock compartido iter 91/100 | OK | 120 | {"201":100,"400":20} | 1354ms | 87.08 |
| C7 reservas mismo slot iter 91/100 | OK | 100 | {"201":1,"409":99} | 593ms | 164.74 |
| C5 pago duplicado concurrente iter 92/100 | OK | 100 | {"201":1,"400":99} | 1030ms | 93.46 |
| C6 stock compartido iter 92/100 | OK | 120 | {"0":12,"201":100,"400":8} | 60012ms | 2 |
| C7 reservas mismo slot iter 92/100 | OK | 100 | {"201":1,"409":99} | 588ms | 165.02 |
| C5 pago duplicado concurrente iter 93/100 | OK | 100 | {"201":1,"400":99} | 934ms | 102.04 |
| C6 stock compartido iter 93/100 | OK | 120 | {"201":100,"400":20} | 1411ms | 83.1 |
| C7 reservas mismo slot iter 93/100 | OK | 100 | {"201":1,"409":99} | 698ms | 138.12 |
| C5 pago duplicado concurrente iter 94/100 | OK | 100 | {"201":1,"400":99} | 1200ms | 81.17 |
| C6 stock compartido iter 94/100 | OK | 120 | {"201":100,"400":20} | 1386ms | 84.21 |
| C7 reservas mismo slot iter 94/100 | OK | 100 | {"201":1,"409":99} | 492ms | 197.24 |
| C5 pago duplicado concurrente iter 95/100 | OK | 100 | {"201":1,"400":99} | 1050ms | 92.42 |
| C6 stock compartido iter 95/100 | OK | 120 | {"201":100,"400":20} | 1361ms | 86.77 |
| C7 reservas mismo slot iter 95/100 | OK | 100 | {"201":1,"409":99} | 441ms | 219.3 |
| C5 pago duplicado concurrente iter 96/100 | OK | 100 | {"201":1,"400":99} | 1203ms | 80.45 |
| C6 stock compartido iter 96/100 | OK | 120 | {"201":100,"400":20} | 1347ms | 87.15 |
| C7 reservas mismo slot iter 96/100 | OK | 100 | {"201":1,"409":99} | 710ms | 136.05 |
| C5 pago duplicado concurrente iter 97/100 | OK | 100 | {"201":1,"400":99} | 1163ms | 83.06 |
| C6 stock compartido iter 97/100 | OK | 120 | {"201":100,"400":20} | 1452ms | 81.03 |
| C7 reservas mismo slot iter 97/100 | OK | 100 | {"201":1,"409":99} | 452ms | 214.13 |
| C5 pago duplicado concurrente iter 98/100 | OK | 100 | {"201":1,"400":99} | 1002ms | 96.62 |
| C6 stock compartido iter 98/100 | OK | 120 | {"201":100,"400":20} | 1279ms | 90.36 |
| C7 reservas mismo slot iter 98/100 | OK | 100 | {"201":1,"409":99} | 638ms | 151.98 |
| C5 pago duplicado concurrente iter 99/100 | OK | 100 | {"201":1,"400":99} | 1122ms | 86.96 |
| C6 stock compartido iter 99/100 | OK | 120 | {"0":7,"201":100,"400":13} | 60004ms | 2 |
| C7 reservas mismo slot iter 99/100 | OK | 100 | {"201":1,"409":99} | 748ms | 129.37 |
| C5 pago duplicado concurrente iter 100/100 | OK | 100 | {"201":1,"400":99} | 1118ms | 85.54 |
| C6 stock compartido iter 100/100 | OK | 120 | {"201":100,"400":20} | 1318ms | 88.89 |
| C7 reservas mismo slot iter 100/100 | OK | 100 | {"201":1,"409":99} | 459ms | 209.21 |

## Detalle

### C5 pago duplicado concurrente iter 1/100

- Invariante: OK
- Duracion: 1697ms
- Latencia: p50=1087ms, p95=1629ms, p99=1680ms, max=1680ms
- Detalle: `{"cuentaId":"c136e0e2-1832-48bf-a680-c01237755ee6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":1}`

### C6 stock compartido iter 1/100

- Invariante: OK
- Duracion: 1557ms
- Latencia: p50=977ms, p95=1514ms, p99=1541ms, max=1545ms
- Detalle: `{"productId":"4ca66599-a659-4e04-866a-bc4d4757b246","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":1}`

### C7 reservas mismo slot iter 1/100

- Invariante: OK
- Duracion: 479ms
- Latencia: p50=288ms, p95=460ms, p99=472ms, max=472ms
- Detalle: `{"fecha":"2221-11-23","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/100

- Invariante: OK
- Duracion: 1120ms
- Latencia: p50=710ms, p95=1086ms, p99=1113ms, max=1113ms
- Detalle: `{"cuentaId":"a686c2b6-dfe4-4820-9da5-72ab5fce60a1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":2}`

### C6 stock compartido iter 2/100

- Invariante: OK
- Duracion: 1523ms
- Latencia: p50=999ms, p95=1483ms, p99=1513ms, max=1515ms
- Detalle: `{"productId":"9ed827b2-25af-4a08-84c6-eb2b02461575","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":65,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":35,"statuses":{"201":100,"400":20},"iteration":2}`

### C7 reservas mismo slot iter 2/100

- Invariante: OK
- Duracion: 734ms
- Latencia: p50=470ms, p95=710ms, p99=720ms, max=720ms
- Detalle: `{"fecha":"2221-11-24","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/100

- Invariante: OK
- Duracion: 1197ms
- Latencia: p50=772ms, p95=1156ms, p99=1188ms, max=1188ms
- Detalle: `{"cuentaId":"99ee086e-4dee-4621-aa68-9a397a636d09","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":3}`

### C6 stock compartido iter 3/100

- Invariante: OK
- Duracion: 1495ms
- Latencia: p50=969ms, p95=1466ms, p99=1484ms, max=1486ms
- Detalle: `{"productId":"38f88a18-85a2-445d-87eb-d6ad377346b4","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":3}`

### C7 reservas mismo slot iter 3/100

- Invariante: OK
- Duracion: 547ms
- Latencia: p50=356ms, p95=523ms, p99=538ms, max=538ms
- Detalle: `{"fecha":"2221-11-25","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

### C5 pago duplicado concurrente iter 4/100

- Invariante: OK
- Duracion: 35688ms
- Latencia: p50=649ms, p95=1020ms, p99=35683ms, max=35683ms
- Detalle: `{"cuentaId":"518587c1-2471-4b7c-9084-592db3040219","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":4}`

### C6 stock compartido iter 4/100

- Invariante: OK
- Duracion: 1567ms
- Latencia: p50=1053ms, p95=1536ms, p99=1556ms, max=1558ms
- Detalle: `{"productId":"8b810fe0-302c-4781-b554-423193a1e9e2","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":78,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":22,"statuses":{"201":100,"400":20},"iteration":4}`

### C7 reservas mismo slot iter 4/100

- Invariante: OK
- Duracion: 554ms
- Latencia: p50=338ms, p95=533ms, p99=546ms, max=546ms
- Detalle: `{"fecha":"2221-11-26","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":4}`

### C5 pago duplicado concurrente iter 5/100

- Invariante: OK
- Duracion: 1134ms
- Latencia: p50=710ms, p95=1099ms, p99=1129ms, max=1129ms
- Detalle: `{"cuentaId":"9aee0ef3-7b81-4afe-bf54-8106a10c6f3a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":5}`

### C6 stock compartido iter 5/100

- Invariante: OK
- Duracion: 1474ms
- Latencia: p50=957ms, p95=1438ms, p99=1460ms, max=1461ms
- Detalle: `{"productId":"9671126e-2cf4-469e-a9b1-f15f4a9243f0","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":5}`

### C7 reservas mismo slot iter 5/100

- Invariante: OK
- Duracion: 658ms
- Latencia: p50=374ms, p95=634ms, p99=647ms, max=647ms
- Detalle: `{"fecha":"2221-11-27","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":5}`

### C5 pago duplicado concurrente iter 6/100

- Invariante: OK
- Duracion: 1067ms
- Latencia: p50=652ms, p95=1034ms, p99=1061ms, max=1061ms
- Detalle: `{"cuentaId":"6f3e803b-6052-439a-910a-d5e0e40e6c4d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":6}`

### C6 stock compartido iter 6/100

- Invariante: OK
- Duracion: 1466ms
- Latencia: p50=915ms, p95=1449ms, p99=1459ms, max=1460ms
- Detalle: `{"productId":"1c1e0ccc-1323-4fc1-8435-d956a9bdd647","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":79,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":21,"statuses":{"201":100,"400":20},"iteration":6}`

### C7 reservas mismo slot iter 6/100

- Invariante: OK
- Duracion: 748ms
- Latencia: p50=465ms, p95=726ms, p99=742ms, max=742ms
- Detalle: `{"fecha":"2221-11-28","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":6}`

### C5 pago duplicado concurrente iter 7/100

- Invariante: OK
- Duracion: 35761ms
- Latencia: p50=705ms, p95=35705ms, p99=35756ms, max=35756ms
- Detalle: `{"cuentaId":"40c4a93a-ef74-4923-a0b5-57bf3270fd06","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":7}`

### C6 stock compartido iter 7/100

- Invariante: OK
- Duracion: 1318ms
- Latencia: p50=860ms, p95=1283ms, p99=1312ms, max=1313ms
- Detalle: `{"productId":"be003370-6edc-4615-9c96-bf85f0b0ed4e","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":7}`

### C7 reservas mismo slot iter 7/100

- Invariante: OK
- Duracion: 592ms
- Latencia: p50=354ms, p95=574ms, p99=589ms, max=589ms
- Detalle: `{"fecha":"2221-11-29","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":7}`

### C5 pago duplicado concurrente iter 8/100

- Invariante: OK
- Duracion: 1159ms
- Latencia: p50=640ms, p95=1127ms, p99=1153ms, max=1153ms
- Detalle: `{"cuentaId":"4177b70e-4bb7-4394-8ae9-d60569ac3184","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":8}`

### C6 stock compartido iter 8/100

- Invariante: OK
- Duracion: 60010ms
- Latencia: p50=935ms, p95=60004ms, p99=60005ms, max=60005ms
- Detalle: `{"productId":"620fe540-a52f-45c2-9bab-4ff54a8de2d6","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":10,"clientTimeouts":10,"stockActual":0,"statuses":{"0":10,"201":100,"400":10},"iteration":8}`

### C7 reservas mismo slot iter 8/100

- Invariante: OK
- Duracion: 526ms
- Latencia: p50=281ms, p95=506ms, p99=522ms, max=522ms
- Detalle: `{"fecha":"2221-11-30","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":8}`

### C5 pago duplicado concurrente iter 9/100

- Invariante: OK
- Duracion: 1183ms
- Latencia: p50=625ms, p95=1146ms, p99=1179ms, max=1179ms
- Detalle: `{"cuentaId":"4302e9d4-039c-4baa-8f6b-9379a0b7afc9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":9}`

### C6 stock compartido iter 9/100

- Invariante: OK
- Duracion: 1233ms
- Latencia: p50=805ms, p95=1202ms, p99=1222ms, max=1225ms
- Detalle: `{"productId":"462fea28-9cb6-4e1e-ac8c-ed887d597654","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":9}`

### C7 reservas mismo slot iter 9/100

- Invariante: OK
- Duracion: 639ms
- Latencia: p50=332ms, p95=611ms, p99=634ms, max=634ms
- Detalle: `{"fecha":"2221-12-01","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":9}`

### C5 pago duplicado concurrente iter 10/100

- Invariante: OK
- Duracion: 1189ms
- Latencia: p50=746ms, p95=1159ms, p99=1185ms, max=1185ms
- Detalle: `{"cuentaId":"35478929-1e56-48ef-b3a8-03b3e55d12e2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":10}`

### C6 stock compartido iter 10/100

- Invariante: OK
- Duracion: 1260ms
- Latencia: p50=815ms, p95=1241ms, p99=1250ms, max=1254ms
- Detalle: `{"productId":"d771a7d4-9792-4c5c-92cf-9bae452defaa","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":10}`

### C7 reservas mismo slot iter 10/100

- Invariante: OK
- Duracion: 434ms
- Latencia: p50=251ms, p95=414ms, p99=428ms, max=428ms
- Detalle: `{"fecha":"2221-12-02","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":10}`

### C5 pago duplicado concurrente iter 11/100

- Invariante: OK
- Duracion: 4216ms
- Latencia: p50=547ms, p95=886ms, p99=4210ms, max=4210ms
- Detalle: `{"cuentaId":"f52658e7-e5f3-48ef-b7cf-4cb98a46665a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":11}`

### C6 stock compartido iter 11/100

- Invariante: OK
- Duracion: 1640ms
- Latencia: p50=1020ms, p95=1610ms, p99=1633ms, max=1634ms
- Detalle: `{"productId":"b06d9a0c-e0a8-47c9-989f-d54073562822","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":11}`

### C7 reservas mismo slot iter 11/100

- Invariante: OK
- Duracion: 612ms
- Latencia: p50=306ms, p95=589ms, p99=607ms, max=607ms
- Detalle: `{"fecha":"2221-12-03","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":11}`

### C5 pago duplicado concurrente iter 12/100

- Invariante: OK
- Duracion: 1216ms
- Latencia: p50=794ms, p95=1185ms, p99=1211ms, max=1211ms
- Detalle: `{"cuentaId":"729ab451-a039-4555-a8a7-6787906f87c2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":12}`

### C6 stock compartido iter 12/100

- Invariante: OK
- Duracion: 1460ms
- Latencia: p50=954ms, p95=1425ms, p99=1453ms, max=1455ms
- Detalle: `{"productId":"5cb28783-fa79-4d1d-ae8d-4c1263ae6804","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":79,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":21,"statuses":{"201":100,"400":20},"iteration":12}`

### C7 reservas mismo slot iter 12/100

- Invariante: OK
- Duracion: 448ms
- Latencia: p50=280ms, p95=435ms, p99=442ms, max=442ms
- Detalle: `{"fecha":"2221-12-04","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":12}`

### C5 pago duplicado concurrente iter 13/100

- Invariante: OK
- Duracion: 1227ms
- Latencia: p50=764ms, p95=1190ms, p99=1221ms, max=1221ms
- Detalle: `{"cuentaId":"571636ae-7a80-4f2b-aeeb-7f5ba815553c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":13}`

### C6 stock compartido iter 13/100

- Invariante: OK
- Duracion: 60010ms
- Latencia: p50=818ms, p95=60004ms, p99=60005ms, max=60005ms
- Detalle: `{"productId":"02e1f79e-1d65-4d8a-87c5-5fde5eaf7c6c","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":11,"clientTimeouts":9,"stockActual":0,"statuses":{"0":9,"201":100,"400":11},"iteration":13}`

### C7 reservas mismo slot iter 13/100

- Invariante: OK
- Duracion: 524ms
- Latencia: p50=348ms, p95=504ms, p99=517ms, max=517ms
- Detalle: `{"fecha":"2221-12-05","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":13}`

### C5 pago duplicado concurrente iter 14/100

- Invariante: OK
- Duracion: 1088ms
- Latencia: p50=670ms, p95=1056ms, p99=1083ms, max=1083ms
- Detalle: `{"cuentaId":"85c640d1-da3c-47e8-8301-03d0e769ce8d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":14}`

### C6 stock compartido iter 14/100

- Invariante: OK
- Duracion: 1371ms
- Latencia: p50=908ms, p95=1333ms, p99=1361ms, max=1369ms
- Detalle: `{"productId":"3d9e8de1-6f68-4957-aad3-5a16439a9781","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":78,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":22,"statuses":{"201":100,"400":20},"iteration":14}`

### C7 reservas mismo slot iter 14/100

- Invariante: OK
- Duracion: 510ms
- Latencia: p50=339ms, p95=496ms, p99=506ms, max=506ms
- Detalle: `{"fecha":"2221-12-06","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":14}`

### C5 pago duplicado concurrente iter 15/100

- Invariante: OK
- Duracion: 1025ms
- Latencia: p50=608ms, p95=993ms, p99=1020ms, max=1020ms
- Detalle: `{"cuentaId":"09d418d8-631e-42e3-a378-1d3d1f03d420","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":15}`

### C6 stock compartido iter 15/100

- Invariante: OK
- Duracion: 11275ms
- Latencia: p50=937ms, p95=7204ms, p99=11272ms, max=11273ms
- Detalle: `{"productId":"59cdddff-91d6-44b9-8209-bdf50b51ad77","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":0,"statuses":{"201":100,"400":20},"iteration":15}`

### C7 reservas mismo slot iter 15/100

- Invariante: OK
- Duracion: 559ms
- Latencia: p50=355ms, p95=542ms, p99=552ms, max=552ms
- Detalle: `{"fecha":"2221-12-07","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":15}`

### C5 pago duplicado concurrente iter 16/100

- Invariante: OK
- Duracion: 1080ms
- Latencia: p50=662ms, p95=1037ms, p99=1074ms, max=1074ms
- Detalle: `{"cuentaId":"40e6e27e-5005-4819-90d1-deba7e2a1b1a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":16}`

### C6 stock compartido iter 16/100

- Invariante: OK
- Duracion: 1470ms
- Latencia: p50=934ms, p95=1427ms, p99=1461ms, max=1462ms
- Detalle: `{"productId":"aaa782ad-cbdf-43d4-b3a0-e82695b74893","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":78,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":22,"statuses":{"201":100,"400":20},"iteration":16}`

### C7 reservas mismo slot iter 16/100

- Invariante: OK
- Duracion: 495ms
- Latencia: p50=319ms, p95=482ms, p99=492ms, max=492ms
- Detalle: `{"fecha":"2221-12-08","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":16}`

### C5 pago duplicado concurrente iter 17/100

- Invariante: OK
- Duracion: 1075ms
- Latencia: p50=650ms, p95=1038ms, p99=1067ms, max=1067ms
- Detalle: `{"cuentaId":"bd9f8128-c5b6-4413-a4f3-92b32d01412e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":17}`

### C6 stock compartido iter 17/100

- Invariante: OK
- Duracion: 1667ms
- Latencia: p50=1110ms, p95=1641ms, p99=1659ms, max=1661ms
- Detalle: `{"productId":"f255d8f2-d5d6-4c8e-882f-2b7af6e13518","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":38,"statuses":{"201":100,"400":20},"iteration":17}`

### C7 reservas mismo slot iter 17/100

- Invariante: OK
- Duracion: 819ms
- Latencia: p50=537ms, p95=793ms, p99=809ms, max=809ms
- Detalle: `{"fecha":"2221-12-09","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":17}`

### C5 pago duplicado concurrente iter 18/100

- Invariante: OK
- Duracion: 1179ms
- Latencia: p50=732ms, p95=1144ms, p99=1172ms, max=1172ms
- Detalle: `{"cuentaId":"ac704cbd-eacc-40b8-a1ad-0b4cbf566dc2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":18}`

### C6 stock compartido iter 18/100

- Invariante: OK
- Duracion: 1660ms
- Latencia: p50=1083ms, p95=1638ms, p99=1650ms, max=1651ms
- Detalle: `{"productId":"01df33de-dda8-44d5-86c9-84138542be95","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":18}`

### C7 reservas mismo slot iter 18/100

- Invariante: OK
- Duracion: 455ms
- Latencia: p50=276ms, p95=430ms, p99=445ms, max=445ms
- Detalle: `{"fecha":"2221-12-10","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":18}`

### C5 pago duplicado concurrente iter 19/100

- Invariante: OK
- Duracion: 1166ms
- Latencia: p50=688ms, p95=1128ms, p99=1160ms, max=1160ms
- Detalle: `{"cuentaId":"05937076-1100-42e6-9979-f3c93f6a0c81","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":19}`

### C6 stock compartido iter 19/100

- Invariante: OK
- Duracion: 1790ms
- Latencia: p50=1151ms, p95=1745ms, p99=1778ms, max=1784ms
- Detalle: `{"productId":"05e384d0-9d92-413d-ae83-0851d69a338a","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":19}`

### C7 reservas mismo slot iter 19/100

- Invariante: OK
- Duracion: 505ms
- Latencia: p50=297ms, p95=474ms, p99=494ms, max=494ms
- Detalle: `{"fecha":"2221-12-11","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":19}`

### C5 pago duplicado concurrente iter 20/100

- Invariante: OK
- Duracion: 1108ms
- Latencia: p50=652ms, p95=1073ms, p99=1101ms, max=1101ms
- Detalle: `{"cuentaId":"6ad64258-8073-4efa-9057-c5c7d7b0a87e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":20}`

### C6 stock compartido iter 20/100

- Invariante: OK
- Duracion: 1607ms
- Latencia: p50=1003ms, p95=1575ms, p99=1598ms, max=1600ms
- Detalle: `{"productId":"39af3a99-7a35-4386-bc8c-f1c68105b298","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":20}`

### C7 reservas mismo slot iter 20/100

- Invariante: OK
- Duracion: 664ms
- Latencia: p50=382ms, p95=645ms, p99=654ms, max=654ms
- Detalle: `{"fecha":"2221-12-12","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":20}`

### C5 pago duplicado concurrente iter 21/100

- Invariante: OK
- Duracion: 1078ms
- Latencia: p50=654ms, p95=1041ms, p99=1072ms, max=1072ms
- Detalle: `{"cuentaId":"45998dde-3997-4524-87e6-67bc92e6be64","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":21}`

### C6 stock compartido iter 21/100

- Invariante: OK
- Duracion: 1779ms
- Latencia: p50=1153ms, p95=1734ms, p99=1771ms, max=1774ms
- Detalle: `{"productId":"acf552fd-ce2e-4773-959a-5c09e3fe7e2e","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":68,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":32,"statuses":{"201":100,"400":20},"iteration":21}`

### C7 reservas mismo slot iter 21/100

- Invariante: OK
- Duracion: 585ms
- Latencia: p50=350ms, p95=563ms, p99=577ms, max=577ms
- Detalle: `{"fecha":"2221-12-13","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":21}`

### C5 pago duplicado concurrente iter 22/100

- Invariante: OK
- Duracion: 1236ms
- Latencia: p50=775ms, p95=1204ms, p99=1230ms, max=1230ms
- Detalle: `{"cuentaId":"8fc53eac-d844-4017-af6e-94d18b0a9362","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":22}`

### C6 stock compartido iter 22/100

- Invariante: OK
- Duracion: 1615ms
- Latencia: p50=1054ms, p95=1577ms, p99=1602ms, max=1604ms
- Detalle: `{"productId":"64ee55ac-b868-4967-b88b-3850a4009463","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":65,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":35,"statuses":{"201":100,"400":20},"iteration":22}`

### C7 reservas mismo slot iter 22/100

- Invariante: OK
- Duracion: 457ms
- Latencia: p50=290ms, p95=438ms, p99=448ms, max=448ms
- Detalle: `{"fecha":"2221-12-14","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":22}`

### C5 pago duplicado concurrente iter 23/100

- Invariante: OK
- Duracion: 1070ms
- Latencia: p50=664ms, p95=1038ms, p99=1067ms, max=1067ms
- Detalle: `{"cuentaId":"41dafefc-1b8e-4e2c-b7f9-2e1ecca29d83","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":23}`

### C6 stock compartido iter 23/100

- Invariante: OK
- Duracion: 1679ms
- Latencia: p50=1118ms, p95=1646ms, p99=1671ms, max=1673ms
- Detalle: `{"productId":"a42d14a7-85d7-4447-ae3a-7b293ffe8edc","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":38,"statuses":{"201":100,"400":20},"iteration":23}`

### C7 reservas mismo slot iter 23/100

- Invariante: OK
- Duracion: 474ms
- Latencia: p50=284ms, p95=459ms, p99=469ms, max=469ms
- Detalle: `{"fecha":"2221-12-15","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":23}`

### C5 pago duplicado concurrente iter 24/100

- Invariante: OK
- Duracion: 1217ms
- Latencia: p50=772ms, p95=1184ms, p99=1215ms, max=1215ms
- Detalle: `{"cuentaId":"7845b38b-14a7-41d9-8e01-7325ffca3060","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":24}`

### C6 stock compartido iter 24/100

- Invariante: OK
- Duracion: 1576ms
- Latencia: p50=1015ms, p95=1550ms, p99=1566ms, max=1573ms
- Detalle: `{"productId":"ca657170-94bc-4e69-b566-a255d4a7836b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":61,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":39,"statuses":{"201":100,"400":20},"iteration":24}`

### C7 reservas mismo slot iter 24/100

- Invariante: OK
- Duracion: 35655ms
- Latencia: p50=298ms, p95=35645ms, p99=35654ms, max=35654ms
- Detalle: `{"fecha":"2221-12-16","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":24}`

### C5 pago duplicado concurrente iter 25/100

- Invariante: OK
- Duracion: 1222ms
- Latencia: p50=727ms, p95=1188ms, p99=1216ms, max=1216ms
- Detalle: `{"cuentaId":"82d0aa7d-f9ed-4b55-a687-e79b92b7b4f5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":25}`

### C6 stock compartido iter 25/100

- Invariante: OK
- Duracion: 1686ms
- Latencia: p50=1106ms, p95=1640ms, p99=1675ms, max=1677ms
- Detalle: `{"productId":"4379546a-eaa1-4628-8963-7067fdfac22b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":25}`

### C7 reservas mismo slot iter 25/100

- Invariante: OK
- Duracion: 627ms
- Latencia: p50=398ms, p95=610ms, p99=621ms, max=621ms
- Detalle: `{"fecha":"2221-12-17","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":25}`

### C5 pago duplicado concurrente iter 26/100

- Invariante: OK
- Duracion: 35685ms
- Latencia: p50=605ms, p95=35639ms, p99=35681ms, max=35681ms
- Detalle: `{"cuentaId":"81e0c25f-e3f5-4214-900a-d7880ad9fb6e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":26}`

### C6 stock compartido iter 26/100

- Invariante: OK
- Duracion: 5122ms
- Latencia: p50=1019ms, p95=1539ms, p99=2053ms, max=5122ms
- Detalle: `{"productId":"8f7455f0-ff21-4ca4-b849-82d5bea048c4","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":0,"statuses":{"201":100,"400":20},"iteration":26}`

### C7 reservas mismo slot iter 26/100

- Invariante: OK
- Duracion: 513ms
- Latencia: p50=317ms, p95=493ms, p99=505ms, max=505ms
- Detalle: `{"fecha":"2221-12-18","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":26}`

### C5 pago duplicado concurrente iter 27/100

- Invariante: OK
- Duracion: 1187ms
- Latencia: p50=694ms, p95=1155ms, p99=1181ms, max=1181ms
- Detalle: `{"cuentaId":"9287c83b-712f-4cde-be98-c544b7a6e8a0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":98,"502":1},"iteration":27}`

### C6 stock compartido iter 27/100

- Invariante: OK
- Duracion: 1604ms
- Latencia: p50=1038ms, p95=1559ms, p99=1593ms, max=1595ms
- Detalle: `{"productId":"1ed0d1f0-353a-451e-b872-99920675721b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":65,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":35,"statuses":{"201":100,"400":20},"iteration":27}`

### C7 reservas mismo slot iter 27/100

- Invariante: OK
- Duracion: 448ms
- Latencia: p50=234ms, p95=427ms, p99=441ms, max=441ms
- Detalle: `{"fecha":"2221-12-19","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":27}`

### C5 pago duplicado concurrente iter 28/100

- Invariante: OK
- Duracion: 1187ms
- Latencia: p50=616ms, p95=1144ms, p99=1181ms, max=1181ms
- Detalle: `{"cuentaId":"ec6d34b3-39bc-4d61-85b5-342007a3d470","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":28}`

### C6 stock compartido iter 28/100

- Invariante: OK
- Duracion: 1777ms
- Latencia: p50=1173ms, p95=1752ms, p99=1771ms, max=1771ms
- Detalle: `{"productId":"5fae3b61-2f3a-43d7-ab36-dea9f189efdf","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":65,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":35,"statuses":{"201":100,"400":20},"iteration":28}`

### C7 reservas mismo slot iter 28/100

- Invariante: OK
- Duracion: 485ms
- Latencia: p50=310ms, p95=466ms, p99=479ms, max=479ms
- Detalle: `{"fecha":"2221-12-20","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":28}`

### C5 pago duplicado concurrente iter 29/100

- Invariante: OK
- Duracion: 1075ms
- Latencia: p50=663ms, p95=1041ms, p99=1069ms, max=1069ms
- Detalle: `{"cuentaId":"d2644ef5-b841-48e6-b209-597a55b8945c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":29}`

### C6 stock compartido iter 29/100

- Invariante: OK
- Duracion: 1490ms
- Latencia: p50=959ms, p95=1465ms, p99=1484ms, max=1488ms
- Detalle: `{"productId":"aa7fcb21-4b0e-4f08-9f6a-6db861e6db37","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":29}`

### C7 reservas mismo slot iter 29/100

- Invariante: OK
- Duracion: 438ms
- Latencia: p50=270ms, p95=426ms, p99=435ms, max=435ms
- Detalle: `{"fecha":"2221-12-21","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":29}`

### C5 pago duplicado concurrente iter 30/100

- Invariante: OK
- Duracion: 925ms
- Latencia: p50=547ms, p95=883ms, p99=921ms, max=921ms
- Detalle: `{"cuentaId":"a2b86859-f813-4d95-9f92-ccbd4ff59636","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":30}`

### C6 stock compartido iter 30/100

- Invariante: OK
- Duracion: 11381ms
- Latencia: p50=1024ms, p95=11374ms, p99=11377ms, max=11379ms
- Detalle: `{"productId":"3e02f129-3490-4a98-a5c0-c468c0c51287","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":0,"statuses":{"201":100,"400":20},"iteration":30}`

### C7 reservas mismo slot iter 30/100

- Invariante: OK
- Duracion: 399ms
- Latencia: p50=273ms, p95=385ms, p99=394ms, max=394ms
- Detalle: `{"fecha":"2221-12-22","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":30}`

### C5 pago duplicado concurrente iter 31/100

- Invariante: OK
- Duracion: 1242ms
- Latencia: p50=805ms, p95=1203ms, p99=1237ms, max=1237ms
- Detalle: `{"cuentaId":"77949e37-1281-42a3-85ef-47eb5b28a92a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":31}`

### C6 stock compartido iter 31/100

- Invariante: OK
- Duracion: 1370ms
- Latencia: p50=874ms, p95=1351ms, p99=1362ms, max=1363ms
- Detalle: `{"productId":"d5ca0a9f-c42b-4c2e-9700-a8f7dfc37fab","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":31}`

### C7 reservas mismo slot iter 31/100

- Invariante: OK
- Duracion: 496ms
- Latencia: p50=329ms, p95=474ms, p99=492ms, max=492ms
- Detalle: `{"fecha":"2221-12-23","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":31}`

### C5 pago duplicado concurrente iter 32/100

- Invariante: OK
- Duracion: 1050ms
- Latencia: p50=633ms, p95=1021ms, p99=1047ms, max=1047ms
- Detalle: `{"cuentaId":"bc4f60d4-6b8f-465e-aeb0-4c7bf64fb2fd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":32}`

### C6 stock compartido iter 32/100

- Invariante: OK
- Duracion: 1380ms
- Latencia: p50=896ms, p95=1363ms, p99=1371ms, max=1372ms
- Detalle: `{"productId":"1b3c53b2-f853-4b25-85f7-c916c683ed2d","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":32}`

### C7 reservas mismo slot iter 32/100

- Invariante: OK
- Duracion: 467ms
- Latencia: p50=301ms, p95=450ms, p99=460ms, max=460ms
- Detalle: `{"fecha":"2221-12-24","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":32}`

### C5 pago duplicado concurrente iter 33/100

- Invariante: OK
- Duracion: 1094ms
- Latencia: p50=711ms, p95=1062ms, p99=1087ms, max=1087ms
- Detalle: `{"cuentaId":"d8635651-b158-423a-bbfb-a915b32f37d9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":33}`

### C6 stock compartido iter 33/100

- Invariante: OK
- Duracion: 1376ms
- Latencia: p50=893ms, p95=1351ms, p99=1366ms, max=1372ms
- Detalle: `{"productId":"93ed9f7b-2242-4b93-b043-12f6f524f325","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":50,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":50,"statuses":{"201":100,"400":20},"iteration":33}`

### C7 reservas mismo slot iter 33/100

- Invariante: OK
- Duracion: 577ms
- Latencia: p50=326ms, p95=553ms, p99=573ms, max=573ms
- Detalle: `{"fecha":"2221-12-25","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":33}`

### C5 pago duplicado concurrente iter 34/100

- Invariante: OK
- Duracion: 60008ms
- Latencia: p50=552ms, p95=896ms, p99=60005ms, max=60005ms
- Detalle: `{"cuentaId":"c447ce75-734e-42f4-a25c-680fc67671f3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":2,"201":1,"400":97},"iteration":34}`

### C6 stock compartido iter 34/100

- Invariante: OK
- Duracion: 1931ms
- Latencia: p50=1315ms, p95=1896ms, p99=1922ms, max=1924ms
- Detalle: `{"productId":"2941d2a6-fa63-436f-82bc-351b2aacb729","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":34}`

### C7 reservas mismo slot iter 34/100

- Invariante: OK
- Duracion: 620ms
- Latencia: p50=380ms, p95=601ms, p99=611ms, max=611ms
- Detalle: `{"fecha":"2221-12-26","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":34}`

### C5 pago duplicado concurrente iter 35/100

- Invariante: OK
- Duracion: 1373ms
- Latencia: p50=833ms, p95=1340ms, p99=1365ms, max=1365ms
- Detalle: `{"cuentaId":"257e08b5-1389-448e-85be-c65e64401961","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":35}`

### C6 stock compartido iter 35/100

- Invariante: OK
- Duracion: 1630ms
- Latencia: p50=1025ms, p95=1587ms, p99=1621ms, max=1626ms
- Detalle: `{"productId":"2f9fec50-7cf0-4c13-9263-aaa40f683d40","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":61,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":39,"statuses":{"201":100,"400":20},"iteration":35}`

### C7 reservas mismo slot iter 35/100

- Invariante: OK
- Duracion: 517ms
- Latencia: p50=335ms, p95=496ms, p99=508ms, max=508ms
- Detalle: `{"fecha":"2221-12-27","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":35}`

### C5 pago duplicado concurrente iter 36/100

- Invariante: OK
- Duracion: 1141ms
- Latencia: p50=732ms, p95=1105ms, p99=1133ms, max=1133ms
- Detalle: `{"cuentaId":"6ef64899-3e5b-4371-9e4e-d1f7d850ce66","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":36}`

### C6 stock compartido iter 36/100

- Invariante: OK
- Duracion: 1764ms
- Latencia: p50=1110ms, p95=1722ms, p99=1748ms, max=1756ms
- Detalle: `{"productId":"3cad08f3-1a8c-4e1d-98e4-5a4a319ede74","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":70,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":30,"statuses":{"201":100,"400":20},"iteration":36}`

### C7 reservas mismo slot iter 36/100

- Invariante: OK
- Duracion: 586ms
- Latencia: p50=302ms, p95=561ms, p99=582ms, max=582ms
- Detalle: `{"fecha":"2221-12-28","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":36}`

### C5 pago duplicado concurrente iter 37/100

- Invariante: OK
- Duracion: 1169ms
- Latencia: p50=602ms, p95=1126ms, p99=1164ms, max=1164ms
- Detalle: `{"cuentaId":"3c997a88-ff2f-454b-aade-1d357048dbbe","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":37}`

### C6 stock compartido iter 37/100

- Invariante: OK
- Duracion: 1928ms
- Latencia: p50=1311ms, p95=1900ms, p99=1920ms, max=1921ms
- Detalle: `{"productId":"2eb47afe-2d0e-41aa-9329-db7960ba17e5","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":37}`

### C7 reservas mismo slot iter 37/100

- Invariante: OK
- Duracion: 629ms
- Latencia: p50=420ms, p95=611ms, p99=625ms, max=625ms
- Detalle: `{"fecha":"2221-12-29","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":37}`

### C5 pago duplicado concurrente iter 38/100

- Invariante: OK
- Duracion: 1054ms
- Latencia: p50=637ms, p95=1024ms, p99=1051ms, max=1051ms
- Detalle: `{"cuentaId":"b8851449-c550-4a98-bf7f-3594211d8de5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":38}`

### C6 stock compartido iter 38/100

- Invariante: OK
- Duracion: 1591ms
- Latencia: p50=1021ms, p95=1567ms, p99=1583ms, max=1586ms
- Detalle: `{"productId":"fd269b98-4973-4a67-bf59-58763ea2f727","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":61,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":39,"statuses":{"201":100,"400":20},"iteration":38}`

### C7 reservas mismo slot iter 38/100

- Invariante: OK
- Duracion: 453ms
- Latencia: p50=263ms, p95=429ms, p99=443ms, max=443ms
- Detalle: `{"fecha":"2221-12-30","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":38}`

### C5 pago duplicado concurrente iter 39/100

- Invariante: OK
- Duracion: 1319ms
- Latencia: p50=701ms, p95=1277ms, p99=1313ms, max=1313ms
- Detalle: `{"cuentaId":"810f5ee2-3743-4f11-95a5-f9cd6876ac74","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":39}`

### C6 stock compartido iter 39/100

- Invariante: OK
- Duracion: 1657ms
- Latencia: p50=1064ms, p95=1621ms, p99=1648ms, max=1650ms
- Detalle: `{"productId":"54e9f77f-4a30-4067-b0ac-0ffc02dd1c60","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":39}`

### C7 reservas mismo slot iter 39/100

- Invariante: OK
- Duracion: 520ms
- Latencia: p50=272ms, p95=496ms, p99=515ms, max=515ms
- Detalle: `{"fecha":"2221-12-31","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":39}`

### C5 pago duplicado concurrente iter 40/100

- Invariante: OK
- Duracion: 1393ms
- Latencia: p50=894ms, p95=1338ms, p99=1388ms, max=1388ms
- Detalle: `{"cuentaId":"5cc3acb0-6787-4f8e-aea7-0238893d433f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":40}`

### C6 stock compartido iter 40/100

- Invariante: OK
- Duracion: 1574ms
- Latencia: p50=1028ms, p95=1537ms, p99=1565ms, max=1568ms
- Detalle: `{"productId":"850f5aaf-d76f-4ca4-853e-5d543774f310","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":60,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":40,"statuses":{"201":100,"400":20},"iteration":40}`

### C7 reservas mismo slot iter 40/100

- Invariante: OK
- Duracion: 564ms
- Latencia: p50=386ms, p95=545ms, p99=560ms, max=560ms
- Detalle: `{"fecha":"2222-01-01","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":40}`

### C5 pago duplicado concurrente iter 41/100

- Invariante: OK
- Duracion: 1010ms
- Latencia: p50=619ms, p95=982ms, p99=1005ms, max=1005ms
- Detalle: `{"cuentaId":"6d19b146-a183-47f7-bdc8-4922363d097b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":98,"502":1},"iteration":41}`

### C6 stock compartido iter 41/100

- Invariante: OK
- Duracion: 2061ms
- Latencia: p50=1250ms, p95=1998ms, p99=2049ms, max=2051ms
- Detalle: `{"productId":"027a9bb5-c769-43d3-85f6-7445915f5d8b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":64,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":36,"statuses":{"201":100,"400":20},"iteration":41}`

### C7 reservas mismo slot iter 41/100

- Invariante: OK
- Duracion: 579ms
- Latencia: p50=301ms, p95=557ms, p99=570ms, max=570ms
- Detalle: `{"fecha":"2222-01-02","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":41}`

### C5 pago duplicado concurrente iter 42/100

- Invariante: OK
- Duracion: 1201ms
- Latencia: p50=789ms, p95=1162ms, p99=1192ms, max=1192ms
- Detalle: `{"cuentaId":"1e1e9bf0-36a5-4cb1-95cc-1a8035355e73","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":42}`

### C6 stock compartido iter 42/100

- Invariante: OK
- Duracion: 1790ms
- Latencia: p50=1132ms, p95=1764ms, p99=1782ms, max=1784ms
- Detalle: `{"productId":"4becd30b-79ae-4604-9646-fde96b13c19e","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":42}`

### C7 reservas mismo slot iter 42/100

- Invariante: OK
- Duracion: 533ms
- Latencia: p50=311ms, p95=515ms, p99=527ms, max=527ms
- Detalle: `{"fecha":"2222-01-03","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":42}`

### C5 pago duplicado concurrente iter 43/100

- Invariante: OK
- Duracion: 1092ms
- Latencia: p50=682ms, p95=1064ms, p99=1089ms, max=1089ms
- Detalle: `{"cuentaId":"15a45888-255e-4a08-8ecc-1f72ec8a504c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":43}`

### C6 stock compartido iter 43/100

- Invariante: OK
- Duracion: 1636ms
- Latencia: p50=1059ms, p95=1610ms, p99=1626ms, max=1629ms
- Detalle: `{"productId":"877f644d-6eb5-4b34-aae0-99cff63f1053","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":43}`

### C7 reservas mismo slot iter 43/100

- Invariante: OK
- Duracion: 35841ms
- Latencia: p50=330ms, p95=35833ms, p99=35838ms, max=35838ms
- Detalle: `{"fecha":"2222-01-04","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":43}`

### C5 pago duplicado concurrente iter 44/100

- Invariante: OK
- Duracion: 1191ms
- Latencia: p50=733ms, p95=1152ms, p99=1185ms, max=1185ms
- Detalle: `{"cuentaId":"69ea144e-8fac-498d-abcb-57c5716d0e28","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":44}`

### C6 stock compartido iter 44/100

- Invariante: OK
- Duracion: 1697ms
- Latencia: p50=1075ms, p95=1665ms, p99=1689ms, max=1690ms
- Detalle: `{"productId":"0e825f0c-98d1-416c-92d6-afe3bb4ba7f3","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":44}`

### C7 reservas mismo slot iter 44/100

- Invariante: OK
- Duracion: 650ms
- Latencia: p50=383ms, p95=633ms, p99=642ms, max=642ms
- Detalle: `{"fecha":"2222-01-05","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":44}`

### C5 pago duplicado concurrente iter 45/100

- Invariante: OK
- Duracion: 1150ms
- Latencia: p50=674ms, p95=1111ms, p99=1144ms, max=1144ms
- Detalle: `{"cuentaId":"a7138b03-4f7b-420a-8d6b-ecadc193ae77","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":45}`

### C6 stock compartido iter 45/100

- Invariante: OK
- Duracion: 1619ms
- Latencia: p50=1041ms, p95=1582ms, p99=1611ms, max=1616ms
- Detalle: `{"productId":"160ec1b5-0de5-4500-a635-63cf57d983ff","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":38,"statuses":{"201":100,"400":20},"iteration":45}`

### C7 reservas mismo slot iter 45/100

- Invariante: OK
- Duracion: 435ms
- Latencia: p50=296ms, p95=423ms, p99=428ms, max=428ms
- Detalle: `{"fecha":"2222-01-06","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":45}`

### C5 pago duplicado concurrente iter 46/100

- Invariante: OK
- Duracion: 1138ms
- Latencia: p50=644ms, p95=1102ms, p99=1131ms, max=1131ms
- Detalle: `{"cuentaId":"947a148a-632c-4563-8771-cec58524ea88","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":46}`

### C6 stock compartido iter 46/100

- Invariante: OK
- Duracion: 1670ms
- Latencia: p50=1121ms, p95=1629ms, p99=1653ms, max=1662ms
- Detalle: `{"productId":"0d9490ac-142e-4f4a-8fc2-7ee6da501c76","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":46}`

### C7 reservas mismo slot iter 46/100

- Invariante: OK
- Duracion: 541ms
- Latencia: p50=349ms, p95=527ms, p99=535ms, max=535ms
- Detalle: `{"fecha":"2222-01-07","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":46}`

### C5 pago duplicado concurrente iter 47/100

- Invariante: OK
- Duracion: 1078ms
- Latencia: p50=663ms, p95=1048ms, p99=1075ms, max=1075ms
- Detalle: `{"cuentaId":"3faac0f1-a475-4cc7-bdc7-5f796443726b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":47}`

### C6 stock compartido iter 47/100

- Invariante: OK
- Duracion: 1611ms
- Latencia: p50=1032ms, p95=1570ms, p99=1603ms, max=1605ms
- Detalle: `{"productId":"33638545-b9da-4ab8-b342-a91c4534e4cd","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":47}`

### C7 reservas mismo slot iter 47/100

- Invariante: OK
- Duracion: 486ms
- Latencia: p50=306ms, p95=469ms, p99=479ms, max=479ms
- Detalle: `{"fecha":"2222-01-08","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":47}`

### C5 pago duplicado concurrente iter 48/100

- Invariante: OK
- Duracion: 1512ms
- Latencia: p50=1024ms, p95=1475ms, p99=1504ms, max=1504ms
- Detalle: `{"cuentaId":"ccdd9604-e065-45e8-babd-f001d9af8300","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":48}`

### C6 stock compartido iter 48/100

- Invariante: OK
- Duracion: 1780ms
- Latencia: p50=1223ms, p95=1718ms, p99=1759ms, max=1765ms
- Detalle: `{"productId":"385b83a5-38d1-4de3-9e10-b4d6f755f13a","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":48}`

### C7 reservas mismo slot iter 48/100

- Invariante: OK
- Duracion: 753ms
- Latencia: p50=581ms, p95=729ms, p99=747ms, max=747ms
- Detalle: `{"fecha":"2222-01-09","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":48}`

### C5 pago duplicado concurrente iter 49/100

- Invariante: OK
- Duracion: 1124ms
- Latencia: p50=670ms, p95=1084ms, p99=1121ms, max=1121ms
- Detalle: `{"cuentaId":"4ecff800-a83c-495c-99fb-83dabc9b499a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":49}`

### C6 stock compartido iter 49/100

- Invariante: OK
- Duracion: 1558ms
- Latencia: p50=1028ms, p95=1520ms, p99=1548ms, max=1552ms
- Detalle: `{"productId":"20f612ee-1b3f-4b43-bfcc-8f006c7146a0","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":49}`

### C7 reservas mismo slot iter 49/100

- Invariante: OK
- Duracion: 558ms
- Latencia: p50=349ms, p95=539ms, p99=552ms, max=552ms
- Detalle: `{"fecha":"2222-01-10","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":49}`

### C5 pago duplicado concurrente iter 50/100

- Invariante: OK
- Duracion: 1252ms
- Latencia: p50=770ms, p95=1219ms, p99=1247ms, max=1247ms
- Detalle: `{"cuentaId":"ac866cf9-2d22-4166-b49e-e707ac6309a3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":50}`

### C6 stock compartido iter 50/100

- Invariante: OK
- Duracion: 1825ms
- Latencia: p50=1243ms, p95=1772ms, p99=1810ms, max=1812ms
- Detalle: `{"productId":"d41b2e0a-bd96-4008-b596-3ed9c0f7be42","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":63,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":37,"statuses":{"201":100,"400":20},"iteration":50}`

### C7 reservas mismo slot iter 50/100

- Invariante: OK
- Duracion: 562ms
- Latencia: p50=395ms, p95=540ms, p99=549ms, max=549ms
- Detalle: `{"fecha":"2222-01-11","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":50}`

### C5 pago duplicado concurrente iter 51/100

- Invariante: OK
- Duracion: 1223ms
- Latencia: p50=756ms, p95=1187ms, p99=1214ms, max=1214ms
- Detalle: `{"cuentaId":"0ef3d75a-f151-4834-aee9-8edb75117396","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":51}`

### C6 stock compartido iter 51/100

- Invariante: OK
- Duracion: 2043ms
- Latencia: p50=1366ms, p95=1990ms, p99=2028ms, max=2034ms
- Detalle: `{"productId":"48727a3f-f367-483e-8ade-6e6e9483d90b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":51}`

### C7 reservas mismo slot iter 51/100

- Invariante: OK
- Duracion: 489ms
- Latencia: p50=311ms, p95=473ms, p99=485ms, max=485ms
- Detalle: `{"fecha":"2222-01-12","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":51}`

### C5 pago duplicado concurrente iter 52/100

- Invariante: OK
- Duracion: 994ms
- Latencia: p50=605ms, p95=962ms, p99=986ms, max=986ms
- Detalle: `{"cuentaId":"80133da4-a929-409b-81b0-93a42abbf4ed","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":52}`

### C6 stock compartido iter 52/100

- Invariante: OK
- Duracion: 1523ms
- Latencia: p50=997ms, p95=1476ms, p99=1508ms, max=1512ms
- Detalle: `{"productId":"a276c283-3ed9-40d3-910d-c658d07de6ba","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":77,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":23,"statuses":{"201":100,"400":20},"iteration":52}`

### C7 reservas mismo slot iter 52/100

- Invariante: OK
- Duracion: 487ms
- Latencia: p50=309ms, p95=466ms, p99=478ms, max=478ms
- Detalle: `{"fecha":"2222-01-13","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":52}`

### C5 pago duplicado concurrente iter 53/100

- Invariante: OK
- Duracion: 984ms
- Latencia: p50=605ms, p95=951ms, p99=978ms, max=978ms
- Detalle: `{"cuentaId":"cef54087-0215-43d1-a694-cb6f99574c2b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":53}`

### C6 stock compartido iter 53/100

- Invariante: OK
- Duracion: 1453ms
- Latencia: p50=956ms, p95=1401ms, p99=1431ms, max=1449ms
- Detalle: `{"productId":"b0bb5803-cd95-4055-aff1-21c307c6966f","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":53}`

### C7 reservas mismo slot iter 53/100

- Invariante: OK
- Duracion: 407ms
- Latencia: p50=271ms, p95=394ms, p99=402ms, max=402ms
- Detalle: `{"fecha":"2222-01-14","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":53}`

### C5 pago duplicado concurrente iter 54/100

- Invariante: OK
- Duracion: 914ms
- Latencia: p50=540ms, p95=885ms, p99=909ms, max=909ms
- Detalle: `{"cuentaId":"ecc51e89-f527-47df-8bc7-0e2d769e33d5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":54}`

### C6 stock compartido iter 54/100

- Invariante: OK
- Duracion: 1486ms
- Latencia: p50=980ms, p95=1463ms, p99=1477ms, max=1477ms
- Detalle: `{"productId":"26f17572-b997-48f9-b850-f5f0509c8c6c","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":54}`

### C7 reservas mismo slot iter 54/100

- Invariante: OK
- Duracion: 443ms
- Latencia: p50=283ms, p95=428ms, p99=437ms, max=437ms
- Detalle: `{"fecha":"2222-01-15","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":54}`

### C5 pago duplicado concurrente iter 55/100

- Invariante: OK
- Duracion: 934ms
- Latencia: p50=570ms, p95=897ms, p99=928ms, max=928ms
- Detalle: `{"cuentaId":"a2cfdfd1-dfb1-4b36-b840-ecca933323c1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":55}`

### C6 stock compartido iter 55/100

- Invariante: OK
- Duracion: 1352ms
- Latencia: p50=891ms, p95=1327ms, p99=1346ms, max=1347ms
- Detalle: `{"productId":"74a120d0-a31e-4de2-a8e0-7c20742a12d5","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":55}`

### C7 reservas mismo slot iter 55/100

- Invariante: OK
- Duracion: 689ms
- Latencia: p50=392ms, p95=660ms, p99=684ms, max=684ms
- Detalle: `{"fecha":"2222-01-16","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":55}`

### C5 pago duplicado concurrente iter 56/100

- Invariante: OK
- Duracion: 1113ms
- Latencia: p50=712ms, p95=1080ms, p99=1107ms, max=1107ms
- Detalle: `{"cuentaId":"0618c60e-d8ba-4d96-9f84-9ca5564f5aba","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":56}`

### C6 stock compartido iter 56/100

- Invariante: OK
- Duracion: 1450ms
- Latencia: p50=941ms, p95=1434ms, p99=1445ms, max=1446ms
- Detalle: `{"productId":"35edecea-a84f-446b-aef9-dcd8d07cccef","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":54,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":46,"statuses":{"201":100,"400":20},"iteration":56}`

### C7 reservas mismo slot iter 56/100

- Invariante: OK
- Duracion: 377ms
- Latencia: p50=237ms, p95=361ms, p99=372ms, max=372ms
- Detalle: `{"fecha":"2222-01-17","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":56}`

### C5 pago duplicado concurrente iter 57/100

- Invariante: OK
- Duracion: 990ms
- Latencia: p50=597ms, p95=960ms, p99=984ms, max=984ms
- Detalle: `{"cuentaId":"4104d6f9-bcd6-42c8-94d2-29bc0bb292d4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":57}`

### C6 stock compartido iter 57/100

- Invariante: OK
- Duracion: 1463ms
- Latencia: p50=963ms, p95=1449ms, p99=1459ms, max=1462ms
- Detalle: `{"productId":"ca59252b-4e26-4a91-b9f5-c7c81c4d5e6c","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":77,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":23,"statuses":{"201":100,"400":20},"iteration":57}`

### C7 reservas mismo slot iter 57/100

- Invariante: OK
- Duracion: 636ms
- Latencia: p50=490ms, p95=621ms, p99=628ms, max=628ms
- Detalle: `{"fecha":"2222-01-18","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":57}`

### C5 pago duplicado concurrente iter 58/100

- Invariante: OK
- Duracion: 981ms
- Latencia: p50=590ms, p95=954ms, p99=979ms, max=979ms
- Detalle: `{"cuentaId":"85589458-a860-42fc-ab5c-ee03e755c1b5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":58}`

### C6 stock compartido iter 58/100

- Invariante: OK
- Duracion: 1410ms
- Latencia: p50=922ms, p95=1379ms, p99=1396ms, max=1397ms
- Detalle: `{"productId":"fb7c01f9-4efd-445a-93a2-259e326b3f3f","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":54,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":46,"statuses":{"201":100,"400":20},"iteration":58}`

### C7 reservas mismo slot iter 58/100

- Invariante: OK
- Duracion: 3109ms
- Latencia: p50=484ms, p95=3098ms, p99=3108ms, max=3108ms
- Detalle: `{"fecha":"2222-01-19","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":58}`

### C5 pago duplicado concurrente iter 59/100

- Invariante: OK
- Duracion: 35711ms
- Latencia: p50=580ms, p95=917ms, p99=35705ms, max=35705ms
- Detalle: `{"cuentaId":"c8e61074-f878-4f5d-8b72-ec28197edf92","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":59}`

### C6 stock compartido iter 59/100

- Invariante: OK
- Duracion: 1457ms
- Latencia: p50=949ms, p95=1425ms, p99=1447ms, max=1447ms
- Detalle: `{"productId":"bdb8658d-b911-461f-8467-673c02a65307","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":59}`

### C7 reservas mismo slot iter 59/100

- Invariante: OK
- Duracion: 686ms
- Latencia: p50=395ms, p95=668ms, p99=681ms, max=681ms
- Detalle: `{"fecha":"2222-01-20","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":59}`

### C5 pago duplicado concurrente iter 60/100

- Invariante: OK
- Duracion: 931ms
- Latencia: p50=568ms, p95=902ms, p99=928ms, max=928ms
- Detalle: `{"cuentaId":"df51b9b4-4071-4b2b-9aba-04582245d091","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":60}`

### C6 stock compartido iter 60/100

- Invariante: OK
- Duracion: 1541ms
- Latencia: p50=1027ms, p95=1502ms, p99=1527ms, max=1529ms
- Detalle: `{"productId":"d731e23b-2990-4b09-b3ce-1909f81b292c","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":60}`

### C7 reservas mismo slot iter 60/100

- Invariante: OK
- Duracion: 588ms
- Latencia: p50=357ms, p95=573ms, p99=585ms, max=585ms
- Detalle: `{"fecha":"2222-01-21","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":60}`

### C5 pago duplicado concurrente iter 61/100

- Invariante: OK
- Duracion: 932ms
- Latencia: p50=552ms, p95=902ms, p99=926ms, max=926ms
- Detalle: `{"cuentaId":"ee9b31e7-a9a0-44cc-8414-dee0848810a3","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":61}`

### C6 stock compartido iter 61/100

- Invariante: OK
- Duracion: 1597ms
- Latencia: p50=1033ms, p95=1574ms, p99=1588ms, max=1591ms
- Detalle: `{"productId":"2633ef1c-73d7-44dc-bed5-ad63356471f7","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":78,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":22,"statuses":{"201":100,"400":20},"iteration":61}`

### C7 reservas mismo slot iter 61/100

- Invariante: OK
- Duracion: 415ms
- Latencia: p50=276ms, p95=399ms, p99=410ms, max=410ms
- Detalle: `{"fecha":"2222-01-22","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":61}`

### C5 pago duplicado concurrente iter 62/100

- Invariante: OK
- Duracion: 1127ms
- Latencia: p50=678ms, p95=1090ms, p99=1121ms, max=1121ms
- Detalle: `{"cuentaId":"63b5704c-a225-40a6-8544-86a4d589924c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":62}`

### C6 stock compartido iter 62/100

- Invariante: OK
- Duracion: 1527ms
- Latencia: p50=1011ms, p95=1498ms, p99=1517ms, max=1519ms
- Detalle: `{"productId":"cc5793d4-42f7-4ad0-b959-221a67679497","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":62}`

### C7 reservas mismo slot iter 62/100

- Invariante: OK
- Duracion: 35833ms
- Latencia: p50=316ms, p95=481ms, p99=35828ms, max=35828ms
- Detalle: `{"fecha":"2222-01-23","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":62}`

### C5 pago duplicado concurrente iter 63/100

- Invariante: OK
- Duracion: 3226ms
- Latencia: p50=611ms, p95=970ms, p99=3220ms, max=3220ms
- Detalle: `{"cuentaId":"e534613a-cac6-4625-88a4-2f3d76683d45","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":63}`

### C6 stock compartido iter 63/100

- Invariante: OK
- Duracion: 1545ms
- Latencia: p50=1029ms, p95=1507ms, p99=1534ms, max=1538ms
- Detalle: `{"productId":"ab453ff9-7927-4bde-b3ea-e82bb6f3db30","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":61,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":39,"statuses":{"201":100,"400":20},"iteration":63}`

### C7 reservas mismo slot iter 63/100

- Invariante: OK
- Duracion: 409ms
- Latencia: p50=262ms, p95=395ms, p99=404ms, max=404ms
- Detalle: `{"fecha":"2222-01-24","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":63}`

### C5 pago duplicado concurrente iter 64/100

- Invariante: OK
- Duracion: 968ms
- Latencia: p50=610ms, p95=938ms, p99=962ms, max=962ms
- Detalle: `{"cuentaId":"395e8276-65b4-49aa-b1a4-fc89c37d8535","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":64}`

### C6 stock compartido iter 64/100

- Invariante: OK
- Duracion: 1578ms
- Latencia: p50=1031ms, p95=1549ms, p99=1564ms, max=1566ms
- Detalle: `{"productId":"34ac16e2-64f8-483a-88c8-b0fc0c0e4617","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":64}`

### C7 reservas mismo slot iter 64/100

- Invariante: OK
- Duracion: 470ms
- Latencia: p50=292ms, p95=454ms, p99=464ms, max=464ms
- Detalle: `{"fecha":"2222-01-25","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":64}`

### C5 pago duplicado concurrente iter 65/100

- Invariante: OK
- Duracion: 950ms
- Latencia: p50=564ms, p95=917ms, p99=944ms, max=944ms
- Detalle: `{"cuentaId":"ecc5e64b-edf1-4793-b4a4-e1a8a577091a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":65}`

### C6 stock compartido iter 65/100

- Invariante: OK
- Duracion: 1594ms
- Latencia: p50=1065ms, p95=1579ms, p99=1589ms, max=1591ms
- Detalle: `{"productId":"23eaf9a7-10ac-414c-855b-3890ac855a05","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":65}`

### C7 reservas mismo slot iter 65/100

- Invariante: OK
- Duracion: 552ms
- Latencia: p50=359ms, p95=528ms, p99=545ms, max=545ms
- Detalle: `{"fecha":"2222-01-26","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":65}`

### C5 pago duplicado concurrente iter 66/100

- Invariante: OK
- Duracion: 969ms
- Latencia: p50=575ms, p95=941ms, p99=963ms, max=963ms
- Detalle: `{"cuentaId":"534cab39-9fbf-4ea2-87a2-ac97ab1f7e8e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":66}`

### C6 stock compartido iter 66/100

- Invariante: OK
- Duracion: 1486ms
- Latencia: p50=972ms, p95=1432ms, p99=1477ms, max=1478ms
- Detalle: `{"productId":"8bfc03ee-cf55-479f-a875-a6fc329a7031","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":66}`

### C7 reservas mismo slot iter 66/100

- Invariante: OK
- Duracion: 498ms
- Latencia: p50=281ms, p95=472ms, p99=489ms, max=489ms
- Detalle: `{"fecha":"2222-01-27","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":66}`

### C5 pago duplicado concurrente iter 67/100

- Invariante: OK
- Duracion: 999ms
- Latencia: p50=607ms, p95=967ms, p99=993ms, max=993ms
- Detalle: `{"cuentaId":"7a92a412-b768-480f-8c8f-f6e60ce11232","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":67}`

### C6 stock compartido iter 67/100

- Invariante: OK
- Duracion: 60019ms
- Latencia: p50=871ms, p95=60015ms, p99=60016ms, max=60017ms
- Detalle: `{"productId":"cf0cf2fa-23b2-456e-84eb-4bdba5c3d434","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":13,"clientTimeouts":7,"stockActual":0,"statuses":{"0":7,"201":100,"400":13},"iteration":67}`

### C7 reservas mismo slot iter 67/100

- Invariante: OK
- Duracion: 477ms
- Latencia: p50=291ms, p95=461ms, p99=473ms, max=473ms
- Detalle: `{"fecha":"2222-01-28","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":67}`

### C5 pago duplicado concurrente iter 68/100

- Invariante: OK
- Duracion: 1019ms
- Latencia: p50=577ms, p95=989ms, p99=1015ms, max=1015ms
- Detalle: `{"cuentaId":"0d727526-ef1c-4f45-b548-33fbb6400739","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":68}`

### C6 stock compartido iter 68/100

- Invariante: OK
- Duracion: 1442ms
- Latencia: p50=944ms, p95=1411ms, p99=1436ms, max=1437ms
- Detalle: `{"productId":"105d4e58-25cf-441c-a0c8-de69a6cc2c16","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":68}`

### C7 reservas mismo slot iter 68/100

- Invariante: OK
- Duracion: 461ms
- Latencia: p50=273ms, p95=433ms, p99=454ms, max=454ms
- Detalle: `{"fecha":"2222-01-29","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":68}`

### C5 pago duplicado concurrente iter 69/100

- Invariante: OK
- Duracion: 978ms
- Latencia: p50=586ms, p95=947ms, p99=971ms, max=971ms
- Detalle: `{"cuentaId":"f9c94be5-580c-4ce6-8fe9-d6713987b67e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":69}`

### C6 stock compartido iter 69/100

- Invariante: OK
- Duracion: 1513ms
- Latencia: p50=976ms, p95=1466ms, p99=1498ms, max=1511ms
- Detalle: `{"productId":"20689c9e-3bbe-4ef7-b4e5-f2aa3dcea62a","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":69}`

### C7 reservas mismo slot iter 69/100

- Invariante: OK
- Duracion: 475ms
- Latencia: p50=272ms, p95=453ms, p99=466ms, max=466ms
- Detalle: `{"fecha":"2222-01-30","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":69}`

### C5 pago duplicado concurrente iter 70/100

- Invariante: OK
- Duracion: 982ms
- Latencia: p50=598ms, p95=951ms, p99=975ms, max=975ms
- Detalle: `{"cuentaId":"801bb3ad-d65e-47a9-837c-024aac625b38","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":70}`

### C6 stock compartido iter 70/100

- Invariante: OK
- Duracion: 1469ms
- Latencia: p50=949ms, p95=1450ms, p99=1461ms, max=1463ms
- Detalle: `{"productId":"1d3b6079-cd13-4fee-96ff-cfa2d66f8667","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":57,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":43,"statuses":{"201":100,"400":20},"iteration":70}`

### C7 reservas mismo slot iter 70/100

- Invariante: OK
- Duracion: 609ms
- Latencia: p50=356ms, p95=588ms, p99=602ms, max=602ms
- Detalle: `{"fecha":"2222-01-31","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":70}`

### C5 pago duplicado concurrente iter 71/100

- Invariante: OK
- Duracion: 972ms
- Latencia: p50=594ms, p95=944ms, p99=970ms, max=970ms
- Detalle: `{"cuentaId":"47e231e4-50ca-43b2-9cf5-aeab11db0563","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":71}`

### C6 stock compartido iter 71/100

- Invariante: OK
- Duracion: 1401ms
- Latencia: p50=912ms, p95=1374ms, p99=1393ms, max=1394ms
- Detalle: `{"productId":"0939f2b7-ffb4-4a9a-b2c5-80f8e03d758b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":71}`

### C7 reservas mismo slot iter 71/100

- Invariante: OK
- Duracion: 439ms
- Latencia: p50=237ms, p95=425ms, p99=435ms, max=435ms
- Detalle: `{"fecha":"2222-02-01","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":71}`

### C5 pago duplicado concurrente iter 72/100

- Invariante: OK
- Duracion: 943ms
- Latencia: p50=566ms, p95=912ms, p99=938ms, max=938ms
- Detalle: `{"cuentaId":"5ae8c9c8-39c7-4add-a992-9f679cf1befa","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":72}`

### C6 stock compartido iter 72/100

- Invariante: OK
- Duracion: 1341ms
- Latencia: p50=864ms, p95=1315ms, p99=1332ms, max=1333ms
- Detalle: `{"productId":"504fe1c4-16ce-42e5-ba8d-94786150a3f2","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":51,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":49,"statuses":{"201":100,"400":20},"iteration":72}`

### C7 reservas mismo slot iter 72/100

- Invariante: OK
- Duracion: 393ms
- Latencia: p50=265ms, p95=377ms, p99=387ms, max=387ms
- Detalle: `{"fecha":"2222-02-02","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":72}`

### C5 pago duplicado concurrente iter 73/100

- Invariante: OK
- Duracion: 997ms
- Latencia: p50=586ms, p95=955ms, p99=990ms, max=990ms
- Detalle: `{"cuentaId":"75f85bde-20a7-4001-8ba6-4b26b15c39af","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":73}`

### C6 stock compartido iter 73/100

- Invariante: OK
- Duracion: 1323ms
- Latencia: p50=867ms, p95=1293ms, p99=1319ms, max=1320ms
- Detalle: `{"productId":"44c7f4d0-0e98-4692-b2ac-f9ac736790c8","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":64,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":36,"statuses":{"201":100,"400":20},"iteration":73}`

### C7 reservas mismo slot iter 73/100

- Invariante: OK
- Duracion: 622ms
- Latencia: p50=355ms, p95=603ms, p99=612ms, max=612ms
- Detalle: `{"fecha":"2222-02-03","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":73}`

### C5 pago duplicado concurrente iter 74/100

- Invariante: OK
- Duracion: 1064ms
- Latencia: p50=673ms, p95=1034ms, p99=1057ms, max=1057ms
- Detalle: `{"cuentaId":"1649311d-1fcb-4e00-814e-09b236246038","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":74}`

### C6 stock compartido iter 74/100

- Invariante: OK
- Duracion: 1351ms
- Latencia: p50=869ms, p95=1320ms, p99=1338ms, max=1339ms
- Detalle: `{"productId":"9d64994c-1860-4bb7-ad02-96316ae52b79","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":74}`

### C7 reservas mismo slot iter 74/100

- Invariante: OK
- Duracion: 468ms
- Latencia: p50=249ms, p95=446ms, p99=461ms, max=461ms
- Detalle: `{"fecha":"2222-02-04","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":74}`

### C5 pago duplicado concurrente iter 75/100

- Invariante: OK
- Duracion: 1064ms
- Latencia: p50=681ms, p95=1034ms, p99=1060ms, max=1060ms
- Detalle: `{"cuentaId":"8aef5526-86e6-4638-b3de-e73e368e7d00","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":75}`

### C6 stock compartido iter 75/100

- Invariante: OK
- Duracion: 1451ms
- Latencia: p50=909ms, p95=1421ms, p99=1446ms, max=1449ms
- Detalle: `{"productId":"e8e7abe1-dbdb-460a-ae56-d21abe219137","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":75}`

### C7 reservas mismo slot iter 75/100

- Invariante: OK
- Duracion: 1131ms
- Latencia: p50=300ms, p95=1111ms, p99=1126ms, max=1126ms
- Detalle: `{"fecha":"2222-02-05","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":75}`

### C5 pago duplicado concurrente iter 76/100

- Invariante: OK
- Duracion: 1150ms
- Latencia: p50=687ms, p95=1116ms, p99=1142ms, max=1142ms
- Detalle: `{"cuentaId":"1bbd32c4-2019-4ef9-b4b3-f6894e370863","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":76}`

### C6 stock compartido iter 76/100

- Invariante: OK
- Duracion: 60006ms
- Latencia: p50=994ms, p95=1509ms, p99=1530ms, max=60005ms
- Detalle: `{"productId":"783b7f2b-572f-4283-8e54-3ee9bbbe84b5","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":19,"clientTimeouts":1,"stockActual":0,"statuses":{"0":1,"201":100,"400":19},"iteration":76}`

### C7 reservas mismo slot iter 76/100

- Invariante: OK
- Duracion: 424ms
- Latencia: p50=276ms, p95=411ms, p99=420ms, max=420ms
- Detalle: `{"fecha":"2222-02-06","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":76}`

### C5 pago duplicado concurrente iter 77/100

- Invariante: OK
- Duracion: 1066ms
- Latencia: p50=642ms, p95=1037ms, p99=1063ms, max=1063ms
- Detalle: `{"cuentaId":"dbf12fc5-2f4f-43a4-af5b-7656702277ad","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":77}`

### C6 stock compartido iter 77/100

- Invariante: OK
- Duracion: 1361ms
- Latencia: p50=874ms, p95=1281ms, p99=1353ms, max=1354ms
- Detalle: `{"productId":"6a6fe893-a652-4e11-98e5-2778179f21ed","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":77}`

### C7 reservas mismo slot iter 77/100

- Invariante: OK
- Duracion: 555ms
- Latencia: p50=391ms, p95=537ms, p99=549ms, max=549ms
- Detalle: `{"fecha":"2222-02-07","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":77}`

### C5 pago duplicado concurrente iter 78/100

- Invariante: OK
- Duracion: 1083ms
- Latencia: p50=691ms, p95=1050ms, p99=1075ms, max=1075ms
- Detalle: `{"cuentaId":"b470fa5f-61b4-4a6e-8753-6f6b22b4c737","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":78}`

### C6 stock compartido iter 78/100

- Invariante: OK
- Duracion: 1444ms
- Latencia: p50=930ms, p95=1398ms, p99=1432ms, max=1436ms
- Detalle: `{"productId":"d0ba6bbc-f2fc-4fbe-be22-f8f0adb81df6","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":78}`

### C7 reservas mismo slot iter 78/100

- Invariante: OK
- Duracion: 518ms
- Latencia: p50=372ms, p95=505ms, p99=512ms, max=512ms
- Detalle: `{"fecha":"2222-02-08","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":78}`

### C5 pago duplicado concurrente iter 79/100

- Invariante: OK
- Duracion: 929ms
- Latencia: p50=564ms, p95=896ms, p99=924ms, max=924ms
- Detalle: `{"cuentaId":"f5c7b301-c28c-4db7-97b8-d7d01ab274bb","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":79}`

### C6 stock compartido iter 79/100

- Invariante: OK
- Duracion: 1304ms
- Latencia: p50=843ms, p95=1270ms, p99=1295ms, max=1295ms
- Detalle: `{"productId":"a0c46183-89d1-46d5-bc1d-467091cdbef6","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":79}`

### C7 reservas mismo slot iter 79/100

- Invariante: OK
- Duracion: 686ms
- Latencia: p50=393ms, p95=659ms, p99=676ms, max=676ms
- Detalle: `{"fecha":"2222-02-09","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":79}`

### C5 pago duplicado concurrente iter 80/100

- Invariante: OK
- Duracion: 955ms
- Latencia: p50=584ms, p95=925ms, p99=949ms, max=949ms
- Detalle: `{"cuentaId":"20595db8-4078-4fbf-a27f-308c23b9e6c6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":80}`

### C6 stock compartido iter 80/100

- Invariante: OK
- Duracion: 1228ms
- Latencia: p50=781ms, p95=1197ms, p99=1219ms, max=1221ms
- Detalle: `{"productId":"32a8f64d-991a-40a2-be84-fa7c9b2fb0ef","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":80}`

### C7 reservas mismo slot iter 80/100

- Invariante: OK
- Duracion: 737ms
- Latencia: p50=312ms, p95=715ms, p99=731ms, max=731ms
- Detalle: `{"fecha":"2222-02-10","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":80}`

### C5 pago duplicado concurrente iter 81/100

- Invariante: OK
- Duracion: 944ms
- Latencia: p50=568ms, p95=913ms, p99=939ms, max=939ms
- Detalle: `{"cuentaId":"2bea55c1-6793-427e-8fe9-1b58434da8ca","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":81}`

### C6 stock compartido iter 81/100

- Invariante: OK
- Duracion: 1244ms
- Latencia: p50=788ms, p95=1215ms, p99=1237ms, max=1238ms
- Detalle: `{"productId":"28b9f382-fbd1-426c-a2a0-76259c718402","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":81}`

### C7 reservas mismo slot iter 81/100

- Invariante: OK
- Duracion: 517ms
- Latencia: p50=328ms, p95=495ms, p99=511ms, max=511ms
- Detalle: `{"fecha":"2222-02-11","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":81}`

### C5 pago duplicado concurrente iter 82/100

- Invariante: OK
- Duracion: 925ms
- Latencia: p50=566ms, p95=897ms, p99=919ms, max=919ms
- Detalle: `{"cuentaId":"cf579dea-edd6-44a2-a19c-f486cc09a692","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":82}`

### C6 stock compartido iter 82/100

- Invariante: OK
- Duracion: 60121ms
- Latencia: p50=722ms, p95=60002ms, p99=60005ms, max=60005ms
- Detalle: `{"productId":"e6fd14d3-d932-44b2-bfea-379fedaa21cc","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":8,"clientTimeouts":12,"stockActual":0,"statuses":{"0":12,"201":100,"400":8},"iteration":82}`

### C7 reservas mismo slot iter 82/100

- Invariante: OK
- Duracion: 570ms
- Latencia: p50=401ms, p95=555ms, p99=565ms, max=565ms
- Detalle: `{"fecha":"2222-02-12","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":82}`

### C5 pago duplicado concurrente iter 83/100

- Invariante: OK
- Duracion: 1010ms
- Latencia: p50=635ms, p95=978ms, p99=1001ms, max=1001ms
- Detalle: `{"cuentaId":"825eaba1-ca38-4e12-939d-919f4f69080d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":83}`

### C6 stock compartido iter 83/100

- Invariante: OK
- Duracion: 1271ms
- Latencia: p50=812ms, p95=1239ms, p99=1263ms, max=1267ms
- Detalle: `{"productId":"f96520e8-4275-40af-ad77-e3e8034165ea","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":74,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":26,"statuses":{"201":100,"400":20},"iteration":83}`

### C7 reservas mismo slot iter 83/100

- Invariante: OK
- Duracion: 486ms
- Latencia: p50=234ms, p95=465ms, p99=478ms, max=478ms
- Detalle: `{"fecha":"2222-02-13","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":83}`

### C5 pago duplicado concurrente iter 84/100

- Invariante: OK
- Duracion: 911ms
- Latencia: p50=542ms, p95=883ms, p99=905ms, max=905ms
- Detalle: `{"cuentaId":"dba05da8-07e6-4a75-99c2-edf7af4bfc59","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":84}`

### C6 stock compartido iter 84/100

- Invariante: OK
- Duracion: 1486ms
- Latencia: p50=954ms, p95=1415ms, p99=1472ms, max=1477ms
- Detalle: `{"productId":"6f3ad6b0-428d-4996-b496-02bb951bd3af","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":61,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":39,"statuses":{"201":100,"400":20},"iteration":84}`

### C7 reservas mismo slot iter 84/100

- Invariante: OK
- Duracion: 440ms
- Latencia: p50=297ms, p95=424ms, p99=436ms, max=436ms
- Detalle: `{"fecha":"2222-02-14","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":84}`

### C5 pago duplicado concurrente iter 85/100

- Invariante: OK
- Duracion: 921ms
- Latencia: p50=552ms, p95=893ms, p99=916ms, max=916ms
- Detalle: `{"cuentaId":"127fc33e-6e19-4b31-9743-b3955b90443c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":85}`

### C6 stock compartido iter 85/100

- Invariante: OK
- Duracion: 1223ms
- Latencia: p50=786ms, p95=1204ms, p99=1215ms, max=1217ms
- Detalle: `{"productId":"6080d33f-d349-4983-897e-11959aac6cef","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":50,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":50,"statuses":{"201":100,"400":20},"iteration":85}`

### C7 reservas mismo slot iter 85/100

- Invariante: OK
- Duracion: 550ms
- Latencia: p50=352ms, p95=535ms, p99=545ms, max=545ms
- Detalle: `{"fecha":"2222-02-15","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":85}`

### C5 pago duplicado concurrente iter 86/100

- Invariante: OK
- Duracion: 937ms
- Latencia: p50=571ms, p95=909ms, p99=931ms, max=931ms
- Detalle: `{"cuentaId":"c3ec9dc2-0f9e-402b-b23d-651114622f63","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":86}`

### C6 stock compartido iter 86/100

- Invariante: OK
- Duracion: 1298ms
- Latencia: p50=820ms, p95=1260ms, p99=1290ms, max=1291ms
- Detalle: `{"productId":"2213607c-fa22-4cc7-ae38-aa22b4d06dd9","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":86}`

### C7 reservas mismo slot iter 86/100

- Invariante: OK
- Duracion: 625ms
- Latencia: p50=431ms, p95=608ms, p99=620ms, max=620ms
- Detalle: `{"fecha":"2222-02-16","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":86}`

### C5 pago duplicado concurrente iter 87/100

- Invariante: OK
- Duracion: 1037ms
- Latencia: p50=645ms, p95=1007ms, p99=1034ms, max=1034ms
- Detalle: `{"cuentaId":"b54fe48e-12a3-4830-a4bb-14d9902b5acc","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":87}`

### C6 stock compartido iter 87/100

- Invariante: OK
- Duracion: 1207ms
- Latencia: p50=789ms, p95=1175ms, p99=1201ms, max=1202ms
- Detalle: `{"productId":"57f9ce5f-219e-48b5-8cf3-f8782a9d8423","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":87}`

### C7 reservas mismo slot iter 87/100

- Invariante: OK
- Duracion: 462ms
- Latencia: p50=266ms, p95=449ms, p99=456ms, max=456ms
- Detalle: `{"fecha":"2222-02-17","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":87}`

### C5 pago duplicado concurrente iter 88/100

- Invariante: OK
- Duracion: 1026ms
- Latencia: p50=653ms, p95=997ms, p99=1020ms, max=1020ms
- Detalle: `{"cuentaId":"b47ab363-a5f8-420b-98a9-2f5f9cbcc877","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":88}`

### C6 stock compartido iter 88/100

- Invariante: OK
- Duracion: 1316ms
- Latencia: p50=873ms, p95=1295ms, p99=1309ms, max=1310ms
- Detalle: `{"productId":"c5415f43-931d-4dd1-81e9-38875aaba317","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":88}`

### C7 reservas mismo slot iter 88/100

- Invariante: OK
- Duracion: 451ms
- Latencia: p50=272ms, p95=428ms, p99=444ms, max=444ms
- Detalle: `{"fecha":"2222-02-18","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":88}`

### C5 pago duplicado concurrente iter 89/100

- Invariante: OK
- Duracion: 1454ms
- Latencia: p50=991ms, p95=1424ms, p99=1450ms, max=1450ms
- Detalle: `{"cuentaId":"35fe8cab-f2aa-4b0c-a9b1-dbefd25360cb","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":89}`

### C6 stock compartido iter 89/100

- Invariante: OK
- Duracion: 1436ms
- Latencia: p50=924ms, p95=1405ms, p99=1425ms, max=1427ms
- Detalle: `{"productId":"6903ab1e-f061-47c8-b47b-f9cab12c860b","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":89}`

### C7 reservas mismo slot iter 89/100

- Invariante: OK
- Duracion: 431ms
- Latencia: p50=285ms, p95=412ms, p99=424ms, max=424ms
- Detalle: `{"fecha":"2222-02-19","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":89}`

### C5 pago duplicado concurrente iter 90/100

- Invariante: OK
- Duracion: 1158ms
- Latencia: p50=713ms, p95=1119ms, p99=1151ms, max=1151ms
- Detalle: `{"cuentaId":"2aaf798e-3ded-462f-b545-553a1edcdde4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":90}`

### C6 stock compartido iter 90/100

- Invariante: OK
- Duracion: 1705ms
- Latencia: p50=1094ms, p95=1663ms, p99=1701ms, max=1702ms
- Detalle: `{"productId":"bbed8869-ac00-479b-a94a-aabfbb7f8e7d","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":58,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":42,"statuses":{"201":100,"400":20},"iteration":90}`

### C7 reservas mismo slot iter 90/100

- Invariante: OK
- Duracion: 515ms
- Latencia: p50=327ms, p95=499ms, p99=510ms, max=510ms
- Detalle: `{"fecha":"2222-02-20","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":90}`

### C5 pago duplicado concurrente iter 91/100

- Invariante: OK
- Duracion: 1031ms
- Latencia: p50=603ms, p95=997ms, p99=1024ms, max=1024ms
- Detalle: `{"cuentaId":"9e7e7cb6-94d2-4b62-b1a2-a8ae4c5a799c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":91}`

### C6 stock compartido iter 91/100

- Invariante: OK
- Duracion: 1378ms
- Latencia: p50=888ms, p95=1354ms, p99=1370ms, max=1372ms
- Detalle: `{"productId":"4185b2d6-f686-43a9-b42b-324ad46c7f2f","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":75,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":25,"statuses":{"201":100,"400":20},"iteration":91}`

### C7 reservas mismo slot iter 91/100

- Invariante: OK
- Duracion: 607ms
- Latencia: p50=384ms, p95=593ms, p99=602ms, max=602ms
- Detalle: `{"fecha":"2222-02-21","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":91}`

### C5 pago duplicado concurrente iter 92/100

- Invariante: OK
- Duracion: 1070ms
- Latencia: p50=634ms, p95=1030ms, p99=1067ms, max=1067ms
- Detalle: `{"cuentaId":"c99c9f3c-baf0-43e2-a3b6-08912fd5fe47","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":92}`

### C6 stock compartido iter 92/100

- Invariante: OK
- Duracion: 60019ms
- Latencia: p50=875ms, p95=60012ms, p99=60013ms, max=60013ms
- Detalle: `{"productId":"f622a6b0-7870-49df-9719-d3c1fc1cf352","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":8,"clientTimeouts":12,"stockActual":0,"statuses":{"0":12,"201":100,"400":8},"iteration":92}`

### C7 reservas mismo slot iter 92/100

- Invariante: OK
- Duracion: 606ms
- Latencia: p50=365ms, p95=588ms, p99=600ms, max=600ms
- Detalle: `{"fecha":"2222-02-22","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":92}`

### C5 pago duplicado concurrente iter 93/100

- Invariante: OK
- Duracion: 980ms
- Latencia: p50=569ms, p95=934ms, p99=972ms, max=972ms
- Detalle: `{"cuentaId":"a966f3d6-98d5-4692-994a-961566077b6f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":93}`

### C6 stock compartido iter 93/100

- Invariante: OK
- Duracion: 1444ms
- Latencia: p50=938ms, p95=1411ms, p99=1437ms, max=1438ms
- Detalle: `{"productId":"6d33b437-7c05-4467-9368-d0f20ceae9ce","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":93}`

### C7 reservas mismo slot iter 93/100

- Invariante: OK
- Duracion: 724ms
- Latencia: p50=466ms, p95=698ms, p99=719ms, max=719ms
- Detalle: `{"fecha":"2222-02-23","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":93}`

### C5 pago duplicado concurrente iter 94/100

- Invariante: OK
- Duracion: 1232ms
- Latencia: p50=794ms, p95=1200ms, p99=1230ms, max=1230ms
- Detalle: `{"cuentaId":"3216394a-2582-43f4-bb12-541b76d2fe67","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":94}`

### C6 stock compartido iter 94/100

- Invariante: OK
- Duracion: 1425ms
- Latencia: p50=944ms, p95=1386ms, p99=1405ms, max=1413ms
- Detalle: `{"productId":"6f1b1333-d4ce-4e1b-adcc-3de7e6526a58","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":79,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":21,"statuses":{"201":100,"400":20},"iteration":94}`

### C7 reservas mismo slot iter 94/100

- Invariante: OK
- Duracion: 507ms
- Latencia: p50=314ms, p95=492ms, p99=501ms, max=501ms
- Detalle: `{"fecha":"2222-02-24","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":94}`

### C5 pago duplicado concurrente iter 95/100

- Invariante: OK
- Duracion: 1082ms
- Latencia: p50=615ms, p95=1050ms, p99=1075ms, max=1075ms
- Detalle: `{"cuentaId":"9fbcc7a6-5ca9-449d-bb50-b4c2c60ff4be","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":95}`

### C6 stock compartido iter 95/100

- Invariante: OK
- Duracion: 1383ms
- Latencia: p50=907ms, p95=1361ms, p99=1375ms, max=1377ms
- Detalle: `{"productId":"56c17ee8-34b9-46a4-a03d-8ce7f5e4f7f4","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":95}`

### C7 reservas mismo slot iter 95/100

- Invariante: OK
- Duracion: 456ms
- Latencia: p50=293ms, p95=441ms, p99=450ms, max=450ms
- Detalle: `{"fecha":"2222-02-25","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":95}`

### C5 pago duplicado concurrente iter 96/100

- Invariante: OK
- Duracion: 1243ms
- Latencia: p50=760ms, p95=1203ms, p99=1236ms, max=1236ms
- Detalle: `{"cuentaId":"406eec87-7aee-49fb-a23b-a5c66aa11776","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":96}`

### C6 stock compartido iter 96/100

- Invariante: OK
- Duracion: 1377ms
- Latencia: p50=872ms, p95=1347ms, p99=1371ms, max=1372ms
- Detalle: `{"productId":"1473b9b6-0cb3-47fe-a007-5a37bd485f05","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":59,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":41,"statuses":{"201":100,"400":20},"iteration":96}`

### C7 reservas mismo slot iter 96/100

- Invariante: OK
- Duracion: 735ms
- Latencia: p50=429ms, p95=710ms, p99=727ms, max=727ms
- Detalle: `{"fecha":"2222-02-26","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":96}`

### C5 pago duplicado concurrente iter 97/100

- Invariante: OK
- Duracion: 1204ms
- Latencia: p50=664ms, p95=1163ms, p99=1198ms, max=1198ms
- Detalle: `{"cuentaId":"4dfc3063-df31-4bc1-b971-85aa0ed6eed7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":97}`

### C6 stock compartido iter 97/100

- Invariante: OK
- Duracion: 1481ms
- Latencia: p50=957ms, p95=1452ms, p99=1477ms, max=1477ms
- Detalle: `{"productId":"7b63daf6-de0d-4b8d-b256-b2e2281dd970","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":38,"statuses":{"201":100,"400":20},"iteration":97}`

### C7 reservas mismo slot iter 97/100

- Invariante: OK
- Duracion: 467ms
- Latencia: p50=287ms, p95=452ms, p99=463ms, max=463ms
- Detalle: `{"fecha":"2222-02-27","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":97}`

### C5 pago duplicado concurrente iter 98/100

- Invariante: OK
- Duracion: 1035ms
- Latencia: p50=640ms, p95=1002ms, p99=1033ms, max=1033ms
- Detalle: `{"cuentaId":"cfa85605-09fd-4c0c-a6b9-35bb2950fdd4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":98}`

### C6 stock compartido iter 98/100

- Invariante: OK
- Duracion: 1328ms
- Latencia: p50=852ms, p95=1279ms, p99=1307ms, max=1318ms
- Detalle: `{"productId":"c6f14551-d8b2-43d3-8108-f6a9a0501485","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":77,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":23,"statuses":{"201":100,"400":20},"iteration":98}`

### C7 reservas mismo slot iter 98/100

- Invariante: OK
- Duracion: 658ms
- Latencia: p50=362ms, p95=638ms, p99=650ms, max=650ms
- Detalle: `{"fecha":"2222-02-28","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":98}`

### C5 pago duplicado concurrente iter 99/100

- Invariante: OK
- Duracion: 1150ms
- Latencia: p50=731ms, p95=1122ms, p99=1144ms, max=1144ms
- Detalle: `{"cuentaId":"5fd049e7-7dcc-4158-b559-6f3042a189be","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":99}`

### C6 stock compartido iter 99/100

- Invariante: OK
- Duracion: 60014ms
- Latencia: p50=855ms, p95=60004ms, p99=60007ms, max=60007ms
- Detalle: `{"productId":"d40f5dd2-9d59-4409-8356-164758d5df07","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":100,"rejectedPedidos":13,"clientTimeouts":7,"stockActual":0,"statuses":{"0":7,"201":100,"400":13},"iteration":99}`

### C7 reservas mismo slot iter 99/100

- Invariante: OK
- Duracion: 773ms
- Latencia: p50=439ms, p95=748ms, p99=764ms, max=764ms
- Detalle: `{"fecha":"2222-03-01","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":99}`

### C5 pago duplicado concurrente iter 100/100

- Invariante: OK
- Duracion: 1169ms
- Latencia: p50=713ms, p95=1118ms, p99=1162ms, max=1162ms
- Detalle: `{"cuentaId":"a741a9b9-f22f-493e-b015-16bf245b7f0d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":100}`

### C6 stock compartido iter 100/100

- Invariante: OK
- Duracion: 1350ms
- Latencia: p50=858ms, p95=1318ms, p99=1338ms, max=1341ms
- Detalle: `{"productId":"735c0e92-1dfa-4fd9-94de-eea57f038694","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":51,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":49,"statuses":{"201":100,"400":20},"iteration":100}`

### C7 reservas mismo slot iter 100/100

- Invariante: OK
- Duracion: 478ms
- Latencia: p50=335ms, p95=459ms, p99=470ms, max=470ms
- Detalle: `{"fecha":"2222-03-02","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":100}`

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

# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T04:47:14.351Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 50
- Iteraciones: 100
- Resultado: 72/300 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/100 | OK | 50 | {"201":1,"400":49} | 605ms | 78.74 |
| C6 stock compartido iter 1/100 | OK | 60 | {"201":50,"400":10} | 676ms | 85.71 |
| C7 reservas mismo slot iter 1/100 | OK | 50 | {"201":1,"409":49} | 271ms | 177.3 |
| C5 pago duplicado concurrente iter 2/100 | OK | 50 | {"201":1,"400":49} | 552ms | 87.72 |
| C6 stock compartido iter 2/100 | OK | 60 | {"201":50,"400":10} | 667ms | 84.87 |
| C7 reservas mismo slot iter 2/100 | OK | 50 | {"201":1,"409":49} | 235ms | 204.92 |
| C5 pago duplicado concurrente iter 3/100 | OK | 50 | {"201":1,"400":49} | 472ms | 101.83 |
| C6 stock compartido iter 3/100 | OK | 60 | {"201":50,"400":10} | 646ms | 87.72 |
| C7 reservas mismo slot iter 3/100 | OK | 50 | {"201":1,"409":49} | 225ms | 215.52 |
| C5 pago duplicado concurrente iter 4/100 | OK | 50 | {"201":1,"400":49} | 523ms | 90.58 |
| C6 stock compartido iter 4/100 | OK | 60 | {"201":50,"400":10} | 666ms | 86.96 |
| C7 reservas mismo slot iter 4/100 | OK | 50 | {"201":1,"409":49} | 193ms | 250 |
| C5 pago duplicado concurrente iter 5/100 | OK | 50 | {"201":1,"400":49} | 507ms | 94.88 |
| C6 stock compartido iter 5/100 | OK | 60 | {"201":50,"400":10} | 644ms | 87.08 |
| C7 reservas mismo slot iter 5/100 | OK | 50 | {"201":1,"409":49} | 238ms | 202.43 |
| C5 pago duplicado concurrente iter 6/100 | OK | 50 | {"201":1,"400":49} | 437ms | 110.38 |
| C6 stock compartido iter 6/100 | OK | 60 | {"0":1,"201":50,"400":9} | 669ms | 4 |
| C7 reservas mismo slot iter 6/100 | OK | 50 | {"201":1,"409":49} | 155ms | 314.47 |
| C5 pago duplicado concurrente iter 7/100 | OK | 50 | {"201":1,"400":49} | 454ms | 106.16 |
| C6 stock compartido iter 7/100 | OK | 60 | {"201":50,"400":10} | 621ms | 89.96 |
| C7 reservas mismo slot iter 7/100 | OK | 50 | {"201":1,"409":49} | 199ms | 243.9 |
| C5 pago duplicado concurrente iter 8/100 | OK | 50 | {"201":1,"400":49} | 476ms | 101.21 |
| C6 stock compartido iter 8/100 | OK | 60 | {"201":50,"400":10} | 628ms | 90.09 |
| C7 reservas mismo slot iter 8/100 | OK | 50 | {"0":8,"201":1,"409":41} | 15017ms | 3.33 |
| C5 pago duplicado concurrente iter 9/100 | OK | 50 | {"0":1,"201":1,"400":48} | 568ms | 3.33 |
| C6 stock compartido iter 9/100 | OK | 60 | {"201":50,"400":10} | 653ms | 88.24 |
| C7 reservas mismo slot iter 9/100 | OK | 50 | {"201":1,"409":49} | 218ms | 217.39 |
| C5 pago duplicado concurrente iter 10/100 | OK | 50 | {"201":1,"400":49} | 512ms | 94.52 |
| C6 stock compartido iter 10/100 | OK | 60 | {"201":50,"400":10} | 657ms | 88.24 |
| C7 reservas mismo slot iter 10/100 | OK | 50 | {"201":1,"409":49} | 210ms | 231.48 |
| C5 pago duplicado concurrente iter 11/100 | OK | 50 | {"201":1,"400":49} | 528ms | 91.07 |
| C6 stock compartido iter 11/100 | OK | 60 | {"201":50,"400":10} | 679ms | 85.84 |
| C7 reservas mismo slot iter 11/100 | OK | 50 | {"201":1,"409":49} | 282ms | 172.41 |
| C5 pago duplicado concurrente iter 12/100 | OK | 50 | {"201":1,"400":49} | 431ms | 111.61 |
| C6 stock compartido iter 12/100 | OK | 60 | {"201":50,"400":10} | 628ms | 90.5 |
| C7 reservas mismo slot iter 12/100 | OK | 50 | {"201":1,"409":49} | 223ms | 217.39 |
| C5 pago duplicado concurrente iter 13/100 | OK | 50 | {"201":1,"400":49} | 602ms | 79.87 |
| C6 stock compartido iter 13/100 | OK | 60 | {"201":50,"400":10} | 713ms | 81.97 |
| C7 reservas mismo slot iter 13/100 | OK | 50 | {"201":1,"409":49} | 248ms | 196.85 |
| C5 pago duplicado concurrente iter 14/100 | OK | 50 | {"201":1,"400":49} | 578ms | 83.06 |
| C6 stock compartido iter 14/100 | OK | 60 | {"201":50,"400":10} | 745ms | 76.43 |
| C7 reservas mismo slot iter 14/100 | OK | 50 | {"201":1,"409":49} | 255ms | 190.11 |
| C5 pago duplicado concurrente iter 15/100 | OK | 50 | {"201":1,"400":49} | 537ms | 90.25 |
| C6 stock compartido iter 15/100 | OK | 60 | {"201":50,"400":10} | 712ms | 80 |
| C7 reservas mismo slot iter 15/100 | OK | 50 | {"201":1,"409":49} | 231ms | 210.08 |
| C5 pago duplicado concurrente iter 16/100 | OK | 50 | {"201":1,"400":49} | 551ms | 87.87 |
| C6 stock compartido iter 16/100 | OK | 60 | {"201":50,"400":10} | 769ms | 75.28 |
| C7 reservas mismo slot iter 16/100 | OK | 50 | {"0":2,"201":1,"409":47} | 234ms | 3.33 |
| C5 pago duplicado concurrente iter 17/100 | OK | 50 | {"201":1,"400":49} | 635ms | 76.57 |
| C6 stock compartido iter 17/100 | OK | 60 | {"201":50,"400":10} | 733ms | 78.84 |
| C7 reservas mismo slot iter 17/100 | OK | 50 | {"201":1,"409":49} | 216ms | 225.23 |
| C5 pago duplicado concurrente iter 18/100 | OK | 50 | {"201":1,"400":49} | 588ms | 82.24 |
| C6 stock compartido iter 18/100 | OK | 60 | {"201":50,"400":10} | 730ms | 78.95 |
| C7 reservas mismo slot iter 18/100 | OK | 50 | {"201":1,"409":49} | 286ms | 170.65 |
| C5 pago duplicado concurrente iter 19/100 | OK | 50 | {"201":1,"400":49} | 537ms | 90.25 |
| C6 stock compartido iter 19/100 | OK | 60 | {"201":50,"400":10} | 723ms | 78.43 |
| C7 reservas mismo slot iter 19/100 | OK | 50 | {"201":1,"409":49} | 251ms | 191.57 |
| C5 pago duplicado concurrente iter 20/100 | OK | 50 | {"201":1,"400":49} | 484ms | 99.8 |
| C6 stock compartido iter 20/100 | OK | 60 | {"201":50,"400":10} | 711ms | 81.97 |
| C7 reservas mismo slot iter 20/100 | OK | 50 | {"201":1,"409":49} | 227ms | 210.97 |
| C5 pago duplicado concurrente iter 21/100 | OK | 50 | {"201":1,"400":49} | 675ms | 71.84 |
| C6 stock compartido iter 21/100 | OK | 60 | {"201":50,"400":10} | 675ms | 85.11 |
| C7 reservas mismo slot iter 21/100 | OK | 50 | {"201":1,"409":49} | 274ms | 177.3 |
| C5 pago duplicado concurrente iter 22/100 | OK | 50 | {"201":1,"400":49} | 535ms | 90.09 |
| C6 stock compartido iter 22/100 | OK | 60 | {"201":50,"400":10} | 696ms | 82.87 |
| C7 reservas mismo slot iter 22/100 | OK | 50 | {"201":1,"409":49} | 207ms | 234.74 |
| C5 pago duplicado concurrente iter 23/100 | OK | 50 | {"201":1,"400":49} | 587ms | 82.24 |
| C6 stock compartido iter 23/100 | OK | 60 | {"201":50,"400":10} | 744ms | 76.63 |
| C7 reservas mismo slot iter 23/100 | OK | 50 | {"201":1,"409":49} | 191ms | 250 |
| C5 pago duplicado concurrente iter 24/100 | OK | 50 | {"201":1,"400":49} | 542ms | 89.29 |
| C6 stock compartido iter 24/100 | OK | 60 | {"201":50,"400":10} | 776ms | 74.35 |
| C7 reservas mismo slot iter 24/100 | OK | 50 | {"201":1,"409":28,"429":21} | 254ms | 183.15 |
| scenarioDuplicatePayment iter 25/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 25/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 25/100 | FALLA | 50 | {"429":50} | 29ms | 1515.15 |
| scenarioDuplicatePayment iter 26/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 26/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 26/100 | FALLA | 50 | {"429":50} | 44ms | 1063.83 |
| scenarioDuplicatePayment iter 27/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 27/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 27/100 | FALLA | 50 | {"429":50} | 23ms | 1923.08 |
| scenarioDuplicatePayment iter 28/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 28/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 28/100 | FALLA | 50 | {"429":50} | 27ms | 1666.67 |
| scenarioDuplicatePayment iter 29/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 29/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 29/100 | FALLA | 50 | {"429":50} | 37ms | 1250 |
| scenarioDuplicatePayment iter 30/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 30/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 30/100 | FALLA | 50 | {"429":50} | 26ms | 1724.14 |
| scenarioDuplicatePayment iter 31/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 31/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 31/100 | FALLA | 50 | {"429":50} | 27ms | 1666.67 |
| scenarioDuplicatePayment iter 32/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 32/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 32/100 | FALLA | 50 | {"429":50} | 25ms | 1851.85 |
| scenarioDuplicatePayment iter 33/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 33/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 33/100 | FALLA | 50 | {"429":50} | 25ms | 1785.71 |
| scenarioDuplicatePayment iter 34/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 34/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 34/100 | FALLA | 50 | {"429":50} | 27ms | 1666.67 |
| scenarioDuplicatePayment iter 35/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 35/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 35/100 | FALLA | 50 | {"429":50} | 21ms | 2173.91 |
| scenarioDuplicatePayment iter 36/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 36/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 36/100 | FALLA | 50 | {"429":50} | 22ms | 2083.33 |
| scenarioDuplicatePayment iter 37/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 37/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 37/100 | FALLA | 50 | {"429":50} | 24ms | 1923.08 |
| scenarioDuplicatePayment iter 38/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 38/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 38/100 | FALLA | 50 | {"429":50} | 22ms | 2000 |
| scenarioDuplicatePayment iter 39/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 39/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 39/100 | FALLA | 50 | {"429":50} | 23ms | 1923.08 |
| scenarioDuplicatePayment iter 40/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 40/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 40/100 | FALLA | 50 | {"429":50} | 29ms | 1562.5 |
| scenarioDuplicatePayment iter 41/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 41/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 41/100 | FALLA | 50 | {"429":50} | 22ms | 2000 |
| scenarioDuplicatePayment iter 42/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 42/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 42/100 | FALLA | 50 | {"429":50} | 27ms | 1666.67 |
| scenarioDuplicatePayment iter 43/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 43/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 43/100 | FALLA | 50 | {"429":50} | 21ms | 2173.91 |
| scenarioDuplicatePayment iter 44/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 44/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 44/100 | FALLA | 50 | {"429":50} | 33ms | 1351.35 |
| scenarioDuplicatePayment iter 45/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 45/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 45/100 | FALLA | 50 | {"429":50} | 28ms | 1612.9 |
| scenarioDuplicatePayment iter 46/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 46/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 46/100 | FALLA | 50 | {"429":50} | 23ms | 2000 |
| scenarioDuplicatePayment iter 47/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 47/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 47/100 | FALLA | 50 | {"429":50} | 23ms | 2000 |
| scenarioDuplicatePayment iter 48/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 48/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 48/100 | FALLA | 50 | {"429":50} | 21ms | 2083.33 |
| scenarioDuplicatePayment iter 49/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 49/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 49/100 | FALLA | 50 | {"429":50} | 20ms | 2173.91 |
| scenarioDuplicatePayment iter 50/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 50/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 50/100 | FALLA | 50 | {"429":50} | 33ms | 1351.35 |
| scenarioDuplicatePayment iter 51/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 51/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 51/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 52/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 52/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 52/100 | FALLA | 50 | {"429":50} | 18ms | 2380.95 |
| scenarioDuplicatePayment iter 53/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 53/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 53/100 | FALLA | 50 | {"429":50} | 22ms | 2083.33 |
| scenarioDuplicatePayment iter 54/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 54/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 54/100 | FALLA | 50 | {"429":50} | 20ms | 2173.91 |
| scenarioDuplicatePayment iter 55/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 55/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 55/100 | FALLA | 50 | {"429":50} | 23ms | 2000 |
| scenarioDuplicatePayment iter 56/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 56/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 56/100 | FALLA | 50 | {"429":50} | 28ms | 1562.5 |
| scenarioDuplicatePayment iter 57/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 57/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 57/100 | FALLA | 50 | {"429":50} | 51ms | 862.07 |
| scenarioDuplicatePayment iter 58/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 58/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 58/100 | FALLA | 50 | {"429":50} | 44ms | 961.54 |
| scenarioDuplicatePayment iter 59/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 59/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 59/100 | FALLA | 50 | {"429":50} | 42ms | 1086.96 |
| scenarioDuplicatePayment iter 60/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 60/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 60/100 | FALLA | 50 | {"429":50} | 32ms | 1388.89 |
| scenarioDuplicatePayment iter 61/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 61/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 61/100 | FALLA | 50 | {"429":50} | 39ms | 1111.11 |
| scenarioDuplicatePayment iter 62/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 62/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 62/100 | FALLA | 50 | {"429":50} | 27ms | 1666.67 |
| scenarioDuplicatePayment iter 63/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 63/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 63/100 | FALLA | 50 | {"429":50} | 24ms | 1785.71 |
| scenarioDuplicatePayment iter 64/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 64/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 64/100 | FALLA | 50 | {"429":50} | 21ms | 2173.91 |
| scenarioDuplicatePayment iter 65/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 65/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 65/100 | FALLA | 50 | {"429":50} | 19ms | 2083.33 |
| scenarioDuplicatePayment iter 66/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 66/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 66/100 | FALLA | 50 | {"429":50} | 21ms | 2173.91 |
| scenarioDuplicatePayment iter 67/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 67/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 67/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 68/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 68/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 68/100 | FALLA | 50 | {"429":50} | 19ms | 2380.95 |
| scenarioDuplicatePayment iter 69/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 69/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 69/100 | FALLA | 50 | {"429":50} | 18ms | 2500 |
| scenarioDuplicatePayment iter 70/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 70/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 70/100 | FALLA | 50 | {"429":50} | 20ms | 2380.95 |
| scenarioDuplicatePayment iter 71/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 71/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 71/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 72/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 72/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 72/100 | FALLA | 50 | {"429":50} | 25ms | 1851.85 |
| scenarioDuplicatePayment iter 73/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 73/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 73/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 74/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 74/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 74/100 | FALLA | 50 | {"429":50} | 28ms | 1515.15 |
| scenarioDuplicatePayment iter 75/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 75/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 75/100 | FALLA | 50 | {"429":50} | 24ms | 2000 |
| scenarioDuplicatePayment iter 76/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 76/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 76/100 | FALLA | 50 | {"429":50} | 22ms | 1923.08 |
| scenarioDuplicatePayment iter 77/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 77/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 77/100 | FALLA | 50 | {"429":50} | 22ms | 2000 |
| scenarioDuplicatePayment iter 78/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 78/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 78/100 | FALLA | 50 | {"429":50} | 22ms | 2173.91 |
| scenarioDuplicatePayment iter 79/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 79/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 79/100 | FALLA | 50 | {"429":50} | 22ms | 2000 |
| scenarioDuplicatePayment iter 80/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 80/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 80/100 | FALLA | 50 | {"429":50} | 23ms | 2000 |
| scenarioDuplicatePayment iter 81/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 81/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 81/100 | FALLA | 50 | {"429":50} | 18ms | 2272.73 |
| scenarioDuplicatePayment iter 82/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 82/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 82/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 83/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 83/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 83/100 | FALLA | 50 | {"429":50} | 24ms | 1724.14 |
| scenarioDuplicatePayment iter 84/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 84/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 84/100 | FALLA | 50 | {"429":50} | 20ms | 2173.91 |
| scenarioDuplicatePayment iter 85/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 85/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 85/100 | FALLA | 50 | {"429":50} | 23ms | 2000 |
| scenarioDuplicatePayment iter 86/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 86/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 86/100 | FALLA | 50 | {"429":50} | 19ms | 2173.91 |
| scenarioDuplicatePayment iter 87/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 87/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 87/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 88/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 88/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 88/100 | FALLA | 50 | {"429":50} | 22ms | 2000 |
| scenarioDuplicatePayment iter 89/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 89/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 89/100 | FALLA | 50 | {"429":50} | 18ms | 2380.95 |
| scenarioDuplicatePayment iter 90/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 90/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 90/100 | FALLA | 50 | {"429":50} | 20ms | 2173.91 |
| scenarioDuplicatePayment iter 91/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 91/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 91/100 | FALLA | 50 | {"429":50} | 24ms | 1851.85 |
| scenarioDuplicatePayment iter 92/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 92/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 92/100 | FALLA | 50 | {"429":50} | 20ms | 2380.95 |
| scenarioDuplicatePayment iter 93/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 93/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 93/100 | FALLA | 50 | {"429":50} | 25ms | 1785.71 |
| scenarioDuplicatePayment iter 94/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 94/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 94/100 | FALLA | 50 | {"429":50} | 22ms | 2083.33 |
| scenarioDuplicatePayment iter 95/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 95/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 95/100 | FALLA | 50 | {"429":50} | 18ms | 2380.95 |
| scenarioDuplicatePayment iter 96/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 96/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 96/100 | FALLA | 50 | {"429":50} | 21ms | 2083.33 |
| scenarioDuplicatePayment iter 97/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 97/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 97/100 | FALLA | 50 | {"429":50} | 19ms | 2272.73 |
| scenarioDuplicatePayment iter 98/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 98/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 98/100 | FALLA | 50 | {"429":50} | 19ms | 2272.73 |
| scenarioDuplicatePayment iter 99/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 99/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 99/100 | FALLA | 50 | {"429":50} | 20ms | 2272.73 |
| scenarioDuplicatePayment iter 100/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| scenarioSharedStock iter 100/100 | FALLA | 0 | {"error":1} | n/a | 0 |
| C7 reservas mismo slot iter 100/100 | FALLA | 50 | {"429":50} | 17ms | 2500 |

## Detalle

### C5 pago duplicado concurrente iter 1/100

- Invariante: OK
- Duracion: 635ms
- Latencia: p50=440ms, p95=605ms, p99=627ms, max=627ms
- Detalle: `{"cuentaId":"9c04d9be-29f8-48eb-bc62-92afcdecb53a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":1}`

### C6 stock compartido iter 1/100

- Invariante: OK
- Duracion: 700ms
- Latencia: p50=454ms, p95=676ms, p99=681ms, max=681ms
- Detalle: `{"productId":"6499428a-0a35-404d-ba44-f623b3d5060c","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":1}`

### C7 reservas mismo slot iter 1/100

- Invariante: OK
- Duracion: 282ms
- Latencia: p50=197ms, p95=271ms, p99=278ms, max=278ms
- Detalle: `{"fecha":"2213-05-21","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/100

- Invariante: OK
- Duracion: 570ms
- Latencia: p50=361ms, p95=552ms, p99=565ms, max=565ms
- Detalle: `{"cuentaId":"c3e7cd4f-f95b-412f-8963-00b8fd745716","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":2}`

### C6 stock compartido iter 2/100

- Invariante: OK
- Duracion: 707ms
- Latencia: p50=456ms, p95=667ms, p99=679ms, max=679ms
- Detalle: `{"productId":"c394421e-5d7a-4f45-9c96-11ede9fbdadc","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":2}`

### C7 reservas mismo slot iter 2/100

- Invariante: OK
- Duracion: 244ms
- Latencia: p50=197ms, p95=235ms, p99=241ms, max=241ms
- Detalle: `{"fecha":"2213-05-22","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/100

- Invariante: OK
- Duracion: 491ms
- Latencia: p50=310ms, p95=472ms, p99=486ms, max=486ms
- Detalle: `{"cuentaId":"0af730f5-e3bc-4180-a320-42c75e7ccf59","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":3}`

### C6 stock compartido iter 3/100

- Invariante: OK
- Duracion: 684ms
- Latencia: p50=439ms, p95=646ms, p99=653ms, max=653ms
- Detalle: `{"productId":"4fa43dc8-69ff-4605-94a9-611023665377","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":3}`

### C7 reservas mismo slot iter 3/100

- Invariante: OK
- Duracion: 232ms
- Latencia: p50=148ms, p95=225ms, p99=228ms, max=228ms
- Detalle: `{"fecha":"2213-05-23","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

### C5 pago duplicado concurrente iter 4/100

- Invariante: OK
- Duracion: 552ms
- Latencia: p50=351ms, p95=523ms, p99=547ms, max=547ms
- Detalle: `{"cuentaId":"4991bcd2-bdb6-49bb-97de-4459c09fa761","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":4}`

### C6 stock compartido iter 4/100

- Invariante: OK
- Duracion: 690ms
- Latencia: p50=451ms, p95=666ms, p99=672ms, max=672ms
- Detalle: `{"productId":"d8590e1f-cdcb-407d-a17a-9638d7e5ea74","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":4}`

### C7 reservas mismo slot iter 4/100

- Invariante: OK
- Duracion: 200ms
- Latencia: p50=121ms, p95=193ms, p99=199ms, max=199ms
- Detalle: `{"fecha":"2213-05-24","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":4}`

### C5 pago duplicado concurrente iter 5/100

- Invariante: OK
- Duracion: 527ms
- Latencia: p50=337ms, p95=507ms, p99=522ms, max=522ms
- Detalle: `{"cuentaId":"251291c8-af30-4597-ae3b-1a3c3e59a351","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":5}`

### C6 stock compartido iter 5/100

- Invariante: OK
- Duracion: 689ms
- Latencia: p50=450ms, p95=644ms, p99=665ms, max=665ms
- Detalle: `{"productId":"218ae684-7d4f-4184-ab3e-9489a870af5d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":5}`

### C7 reservas mismo slot iter 5/100

- Invariante: OK
- Duracion: 247ms
- Latencia: p50=181ms, p95=238ms, p99=244ms, max=244ms
- Detalle: `{"fecha":"2213-05-25","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":5}`

### C5 pago duplicado concurrente iter 6/100

- Invariante: OK
- Duracion: 453ms
- Latencia: p50=268ms, p95=437ms, p99=450ms, max=450ms
- Detalle: `{"cuentaId":"5d1bd663-6228-4ccb-9df3-6cfb105893c7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":6}`

### C6 stock compartido iter 6/100

- Invariante: OK
- Duracion: 15014ms
- Latencia: p50=451ms, p95=669ms, p99=15013ms, max=15013ms
- Detalle: `{"productId":"08e2dfae-eb9d-4ba9-a150-fe1c77ebf674","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":9,"clientTimeouts":1,"stockActual":0,"statuses":{"0":1,"201":50,"400":9},"iteration":6}`

### C7 reservas mismo slot iter 6/100

- Invariante: OK
- Duracion: 159ms
- Latencia: p50=104ms, p95=155ms, p99=157ms, max=157ms
- Detalle: `{"fecha":"2213-05-26","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":6}`

### C5 pago duplicado concurrente iter 7/100

- Invariante: OK
- Duracion: 471ms
- Latencia: p50=291ms, p95=454ms, p99=469ms, max=469ms
- Detalle: `{"cuentaId":"2d3f8a6f-2d33-42db-8237-381c872bc493","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":7}`

### C6 stock compartido iter 7/100

- Invariante: OK
- Duracion: 667ms
- Latencia: p50=441ms, p95=621ms, p99=638ms, max=638ms
- Detalle: `{"productId":"93a9e4f3-2ed3-4351-82f0-42d7cda17ef9","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":7}`

### C7 reservas mismo slot iter 7/100

- Invariante: OK
- Duracion: 205ms
- Latencia: p50=134ms, p95=199ms, p99=201ms, max=201ms
- Detalle: `{"fecha":"2213-05-27","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":7}`

### C5 pago duplicado concurrente iter 8/100

- Invariante: OK
- Duracion: 494ms
- Latencia: p50=309ms, p95=476ms, p99=491ms, max=491ms
- Detalle: `{"cuentaId":"43966d40-5279-4145-b8db-363dae118a26","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":8}`

### C6 stock compartido iter 8/100

- Invariante: OK
- Duracion: 666ms
- Latencia: p50=440ms, p95=628ms, p99=639ms, max=639ms
- Detalle: `{"productId":"1d584705-bf87-4b4f-9909-8570589750fb","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":8}`

### C7 reservas mismo slot iter 8/100

- Invariante: OK
- Duracion: 15021ms
- Latencia: p50=126ms, p95=15017ms, p99=15018ms, max=15018ms
- Detalle: `{"fecha":"2213-05-28","hora":"18:15","successCount":1,"conflictCount":41,"clientTimeouts":8,"activeReservationsForSlot":1,"iteration":8}`

### C5 pago duplicado concurrente iter 9/100

- Invariante: OK
- Duracion: 15008ms
- Latencia: p50=393ms, p95=568ms, p99=15005ms, max=15005ms
- Detalle: `{"cuentaId":"cfdb1583-56b8-4079-868a-26810540e7e9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"0":1,"201":1,"400":48},"iteration":9}`

### C6 stock compartido iter 9/100

- Invariante: OK
- Duracion: 680ms
- Latencia: p50=454ms, p95=653ms, p99=664ms, max=664ms
- Detalle: `{"productId":"66ffced9-45f6-4830-a723-d1ace7e44b5e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":9}`

### C7 reservas mismo slot iter 9/100

- Invariante: OK
- Duracion: 230ms
- Latencia: p50=160ms, p95=218ms, p99=223ms, max=223ms
- Detalle: `{"fecha":"2213-05-29","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":9}`

### C5 pago duplicado concurrente iter 10/100

- Invariante: OK
- Duracion: 529ms
- Latencia: p50=335ms, p95=512ms, p99=525ms, max=525ms
- Detalle: `{"cuentaId":"14c87616-ffe6-46b7-86f7-165c30632234","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":10}`

### C6 stock compartido iter 10/100

- Invariante: OK
- Duracion: 680ms
- Latencia: p50=450ms, p95=657ms, p99=661ms, max=661ms
- Detalle: `{"productId":"a1e857ef-8546-44b0-ad58-5fe7380afebc","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":10}`

### C7 reservas mismo slot iter 10/100

- Invariante: OK
- Duracion: 216ms
- Latencia: p50=150ms, p95=210ms, p99=214ms, max=214ms
- Detalle: `{"fecha":"2213-05-30","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":10}`

### C5 pago duplicado concurrente iter 11/100

- Invariante: OK
- Duracion: 549ms
- Latencia: p50=307ms, p95=528ms, p99=547ms, max=547ms
- Detalle: `{"cuentaId":"d9e7cfe3-363c-44d4-a0aa-1817a85072e2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":11}`

### C6 stock compartido iter 11/100

- Invariante: OK
- Duracion: 699ms
- Latencia: p50=454ms, p95=679ms, p99=682ms, max=682ms
- Detalle: `{"productId":"efd9b06f-2085-4896-9af2-09de5fb84f14","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":11}`

### C7 reservas mismo slot iter 11/100

- Invariante: OK
- Duracion: 290ms
- Latencia: p50=205ms, p95=282ms, p99=287ms, max=287ms
- Detalle: `{"fecha":"2213-05-31","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":11}`

### C5 pago duplicado concurrente iter 12/100

- Invariante: OK
- Duracion: 448ms
- Latencia: p50=278ms, p95=431ms, p99=445ms, max=445ms
- Detalle: `{"cuentaId":"1e76047a-b5c0-4f80-8048-1e96a68c9f7b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":12}`

### C6 stock compartido iter 12/100

- Invariante: OK
- Duracion: 663ms
- Latencia: p50=435ms, p95=628ms, p99=640ms, max=640ms
- Detalle: `{"productId":"72ed4458-5a4e-4881-86b0-c31b79ea8895","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":12}`

### C7 reservas mismo slot iter 12/100

- Invariante: OK
- Duracion: 230ms
- Latencia: p50=165ms, p95=223ms, p99=226ms, max=226ms
- Detalle: `{"fecha":"2213-06-01","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":12}`

### C5 pago duplicado concurrente iter 13/100

- Invariante: OK
- Duracion: 626ms
- Latencia: p50=398ms, p95=602ms, p99=623ms, max=623ms
- Detalle: `{"cuentaId":"d0ff0151-f038-4b74-be16-8b3a95eab708","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":13}`

### C6 stock compartido iter 13/100

- Invariante: OK
- Duracion: 732ms
- Latencia: p50=487ms, p95=713ms, p99=717ms, max=717ms
- Detalle: `{"productId":"9d883f3f-af5f-4b71-b226-850e7c4283b0","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":13}`

### C7 reservas mismo slot iter 13/100

- Invariante: OK
- Duracion: 254ms
- Latencia: p50=164ms, p95=248ms, p99=251ms, max=251ms
- Detalle: `{"fecha":"2213-06-02","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":13}`

### C5 pago duplicado concurrente iter 14/100

- Invariante: OK
- Duracion: 602ms
- Latencia: p50=383ms, p95=578ms, p99=599ms, max=599ms
- Detalle: `{"cuentaId":"e12ba5a2-deec-44c3-bded-db78c2359d87","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":14}`

### C6 stock compartido iter 14/100

- Invariante: OK
- Duracion: 785ms
- Latencia: p50=517ms, p95=745ms, p99=766ms, max=766ms
- Detalle: `{"productId":"29342888-70f8-4d1c-a44b-2c5ab8f8b2f8","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":14}`

### C7 reservas mismo slot iter 14/100

- Invariante: OK
- Duracion: 263ms
- Latencia: p50=183ms, p95=255ms, p99=258ms, max=258ms
- Detalle: `{"fecha":"2213-06-03","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":14}`

### C5 pago duplicado concurrente iter 15/100

- Invariante: OK
- Duracion: 554ms
- Latencia: p50=347ms, p95=537ms, p99=552ms, max=552ms
- Detalle: `{"cuentaId":"71db7682-ec7d-4709-9f41-a13e9efb1282","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":15}`

### C6 stock compartido iter 15/100

- Invariante: OK
- Duracion: 750ms
- Latencia: p50=482ms, p95=712ms, p99=726ms, max=726ms
- Detalle: `{"productId":"fb3b4bed-f0da-4a16-a4f2-472ff201c336","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":15}`

### C7 reservas mismo slot iter 15/100

- Invariante: OK
- Duracion: 238ms
- Latencia: p50=151ms, p95=231ms, p99=235ms, max=235ms
- Detalle: `{"fecha":"2213-06-04","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":15}`

### C5 pago duplicado concurrente iter 16/100

- Invariante: OK
- Duracion: 569ms
- Latencia: p50=349ms, p95=551ms, p99=566ms, max=566ms
- Detalle: `{"cuentaId":"6735f8f9-c3a7-43ae-b29e-d99f52a1d316","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":16}`

### C6 stock compartido iter 16/100

- Invariante: OK
- Duracion: 797ms
- Latencia: p50=519ms, p95=769ms, p99=775ms, max=775ms
- Detalle: `{"productId":"3401690a-ade2-491a-9d0d-c5ea81413e2a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":16}`

### C7 reservas mismo slot iter 16/100

- Invariante: OK
- Duracion: 15013ms
- Latencia: p50=152ms, p95=234ms, p99=15010ms, max=15010ms
- Detalle: `{"fecha":"2213-06-05","hora":"18:15","successCount":1,"conflictCount":47,"clientTimeouts":2,"activeReservationsForSlot":1,"iteration":16}`

### C5 pago duplicado concurrente iter 17/100

- Invariante: OK
- Duracion: 653ms
- Latencia: p50=433ms, p95=635ms, p99=652ms, max=652ms
- Detalle: `{"cuentaId":"62f0c2a8-b64d-4610-87be-d2271edcd0c1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":17}`

### C6 stock compartido iter 17/100

- Invariante: OK
- Duracion: 761ms
- Latencia: p50=495ms, p95=733ms, p99=742ms, max=742ms
- Detalle: `{"productId":"16e18426-b6ab-4917-97c4-258ddd971270","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":17}`

### C7 reservas mismo slot iter 17/100

- Invariante: OK
- Duracion: 222ms
- Latencia: p50=141ms, p95=216ms, p99=220ms, max=220ms
- Detalle: `{"fecha":"2213-06-06","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":17}`

### C5 pago duplicado concurrente iter 18/100

- Invariante: OK
- Duracion: 608ms
- Latencia: p50=415ms, p95=588ms, p99=605ms, max=605ms
- Detalle: `{"cuentaId":"3e718b60-f341-4ac9-a04a-66b328467eec","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":18}`

### C6 stock compartido iter 18/100

- Invariante: OK
- Duracion: 760ms
- Latencia: p50=512ms, p95=730ms, p99=739ms, max=739ms
- Detalle: `{"productId":"12a82c2a-8071-44bd-925b-87c65c00f279","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":18}`

### C7 reservas mismo slot iter 18/100

- Invariante: OK
- Duracion: 293ms
- Latencia: p50=213ms, p95=286ms, p99=289ms, max=289ms
- Detalle: `{"fecha":"2213-06-07","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":18}`

### C5 pago duplicado concurrente iter 19/100

- Invariante: OK
- Duracion: 554ms
- Latencia: p50=355ms, p95=537ms, p99=552ms, max=552ms
- Detalle: `{"cuentaId":"7deaa283-e49c-4f32-901a-adbf7eec87a1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":19}`

### C6 stock compartido iter 19/100

- Invariante: OK
- Duracion: 765ms
- Latencia: p50=506ms, p95=723ms, p99=737ms, max=737ms
- Detalle: `{"productId":"5a1fbb85-af83-4f33-8deb-1be0f72f67c3","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":19}`

### C7 reservas mismo slot iter 19/100

- Invariante: OK
- Duracion: 261ms
- Latencia: p50=189ms, p95=251ms, p99=257ms, max=257ms
- Detalle: `{"fecha":"2213-06-08","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":19}`

### C5 pago duplicado concurrente iter 20/100

- Invariante: OK
- Duracion: 501ms
- Latencia: p50=310ms, p95=484ms, p99=498ms, max=498ms
- Detalle: `{"cuentaId":"4df6ffff-c625-41be-a00d-bbba935f7373","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":20}`

### C6 stock compartido iter 20/100

- Invariante: OK
- Duracion: 732ms
- Latencia: p50=478ms, p95=711ms, p99=713ms, max=713ms
- Detalle: `{"productId":"68ca8d0b-df64-4c7b-add9-6ba28111fdfe","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":20}`

### C7 reservas mismo slot iter 20/100

- Invariante: OK
- Duracion: 237ms
- Latencia: p50=163ms, p95=227ms, p99=234ms, max=234ms
- Detalle: `{"fecha":"2213-06-09","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":20}`

### C5 pago duplicado concurrente iter 21/100

- Invariante: OK
- Duracion: 696ms
- Latencia: p50=434ms, p95=675ms, p99=692ms, max=692ms
- Detalle: `{"cuentaId":"a415f7a7-990d-4fb3-aba5-e9a5cb3531b2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":21}`

### C6 stock compartido iter 21/100

- Invariante: OK
- Duracion: 705ms
- Latencia: p50=457ms, p95=675ms, p99=679ms, max=679ms
- Detalle: `{"productId":"f2203bf7-ab17-4412-8ebe-b90d9715c2d3","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":21}`

### C7 reservas mismo slot iter 21/100

- Invariante: OK
- Duracion: 282ms
- Latencia: p50=174ms, p95=274ms, p99=277ms, max=277ms
- Detalle: `{"fecha":"2213-06-10","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":21}`

### C5 pago duplicado concurrente iter 22/100

- Invariante: OK
- Duracion: 555ms
- Latencia: p50=340ms, p95=535ms, p99=552ms, max=552ms
- Detalle: `{"cuentaId":"5d1416eb-519b-4293-9715-b99016888ffe","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":22}`

### C6 stock compartido iter 22/100

- Invariante: OK
- Duracion: 724ms
- Latencia: p50=478ms, p95=696ms, p99=699ms, max=699ms
- Detalle: `{"productId":"ff456273-6ff4-4e48-8f88-24a18fd07b39","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":22}`

### C7 reservas mismo slot iter 22/100

- Invariante: OK
- Duracion: 213ms
- Latencia: p50=126ms, p95=207ms, p99=209ms, max=209ms
- Detalle: `{"fecha":"2213-06-11","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":22}`

### C5 pago duplicado concurrente iter 23/100

- Invariante: OK
- Duracion: 608ms
- Latencia: p50=347ms, p95=587ms, p99=605ms, max=605ms
- Detalle: `{"cuentaId":"ad20a147-cdf2-4d96-b119-4b48a36eae90","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":23}`

### C6 stock compartido iter 23/100

- Invariante: OK
- Duracion: 783ms
- Latencia: p50=507ms, p95=744ms, p99=748ms, max=748ms
- Detalle: `{"productId":"87bcc336-9392-47e9-93a3-bda9b972573e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":23}`

### C7 reservas mismo slot iter 23/100

- Invariante: OK
- Duracion: 200ms
- Latencia: p50=123ms, p95=191ms, p99=197ms, max=197ms
- Detalle: `{"fecha":"2213-06-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":23}`

### C5 pago duplicado concurrente iter 24/100

- Invariante: OK
- Duracion: 560ms
- Latencia: p50=354ms, p95=542ms, p99=558ms, max=558ms
- Detalle: `{"cuentaId":"a31c34ae-7a87-421f-9862-662aa2af9064","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":24}`

### C6 stock compartido iter 24/100

- Invariante: OK
- Duracion: 807ms
- Latencia: p50=511ms, p95=776ms, p99=780ms, max=780ms
- Detalle: `{"productId":"a63d338a-07fc-4c6b-aba5-82d3ea4e074d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":24}`

### C7 reservas mismo slot iter 24/100

- Invariante: OK
- Duracion: 273ms
- Latencia: p50=130ms, p95=254ms, p99=269ms, max=269ms
- Detalle: `{"fecha":"2213-06-13","hora":"18:15","successCount":1,"conflictCount":28,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":24}`

### scenarioDuplicatePayment iter 25/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7c2d554778f83623231a390826235362\"}","iteration":25}`

### scenarioSharedStock iter 25/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"ba4bf3671da5811b48a6546a83637f48\"}","iteration":25}`

### C7 reservas mismo slot iter 25/100

- Invariante: FALLA
- Duracion: 33ms
- Latencia: p50=25ms, p95=29ms, p99=30ms, max=30ms
- Detalle: `{"fecha":"2213-06-14","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":25}`

### scenarioDuplicatePayment iter 26/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"560b0e289fb351003b0d664ed3c7731b\"}","iteration":26}`

### scenarioSharedStock iter 26/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"83e0357a96d701718316054a15485c77\"}","iteration":26}`

### C7 reservas mismo slot iter 26/100

- Invariante: FALLA
- Duracion: 47ms
- Latencia: p50=28ms, p95=44ms, p99=44ms, max=44ms
- Detalle: `{"fecha":"2213-06-15","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":26}`

### scenarioDuplicatePayment iter 27/100

- Invariante: FALLA
- Duracion: 5ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"013f3f03b5983a173150a869a3a5190f\"}","iteration":27}`

### scenarioSharedStock iter 27/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"eeabff41eca7c92287bc53650e089436\"}","iteration":27}`

### C7 reservas mismo slot iter 27/100

- Invariante: FALLA
- Duracion: 26ms
- Latencia: p50=19ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-06-16","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":27}`

### scenarioDuplicatePayment iter 28/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"6f437635135fa65a935709364ba19728\"}","iteration":28}`

### scenarioSharedStock iter 28/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7a6e2b14f90727247e5db84b396bf727\"}","iteration":28}`

### C7 reservas mismo slot iter 28/100

- Invariante: FALLA
- Duracion: 30ms
- Latencia: p50=22ms, p95=27ms, p99=27ms, max=27ms
- Detalle: `{"fecha":"2213-06-17","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":28}`

### scenarioDuplicatePayment iter 29/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"91fa8c0c02548f0ca563e944f6c3ca57\"}","iteration":29}`

### scenarioSharedStock iter 29/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"173a914d650b3727eb5e1058ff4ef93c\"}","iteration":29}`

### C7 reservas mismo slot iter 29/100

- Invariante: FALLA
- Duracion: 40ms
- Latencia: p50=24ms, p95=37ms, p99=38ms, max=38ms
- Detalle: `{"fecha":"2213-06-18","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":29}`

### scenarioDuplicatePayment iter 30/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"458e84036a182b22e748c31af9cbcb62\"}","iteration":30}`

### scenarioSharedStock iter 30/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e58c8e29dbbd3c537aba6049b3c9254c\"}","iteration":30}`

### C7 reservas mismo slot iter 30/100

- Invariante: FALLA
- Duracion: 29ms
- Latencia: p50=20ms, p95=26ms, p99=27ms, max=27ms
- Detalle: `{"fecha":"2213-06-19","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":30}`

### scenarioDuplicatePayment iter 31/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"6c94890a9edde144c74f2148f3380e41\"}","iteration":31}`

### scenarioSharedStock iter 31/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7ae5234996e6f800aee9107f6745b520\"}","iteration":31}`

### C7 reservas mismo slot iter 31/100

- Invariante: FALLA
- Duracion: 30ms
- Latencia: p50=19ms, p95=27ms, p99=28ms, max=28ms
- Detalle: `{"fecha":"2213-06-20","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":31}`

### scenarioDuplicatePayment iter 32/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a315393696e25a440d6a517099b8ed41\"}","iteration":32}`

### scenarioSharedStock iter 32/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d2ec7223538fd7315b2b2a3ce58ee204\"}","iteration":32}`

### C7 reservas mismo slot iter 32/100

- Invariante: FALLA
- Duracion: 27ms
- Latencia: p50=17ms, p95=25ms, p99=25ms, max=25ms
- Detalle: `{"fecha":"2213-06-21","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":32}`

### scenarioDuplicatePayment iter 33/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a4b93927630b8b170a7a096896595c35\"}","iteration":33}`

### scenarioSharedStock iter 33/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a62f9906beead8285fe97f1b6fd43015\"}","iteration":33}`

### C7 reservas mismo slot iter 33/100

- Invariante: FALLA
- Duracion: 28ms
- Latencia: p50=19ms, p95=25ms, p99=26ms, max=26ms
- Detalle: `{"fecha":"2213-06-22","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":33}`

### scenarioDuplicatePayment iter 34/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"93f8d1137c29550bc3254155aa912711\"}","iteration":34}`

### scenarioSharedStock iter 34/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"6c9dd9461e1c93216d3d453306dff701\"}","iteration":34}`

### C7 reservas mismo slot iter 34/100

- Invariante: FALLA
- Duracion: 30ms
- Latencia: p50=23ms, p95=27ms, p99=28ms, max=28ms
- Detalle: `{"fecha":"2213-06-23","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":34}`

### scenarioDuplicatePayment iter 35/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a5fba53dfe1934092f85c968c9f34159\"}","iteration":35}`

### scenarioSharedStock iter 35/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9b58eb60ec1068136a023e481fa2cb1b\"}","iteration":35}`

### C7 reservas mismo slot iter 35/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=17ms, p95=21ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-06-24","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":35}`

### scenarioDuplicatePayment iter 36/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"56016c08fb61d9693bfe863f103e6028\"}","iteration":36}`

### scenarioSharedStock iter 36/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"b777173df9756f210f78ae459cb7f16d\"}","iteration":36}`

### C7 reservas mismo slot iter 36/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=17ms, p95=22ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-06-25","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":36}`

### scenarioDuplicatePayment iter 37/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"daab6230b60601409d6353250adeaf32\"}","iteration":37}`

### scenarioSharedStock iter 37/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e6527a55ebdcc13456bd274bbabec552\"}","iteration":37}`

### C7 reservas mismo slot iter 37/100

- Invariante: FALLA
- Duracion: 26ms
- Latencia: p50=16ms, p95=24ms, p99=24ms, max=24ms
- Detalle: `{"fecha":"2213-06-26","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":37}`

### scenarioDuplicatePayment iter 38/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"720f750e885450033e4cb443a8112d54\"}","iteration":38}`

### scenarioSharedStock iter 38/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e634903e01dbf865b2b19101ebda711d\"}","iteration":38}`

### C7 reservas mismo slot iter 38/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=17ms, p95=22ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-06-27","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":38}`

### scenarioDuplicatePayment iter 39/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"aeff1e4e647c251bceb4ad34d8e76022\"}","iteration":39}`

### scenarioSharedStock iter 39/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7ecc406630c3b775497b7a78f3362c15\"}","iteration":39}`

### C7 reservas mismo slot iter 39/100

- Invariante: FALLA
- Duracion: 26ms
- Latencia: p50=16ms, p95=23ms, p99=24ms, max=24ms
- Detalle: `{"fecha":"2213-06-28","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":39}`

### scenarioDuplicatePayment iter 40/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5db03a133b9cd23e2d40db0399f5da28\"}","iteration":40}`

### scenarioSharedStock iter 40/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"ee32e532d7f12150ba2f587c3b52a934\"}","iteration":40}`

### C7 reservas mismo slot iter 40/100

- Invariante: FALLA
- Duracion: 32ms
- Latencia: p50=23ms, p95=29ms, p99=30ms, max=30ms
- Detalle: `{"fecha":"2213-06-29","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":40}`

### scenarioDuplicatePayment iter 41/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"71b2fd3655d731208d59a73391894835\"}","iteration":41}`

### scenarioSharedStock iter 41/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"2d5e28212466f46302dc0d3702f4c158\"}","iteration":41}`

### C7 reservas mismo slot iter 41/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=17ms, p95=22ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-06-30","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":41}`

### scenarioDuplicatePayment iter 42/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d32c825b1cb5e82ddee6750676867f76\"}","iteration":42}`

### scenarioSharedStock iter 42/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"172d5259bd03801633988c6d581cc874\"}","iteration":42}`

### C7 reservas mismo slot iter 42/100

- Invariante: FALLA
- Duracion: 30ms
- Latencia: p50=21ms, p95=27ms, p99=28ms, max=28ms
- Detalle: `{"fecha":"2213-07-01","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":42}`

### scenarioDuplicatePayment iter 43/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e85d906a222b914924237b730aa26345\"}","iteration":43}`

### scenarioSharedStock iter 43/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f1af2647b3b9aa1e3fa3091b84b52a7b\"}","iteration":43}`

### C7 reservas mismo slot iter 43/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=15ms, p95=21ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-07-02","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":43}`

### scenarioDuplicatePayment iter 44/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"8dca0b7a39144657463281035cb1a264\"}","iteration":44}`

### scenarioSharedStock iter 44/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a767650b7d1775552569724c58186850\"}","iteration":44}`

### C7 reservas mismo slot iter 44/100

- Invariante: FALLA
- Duracion: 37ms
- Latencia: p50=17ms, p95=33ms, p99=35ms, max=35ms
- Detalle: `{"fecha":"2213-07-03","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":44}`

### scenarioDuplicatePayment iter 45/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"123ef8644742995dc1898d529711777b\"}","iteration":45}`

### scenarioSharedStock iter 45/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"299c1848229049314755b53b5493cf7d\"}","iteration":45}`

### C7 reservas mismo slot iter 45/100

- Invariante: FALLA
- Duracion: 31ms
- Latencia: p50=20ms, p95=28ms, p99=28ms, max=28ms
- Detalle: `{"fecha":"2213-07-04","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":45}`

### scenarioDuplicatePayment iter 46/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"2f5d3c061b70af486cfbca46181ff03d\"}","iteration":46}`

### scenarioSharedStock iter 46/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"6045947dc11eb31c6e97d72d5fa1aa14\"}","iteration":46}`

### C7 reservas mismo slot iter 46/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=17ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-07-05","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":46}`

### scenarioDuplicatePayment iter 47/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5fec1f4999f00c6850ea12098a99de42\"}","iteration":47}`

### scenarioSharedStock iter 47/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f21b1f11af2b856691d6871221d7067b\"}","iteration":47}`

### C7 reservas mismo slot iter 47/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=15ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-07-06","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":47}`

### scenarioDuplicatePayment iter 48/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"8a554e5b86f9f55e8123a715ca790232\"}","iteration":48}`

### scenarioSharedStock iter 48/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"3a5c866a1bcbe272e90d590c1b95e736\"}","iteration":48}`

### C7 reservas mismo slot iter 48/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=16ms, p95=21ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-07-07","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":48}`

### scenarioDuplicatePayment iter 49/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"cb5c9756aac794027d661453e53aaf1a\"}","iteration":49}`

### scenarioSharedStock iter 49/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f0d9e1659eee6c4c6823392e0497fa15\"}","iteration":49}`

### C7 reservas mismo slot iter 49/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=16ms, p95=20ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-07-08","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":49}`

### scenarioDuplicatePayment iter 50/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"11bd2a0ba0ad2d700375c42a9acb9e5d\"}","iteration":50}`

### scenarioSharedStock iter 50/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f0aa9137625ba2274803c25ced288372\"}","iteration":50}`

### C7 reservas mismo slot iter 50/100

- Invariante: FALLA
- Duracion: 37ms
- Latencia: p50=22ms, p95=33ms, p99=35ms, max=35ms
- Detalle: `{"fecha":"2213-07-09","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":50}`

### scenarioDuplicatePayment iter 51/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0be3c671a263255f9fd12a7976fd366c\"}","iteration":51}`

### scenarioSharedStock iter 51/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0f12ed400312a93f51dca31f40c39752\"}","iteration":51}`

### C7 reservas mismo slot iter 51/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-07-10","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":51}`

### scenarioDuplicatePayment iter 52/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"1abca00fe113553f9ab38c7fb9e0c70f\"}","iteration":52}`

### scenarioSharedStock iter 52/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"071da471ce07785f51d2e027a2abd836\"}","iteration":52}`

### C7 reservas mismo slot iter 52/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=13ms, p95=18ms, p99=19ms, max=19ms
- Detalle: `{"fecha":"2213-07-11","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":52}`

### scenarioDuplicatePayment iter 53/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"49987b71b4944f79ee6d7762ccb51745\"}","iteration":53}`

### scenarioSharedStock iter 53/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"fd7c7129b1c7e404098a493d2b04a676\"}","iteration":53}`

### C7 reservas mismo slot iter 53/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=14ms, p95=22ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-07-12","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":53}`

### scenarioDuplicatePayment iter 54/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"fd57d603334bfe22e9b5e158457e6a5e\"}","iteration":54}`

### scenarioSharedStock iter 54/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0164f559d84e4f4ec28e6b23354beb6e\"}","iteration":54}`

### C7 reservas mismo slot iter 54/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=16ms, p95=20ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-07-13","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":54}`

### scenarioDuplicatePayment iter 55/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"b17aeb58d3dca57ed16f9b44b7eb932b\"}","iteration":55}`

### scenarioSharedStock iter 55/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"665a7a526b6c9b227a614b18b5936e31\"}","iteration":55}`

### C7 reservas mismo slot iter 55/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=14ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-07-14","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":55}`

### scenarioDuplicatePayment iter 56/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"69d7e5253462db40b126897f0a2e260e\"}","iteration":56}`

### scenarioSharedStock iter 56/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"ec73e831fc7467062a601347040c3c2b\"}","iteration":56}`

### C7 reservas mismo slot iter 56/100

- Invariante: FALLA
- Duracion: 32ms
- Latencia: p50=16ms, p95=28ms, p99=30ms, max=30ms
- Detalle: `{"fecha":"2213-07-15","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":56}`

### scenarioDuplicatePayment iter 57/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e5e09255629dd73478d5d248239cce28\"}","iteration":57}`

### scenarioSharedStock iter 57/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"46f58258a4b490723d4a7e651b08356e\"}","iteration":57}`

### C7 reservas mismo slot iter 57/100

- Invariante: FALLA
- Duracion: 58ms
- Latencia: p50=18ms, p95=51ms, p99=55ms, max=55ms
- Detalle: `{"fecha":"2213-07-16","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":57}`

### scenarioDuplicatePayment iter 58/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9793be1b407bab2e8bb13b745c9dae25\"}","iteration":58}`

### scenarioSharedStock iter 58/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"25a35c512248373dd84fc367e689de6a\"}","iteration":58}`

### C7 reservas mismo slot iter 58/100

- Invariante: FALLA
- Duracion: 52ms
- Latencia: p50=20ms, p95=44ms, p99=48ms, max=48ms
- Detalle: `{"fecha":"2213-07-17","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":58}`

### scenarioDuplicatePayment iter 59/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"874492757ddc7e28be433a10d4508621\"}","iteration":59}`

### scenarioSharedStock iter 59/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"b1dbe21db3e1a952b11b230d8f80061f\"}","iteration":59}`

### C7 reservas mismo slot iter 59/100

- Invariante: FALLA
- Duracion: 46ms
- Latencia: p50=16ms, p95=42ms, p99=43ms, max=43ms
- Detalle: `{"fecha":"2213-07-18","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":59}`

### scenarioDuplicatePayment iter 60/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"4adb5d76fdb99b628ed0e3540053b860\"}","iteration":60}`

### scenarioSharedStock iter 60/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f734f80ba8585b04e0aa2f6cb3d38e36\"}","iteration":60}`

### C7 reservas mismo slot iter 60/100

- Invariante: FALLA
- Duracion: 36ms
- Latencia: p50=14ms, p95=32ms, p99=34ms, max=34ms
- Detalle: `{"fecha":"2213-07-19","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":60}`

### scenarioDuplicatePayment iter 61/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e4352926262de96904943e0579052c16\"}","iteration":61}`

### scenarioSharedStock iter 61/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"30eee42c7e388b6f09e30573ba610923\"}","iteration":61}`

### C7 reservas mismo slot iter 61/100

- Invariante: FALLA
- Duracion: 45ms
- Latencia: p50=17ms, p95=39ms, p99=43ms, max=43ms
- Detalle: `{"fecha":"2213-07-20","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":61}`

### scenarioDuplicatePayment iter 62/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"96de7d7c1ee7bf62de4e3f1fe2807012\"}","iteration":62}`

### scenarioSharedStock iter 62/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9329cc1358d9f441037c3f7b7790a906\"}","iteration":62}`

### C7 reservas mismo slot iter 62/100

- Invariante: FALLA
- Duracion: 30ms
- Latencia: p50=15ms, p95=27ms, p99=28ms, max=28ms
- Detalle: `{"fecha":"2213-07-21","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":62}`

### scenarioDuplicatePayment iter 63/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"74ba3e6fb6236f44f20ef26524e69716\"}","iteration":63}`

### scenarioSharedStock iter 63/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"55474a21f1053643aa017773f782624e\"}","iteration":63}`

### C7 reservas mismo slot iter 63/100

- Invariante: FALLA
- Duracion: 28ms
- Latencia: p50=16ms, p95=24ms, p99=26ms, max=26ms
- Detalle: `{"fecha":"2213-07-22","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":63}`

### scenarioDuplicatePayment iter 64/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5ce3b8077af02570a43d782730979549\"}","iteration":64}`

### scenarioSharedStock iter 64/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e593817a8f82062e4580ce2d4acc2f1f\"}","iteration":64}`

### C7 reservas mismo slot iter 64/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=16ms, p95=21ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-07-23","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":64}`

### scenarioDuplicatePayment iter 65/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"dd550556f2c52e2c8e5f817ab9374519\"}","iteration":65}`

### scenarioSharedStock iter 65/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f9d154461523b9659900a3242a2b9b66\"}","iteration":65}`

### C7 reservas mismo slot iter 65/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=15ms, p95=19ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-07-24","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":65}`

### scenarioDuplicatePayment iter 66/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"4f21e915c53449776894516494db4e02\"}","iteration":66}`

### scenarioSharedStock iter 66/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"1f72b8756a350c2510ec241b630cfb01\"}","iteration":66}`

### C7 reservas mismo slot iter 66/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=16ms, p95=21ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-07-25","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":66}`

### scenarioDuplicatePayment iter 67/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f9b3d116f4d38f50050a8620891f1b5d\"}","iteration":67}`

### scenarioSharedStock iter 67/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"cc8e3e47decb905f9f2b033ff569260d\"}","iteration":67}`

### C7 reservas mismo slot iter 67/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-07-26","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":67}`

### scenarioDuplicatePayment iter 68/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"046e2c6d20592d0c14a72b18f5252713\"}","iteration":68}`

### scenarioSharedStock iter 68/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"bc5db56a4c075f7bc2958804b358ef42\"}","iteration":68}`

### C7 reservas mismo slot iter 68/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=14ms, p95=19ms, p99=19ms, max=19ms
- Detalle: `{"fecha":"2213-07-27","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":68}`

### scenarioDuplicatePayment iter 69/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f58c092263486468c6c22c69275fb05d\"}","iteration":69}`

### scenarioSharedStock iter 69/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d4a00049f052f87756a65a768d24006f\"}","iteration":69}`

### C7 reservas mismo slot iter 69/100

- Invariante: FALLA
- Duracion: 20ms
- Latencia: p50=14ms, p95=18ms, p99=19ms, max=19ms
- Detalle: `{"fecha":"2213-07-28","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":69}`

### scenarioDuplicatePayment iter 70/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"2e37bc1d7bbb1421bf84e8329083fa72\"}","iteration":70}`

### scenarioSharedStock iter 70/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"c759ae42eca09f1f64abc30e83407349\"}","iteration":70}`

### C7 reservas mismo slot iter 70/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=15ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-07-29","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":70}`

### scenarioDuplicatePayment iter 71/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e2c10e162737f71f016083569ca4901f\"}","iteration":71}`

### scenarioSharedStock iter 71/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"40ee884b3018844b9860b50262578b60\"}","iteration":71}`

### C7 reservas mismo slot iter 71/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=17ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-07-30","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":71}`

### scenarioDuplicatePayment iter 72/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"057edd12ab0c2f7b721d563c13d23122\"}","iteration":72}`

### scenarioSharedStock iter 72/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f443a30460097a1f4510e00d8c422800\"}","iteration":72}`

### C7 reservas mismo slot iter 72/100

- Invariante: FALLA
- Duracion: 27ms
- Latencia: p50=20ms, p95=25ms, p99=25ms, max=25ms
- Detalle: `{"fecha":"2213-07-31","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":72}`

### scenarioDuplicatePayment iter 73/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d0d2fe0b86fa2e69c9648b75f1bff062\"}","iteration":73}`

### scenarioSharedStock iter 73/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"c792994b8447886b5608912d12ab7659\"}","iteration":73}`

### C7 reservas mismo slot iter 73/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-01","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":73}`

### scenarioDuplicatePayment iter 74/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"8330ca5613f67835cef95b361c078e67\"}","iteration":74}`

### scenarioSharedStock iter 74/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9783d25d92797a5006d7b000d7691a55\"}","iteration":74}`

### C7 reservas mismo slot iter 74/100

- Invariante: FALLA
- Duracion: 33ms
- Latencia: p50=17ms, p95=28ms, p99=30ms, max=30ms
- Detalle: `{"fecha":"2213-08-02","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":74}`

### scenarioDuplicatePayment iter 75/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"ac442b35f9161b176545985052ffeb7d\"}","iteration":75}`

### scenarioSharedStock iter 75/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7fa60209efe6136918156b7c3e1fe36d\"}","iteration":75}`

### C7 reservas mismo slot iter 75/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=15ms, p95=24ms, p99=24ms, max=24ms
- Detalle: `{"fecha":"2213-08-03","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":75}`

### scenarioDuplicatePayment iter 76/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"1a96126885a5317d52b55222440dd859\"}","iteration":76}`

### scenarioSharedStock iter 76/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5a0dd12cc824c73262a32918f4129044\"}","iteration":76}`

### C7 reservas mismo slot iter 76/100

- Invariante: FALLA
- Duracion: 26ms
- Latencia: p50=17ms, p95=22ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-04","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":76}`

### scenarioDuplicatePayment iter 77/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"bbedd2225af18c04a46f7c7c3a081c31\"}","iteration":77}`

### scenarioSharedStock iter 77/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"a6ac931920acb2180f9b6923fa383b66\"}","iteration":77}`

### C7 reservas mismo slot iter 77/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=16ms, p95=22ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-05","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":77}`

### scenarioDuplicatePayment iter 78/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"8b31171201816004c049f44d88a90d06\"}","iteration":78}`

### scenarioSharedStock iter 78/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"eae4575ed6f61626894e3d5e4a316d45\"}","iteration":78}`

### C7 reservas mismo slot iter 78/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=15ms, p95=22ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-08-06","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":78}`

### scenarioDuplicatePayment iter 79/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"3270a810818130296d6fe54d22a18833\"}","iteration":79}`

### scenarioSharedStock iter 79/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"92f038425ec7695d9d9e4c7fef39105c\"}","iteration":79}`

### C7 reservas mismo slot iter 79/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=16ms, p95=22ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-07","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":79}`

### scenarioDuplicatePayment iter 80/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"adc7c441ba98ae4a4420b77b3f687f64\"}","iteration":80}`

### scenarioSharedStock iter 80/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e7211f57c7965310ffacdf34ffff997a\"}","iteration":80}`

### C7 reservas mismo slot iter 80/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=18ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-08","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":80}`

### scenarioDuplicatePayment iter 81/100

- Invariante: FALLA
- Duracion: 4ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"2a60532c047b522b33dcd83ad3a93806\"}","iteration":81}`

### scenarioSharedStock iter 81/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0985116b0105e96f2c1a294a72e47d01\"}","iteration":81}`

### C7 reservas mismo slot iter 81/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=13ms, p95=18ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-08-09","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":81}`

### scenarioDuplicatePayment iter 82/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d13e9e3eb9dcd51f9e0ece0b0b94e154\"}","iteration":82}`

### scenarioSharedStock iter 82/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"238ece2b39cbbf0894d4f161d944ae77\"}","iteration":82}`

### C7 reservas mismo slot iter 82/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=15ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-10","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":82}`

### scenarioDuplicatePayment iter 83/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"b70f3307c2e7457df20b4843c418c957\"}","iteration":83}`

### scenarioSharedStock iter 83/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"dc2d1d327a035533c0a2fa6f1dfa176a\"}","iteration":83}`

### C7 reservas mismo slot iter 83/100

- Invariante: FALLA
- Duracion: 29ms
- Latencia: p50=19ms, p95=24ms, p99=27ms, max=27ms
- Detalle: `{"fecha":"2213-08-11","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":83}`

### scenarioDuplicatePayment iter 84/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"1d4c0431904bf52f6d809b229f78de6a\"}","iteration":84}`

### scenarioSharedStock iter 84/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"18b94674d6bb2d50c988f35bd9e45813\"}","iteration":84}`

### C7 reservas mismo slot iter 84/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-12","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":84}`

### scenarioDuplicatePayment iter 85/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"81ecea4a1a284a03141a414a39ec6015\"}","iteration":85}`

### scenarioSharedStock iter 85/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f829fe61a4180c5065d50e274a75120c\"}","iteration":85}`

### C7 reservas mismo slot iter 85/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=15ms, p95=23ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-13","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":85}`

### scenarioDuplicatePayment iter 86/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"d4d4065a29c9a36368b56b64290e2c53\"}","iteration":86}`

### scenarioSharedStock iter 86/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5eaf9d31036e7c367c6f9558c4d66449\"}","iteration":86}`

### C7 reservas mismo slot iter 86/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=17ms, p95=19ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-14","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":86}`

### scenarioDuplicatePayment iter 87/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"4d3e043c8ab4cd4e4d793b467b4f765c\"}","iteration":87}`

### scenarioSharedStock iter 87/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"df14406e718d976abf69fb63dba88868\"}","iteration":87}`

### C7 reservas mismo slot iter 87/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=15ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-15","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":87}`

### scenarioDuplicatePayment iter 88/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"b3b6da59b5e5df1865218624d17fe77d\"}","iteration":88}`

### scenarioSharedStock iter 88/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0ddfcb446ddbbf68f6ab2853aa390a1d\"}","iteration":88}`

### C7 reservas mismo slot iter 88/100

- Invariante: FALLA
- Duracion: 25ms
- Latencia: p50=19ms, p95=22ms, p99=23ms, max=23ms
- Detalle: `{"fecha":"2213-08-16","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":88}`

### scenarioDuplicatePayment iter 89/100

- Invariante: FALLA
- Duracion: 5ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"059fb7157b7636725beddf5bb2ae7801\"}","iteration":89}`

### scenarioSharedStock iter 89/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"2be6f52d7a1a2c2e02467f101310b902\"}","iteration":89}`

### C7 reservas mismo slot iter 89/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=14ms, p95=18ms, p99=19ms, max=19ms
- Detalle: `{"fecha":"2213-08-17","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":89}`

### scenarioDuplicatePayment iter 90/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"5321573b5043be2418ddd8646524c70b\"}","iteration":90}`

### scenarioSharedStock iter 90/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"969cf82ecaa9b26c42df6f01ad382b51\"}","iteration":90}`

### C7 reservas mismo slot iter 90/100

- Invariante: FALLA
- Duracion: 23ms
- Latencia: p50=13ms, p95=20ms, p99=21ms, max=21ms
- Detalle: `{"fecha":"2213-08-18","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":90}`

### scenarioDuplicatePayment iter 91/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"3b83972317fab7579568be6608ae3c1b\"}","iteration":91}`

### scenarioSharedStock iter 91/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9f38e814798a0c7f21806b0e60802e3f\"}","iteration":91}`

### C7 reservas mismo slot iter 91/100

- Invariante: FALLA
- Duracion: 27ms
- Latencia: p50=15ms, p95=24ms, p99=25ms, max=25ms
- Detalle: `{"fecha":"2213-08-19","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":91}`

### scenarioDuplicatePayment iter 92/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"4274105f8fcb9717dde4c46d3758c57f\"}","iteration":92}`

### scenarioSharedStock iter 92/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"36f6fe79e2713c5962b6a210ebfe090a\"}","iteration":92}`

### C7 reservas mismo slot iter 92/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-20","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":92}`

### scenarioDuplicatePayment iter 93/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"7fcb76049cda3e606a5b953936a31d0f\"}","iteration":93}`

### scenarioSharedStock iter 93/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"cc2e957758ab85008ea4813a42ddcc01\"}","iteration":93}`

### C7 reservas mismo slot iter 93/100

- Invariante: FALLA
- Duracion: 28ms
- Latencia: p50=17ms, p95=25ms, p99=26ms, max=26ms
- Detalle: `{"fecha":"2213-08-21","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":93}`

### scenarioDuplicatePayment iter 94/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"22f83c66cb16c26eb6194007c343474c\"}","iteration":94}`

### scenarioSharedStock iter 94/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"51ef0e4e98bb5f5c3f5301610103313e\"}","iteration":94}`

### C7 reservas mismo slot iter 94/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=16ms, p95=22ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-08-22","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":94}`

### scenarioDuplicatePayment iter 95/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"66cfbc24f059517bf759dd6e4ce97a52\"}","iteration":95}`

### scenarioSharedStock iter 95/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"9d9e5e47008efd0bc434fd15c2006c37\"}","iteration":95}`

### C7 reservas mismo slot iter 95/100

- Invariante: FALLA
- Duracion: 21ms
- Latencia: p50=12ms, p95=18ms, p99=19ms, max=19ms
- Detalle: `{"fecha":"2213-08-23","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":95}`

### scenarioDuplicatePayment iter 96/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"ce5ef15a52fcff5c4e31fb0c63e08922\"}","iteration":96}`

### scenarioSharedStock iter 96/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"f0b10b7e00ee980c46df813ac0285550\"}","iteration":96}`

### C7 reservas mismo slot iter 96/100

- Invariante: FALLA
- Duracion: 24ms
- Latencia: p50=18ms, p95=21ms, p99=22ms, max=22ms
- Detalle: `{"fecha":"2213-08-24","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":96}`

### scenarioDuplicatePayment iter 97/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"c5b4dd74eec45e1c4e561e26f0288739\"}","iteration":97}`

### scenarioSharedStock iter 97/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"e4d2f833e1e6707ac92404290a31966a\"}","iteration":97}`

### C7 reservas mismo slot iter 97/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=15ms, p95=19ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-25","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":97}`

### scenarioDuplicatePayment iter 98/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"36d67b00722478482a60fd691a7a1246\"}","iteration":98}`

### scenarioSharedStock iter 98/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"fcb4fb2f455b0123a02ff91337c2357d\"}","iteration":98}`

### C7 reservas mismo slot iter 98/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=16ms, p95=19ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-26","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":98}`

### scenarioDuplicatePayment iter 99/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"37eb721c7179cf6146a54e0dd3423d44\"}","iteration":99}`

### scenarioSharedStock iter 99/100

- Invariante: FALLA
- Duracion: 2ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"143f6645b354c03c078f44073c10c357\"}","iteration":99}`

### C7 reservas mismo slot iter 99/100

- Invariante: FALLA
- Duracion: 22ms
- Latencia: p50=16ms, p95=20ms, p99=20ms, max=20ms
- Detalle: `{"fecha":"2213-08-27","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":99}`

### scenarioDuplicatePayment iter 100/100

- Invariante: FALLA
- Duracion: 3ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create mesa: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"fb8a541ef7e2cd14261830641b5ed26f\"}","iteration":100}`

### scenarioSharedStock iter 100/100

- Invariante: FALLA
- Duracion: 1ms
- Latencia: p50=0ms, p95=n/a, p99=n/a, max=0ms
- Detalle: `{"error":"Could not create categoria: 429 {\"message\":\"API rate limit exceeded\",\"request_id\":\"0387df6c413cc35011a6d440db56fe75\"}","iteration":100}`

### C7 reservas mismo slot iter 100/100

- Invariante: FALLA
- Duracion: 20ms
- Latencia: p50=13ms, p95=17ms, p99=18ms, max=18ms
- Detalle: `{"fecha":"2213-08-28","hora":"18:15","successCount":0,"conflictCount":0,"clientTimeouts":0,"activeReservationsForSlot":0,"iteration":100}`

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

- Requiere fix: al menos un invariante de concurrencia/seguridad fallo.

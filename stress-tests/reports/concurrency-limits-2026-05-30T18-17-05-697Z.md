# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-30T18:17:05.697Z
- Base URL: http://localhost:8000
- Rama: codex/stock-idempotency-dlq
- Commit: bfd9ff0 Merge pull request #4 from Marcos7PY/codex/security-and-limit-tests
- Concurrencia base: 50
- Iteraciones: 100
- Resultado: 300/300 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/100 | OK | 50 | {"201":1,"400":49} | 669ms | 71.74 |
| C6 stock compartido iter 1/100 | OK | 60 | {"201":50,"400":10} | 821ms | 71.51 |
| C7 reservas mismo slot iter 1/100 | OK | 50 | {"201":1,"409":49} | 281ms | 172.41 |
| C5 pago duplicado concurrente iter 2/100 | OK | 50 | {"201":1,"400":49} | 611ms | 78.37 |
| C6 stock compartido iter 2/100 | OK | 60 | {"201":50,"400":10} | 840ms | 69.77 |
| C7 reservas mismo slot iter 2/100 | OK | 50 | {"201":1,"409":49} | 210ms | 229.36 |
| C5 pago duplicado concurrente iter 3/100 | OK | 50 | {"201":1,"400":49} | 476ms | 101.21 |
| C6 stock compartido iter 3/100 | OK | 60 | {"201":50,"400":10} | 786ms | 74.35 |
| C7 reservas mismo slot iter 3/100 | OK | 50 | {"201":1,"409":49} | 234ms | 205.76 |
| C5 pago duplicado concurrente iter 4/100 | OK | 50 | {"201":1,"400":49} | 516ms | 93.81 |
| C6 stock compartido iter 4/100 | OK | 60 | {"201":50,"400":10} | 709ms | 82.99 |
| C7 reservas mismo slot iter 4/100 | OK | 50 | {"201":1,"409":49} | 211ms | 227.27 |
| C5 pago duplicado concurrente iter 5/100 | OK | 50 | {"201":1,"400":49} | 35627ms | 1.4 |
| C6 stock compartido iter 5/100 | OK | 60 | {"201":50,"400":10} | 702ms | 83.57 |
| C7 reservas mismo slot iter 5/100 | OK | 50 | {"201":1,"409":49} | 303ms | 157.23 |
| C5 pago duplicado concurrente iter 6/100 | OK | 50 | {"201":1,"400":49} | 534ms | 90.42 |
| C6 stock compartido iter 6/100 | OK | 60 | {"201":50,"400":10} | 705ms | 83.45 |
| C7 reservas mismo slot iter 6/100 | OK | 50 | {"201":1,"409":49} | 269ms | 178.57 |
| C5 pago duplicado concurrente iter 7/100 | OK | 50 | {"201":1,"400":49} | 508ms | 95.24 |
| C6 stock compartido iter 7/100 | OK | 60 | {"201":50,"400":10} | 699ms | 84.99 |
| C7 reservas mismo slot iter 7/100 | OK | 50 | {"201":1,"409":49} | 266ms | 183.15 |
| C5 pago duplicado concurrente iter 8/100 | OK | 50 | {"201":1,"400":49} | 542ms | 89.45 |
| C6 stock compartido iter 8/100 | OK | 60 | {"201":50,"400":10} | 666ms | 88.11 |
| C7 reservas mismo slot iter 8/100 | OK | 50 | {"201":1,"409":49} | 304ms | 159.74 |
| C5 pago duplicado concurrente iter 9/100 | OK | 50 | {"201":1,"400":49} | 510ms | 94.88 |
| C6 stock compartido iter 9/100 | OK | 60 | {"201":50,"400":10} | 647ms | 89.96 |
| C7 reservas mismo slot iter 9/100 | OK | 50 | {"201":1,"409":49} | 275ms | 176.06 |
| C5 pago duplicado concurrente iter 10/100 | OK | 50 | {"201":1,"400":49} | 462ms | 104.6 |
| C6 stock compartido iter 10/100 | OK | 60 | {"201":50,"400":10} | 789ms | 75.19 |
| C7 reservas mismo slot iter 10/100 | OK | 50 | {"201":1,"409":49} | 207ms | 235.85 |
| C5 pago duplicado concurrente iter 11/100 | OK | 50 | {"201":1,"400":49} | 457ms | 104.38 |
| C6 stock compartido iter 11/100 | OK | 60 | {"201":50,"400":10} | 741ms | 78.95 |
| C7 reservas mismo slot iter 11/100 | OK | 50 | {"201":1,"409":49} | 211ms | 229.36 |
| C5 pago duplicado concurrente iter 12/100 | OK | 50 | {"201":1,"400":49} | 468ms | 103.31 |
| C6 stock compartido iter 12/100 | OK | 60 | {"201":50,"400":10} | 691ms | 84.87 |
| C7 reservas mismo slot iter 12/100 | OK | 50 | {"201":1,"409":49} | 208ms | 233.64 |
| C5 pago duplicado concurrente iter 13/100 | OK | 50 | {"201":1,"400":49} | 521ms | 92.59 |
| C6 stock compartido iter 13/100 | OK | 60 | {"0":12,"201":48} | 60015ms | 1 |
| C7 reservas mismo slot iter 13/100 | OK | 50 | {"201":1,"409":49} | 256ms | 190.84 |
| C5 pago duplicado concurrente iter 14/100 | OK | 50 | {"201":1,"400":49} | 516ms | 93.28 |
| C6 stock compartido iter 14/100 | OK | 60 | {"201":50,"400":10} | 798ms | 74.17 |
| C7 reservas mismo slot iter 14/100 | OK | 50 | {"201":1,"409":49} | 277ms | 174.83 |
| C5 pago duplicado concurrente iter 15/100 | OK | 50 | {"201":1,"400":49} | 571ms | 85.03 |
| C6 stock compartido iter 15/100 | OK | 60 | {"201":50,"400":10} | 688ms | 85.47 |
| C7 reservas mismo slot iter 15/100 | OK | 50 | {"201":1,"409":49} | 283ms | 172.41 |
| C5 pago duplicado concurrente iter 16/100 | OK | 50 | {"201":1,"400":49} | 539ms | 89.45 |
| C6 stock compartido iter 16/100 | OK | 60 | {"201":50,"400":10} | 772ms | 76.14 |
| C7 reservas mismo slot iter 16/100 | OK | 50 | {"201":1,"409":49} | 281ms | 173.61 |
| C5 pago duplicado concurrente iter 17/100 | OK | 50 | {"201":1,"400":49} | 552ms | 87.26 |
| C6 stock compartido iter 17/100 | OK | 60 | {"201":50,"400":10} | 828ms | 71.34 |
| C7 reservas mismo slot iter 17/100 | OK | 50 | {"201":1,"409":49} | 320ms | 150.6 |
| C5 pago duplicado concurrente iter 18/100 | OK | 50 | {"201":1,"400":49} | 619ms | 77.4 |
| C6 stock compartido iter 18/100 | OK | 60 | {"201":50,"400":10} | 757ms | 78.02 |
| C7 reservas mismo slot iter 18/100 | OK | 50 | {"201":1,"409":49} | 218ms | 220.26 |
| C5 pago duplicado concurrente iter 19/100 | OK | 50 | {"201":1,"400":49} | 503ms | 96.15 |
| C6 stock compartido iter 19/100 | OK | 60 | {"201":50,"400":10} | 746ms | 79.26 |
| C7 reservas mismo slot iter 19/100 | OK | 50 | {"201":1,"409":49} | 195ms | 245.1 |
| C5 pago duplicado concurrente iter 20/100 | OK | 50 | {"201":1,"400":49} | 466ms | 103.31 |
| C6 stock compartido iter 20/100 | OK | 60 | {"201":50,"400":10} | 670ms | 87.98 |
| C7 reservas mismo slot iter 20/100 | OK | 50 | {"201":1,"409":49} | 250ms | 195.31 |
| C5 pago duplicado concurrente iter 21/100 | OK | 50 | {"201":1,"400":49} | 522ms | 91.24 |
| C6 stock compartido iter 21/100 | OK | 60 | {"201":50,"400":10} | 697ms | 84.63 |
| C7 reservas mismo slot iter 21/100 | OK | 50 | {"201":1,"409":49} | 198ms | 245.1 |
| C5 pago duplicado concurrente iter 22/100 | OK | 50 | {"201":1,"400":49} | 542ms | 88.5 |
| C6 stock compartido iter 22/100 | OK | 60 | {"201":50,"400":10} | 692ms | 1.68 |
| C7 reservas mismo slot iter 22/100 | OK | 50 | {"201":1,"409":49} | 184ms | 261.78 |
| C5 pago duplicado concurrente iter 23/100 | OK | 50 | {"201":1,"400":49} | 545ms | 88.65 |
| C6 stock compartido iter 23/100 | OK | 60 | {"201":50,"400":10} | 855ms | 69.28 |
| C7 reservas mismo slot iter 23/100 | OK | 50 | {"201":1,"409":49} | 193ms | 251.26 |
| C5 pago duplicado concurrente iter 24/100 | OK | 50 | {"201":1,"400":49} | 467ms | 102.88 |
| C6 stock compartido iter 24/100 | OK | 60 | {"201":50,"400":10} | 688ms | 85.96 |
| C7 reservas mismo slot iter 24/100 | OK | 50 | {"201":1,"409":49} | 290ms | 168.35 |
| C5 pago duplicado concurrente iter 25/100 | OK | 50 | {"201":1,"400":49} | 551ms | 86.66 |
| C6 stock compartido iter 25/100 | OK | 60 | {"201":50,"400":10} | 689ms | 86.08 |
| C7 reservas mismo slot iter 25/100 | OK | 50 | {"201":1,"409":49} | 214ms | 228.31 |
| C5 pago duplicado concurrente iter 26/100 | OK | 50 | {"201":1,"400":49} | 513ms | 93.98 |
| C6 stock compartido iter 26/100 | OK | 60 | {"201":50,"400":10} | 35661ms | 1.68 |
| C7 reservas mismo slot iter 26/100 | OK | 50 | {"201":1,"409":49} | 288ms | 170.07 |
| C5 pago duplicado concurrente iter 27/100 | OK | 50 | {"201":1,"400":49} | 524ms | 91.58 |
| C6 stock compartido iter 27/100 | OK | 60 | {"201":50,"400":10} | 837ms | 70.59 |
| C7 reservas mismo slot iter 27/100 | OK | 50 | {"201":1,"409":49} | 219ms | 221.24 |
| C5 pago duplicado concurrente iter 28/100 | OK | 50 | {"201":1,"400":49} | 604ms | 80.26 |
| C6 stock compartido iter 28/100 | OK | 60 | {"201":50,"400":10} | 709ms | 83.68 |
| C7 reservas mismo slot iter 28/100 | OK | 50 | {"201":1,"409":49} | 193ms | 247.52 |
| C5 pago duplicado concurrente iter 29/100 | OK | 50 | {"201":1,"400":49} | 579ms | 83.06 |
| C6 stock compartido iter 29/100 | OK | 60 | {"201":50,"400":10} | 812ms | 72.55 |
| C7 reservas mismo slot iter 29/100 | OK | 50 | {"201":1,"409":49} | 243ms | 201.61 |
| C5 pago duplicado concurrente iter 30/100 | OK | 50 | {"201":1,"400":49} | 568ms | 84.6 |
| C6 stock compartido iter 30/100 | OK | 60 | {"201":50,"400":10} | 823ms | 71.17 |
| C7 reservas mismo slot iter 30/100 | OK | 50 | {"0":12,"201":1,"409":37} | 60004ms | 0.83 |
| C5 pago duplicado concurrente iter 31/100 | OK | 50 | {"201":1,"400":49} | 557ms | 86.21 |
| C6 stock compartido iter 31/100 | OK | 60 | {"201":50,"400":10} | 794ms | 74.26 |
| C7 reservas mismo slot iter 31/100 | OK | 50 | {"201":1,"409":49} | 227ms | 213.68 |
| C5 pago duplicado concurrente iter 32/100 | OK | 50 | {"201":1,"400":49} | 765ms | 63.37 |
| C6 stock compartido iter 32/100 | OK | 60 | {"0":4,"201":50,"400":6} | 60002ms | 1 |
| C7 reservas mismo slot iter 32/100 | OK | 50 | {"201":1,"409":49} | 254ms | 190.84 |
| C5 pago duplicado concurrente iter 33/100 | OK | 50 | {"201":1,"400":49} | 622ms | 78.13 |
| C6 stock compartido iter 33/100 | OK | 60 | {"201":50,"400":10} | 821ms | 70.34 |
| C7 reservas mismo slot iter 33/100 | OK | 50 | {"201":1,"409":49} | 351ms | 138.89 |
| C5 pago duplicado concurrente iter 34/100 | OK | 50 | {"201":1,"400":49} | 656ms | 72.89 |
| C6 stock compartido iter 34/100 | OK | 60 | {"201":50,"400":10} | 782ms | 73.8 |
| C7 reservas mismo slot iter 34/100 | OK | 50 | {"201":1,"409":49} | 286ms | 169.49 |
| C5 pago duplicado concurrente iter 35/100 | OK | 50 | {"201":1,"400":49} | 631ms | 76.57 |
| C6 stock compartido iter 35/100 | OK | 60 | {"201":50,"400":10} | 35672ms | 1.68 |
| C7 reservas mismo slot iter 35/100 | OK | 50 | {"201":1,"409":49} | 314ms | 152.91 |
| C5 pago duplicado concurrente iter 36/100 | OK | 50 | {"201":1,"400":49} | 521ms | 92.94 |
| C6 stock compartido iter 36/100 | OK | 60 | {"201":50,"400":10} | 706ms | 83.8 |
| C7 reservas mismo slot iter 36/100 | OK | 50 | {"201":1,"409":49} | 286ms | 170.07 |
| C5 pago duplicado concurrente iter 37/100 | OK | 50 | {"201":1,"400":49} | 536ms | 90.25 |
| C6 stock compartido iter 37/100 | OK | 60 | {"201":50,"400":10} | 712ms | 82.87 |
| C7 reservas mismo slot iter 37/100 | OK | 50 | {"201":1,"409":49} | 251ms | 194.55 |
| C5 pago duplicado concurrente iter 38/100 | OK | 50 | {"201":1,"400":49} | 477ms | 100.2 |
| C6 stock compartido iter 38/100 | OK | 60 | {"201":50,"400":10} | 756ms | 77.62 |
| C7 reservas mismo slot iter 38/100 | OK | 50 | {"201":1,"409":49} | 242ms | 192.31 |
| C5 pago duplicado concurrente iter 39/100 | OK | 50 | {"201":1,"400":49} | 524ms | 91.91 |
| C6 stock compartido iter 39/100 | OK | 60 | {"201":50,"400":10} | 728ms | 81.08 |
| C7 reservas mismo slot iter 39/100 | OK | 50 | {"201":1,"409":49} | 206ms | 231.48 |
| C5 pago duplicado concurrente iter 40/100 | OK | 50 | {"201":1,"400":49} | 525ms | 92.25 |
| C6 stock compartido iter 40/100 | OK | 60 | {"201":50,"400":10} | 704ms | 83.92 |
| C7 reservas mismo slot iter 40/100 | OK | 50 | {"201":1,"409":49} | 297ms | 163.93 |
| C5 pago duplicado concurrente iter 41/100 | OK | 50 | {"201":1,"400":49} | 11394ms | 4.38 |
| C6 stock compartido iter 41/100 | OK | 60 | {"201":50,"400":10} | 714ms | 82.53 |
| C7 reservas mismo slot iter 41/100 | OK | 50 | {"201":1,"409":49} | 198ms | 241.55 |
| C5 pago duplicado concurrente iter 42/100 | OK | 50 | {"201":1,"400":49} | 506ms | 95.6 |
| C6 stock compartido iter 42/100 | OK | 60 | {"201":50,"400":10} | 653ms | 86.96 |
| C7 reservas mismo slot iter 42/100 | OK | 50 | {"201":1,"409":49} | 193ms | 253.81 |
| C5 pago duplicado concurrente iter 43/100 | OK | 50 | {"201":1,"400":49} | 494ms | 96.9 |
| C6 stock compartido iter 43/100 | OK | 60 | {"201":50,"400":10} | 664ms | 89.02 |
| C7 reservas mismo slot iter 43/100 | OK | 50 | {"201":1,"409":49} | 164ms | 295.86 |
| C5 pago duplicado concurrente iter 44/100 | OK | 50 | {"201":1,"400":49} | 587ms | 82.78 |
| C6 stock compartido iter 44/100 | OK | 60 | {"201":50,"400":10} | 621ms | 91.32 |
| C7 reservas mismo slot iter 44/100 | OK | 50 | {"201":1,"409":49} | 191ms | 253.81 |
| C5 pago duplicado concurrente iter 45/100 | OK | 50 | {"201":1,"400":49} | 534ms | 90.74 |
| C6 stock compartido iter 45/100 | OK | 60 | {"201":50,"400":10} | 679ms | 86.96 |
| C7 reservas mismo slot iter 45/100 | OK | 50 | {"201":1,"409":49} | 238ms | 201.61 |
| C5 pago duplicado concurrente iter 46/100 | OK | 50 | {"201":1,"400":49} | 463ms | 104.38 |
| C6 stock compartido iter 46/100 | OK | 60 | {"201":50,"400":10} | 624ms | 94.79 |
| C7 reservas mismo slot iter 46/100 | OK | 50 | {"201":1,"409":49} | 216ms | 226.24 |
| C5 pago duplicado concurrente iter 47/100 | OK | 50 | {"201":1,"400":49} | 507ms | 95.42 |
| C6 stock compartido iter 47/100 | OK | 60 | {"201":50,"400":10} | 607ms | 96 |
| C7 reservas mismo slot iter 47/100 | OK | 50 | {"201":1,"409":49} | 11446ms | 4.36 |
| C5 pago duplicado concurrente iter 48/100 | OK | 50 | {"201":1,"400":49} | 610ms | 78.74 |
| C6 stock compartido iter 48/100 | OK | 60 | {"201":50,"400":10} | 720ms | 82.42 |
| C7 reservas mismo slot iter 48/100 | OK | 50 | {"201":1,"409":49} | 254ms | 193.8 |
| C5 pago duplicado concurrente iter 49/100 | OK | 50 | {"201":1,"400":49} | 587ms | 82.51 |
| C6 stock compartido iter 49/100 | OK | 60 | {"201":50,"400":10} | 650ms | 91.46 |
| C7 reservas mismo slot iter 49/100 | OK | 50 | {"201":1,"409":49} | 193ms | 250 |
| C5 pago duplicado concurrente iter 50/100 | OK | 50 | {"201":1,"400":49} | 435ms | 110.62 |
| C6 stock compartido iter 50/100 | OK | 60 | {"201":50,"400":10} | 704ms | 84.27 |
| C7 reservas mismo slot iter 50/100 | OK | 50 | {"201":1,"409":49} | 232ms | 210.08 |
| C5 pago duplicado concurrente iter 51/100 | OK | 50 | {"201":1,"400":49} | 546ms | 88.65 |
| C6 stock compartido iter 51/100 | OK | 60 | {"201":50,"400":10} | 751ms | 78.43 |
| C7 reservas mismo slot iter 51/100 | OK | 50 | {"201":1,"409":49} | 243ms | 200.8 |
| C5 pago duplicado concurrente iter 52/100 | OK | 50 | {"201":1,"400":49} | 490ms | 98.04 |
| C6 stock compartido iter 52/100 | OK | 60 | {"201":50,"400":10} | 642ms | 90.91 |
| C7 reservas mismo slot iter 52/100 | OK | 50 | {"201":1,"409":49} | 208ms | 231.48 |
| C5 pago duplicado concurrente iter 53/100 | OK | 50 | {"201":1,"400":49} | 594ms | 81.7 |
| C6 stock compartido iter 53/100 | OK | 60 | {"201":50,"400":10} | 713ms | 82.76 |
| C7 reservas mismo slot iter 53/100 | OK | 50 | {"201":1,"409":49} | 198ms | 242.72 |
| C5 pago duplicado concurrente iter 54/100 | OK | 50 | {"201":1,"400":49} | 456ms | 105.71 |
| C6 stock compartido iter 54/100 | OK | 60 | {"201":50,"400":10} | 626ms | 94.94 |
| C7 reservas mismo slot iter 54/100 | OK | 50 | {"201":1,"409":49} | 209ms | 231.48 |
| C5 pago duplicado concurrente iter 55/100 | OK | 50 | {"201":1,"400":49} | 508ms | 95.42 |
| C6 stock compartido iter 55/100 | OK | 60 | {"201":50,"400":10} | 720ms | 81.52 |
| C7 reservas mismo slot iter 55/100 | OK | 50 | {"201":1,"409":49} | 181ms | 268.82 |
| C5 pago duplicado concurrente iter 56/100 | OK | 50 | {"201":1,"400":49} | 541ms | 89.29 |
| C6 stock compartido iter 56/100 | OK | 60 | {"201":50,"400":10} | 639ms | 89.15 |
| C7 reservas mismo slot iter 56/100 | OK | 50 | {"201":1,"409":49} | 223ms | 213.68 |
| C5 pago duplicado concurrente iter 57/100 | OK | 50 | {"201":1,"400":49} | 567ms | 83.33 |
| C6 stock compartido iter 57/100 | OK | 60 | {"201":50,"400":10} | 19521ms | 3.07 |
| C7 reservas mismo slot iter 57/100 | OK | 50 | {"201":1,"409":49} | 190ms | 253.81 |
| C5 pago duplicado concurrente iter 58/100 | OK | 50 | {"201":1,"400":49} | 520ms | 93.11 |
| C6 stock compartido iter 58/100 | OK | 60 | {"201":50,"400":10} | 713ms | 82.99 |
| C7 reservas mismo slot iter 58/100 | OK | 50 | {"201":1,"409":49} | 247ms | 196.85 |
| C5 pago duplicado concurrente iter 59/100 | OK | 50 | {"201":1,"400":49} | 467ms | 103.31 |
| C6 stock compartido iter 59/100 | OK | 60 | {"201":50,"400":10} | 699ms | 84.39 |
| C7 reservas mismo slot iter 59/100 | OK | 50 | {"201":1,"409":49} | 214ms | 226.24 |
| C5 pago duplicado concurrente iter 60/100 | OK | 50 | {"201":1,"400":49} | 572ms | 84.46 |
| C6 stock compartido iter 60/100 | OK | 60 | {"201":50,"400":10} | 683ms | 86.33 |
| C7 reservas mismo slot iter 60/100 | OK | 50 | {"201":1,"409":49} | 2094ms | 23.82 |
| C5 pago duplicado concurrente iter 61/100 | OK | 50 | {"201":1,"400":47,"502":2} | 458ms | 105.71 |
| C6 stock compartido iter 61/100 | OK | 60 | {"201":50,"400":10} | 644ms | 91.19 |
| C7 reservas mismo slot iter 61/100 | OK | 50 | {"201":1,"409":49} | 200ms | 240.38 |
| C5 pago duplicado concurrente iter 62/100 | OK | 50 | {"201":1,"400":49} | 441ms | 1.4 |
| C6 stock compartido iter 62/100 | OK | 60 | {"201":50,"400":10} | 714ms | 82.99 |
| C7 reservas mismo slot iter 62/100 | OK | 50 | {"201":1,"409":49} | 185ms | 259.07 |
| C5 pago duplicado concurrente iter 63/100 | OK | 50 | {"201":1,"400":49} | 499ms | 97.09 |
| C6 stock compartido iter 63/100 | OK | 60 | {"201":50,"400":10} | 688ms | 86.08 |
| C7 reservas mismo slot iter 63/100 | OK | 50 | {"201":1,"409":49} | 196ms | 242.72 |
| C5 pago duplicado concurrente iter 64/100 | OK | 50 | {"201":1,"400":49} | 443ms | 108.46 |
| C6 stock compartido iter 64/100 | OK | 60 | {"201":50,"400":10} | 735ms | 79.79 |
| C7 reservas mismo slot iter 64/100 | OK | 50 | {"201":1,"409":49} | 164ms | 292.4 |
| C5 pago duplicado concurrente iter 65/100 | OK | 50 | {"201":1,"400":49} | 451ms | 107.07 |
| C6 stock compartido iter 65/100 | OK | 60 | {"201":50,"400":10} | 600ms | 99.01 |
| C7 reservas mismo slot iter 65/100 | OK | 50 | {"201":1,"409":49} | 206ms | 233.64 |
| C5 pago duplicado concurrente iter 66/100 | OK | 50 | {"201":1,"400":49} | 430ms | 112.11 |
| C6 stock compartido iter 66/100 | OK | 60 | {"201":50,"400":10} | 607ms | 97.56 |
| C7 reservas mismo slot iter 66/100 | OK | 50 | {"201":1,"409":49} | 233ms | 209.21 |
| C5 pago duplicado concurrente iter 67/100 | OK | 50 | {"201":1,"400":49} | 453ms | 106.84 |
| C6 stock compartido iter 67/100 | OK | 60 | {"201":50,"400":10} | 588ms | 100.33 |
| C7 reservas mismo slot iter 67/100 | OK | 50 | {"201":1,"409":49} | 239ms | 204.08 |
| C5 pago duplicado concurrente iter 68/100 | OK | 50 | {"201":1,"400":49} | 420ms | 114.94 |
| C6 stock compartido iter 68/100 | OK | 60 | {"201":50,"400":10} | 748ms | 79.16 |
| C7 reservas mismo slot iter 68/100 | OK | 50 | {"201":1,"409":49} | 246ms | 195.31 |
| C5 pago duplicado concurrente iter 69/100 | OK | 50 | {"201":1,"400":49} | 504ms | 96.15 |
| C6 stock compartido iter 69/100 | OK | 60 | {"201":50,"400":10} | 665ms | 89.15 |
| C7 reservas mismo slot iter 69/100 | OK | 50 | {"201":1,"409":49} | 209ms | 230.41 |
| C5 pago duplicado concurrente iter 70/100 | OK | 50 | {"201":1,"400":49} | 501ms | 96.34 |
| C6 stock compartido iter 70/100 | OK | 60 | {"201":50,"400":10} | 775ms | 75.47 |
| C7 reservas mismo slot iter 70/100 | OK | 50 | {"201":1,"409":49} | 349ms | 140.85 |
| C5 pago duplicado concurrente iter 71/100 | OK | 50 | {"201":1,"400":49} | 466ms | 103.52 |
| C6 stock compartido iter 71/100 | OK | 60 | {"201":50,"400":10} | 667ms | 89.15 |
| C7 reservas mismo slot iter 71/100 | OK | 50 | {"201":1,"409":49} | 252ms | 193.8 |
| C5 pago duplicado concurrente iter 72/100 | OK | 50 | {"201":1,"400":49} | 499ms | 96.53 |
| C6 stock compartido iter 72/100 | OK | 60 | {"201":50,"400":10} | 615ms | 96 |
| C7 reservas mismo slot iter 72/100 | OK | 50 | {"201":1,"409":49} | 250ms | 190.11 |
| C5 pago duplicado concurrente iter 73/100 | OK | 50 | {"201":1,"400":49} | 435ms | 110.86 |
| C6 stock compartido iter 73/100 | OK | 60 | {"201":50,"400":10} | 605ms | 97.09 |
| C7 reservas mismo slot iter 73/100 | OK | 50 | {"201":1,"409":49} | 278ms | 174.83 |
| C5 pago duplicado concurrente iter 74/100 | OK | 50 | {"201":1,"400":49} | 527ms | 91.58 |
| C6 stock compartido iter 74/100 | OK | 60 | {"201":50,"400":10} | 744ms | 75.57 |
| C7 reservas mismo slot iter 74/100 | OK | 50 | {"201":1,"409":49} | 230ms | 209.21 |
| C5 pago duplicado concurrente iter 75/100 | OK | 50 | {"201":1,"400":49} | 539ms | 88.97 |
| C6 stock compartido iter 75/100 | OK | 60 | {"201":50,"400":10} | 647ms | 88.5 |
| C7 reservas mismo slot iter 75/100 | OK | 50 | {"201":1,"409":49} | 215ms | 224.22 |
| C5 pago duplicado concurrente iter 76/100 | OK | 50 | {"201":1,"400":49} | 579ms | 82.51 |
| C6 stock compartido iter 76/100 | OK | 60 | {"201":50,"400":10} | 682ms | 86.83 |
| C7 reservas mismo slot iter 76/100 | OK | 50 | {"201":1,"409":49} | 263ms | 185.87 |
| C5 pago duplicado concurrente iter 77/100 | OK | 50 | {"201":1,"400":49} | 480ms | 100.81 |
| C6 stock compartido iter 77/100 | OK | 60 | {"201":50,"400":10} | 641ms | 91.19 |
| C7 reservas mismo slot iter 77/100 | OK | 50 | {"201":1,"409":49} | 35671ms | 1.4 |
| C5 pago duplicado concurrente iter 78/100 | OK | 50 | {"201":1,"400":49} | 545ms | 88.03 |
| C6 stock compartido iter 78/100 | OK | 60 | {"201":50,"400":10} | 660ms | 89.02 |
| C7 reservas mismo slot iter 78/100 | OK | 50 | {"201":1,"409":49} | 164ms | 276.24 |
| C5 pago duplicado concurrente iter 79/100 | OK | 50 | {"201":1,"400":49} | 435ms | 111.11 |
| C6 stock compartido iter 79/100 | OK | 60 | {"201":50,"400":10} | 686ms | 85.96 |
| C7 reservas mismo slot iter 79/100 | OK | 50 | {"201":1,"409":49} | 304ms | 158.23 |
| C5 pago duplicado concurrente iter 80/100 | OK | 50 | {"201":1,"400":49} | 593ms | 81.57 |
| C6 stock compartido iter 80/100 | OK | 60 | {"201":50,"400":10} | 643ms | 91.74 |
| C7 reservas mismo slot iter 80/100 | OK | 50 | {"201":1,"409":49} | 218ms | 222.22 |
| C5 pago duplicado concurrente iter 81/100 | OK | 50 | {"201":1,"400":49} | 514ms | 93.28 |
| C6 stock compartido iter 81/100 | OK | 60 | {"201":50,"400":10} | 740ms | 79.47 |
| C7 reservas mismo slot iter 81/100 | OK | 50 | {"201":1,"409":49} | 393ms | 121.65 |
| C5 pago duplicado concurrente iter 82/100 | OK | 50 | {"201":1,"400":49} | 613ms | 78.99 |
| C6 stock compartido iter 82/100 | OK | 60 | {"0":5,"201":50,"400":5} | 60012ms | 1 |
| C7 reservas mismo slot iter 82/100 | OK | 50 | {"201":1,"409":49} | 320ms | 151.52 |
| C5 pago duplicado concurrente iter 83/100 | OK | 50 | {"201":1,"400":49} | 584ms | 81.83 |
| C6 stock compartido iter 83/100 | OK | 60 | {"201":50,"400":10} | 661ms | 88.63 |
| C7 reservas mismo slot iter 83/100 | OK | 50 | {"201":1,"409":49} | 272ms | 179.21 |
| C5 pago duplicado concurrente iter 84/100 | OK | 50 | {"201":1,"400":49} | 500ms | 95.79 |
| C6 stock compartido iter 84/100 | OK | 60 | {"201":50,"400":10} | 676ms | 85.96 |
| C7 reservas mismo slot iter 84/100 | OK | 50 | {"201":1,"409":49} | 224ms | 212.77 |
| C5 pago duplicado concurrente iter 85/100 | OK | 50 | {"201":1,"400":49} | 628ms | 75.64 |
| C6 stock compartido iter 85/100 | OK | 60 | {"201":50,"400":10} | 840ms | 69.77 |
| C7 reservas mismo slot iter 85/100 | OK | 50 | {"201":1,"409":49} | 275ms | 175.44 |
| C5 pago duplicado concurrente iter 86/100 | OK | 50 | {"201":1,"400":49} | 563ms | 85.91 |
| C6 stock compartido iter 86/100 | OK | 60 | {"201":50,"400":10} | 732ms | 80.54 |
| C7 reservas mismo slot iter 86/100 | OK | 50 | {"201":1,"409":49} | 175ms | 276.24 |
| C5 pago duplicado concurrente iter 87/100 | OK | 50 | {"201":1,"400":49} | 488ms | 98.04 |
| C6 stock compartido iter 87/100 | OK | 60 | {"201":50,"400":10} | 756ms | 78.43 |
| C7 reservas mismo slot iter 87/100 | OK | 50 | {"201":1,"409":49} | 183ms | 263.16 |
| C5 pago duplicado concurrente iter 88/100 | OK | 50 | {"201":1,"400":49} | 473ms | 101.83 |
| C6 stock compartido iter 88/100 | OK | 60 | {"201":50,"400":10} | 731ms | 80.32 |
| C7 reservas mismo slot iter 88/100 | OK | 50 | {"201":1,"409":49} | 245ms | 200 |
| C5 pago duplicado concurrente iter 89/100 | OK | 50 | {"201":1,"400":49} | 484ms | 99.8 |
| C6 stock compartido iter 89/100 | OK | 60 | {"201":50,"400":10} | 729ms | 81.19 |
| C7 reservas mismo slot iter 89/100 | OK | 50 | {"201":1,"409":49} | 206ms | 235.85 |
| C5 pago duplicado concurrente iter 90/100 | OK | 50 | {"201":1,"400":49} | 470ms | 102.88 |
| C6 stock compartido iter 90/100 | OK | 60 | {"201":50,"400":10} | 748ms | 79.68 |
| C7 reservas mismo slot iter 90/100 | OK | 50 | {"201":1,"409":49} | 273ms | 179.21 |
| C5 pago duplicado concurrente iter 91/100 | OK | 50 | {"201":1,"400":49} | 602ms | 80.65 |
| C6 stock compartido iter 91/100 | OK | 60 | {"201":50,"400":10} | 749ms | 79.05 |
| C7 reservas mismo slot iter 91/100 | OK | 50 | {"201":1,"409":49} | 194ms | 250 |
| C5 pago duplicado concurrente iter 92/100 | OK | 50 | {"201":1,"400":49} | 537ms | 88.97 |
| C6 stock compartido iter 92/100 | OK | 60 | {"201":50,"400":10} | 751ms | 78.64 |
| C7 reservas mismo slot iter 92/100 | OK | 50 | {"201":1,"409":49} | 198ms | 246.31 |
| C5 pago duplicado concurrente iter 93/100 | OK | 50 | {"201":1,"400":49} | 495ms | 97.47 |
| C6 stock compartido iter 93/100 | OK | 60 | {"201":50,"400":10} | 700ms | 84.27 |
| C7 reservas mismo slot iter 93/100 | OK | 50 | {"201":1,"409":49} | 270ms | 181.16 |
| C5 pago duplicado concurrente iter 94/100 | OK | 50 | {"201":1,"400":49} | 519ms | 93.28 |
| C6 stock compartido iter 94/100 | OK | 60 | {"201":50,"400":10} | 661ms | 87.46 |
| C7 reservas mismo slot iter 94/100 | OK | 50 | {"201":1,"409":49} | 246ms | 197.63 |
| C5 pago duplicado concurrente iter 95/100 | OK | 50 | {"201":1,"400":49} | 482ms | 100 |
| C6 stock compartido iter 95/100 | OK | 60 | {"201":50,"400":10} | 964ms | 61.22 |
| C7 reservas mismo slot iter 95/100 | OK | 50 | {"201":1,"409":49} | 195ms | 251.26 |
| C5 pago duplicado concurrente iter 96/100 | OK | 50 | {"201":1,"400":49} | 665ms | 72.78 |
| C6 stock compartido iter 96/100 | OK | 60 | {"201":50,"400":10} | 824ms | 71.86 |
| C7 reservas mismo slot iter 96/100 | OK | 50 | {"201":1,"409":49} | 428ms | 114.94 |
| C5 pago duplicado concurrente iter 97/100 | OK | 50 | {"201":1,"400":49} | 538ms | 89.77 |
| C6 stock compartido iter 97/100 | OK | 60 | {"201":50,"400":10} | 802ms | 74.26 |
| C7 reservas mismo slot iter 97/100 | OK | 50 | {"201":1,"409":49} | 275ms | 177.3 |
| C5 pago duplicado concurrente iter 98/100 | OK | 50 | {"201":1,"400":49} | 623ms | 77.76 |
| C6 stock compartido iter 98/100 | OK | 60 | {"201":50,"400":10} | 797ms | 74.44 |
| C7 reservas mismo slot iter 98/100 | OK | 50 | {"201":1,"409":49} | 222ms | 215.52 |
| C5 pago duplicado concurrente iter 99/100 | OK | 50 | {"201":1,"400":49} | 497ms | 96.9 |
| C6 stock compartido iter 99/100 | OK | 60 | {"201":50,"400":10} | 851ms | 69.69 |
| C7 reservas mismo slot iter 99/100 | OK | 50 | {"201":1,"409":49} | 258ms | 188.68 |
| C5 pago duplicado concurrente iter 100/100 | OK | 50 | {"201":1,"400":49} | 544ms | 86.96 |
| C6 stock compartido iter 100/100 | OK | 60 | {"201":50,"400":10} | 644ms | 92.02 |
| C7 reservas mismo slot iter 100/100 | OK | 50 | {"201":1,"409":49} | 254ms | 189.39 |

## Detalle

### C5 pago duplicado concurrente iter 1/100

- Invariante: OK
- Duracion: 697ms
- Latencia: p50=458ms, p95=669ms, p99=691ms, max=691ms
- Detalle: `{"cuentaId":"cb9bd516-e990-470d-86f1-8b270dcf2145","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":1}`

### C6 stock compartido iter 1/100

- Invariante: OK
- Duracion: 839ms
- Latencia: p50=555ms, p95=821ms, p99=830ms, max=830ms
- Detalle: `{"productId":"c0d9e00a-e799-48b9-8632-a3dcc8dcc6d1","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":1}`

### C7 reservas mismo slot iter 1/100

- Invariante: OK
- Duracion: 290ms
- Latencia: p50=182ms, p95=281ms, p99=286ms, max=286ms
- Detalle: `{"fecha":"2222-10-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/100

- Invariante: OK
- Duracion: 638ms
- Latencia: p50=419ms, p95=611ms, p99=631ms, max=631ms
- Detalle: `{"cuentaId":"242e4e80-cff5-4f34-9578-bd6a202c32bd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":2}`

### C6 stock compartido iter 2/100

- Invariante: OK
- Duracion: 860ms
- Latencia: p50=543ms, p95=840ms, p99=857ms, max=857ms
- Detalle: `{"productId":"131f1121-2489-422a-b04a-eaade133b013","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":2}`

### C7 reservas mismo slot iter 2/100

- Invariante: OK
- Duracion: 218ms
- Latencia: p50=142ms, p95=210ms, p99=212ms, max=212ms
- Detalle: `{"fecha":"2222-10-13","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/100

- Invariante: OK
- Duracion: 494ms
- Latencia: p50=304ms, p95=476ms, p99=488ms, max=488ms
- Detalle: `{"cuentaId":"5cabf3f6-bc9f-4cf7-bf19-5df3f1bf3f5e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":3}`

### C6 stock compartido iter 3/100

- Invariante: OK
- Duracion: 807ms
- Latencia: p50=519ms, p95=786ms, p99=805ms, max=805ms
- Detalle: `{"productId":"f6015c65-fc97-49b8-b8e5-236f030374cd","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":3}`

### C7 reservas mismo slot iter 3/100

- Invariante: OK
- Duracion: 243ms
- Latencia: p50=155ms, p95=234ms, p99=239ms, max=239ms
- Detalle: `{"fecha":"2222-10-14","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

### C5 pago duplicado concurrente iter 4/100

- Invariante: OK
- Duracion: 533ms
- Latencia: p50=345ms, p95=516ms, p99=528ms, max=528ms
- Detalle: `{"cuentaId":"3b209a8d-3a25-408b-98ad-1beb2ccb5796","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":4}`

### C6 stock compartido iter 4/100

- Invariante: OK
- Duracion: 723ms
- Latencia: p50=473ms, p95=709ms, p99=720ms, max=720ms
- Detalle: `{"productId":"02b3f27e-232c-457e-ad05-fd9e81b1000e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":4}`

### C7 reservas mismo slot iter 4/100

- Invariante: OK
- Duracion: 220ms
- Latencia: p50=138ms, p95=211ms, p99=216ms, max=216ms
- Detalle: `{"fecha":"2222-10-15","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":4}`

### C5 pago duplicado concurrente iter 5/100

- Invariante: OK
- Duracion: 35651ms
- Latencia: p50=351ms, p95=35627ms, p99=35647ms, max=35647ms
- Detalle: `{"cuentaId":"3ffb4f64-087d-470c-96f9-2b94cfa2f32a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":5}`

### C6 stock compartido iter 5/100

- Invariante: OK
- Duracion: 718ms
- Latencia: p50=484ms, p95=702ms, p99=713ms, max=713ms
- Detalle: `{"productId":"a2ff5f0c-f21b-49d9-871c-1f63f6ad9d9f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":5}`

### C7 reservas mismo slot iter 5/100

- Invariante: OK
- Duracion: 318ms
- Latencia: p50=203ms, p95=303ms, p99=314ms, max=314ms
- Detalle: `{"fecha":"2222-10-16","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":5}`

### C5 pago duplicado concurrente iter 6/100

- Invariante: OK
- Duracion: 553ms
- Latencia: p50=349ms, p95=534ms, p99=550ms, max=550ms
- Detalle: `{"cuentaId":"9eb4292f-b7a5-4faa-973a-fe0ba8f850a7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":6}`

### C6 stock compartido iter 6/100

- Invariante: OK
- Duracion: 719ms
- Latencia: p50=470ms, p95=705ms, p99=708ms, max=708ms
- Detalle: `{"productId":"e1c4960a-89db-4523-a059-42cce8775c9c","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":6}`

### C7 reservas mismo slot iter 6/100

- Invariante: OK
- Duracion: 280ms
- Latencia: p50=169ms, p95=269ms, p99=275ms, max=275ms
- Detalle: `{"fecha":"2222-10-17","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":6}`

### C5 pago duplicado concurrente iter 7/100

- Invariante: OK
- Duracion: 525ms
- Latencia: p50=338ms, p95=508ms, p99=522ms, max=522ms
- Detalle: `{"cuentaId":"2b7cc5a1-effc-4f17-98ab-107e329e41bf","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":7}`

### C6 stock compartido iter 7/100

- Invariante: OK
- Duracion: 706ms
- Latencia: p50=463ms, p95=699ms, p99=700ms, max=700ms
- Detalle: `{"productId":"58b4b18b-d65b-4bb7-a500-a33bf55c7c9f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":7}`

### C7 reservas mismo slot iter 7/100

- Invariante: OK
- Duracion: 273ms
- Latencia: p50=175ms, p95=266ms, p99=271ms, max=271ms
- Detalle: `{"fecha":"2222-10-18","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":7}`

### C5 pago duplicado concurrente iter 8/100

- Invariante: OK
- Duracion: 559ms
- Latencia: p50=348ms, p95=542ms, p99=556ms, max=556ms
- Detalle: `{"cuentaId":"5f1cc783-dc48-44e6-a458-3f9c66b5ebad","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":8}`

### C6 stock compartido iter 8/100

- Invariante: OK
- Duracion: 681ms
- Latencia: p50=455ms, p95=666ms, p99=677ms, max=677ms
- Detalle: `{"productId":"7212c7fb-f144-4749-8d31-b4955c04ed43","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":8}`

### C7 reservas mismo slot iter 8/100

- Invariante: OK
- Duracion: 313ms
- Latencia: p50=205ms, p95=304ms, p99=310ms, max=310ms
- Detalle: `{"fecha":"2222-10-19","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":8}`

### C5 pago duplicado concurrente iter 9/100

- Invariante: OK
- Duracion: 527ms
- Latencia: p50=312ms, p95=510ms, p99=525ms, max=525ms
- Detalle: `{"cuentaId":"42e48282-a55b-43c2-83c2-a36223d02ef2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":9}`

### C6 stock compartido iter 9/100

- Invariante: OK
- Duracion: 667ms
- Latencia: p50=436ms, p95=647ms, p99=663ms, max=663ms
- Detalle: `{"productId":"c1e4cfcf-7029-4da5-8b62-51603e856b30","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":9}`

### C7 reservas mismo slot iter 9/100

- Invariante: OK
- Duracion: 284ms
- Latencia: p50=194ms, p95=275ms, p99=280ms, max=280ms
- Detalle: `{"fecha":"2222-10-20","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":9}`

### C5 pago duplicado concurrente iter 10/100

- Invariante: OK
- Duracion: 478ms
- Latencia: p50=300ms, p95=462ms, p99=475ms, max=475ms
- Detalle: `{"cuentaId":"e3bf993b-b0b7-47d8-a433-7310fd3a874c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":10}`

### C6 stock compartido iter 10/100

- Invariante: OK
- Duracion: 798ms
- Latencia: p50=521ms, p95=789ms, p99=794ms, max=794ms
- Detalle: `{"productId":"65de691e-2e41-4841-81e3-8e996f402e45","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":10}`

### C7 reservas mismo slot iter 10/100

- Invariante: OK
- Duracion: 212ms
- Latencia: p50=134ms, p95=207ms, p99=210ms, max=210ms
- Detalle: `{"fecha":"2222-10-21","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":10}`

### C5 pago duplicado concurrente iter 11/100

- Invariante: OK
- Duracion: 479ms
- Latencia: p50=301ms, p95=457ms, p99=476ms, max=476ms
- Detalle: `{"cuentaId":"b525a1f4-b856-4cba-a65c-a45b5586f6f4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":11}`

### C6 stock compartido iter 11/100

- Invariante: OK
- Duracion: 760ms
- Latencia: p50=501ms, p95=741ms, p99=757ms, max=757ms
- Detalle: `{"productId":"c60e94bc-56df-48ad-aed6-1fcbb75885dd","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":11}`

### C7 reservas mismo slot iter 11/100

- Invariante: OK
- Duracion: 218ms
- Latencia: p50=144ms, p95=211ms, p99=215ms, max=215ms
- Detalle: `{"fecha":"2222-10-22","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":11}`

### C5 pago duplicado concurrente iter 12/100

- Invariante: OK
- Duracion: 484ms
- Latencia: p50=292ms, p95=468ms, p99=482ms, max=482ms
- Detalle: `{"cuentaId":"c38785ed-96c6-4e47-b691-7a00b775eedd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":12}`

### C6 stock compartido iter 12/100

- Invariante: OK
- Duracion: 707ms
- Latencia: p50=459ms, p95=691ms, p99=699ms, max=699ms
- Detalle: `{"productId":"185e54b7-6703-403c-acc1-885c2d2d1e38","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":12}`

### C7 reservas mismo slot iter 12/100

- Invariante: OK
- Duracion: 214ms
- Latencia: p50=141ms, p95=208ms, p99=211ms, max=211ms
- Detalle: `{"fecha":"2222-10-23","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":12}`

### C5 pago duplicado concurrente iter 13/100

- Invariante: OK
- Duracion: 540ms
- Latencia: p50=325ms, p95=521ms, p99=538ms, max=538ms
- Detalle: `{"cuentaId":"823dcd21-1a8e-4302-b00a-e19805eb7d2a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":13}`

### C6 stock compartido iter 13/100

- Invariante: OK
- Duracion: 60019ms
- Latencia: p50=473ms, p95=60015ms, p99=60016ms, max=60016ms
- Detalle: `{"productId":"77e36f68-95ce-41c3-a581-4eb137c2d549","stockInicial":50,"attempts":60,"successfulPedidos":48,"effectiveSuccessfulPedidos":50,"rejectedPedidos":0,"clientTimeouts":12,"stockActual":0,"statuses":{"0":12,"201":48},"iteration":13}`

### C7 reservas mismo slot iter 13/100

- Invariante: OK
- Duracion: 262ms
- Latencia: p50=191ms, p95=256ms, p99=259ms, max=259ms
- Detalle: `{"fecha":"2222-10-24","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":13}`

### C5 pago duplicado concurrente iter 14/100

- Invariante: OK
- Duracion: 536ms
- Latencia: p50=320ms, p95=516ms, p99=531ms, max=531ms
- Detalle: `{"cuentaId":"4e7e9744-1fa2-4ec7-b439-1ca39f9109ae","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":14}`

### C6 stock compartido iter 14/100

- Invariante: OK
- Duracion: 809ms
- Latencia: p50=531ms, p95=798ms, p99=804ms, max=804ms
- Detalle: `{"productId":"d09ba79c-1588-4935-bd13-520e871c61a2","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":14}`

### C7 reservas mismo slot iter 14/100

- Invariante: OK
- Duracion: 286ms
- Latencia: p50=189ms, p95=277ms, p99=282ms, max=282ms
- Detalle: `{"fecha":"2222-10-25","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":14}`

### C5 pago duplicado concurrente iter 15/100

- Invariante: OK
- Duracion: 588ms
- Latencia: p50=403ms, p95=571ms, p99=585ms, max=585ms
- Detalle: `{"cuentaId":"f39fce0f-fc0f-48da-add5-33736d81cf14","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":15}`

### C6 stock compartido iter 15/100

- Invariante: OK
- Duracion: 702ms
- Latencia: p50=464ms, p95=688ms, p99=699ms, max=699ms
- Detalle: `{"productId":"5c392d41-96ae-419a-9f20-9399bb83c894","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":15}`

### C7 reservas mismo slot iter 15/100

- Invariante: OK
- Duracion: 290ms
- Latencia: p50=188ms, p95=283ms, p99=287ms, max=287ms
- Detalle: `{"fecha":"2222-10-26","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":15}`

### C5 pago duplicado concurrente iter 16/100

- Invariante: OK
- Duracion: 559ms
- Latencia: p50=339ms, p95=539ms, p99=556ms, max=556ms
- Detalle: `{"cuentaId":"2f399185-7552-433f-a9fb-e11ba33d9c4c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":16}`

### C6 stock compartido iter 16/100

- Invariante: OK
- Duracion: 788ms
- Latencia: p50=525ms, p95=772ms, p99=784ms, max=784ms
- Detalle: `{"productId":"49da78a3-6b2c-4364-9d28-6953002238c9","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":16}`

### C7 reservas mismo slot iter 16/100

- Invariante: OK
- Duracion: 288ms
- Latencia: p50=208ms, p95=281ms, p99=281ms, max=281ms
- Detalle: `{"fecha":"2222-10-27","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":16}`

### C5 pago duplicado concurrente iter 17/100

- Invariante: OK
- Duracion: 573ms
- Latencia: p50=324ms, p95=552ms, p99=570ms, max=570ms
- Detalle: `{"cuentaId":"46ce8e12-75e3-44c4-bc8b-a54ae54d3669","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":17}`

### C6 stock compartido iter 17/100

- Invariante: OK
- Duracion: 841ms
- Latencia: p50=536ms, p95=828ms, p99=838ms, max=838ms
- Detalle: `{"productId":"b259fde5-85a5-44ac-b201-9ba3ece8144c","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":17}`

### C7 reservas mismo slot iter 17/100

- Invariante: OK
- Duracion: 332ms
- Latencia: p50=243ms, p95=320ms, p99=328ms, max=328ms
- Detalle: `{"fecha":"2222-10-28","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":17}`

### C5 pago duplicado concurrente iter 18/100

- Invariante: OK
- Duracion: 646ms
- Latencia: p50=400ms, p95=619ms, p99=644ms, max=644ms
- Detalle: `{"cuentaId":"cec3c60f-494b-4701-b648-bdcefa029a21","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":18}`

### C6 stock compartido iter 18/100

- Invariante: OK
- Duracion: 769ms
- Latencia: p50=512ms, p95=757ms, p99=763ms, max=763ms
- Detalle: `{"productId":"affc4d20-1ba0-4052-a754-dc47d44007aa","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":18}`

### C7 reservas mismo slot iter 18/100

- Invariante: OK
- Duracion: 227ms
- Latencia: p50=148ms, p95=218ms, p99=225ms, max=225ms
- Detalle: `{"fecha":"2222-10-29","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":18}`

### C5 pago duplicado concurrente iter 19/100

- Invariante: OK
- Duracion: 520ms
- Latencia: p50=336ms, p95=503ms, p99=518ms, max=518ms
- Detalle: `{"cuentaId":"ec9987b4-8639-419e-b43b-ce208c558206","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":19}`

### C6 stock compartido iter 19/100

- Invariante: OK
- Duracion: 757ms
- Latencia: p50=508ms, p95=746ms, p99=754ms, max=754ms
- Detalle: `{"productId":"fd175ae4-f8fe-4823-92c5-ce0621b755e8","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":19}`

### C7 reservas mismo slot iter 19/100

- Invariante: OK
- Duracion: 204ms
- Latencia: p50=123ms, p95=195ms, p99=202ms, max=202ms
- Detalle: `{"fecha":"2222-10-30","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":19}`

### C5 pago duplicado concurrente iter 20/100

- Invariante: OK
- Duracion: 484ms
- Latencia: p50=289ms, p95=466ms, p99=482ms, max=482ms
- Detalle: `{"cuentaId":"99b51216-ce19-4076-a99b-fbe7da6ad85e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":20}`

### C6 stock compartido iter 20/100

- Invariante: OK
- Duracion: 682ms
- Latencia: p50=446ms, p95=670ms, p99=675ms, max=675ms
- Detalle: `{"productId":"c5889a1a-de38-4e27-b654-24a43f529e44","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":20}`

### C7 reservas mismo slot iter 20/100

- Invariante: OK
- Duracion: 256ms
- Latencia: p50=186ms, p95=250ms, p99=253ms, max=253ms
- Detalle: `{"fecha":"2222-10-31","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":20}`

### C5 pago duplicado concurrente iter 21/100

- Invariante: OK
- Duracion: 548ms
- Latencia: p50=339ms, p95=522ms, p99=546ms, max=546ms
- Detalle: `{"cuentaId":"f2f2f363-475d-4d70-91fa-20877e003a40","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":21}`

### C6 stock compartido iter 21/100

- Invariante: OK
- Duracion: 709ms
- Latencia: p50=475ms, p95=697ms, p99=708ms, max=708ms
- Detalle: `{"productId":"f782c440-933a-4f67-af36-dee82ee6bb89","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":21}`

### C7 reservas mismo slot iter 21/100

- Invariante: OK
- Duracion: 204ms
- Latencia: p50=131ms, p95=198ms, p99=202ms, max=202ms
- Detalle: `{"fecha":"2222-11-01","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":21}`

### C5 pago duplicado concurrente iter 22/100

- Invariante: OK
- Duracion: 565ms
- Latencia: p50=334ms, p95=542ms, p99=562ms, max=562ms
- Detalle: `{"cuentaId":"1706c57f-bfac-490b-bcab-51ae821f8c89","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":22}`

### C6 stock compartido iter 22/100

- Invariante: OK
- Duracion: 35640ms
- Latencia: p50=456ms, p95=692ms, p99=35639ms, max=35639ms
- Detalle: `{"productId":"1c9e1565-28b3-439d-a53a-16b2928b03c1","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":22}`

### C7 reservas mismo slot iter 22/100

- Invariante: OK
- Duracion: 191ms
- Latencia: p50=125ms, p95=184ms, p99=188ms, max=188ms
- Detalle: `{"fecha":"2222-11-02","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":22}`

### C5 pago duplicado concurrente iter 23/100

- Invariante: OK
- Duracion: 564ms
- Latencia: p50=361ms, p95=545ms, p99=561ms, max=561ms
- Detalle: `{"cuentaId":"2130c4bf-97fc-472d-a950-64e08802935a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":23}`

### C6 stock compartido iter 23/100

- Invariante: OK
- Duracion: 866ms
- Latencia: p50=561ms, p95=855ms, p99=863ms, max=863ms
- Detalle: `{"productId":"e57d54f4-1b68-4664-a488-bfb066779d21","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":23}`

### C7 reservas mismo slot iter 23/100

- Invariante: OK
- Duracion: 199ms
- Latencia: p50=127ms, p95=193ms, p99=196ms, max=196ms
- Detalle: `{"fecha":"2222-11-03","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":23}`

### C5 pago duplicado concurrente iter 24/100

- Invariante: OK
- Duracion: 486ms
- Latencia: p50=299ms, p95=467ms, p99=483ms, max=483ms
- Detalle: `{"cuentaId":"6ef2f609-334d-4f79-a692-12023bb06eaf","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":24}`

### C6 stock compartido iter 24/100

- Invariante: OK
- Duracion: 698ms
- Latencia: p50=444ms, p95=688ms, p99=694ms, max=694ms
- Detalle: `{"productId":"261843a8-5d6c-4010-b930-02effaa5d2e8","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":24}`

### C7 reservas mismo slot iter 24/100

- Invariante: OK
- Duracion: 297ms
- Latencia: p50=191ms, p95=290ms, p99=294ms, max=294ms
- Detalle: `{"fecha":"2222-11-04","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":24}`

### C5 pago duplicado concurrente iter 25/100

- Invariante: OK
- Duracion: 577ms
- Latencia: p50=356ms, p95=551ms, p99=574ms, max=574ms
- Detalle: `{"cuentaId":"b3b2f649-d358-457e-aef8-26b2143280dd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":25}`

### C6 stock compartido iter 25/100

- Invariante: OK
- Duracion: 697ms
- Latencia: p50=467ms, p95=689ms, p99=696ms, max=696ms
- Detalle: `{"productId":"5f84d6c9-24f1-492d-8e54-86e9f353db75","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":25}`

### C7 reservas mismo slot iter 25/100

- Invariante: OK
- Duracion: 219ms
- Latencia: p50=152ms, p95=214ms, p99=216ms, max=216ms
- Detalle: `{"fecha":"2222-11-05","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":25}`

### C5 pago duplicado concurrente iter 26/100

- Invariante: OK
- Duracion: 532ms
- Latencia: p50=349ms, p95=513ms, p99=531ms, max=531ms
- Detalle: `{"cuentaId":"df0c20c2-6c52-4d44-9f04-97cb0e855f1d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":26}`

### C6 stock compartido iter 26/100

- Invariante: OK
- Duracion: 35666ms
- Latencia: p50=442ms, p95=35661ms, p99=35663ms, max=35663ms
- Detalle: `{"productId":"13434b2a-d88d-4909-8fc4-f2ef7ce72b4a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":26}`

### C7 reservas mismo slot iter 26/100

- Invariante: OK
- Duracion: 294ms
- Latencia: p50=183ms, p95=288ms, p99=291ms, max=291ms
- Detalle: `{"fecha":"2222-11-06","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":26}`

### C5 pago duplicado concurrente iter 27/100

- Invariante: OK
- Duracion: 546ms
- Latencia: p50=303ms, p95=524ms, p99=542ms, max=542ms
- Detalle: `{"cuentaId":"d926fa1a-6e92-4e97-80db-d3359ff40917","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":27}`

### C6 stock compartido iter 27/100

- Invariante: OK
- Duracion: 850ms
- Latencia: p50=568ms, p95=837ms, p99=846ms, max=846ms
- Detalle: `{"productId":"0b841db9-64d4-43d1-8cdd-2449dc784827","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":27}`

### C7 reservas mismo slot iter 27/100

- Invariante: OK
- Duracion: 226ms
- Latencia: p50=152ms, p95=219ms, p99=224ms, max=224ms
- Detalle: `{"fecha":"2222-11-07","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":27}`

### C5 pago duplicado concurrente iter 28/100

- Invariante: OK
- Duracion: 623ms
- Latencia: p50=406ms, p95=604ms, p99=619ms, max=619ms
- Detalle: `{"cuentaId":"9128a9b9-11ec-4592-8b15-6b5204ba3519","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":28}`

### C6 stock compartido iter 28/100

- Invariante: OK
- Duracion: 717ms
- Latencia: p50=477ms, p95=709ms, p99=713ms, max=713ms
- Detalle: `{"productId":"1b53988a-7181-4618-b4a1-b7c847aa9907","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":28}`

### C7 reservas mismo slot iter 28/100

- Invariante: OK
- Duracion: 202ms
- Latencia: p50=144ms, p95=193ms, p99=200ms, max=200ms
- Detalle: `{"fecha":"2222-11-08","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":28}`

### C5 pago duplicado concurrente iter 29/100

- Invariante: OK
- Duracion: 602ms
- Latencia: p50=401ms, p95=579ms, p99=598ms, max=598ms
- Detalle: `{"cuentaId":"85b5c18a-ad36-453a-9f4e-281ba38f4c7e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":29}`

### C6 stock compartido iter 29/100

- Invariante: OK
- Duracion: 827ms
- Latencia: p50=534ms, p95=812ms, p99=822ms, max=822ms
- Detalle: `{"productId":"c3345bd0-0d32-45c6-99bb-bf7b8fc17fee","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":29}`

### C7 reservas mismo slot iter 29/100

- Invariante: OK
- Duracion: 248ms
- Latencia: p50=149ms, p95=243ms, p99=246ms, max=246ms
- Detalle: `{"fecha":"2222-11-09","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":29}`

### C5 pago duplicado concurrente iter 30/100

- Invariante: OK
- Duracion: 591ms
- Latencia: p50=332ms, p95=568ms, p99=588ms, max=588ms
- Detalle: `{"cuentaId":"01faf1b1-820b-4321-98be-ce32df7982db","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":30}`

### C6 stock compartido iter 30/100

- Invariante: OK
- Duracion: 843ms
- Latencia: p50=573ms, p95=823ms, p99=837ms, max=837ms
- Detalle: `{"productId":"2b0b0ee0-d235-4243-9a6e-ca4c4fb2a770","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":30}`

### C7 reservas mismo slot iter 30/100

- Invariante: OK
- Duracion: 60007ms
- Latencia: p50=133ms, p95=60004ms, p99=60004ms, max=60004ms
- Detalle: `{"fecha":"2222-11-10","hora":"18:15","successCount":1,"conflictCount":37,"clientTimeouts":12,"activeReservationsForSlot":1,"iteration":30}`

### C5 pago duplicado concurrente iter 31/100

- Invariante: OK
- Duracion: 580ms
- Latencia: p50=367ms, p95=557ms, p99=577ms, max=577ms
- Detalle: `{"cuentaId":"1a15a282-6c95-47bb-8bfd-4b338511cb6d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":31}`

### C6 stock compartido iter 31/100

- Invariante: OK
- Duracion: 808ms
- Latencia: p50=533ms, p95=794ms, p99=806ms, max=806ms
- Detalle: `{"productId":"9c140f7b-ae7c-402f-b76e-b676dc29c092","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":31}`

### C7 reservas mismo slot iter 31/100

- Invariante: OK
- Duracion: 234ms
- Latencia: p50=151ms, p95=227ms, p99=231ms, max=231ms
- Detalle: `{"fecha":"2222-11-11","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":31}`

### C5 pago duplicado concurrente iter 32/100

- Invariante: OK
- Duracion: 789ms
- Latencia: p50=480ms, p95=765ms, p99=786ms, max=786ms
- Detalle: `{"cuentaId":"b7318442-88cf-44cc-a2ef-d94a23097906","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":32}`

### C6 stock compartido iter 32/100

- Invariante: OK
- Duracion: 60004ms
- Latencia: p50=529ms, p95=60002ms, p99=60003ms, max=60003ms
- Detalle: `{"productId":"65d9038a-cbd1-4695-b4a3-7dc5b32d967a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":6,"clientTimeouts":4,"stockActual":0,"statuses":{"0":4,"201":50,"400":6},"iteration":32}`

### C7 reservas mismo slot iter 32/100

- Invariante: OK
- Duracion: 262ms
- Latencia: p50=181ms, p95=254ms, p99=259ms, max=259ms
- Detalle: `{"fecha":"2222-11-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":32}`

### C5 pago duplicado concurrente iter 33/100

- Invariante: OK
- Duracion: 640ms
- Latencia: p50=428ms, p95=622ms, p99=637ms, max=637ms
- Detalle: `{"cuentaId":"4b58f3c5-98e0-4472-a097-12a7e01142b0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":33}`

### C6 stock compartido iter 33/100

- Invariante: OK
- Duracion: 853ms
- Latencia: p50=557ms, p95=821ms, p99=841ms, max=841ms
- Detalle: `{"productId":"f782e993-eadb-47dd-b145-c49c9ecc6ac8","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":33}`

### C7 reservas mismo slot iter 33/100

- Invariante: OK
- Duracion: 360ms
- Latencia: p50=214ms, p95=351ms, p99=357ms, max=357ms
- Detalle: `{"fecha":"2222-11-13","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":33}`

### C5 pago duplicado concurrente iter 34/100

- Invariante: OK
- Duracion: 686ms
- Latencia: p50=389ms, p95=656ms, p99=683ms, max=683ms
- Detalle: `{"cuentaId":"37ce2495-b516-4582-809e-4d0e2005c0c4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":34}`

### C6 stock compartido iter 34/100

- Invariante: OK
- Duracion: 813ms
- Latencia: p50=544ms, p95=782ms, p99=803ms, max=803ms
- Detalle: `{"productId":"8c3c3d00-1029-4eab-928b-bd163c4cb96a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":34}`

### C7 reservas mismo slot iter 34/100

- Invariante: OK
- Duracion: 295ms
- Latencia: p50=184ms, p95=286ms, p99=292ms, max=292ms
- Detalle: `{"fecha":"2222-11-14","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":34}`

### C5 pago duplicado concurrente iter 35/100

- Invariante: OK
- Duracion: 653ms
- Latencia: p50=405ms, p95=631ms, p99=650ms, max=650ms
- Detalle: `{"cuentaId":"25deff17-1d33-449a-b067-97ef1dd0c100","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":35}`

### C6 stock compartido iter 35/100

- Invariante: OK
- Duracion: 35674ms
- Latencia: p50=462ms, p95=35672ms, p99=35674ms, max=35674ms
- Detalle: `{"productId":"000d13cc-1e3e-47ab-807c-d72b94c93a7d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":35}`

### C7 reservas mismo slot iter 35/100

- Invariante: OK
- Duracion: 327ms
- Latencia: p50=228ms, p95=314ms, p99=325ms, max=325ms
- Detalle: `{"fecha":"2222-11-15","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":35}`

### C5 pago duplicado concurrente iter 36/100

- Invariante: OK
- Duracion: 538ms
- Latencia: p50=356ms, p95=521ms, p99=534ms, max=534ms
- Detalle: `{"cuentaId":"a5c4f9b8-94ae-4bdf-8c55-fc7efb01be00","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":36}`

### C6 stock compartido iter 36/100

- Invariante: OK
- Duracion: 716ms
- Latencia: p50=473ms, p95=706ms, p99=714ms, max=714ms
- Detalle: `{"productId":"ccb7fb1b-2326-4016-a7f8-f7e834254ba9","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":36}`

### C7 reservas mismo slot iter 36/100

- Invariante: OK
- Duracion: 294ms
- Latencia: p50=207ms, p95=286ms, p99=289ms, max=289ms
- Detalle: `{"fecha":"2222-11-16","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":36}`

### C5 pago duplicado concurrente iter 37/100

- Invariante: OK
- Duracion: 554ms
- Latencia: p50=358ms, p95=536ms, p99=551ms, max=551ms
- Detalle: `{"cuentaId":"56b8c6b3-6144-4ef1-af68-499fc48c58d8","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":37}`

### C6 stock compartido iter 37/100

- Invariante: OK
- Duracion: 724ms
- Latencia: p50=470ms, p95=712ms, p99=716ms, max=716ms
- Detalle: `{"productId":"ff4be235-5391-4c78-a0e9-e638cf28c23f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":37}`

### C7 reservas mismo slot iter 37/100

- Invariante: OK
- Duracion: 257ms
- Latencia: p50=157ms, p95=251ms, p99=254ms, max=254ms
- Detalle: `{"fecha":"2222-11-17","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":37}`

### C5 pago duplicado concurrente iter 38/100

- Invariante: OK
- Duracion: 499ms
- Latencia: p50=302ms, p95=477ms, p99=496ms, max=496ms
- Detalle: `{"cuentaId":"ddc91e5c-7d70-48c6-b063-ec27c879054e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":38}`

### C6 stock compartido iter 38/100

- Invariante: OK
- Duracion: 773ms
- Latencia: p50=502ms, p95=756ms, p99=769ms, max=769ms
- Detalle: `{"productId":"cb4cc589-e948-47ef-8dd6-0e4825f278e2","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":38}`

### C7 reservas mismo slot iter 38/100

- Invariante: OK
- Duracion: 260ms
- Latencia: p50=182ms, p95=242ms, p99=257ms, max=257ms
- Detalle: `{"fecha":"2222-11-18","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":38}`

### C5 pago duplicado concurrente iter 39/100

- Invariante: OK
- Duracion: 544ms
- Latencia: p50=340ms, p95=524ms, p99=541ms, max=541ms
- Detalle: `{"cuentaId":"0e37e268-cf47-41e5-a88a-9045551bfac7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":39}`

### C6 stock compartido iter 39/100

- Invariante: OK
- Duracion: 740ms
- Latencia: p50=467ms, p95=728ms, p99=736ms, max=736ms
- Detalle: `{"productId":"6ca24264-5a01-4aee-b4c4-f547e68a8b3d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":39}`

### C7 reservas mismo slot iter 39/100

- Invariante: OK
- Duracion: 216ms
- Latencia: p50=139ms, p95=206ms, p99=211ms, max=211ms
- Detalle: `{"fecha":"2222-11-19","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":39}`

### C5 pago duplicado concurrente iter 40/100

- Invariante: OK
- Duracion: 542ms
- Latencia: p50=356ms, p95=525ms, p99=539ms, max=539ms
- Detalle: `{"cuentaId":"20f65c6d-8b10-4b23-b1d5-fc65732dc068","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":40}`

### C6 stock compartido iter 40/100

- Invariante: OK
- Duracion: 715ms
- Latencia: p50=453ms, p95=704ms, p99=714ms, max=714ms
- Detalle: `{"productId":"d3b8ce63-f780-43be-aafb-2ac4f499d3fb","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":40}`

### C7 reservas mismo slot iter 40/100

- Invariante: OK
- Duracion: 305ms
- Latencia: p50=171ms, p95=297ms, p99=302ms, max=302ms
- Detalle: `{"fecha":"2222-11-20","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":40}`

### C5 pago duplicado concurrente iter 41/100

- Invariante: OK
- Duracion: 11414ms
- Latencia: p50=356ms, p95=11394ms, p99=11408ms, max=11408ms
- Detalle: `{"cuentaId":"34ae4947-e1a0-40ba-becf-d4d5e2eba826","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":41}`

### C6 stock compartido iter 41/100

- Invariante: OK
- Duracion: 727ms
- Latencia: p50=482ms, p95=714ms, p99=722ms, max=722ms
- Detalle: `{"productId":"26aa5d10-f3d6-4bab-a801-b7c86d9456c4","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":41}`

### C7 reservas mismo slot iter 41/100

- Invariante: OK
- Duracion: 207ms
- Latencia: p50=129ms, p95=198ms, p99=204ms, max=204ms
- Detalle: `{"fecha":"2222-11-21","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":41}`

### C5 pago duplicado concurrente iter 42/100

- Invariante: OK
- Duracion: 523ms
- Latencia: p50=334ms, p95=506ms, p99=519ms, max=519ms
- Detalle: `{"cuentaId":"53b874bd-31e3-44ff-994d-38df62723584","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":42}`

### C6 stock compartido iter 42/100

- Invariante: OK
- Duracion: 690ms
- Latencia: p50=463ms, p95=653ms, p99=684ms, max=684ms
- Detalle: `{"productId":"ea541de0-0b97-4722-b1d0-c001da7c4c92","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":42}`

### C7 reservas mismo slot iter 42/100

- Invariante: OK
- Duracion: 197ms
- Latencia: p50=126ms, p95=193ms, p99=195ms, max=195ms
- Detalle: `{"fecha":"2222-11-22","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":42}`

### C5 pago duplicado concurrente iter 43/100

- Invariante: OK
- Duracion: 516ms
- Latencia: p50=285ms, p95=494ms, p99=513ms, max=513ms
- Detalle: `{"cuentaId":"2d2e1525-fce8-4f82-b93f-a623a3c25412","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":43}`

### C6 stock compartido iter 43/100

- Invariante: OK
- Duracion: 674ms
- Latencia: p50=427ms, p95=664ms, p99=669ms, max=669ms
- Detalle: `{"productId":"95f037f1-57f7-4861-8f35-ced056218b0f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":43}`

### C7 reservas mismo slot iter 43/100

- Invariante: OK
- Duracion: 169ms
- Latencia: p50=113ms, p95=164ms, p99=167ms, max=167ms
- Detalle: `{"fecha":"2222-11-23","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":43}`

### C5 pago duplicado concurrente iter 44/100

- Invariante: OK
- Duracion: 604ms
- Latencia: p50=412ms, p95=587ms, p99=602ms, max=602ms
- Detalle: `{"cuentaId":"15f3b210-983f-4216-adbc-f20898035fff","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":44}`

### C6 stock compartido iter 44/100

- Invariante: OK
- Duracion: 657ms
- Latencia: p50=429ms, p95=621ms, p99=648ms, max=648ms
- Detalle: `{"productId":"bb35fcc8-0f8c-433a-88af-b90e07486912","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":44}`

### C7 reservas mismo slot iter 44/100

- Invariante: OK
- Duracion: 197ms
- Latencia: p50=128ms, p95=191ms, p99=195ms, max=195ms
- Detalle: `{"fecha":"2222-11-24","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":44}`

### C5 pago duplicado concurrente iter 45/100

- Invariante: OK
- Duracion: 551ms
- Latencia: p50=356ms, p95=534ms, p99=547ms, max=547ms
- Detalle: `{"cuentaId":"50cb1bc3-cd21-4b6d-b06a-212ee8e575b4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":45}`

### C6 stock compartido iter 45/100

- Invariante: OK
- Duracion: 690ms
- Latencia: p50=458ms, p95=679ms, p99=684ms, max=684ms
- Detalle: `{"productId":"62c6344f-228b-4f96-8f2a-1a75b85a1453","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":45}`

### C7 reservas mismo slot iter 45/100

- Invariante: OK
- Duracion: 248ms
- Latencia: p50=143ms, p95=238ms, p99=245ms, max=245ms
- Detalle: `{"fecha":"2222-11-25","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":45}`

### C5 pago duplicado concurrente iter 46/100

- Invariante: OK
- Duracion: 479ms
- Latencia: p50=303ms, p95=463ms, p99=477ms, max=477ms
- Detalle: `{"cuentaId":"6b3e4204-3dd0-44d5-b8d7-624ef0f53c82","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":46}`

### C6 stock compartido iter 46/100

- Invariante: OK
- Duracion: 633ms
- Latencia: p50=411ms, p95=624ms, p99=629ms, max=629ms
- Detalle: `{"productId":"26658583-e8bc-4124-b984-32b50b10b22f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":46}`

### C7 reservas mismo slot iter 46/100

- Invariante: OK
- Duracion: 221ms
- Latencia: p50=150ms, p95=216ms, p99=218ms, max=218ms
- Detalle: `{"fecha":"2222-11-26","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":46}`

### C5 pago duplicado concurrente iter 47/100

- Invariante: OK
- Duracion: 524ms
- Latencia: p50=337ms, p95=507ms, p99=522ms, max=522ms
- Detalle: `{"cuentaId":"efeb8851-c67e-49d0-9347-cb06d1ee1c4e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":47}`

### C6 stock compartido iter 47/100

- Invariante: OK
- Duracion: 625ms
- Latencia: p50=403ms, p95=607ms, p99=620ms, max=620ms
- Detalle: `{"productId":"07f47775-2ce4-4891-9972-218847aa01e5","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":47}`

### C7 reservas mismo slot iter 47/100

- Invariante: OK
- Duracion: 11465ms
- Latencia: p50=161ms, p95=11446ms, p99=11463ms, max=11463ms
- Detalle: `{"fecha":"2222-11-27","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":47}`

### C5 pago duplicado concurrente iter 48/100

- Invariante: OK
- Duracion: 635ms
- Latencia: p50=426ms, p95=610ms, p99=632ms, max=632ms
- Detalle: `{"cuentaId":"4246de03-ad54-4e2e-a5f8-2e44336afb5c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":48}`

### C6 stock compartido iter 48/100

- Invariante: OK
- Duracion: 728ms
- Latencia: p50=477ms, p95=720ms, p99=723ms, max=723ms
- Detalle: `{"productId":"1e55c900-3f35-4598-aa63-90c7af89c33e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":48}`

### C7 reservas mismo slot iter 48/100

- Invariante: OK
- Duracion: 258ms
- Latencia: p50=157ms, p95=254ms, p99=257ms, max=257ms
- Detalle: `{"fecha":"2222-11-28","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":48}`

### C5 pago duplicado concurrente iter 49/100

- Invariante: OK
- Duracion: 606ms
- Latencia: p50=390ms, p95=587ms, p99=603ms, max=603ms
- Detalle: `{"cuentaId":"bdd19202-6dc6-4561-b4d1-87b6826d9f93","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":49}`

### C6 stock compartido iter 49/100

- Invariante: OK
- Duracion: 656ms
- Latencia: p50=427ms, p95=650ms, p99=653ms, max=653ms
- Detalle: `{"productId":"ead5693a-222e-4367-8709-e43ef36a1c6f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":49}`

### C7 reservas mismo slot iter 49/100

- Invariante: OK
- Duracion: 200ms
- Latencia: p50=128ms, p95=193ms, p99=197ms, max=197ms
- Detalle: `{"fecha":"2222-11-29","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":49}`

### C5 pago duplicado concurrente iter 50/100

- Invariante: OK
- Duracion: 452ms
- Latencia: p50=274ms, p95=435ms, p99=450ms, max=450ms
- Detalle: `{"cuentaId":"dcb2db4a-c9ed-4741-8c83-3427e882a9d6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":50}`

### C6 stock compartido iter 50/100

- Invariante: OK
- Duracion: 712ms
- Latencia: p50=449ms, p95=704ms, p99=709ms, max=709ms
- Detalle: `{"productId":"371f2220-e84e-4e08-9429-df990867edab","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":50}`

### C7 reservas mismo slot iter 50/100

- Invariante: OK
- Duracion: 238ms
- Latencia: p50=161ms, p95=232ms, p99=236ms, max=236ms
- Detalle: `{"fecha":"2222-11-30","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":50}`

### C5 pago duplicado concurrente iter 51/100

- Invariante: OK
- Duracion: 564ms
- Latencia: p50=353ms, p95=546ms, p99=561ms, max=561ms
- Detalle: `{"cuentaId":"b85ebfd8-7b88-4396-bc0e-761dbb0e8a8b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":51}`

### C6 stock compartido iter 51/100

- Invariante: OK
- Duracion: 765ms
- Latencia: p50=518ms, p95=751ms, p99=755ms, max=755ms
- Detalle: `{"productId":"fb5ff9a4-2c30-491a-98ab-b0723c0ede62","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":51}`

### C7 reservas mismo slot iter 51/100

- Invariante: OK
- Duracion: 249ms
- Latencia: p50=168ms, p95=243ms, p99=247ms, max=247ms
- Detalle: `{"fecha":"2222-12-01","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":51}`

### C5 pago duplicado concurrente iter 52/100

- Invariante: OK
- Duracion: 510ms
- Latencia: p50=327ms, p95=490ms, p99=508ms, max=508ms
- Detalle: `{"cuentaId":"1749a892-52dd-4aec-ad83-7e0060794690","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":52}`

### C6 stock compartido iter 52/100

- Invariante: OK
- Duracion: 660ms
- Latencia: p50=432ms, p95=642ms, p99=655ms, max=655ms
- Detalle: `{"productId":"e0d2cf9e-d71e-4d1e-a336-1a751a07d409","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":52}`

### C7 reservas mismo slot iter 52/100

- Invariante: OK
- Duracion: 216ms
- Latencia: p50=139ms, p95=208ms, p99=214ms, max=214ms
- Detalle: `{"fecha":"2222-12-02","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":52}`

### C5 pago duplicado concurrente iter 53/100

- Invariante: OK
- Duracion: 612ms
- Latencia: p50=377ms, p95=594ms, p99=609ms, max=609ms
- Detalle: `{"cuentaId":"48ec3ebe-2371-4798-9d69-48efaa4233cc","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":53}`

### C6 stock compartido iter 53/100

- Invariante: OK
- Duracion: 725ms
- Latencia: p50=481ms, p95=713ms, p99=722ms, max=722ms
- Detalle: `{"productId":"cc8d72b4-d53d-4d4c-baa6-7e0ae82e8228","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":53}`

### C7 reservas mismo slot iter 53/100

- Invariante: OK
- Duracion: 206ms
- Latencia: p50=136ms, p95=198ms, p99=203ms, max=203ms
- Detalle: `{"fecha":"2222-12-03","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":53}`

### C5 pago duplicado concurrente iter 54/100

- Invariante: OK
- Duracion: 473ms
- Latencia: p50=283ms, p95=456ms, p99=470ms, max=470ms
- Detalle: `{"cuentaId":"754d3562-0c5a-44d0-bfa3-0fa7e347d586","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":54}`

### C6 stock compartido iter 54/100

- Invariante: OK
- Duracion: 632ms
- Latencia: p50=411ms, p95=626ms, p99=628ms, max=628ms
- Detalle: `{"productId":"f38baa6d-6671-43a7-8c67-23d53f0e81b4","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":54}`

### C7 reservas mismo slot iter 54/100

- Invariante: OK
- Duracion: 216ms
- Latencia: p50=135ms, p95=209ms, p99=213ms, max=213ms
- Detalle: `{"fecha":"2222-12-04","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":54}`

### C5 pago duplicado concurrente iter 55/100

- Invariante: OK
- Duracion: 524ms
- Latencia: p50=342ms, p95=508ms, p99=521ms, max=521ms
- Detalle: `{"cuentaId":"dbb88cc0-eb13-40df-a713-90be6bea7309","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":55}`

### C6 stock compartido iter 55/100

- Invariante: OK
- Duracion: 736ms
- Latencia: p50=471ms, p95=720ms, p99=726ms, max=726ms
- Detalle: `{"productId":"0ad345e2-9dca-471c-8bdd-7dd7e740559d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":55}`

### C7 reservas mismo slot iter 55/100

- Invariante: OK
- Duracion: 186ms
- Latencia: p50=124ms, p95=181ms, p99=184ms, max=184ms
- Detalle: `{"fecha":"2222-12-05","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":55}`

### C5 pago duplicado concurrente iter 56/100

- Invariante: OK
- Duracion: 560ms
- Latencia: p50=342ms, p95=541ms, p99=558ms, max=558ms
- Detalle: `{"cuentaId":"5366bccd-aa22-44c1-870c-a7e020decfea","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":56}`

### C6 stock compartido iter 56/100

- Invariante: OK
- Duracion: 673ms
- Latencia: p50=430ms, p95=639ms, p99=670ms, max=670ms
- Detalle: `{"productId":"7a5de58d-9c33-42da-a8d2-6fc493fcd54d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":56}`

### C7 reservas mismo slot iter 56/100

- Invariante: OK
- Duracion: 234ms
- Latencia: p50=161ms, p95=223ms, p99=229ms, max=229ms
- Detalle: `{"fecha":"2222-12-06","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":56}`

### C5 pago duplicado concurrente iter 57/100

- Invariante: OK
- Duracion: 600ms
- Latencia: p50=321ms, p95=567ms, p99=596ms, max=596ms
- Detalle: `{"cuentaId":"06ab77b7-6f91-460a-9d35-a0b1fc7b18c6","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":57}`

### C6 stock compartido iter 57/100

- Invariante: OK
- Duracion: 19535ms
- Latencia: p50=474ms, p95=19521ms, p99=19533ms, max=19533ms
- Detalle: `{"productId":"35ecd2e5-0eb6-4c9e-842a-28b9490f612e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":57}`

### C7 reservas mismo slot iter 57/100

- Invariante: OK
- Duracion: 197ms
- Latencia: p50=115ms, p95=190ms, p99=195ms, max=195ms
- Detalle: `{"fecha":"2222-12-07","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":57}`

### C5 pago duplicado concurrente iter 58/100

- Invariante: OK
- Duracion: 537ms
- Latencia: p50=351ms, p95=520ms, p99=534ms, max=534ms
- Detalle: `{"cuentaId":"82fd99a7-54f2-4529-8eff-d2bf1b650e6d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":58}`

### C6 stock compartido iter 58/100

- Invariante: OK
- Duracion: 723ms
- Latencia: p50=473ms, p95=713ms, p99=718ms, max=718ms
- Detalle: `{"productId":"ed96aaca-d4f9-4aaa-b6ee-7a5321d6a863","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":58}`

### C7 reservas mismo slot iter 58/100

- Invariante: OK
- Duracion: 254ms
- Latencia: p50=155ms, p95=247ms, p99=250ms, max=250ms
- Detalle: `{"fecha":"2222-12-08","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":58}`

### C5 pago duplicado concurrente iter 59/100

- Invariante: OK
- Duracion: 484ms
- Latencia: p50=291ms, p95=467ms, p99=481ms, max=481ms
- Detalle: `{"cuentaId":"e66b5fe6-57d9-4f8e-b116-d5f5b76bb5b9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":59}`

### C6 stock compartido iter 59/100

- Invariante: OK
- Duracion: 711ms
- Latencia: p50=450ms, p95=699ms, p99=707ms, max=707ms
- Detalle: `{"productId":"aa7a2725-e42d-4fa6-a7e2-0091fb44fa83","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":59}`

### C7 reservas mismo slot iter 59/100

- Invariante: OK
- Duracion: 221ms
- Latencia: p50=139ms, p95=214ms, p99=219ms, max=219ms
- Detalle: `{"fecha":"2222-12-09","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":59}`

### C5 pago duplicado concurrente iter 60/100

- Invariante: OK
- Duracion: 592ms
- Latencia: p50=388ms, p95=572ms, p99=588ms, max=588ms
- Detalle: `{"cuentaId":"07dbcfd4-bd04-4c55-a860-502882c51b0d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":60}`

### C6 stock compartido iter 60/100

- Invariante: OK
- Duracion: 695ms
- Latencia: p50=457ms, p95=683ms, p99=691ms, max=691ms
- Detalle: `{"productId":"4283bbfd-164b-48c6-97a0-26dfbe603c92","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":60}`

### C7 reservas mismo slot iter 60/100

- Invariante: OK
- Duracion: 2099ms
- Latencia: p50=140ms, p95=2094ms, p99=2097ms, max=2097ms
- Detalle: `{"fecha":"2222-12-10","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":60}`

### C5 pago duplicado concurrente iter 61/100

- Invariante: OK
- Duracion: 473ms
- Latencia: p50=294ms, p95=458ms, p99=471ms, max=471ms
- Detalle: `{"cuentaId":"15461cf7-e418-4bea-9a53-27fb0c638ddc","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":47,"502":2},"iteration":61}`

### C6 stock compartido iter 61/100

- Invariante: OK
- Duracion: 658ms
- Latencia: p50=439ms, p95=644ms, p99=651ms, max=651ms
- Detalle: `{"productId":"2ca2a907-0ced-4e70-8f2b-b4cce7a5475d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":61}`

### C7 reservas mismo slot iter 61/100

- Invariante: OK
- Duracion: 208ms
- Latencia: p50=138ms, p95=200ms, p99=202ms, max=202ms
- Detalle: `{"fecha":"2222-12-11","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":61}`

### C5 pago duplicado concurrente iter 62/100

- Invariante: OK
- Duracion: 35740ms
- Latencia: p50=279ms, p95=441ms, p99=35736ms, max=35736ms
- Detalle: `{"cuentaId":"7bc3996e-78b2-47c5-8a3e-00eeac5757f2","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":62}`

### C6 stock compartido iter 62/100

- Invariante: OK
- Duracion: 723ms
- Latencia: p50=483ms, p95=714ms, p99=720ms, max=720ms
- Detalle: `{"productId":"d7886742-6044-4387-a024-30494c071d55","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":62}`

### C7 reservas mismo slot iter 62/100

- Invariante: OK
- Duracion: 193ms
- Latencia: p50=129ms, p95=185ms, p99=190ms, max=190ms
- Detalle: `{"fecha":"2222-12-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":62}`

### C5 pago duplicado concurrente iter 63/100

- Invariante: OK
- Duracion: 515ms
- Latencia: p50=334ms, p95=499ms, p99=512ms, max=512ms
- Detalle: `{"cuentaId":"63e7400c-d048-49b4-bf08-613ca328c29e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":63}`

### C6 stock compartido iter 63/100

- Invariante: OK
- Duracion: 697ms
- Latencia: p50=467ms, p95=688ms, p99=695ms, max=695ms
- Detalle: `{"productId":"a01ccb65-4d5e-47ab-a2fa-aeaa6b32f1a1","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":63}`

### C7 reservas mismo slot iter 63/100

- Invariante: OK
- Duracion: 206ms
- Latencia: p50=121ms, p95=196ms, p99=203ms, max=203ms
- Detalle: `{"fecha":"2222-12-13","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":63}`

### C5 pago duplicado concurrente iter 64/100

- Invariante: OK
- Duracion: 461ms
- Latencia: p50=267ms, p95=443ms, p99=456ms, max=456ms
- Detalle: `{"cuentaId":"a9dcb0eb-9ba2-4def-a8e3-156476872cee","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":64}`

### C6 stock compartido iter 64/100

- Invariante: OK
- Duracion: 752ms
- Latencia: p50=503ms, p95=735ms, p99=745ms, max=745ms
- Detalle: `{"productId":"3c0a005f-e93c-4984-bbf2-ecd7a44b3500","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":64}`

### C7 reservas mismo slot iter 64/100

- Invariante: OK
- Duracion: 171ms
- Latencia: p50=111ms, p95=164ms, p99=168ms, max=168ms
- Detalle: `{"fecha":"2222-12-14","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":64}`

### C5 pago duplicado concurrente iter 65/100

- Invariante: OK
- Duracion: 467ms
- Latencia: p50=291ms, p95=451ms, p99=464ms, max=464ms
- Detalle: `{"cuentaId":"b4b6a709-1e5e-4578-b501-c9b63e664cdd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":65}`

### C6 stock compartido iter 65/100

- Invariante: OK
- Duracion: 606ms
- Latencia: p50=398ms, p95=600ms, p99=604ms, max=604ms
- Detalle: `{"productId":"3a8d0777-3a16-4a5b-a216-bac6f893102a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":65}`

### C7 reservas mismo slot iter 65/100

- Invariante: OK
- Duracion: 214ms
- Latencia: p50=140ms, p95=206ms, p99=212ms, max=212ms
- Detalle: `{"fecha":"2222-12-15","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":65}`

### C5 pago duplicado concurrente iter 66/100

- Invariante: OK
- Duracion: 446ms
- Latencia: p50=279ms, p95=430ms, p99=443ms, max=443ms
- Detalle: `{"cuentaId":"3842fd2e-5659-4a68-bc63-842d1ad8b9f9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":66}`

### C6 stock compartido iter 66/100

- Invariante: OK
- Duracion: 615ms
- Latencia: p50=398ms, p95=607ms, p99=610ms, max=610ms
- Detalle: `{"productId":"0cf4e2b2-aef2-4628-9757-a709d173216f","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":66}`

### C7 reservas mismo slot iter 66/100

- Invariante: OK
- Duracion: 239ms
- Latencia: p50=154ms, p95=233ms, p99=236ms, max=236ms
- Detalle: `{"fecha":"2222-12-16","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":66}`

### C5 pago duplicado concurrente iter 67/100

- Invariante: OK
- Duracion: 468ms
- Latencia: p50=288ms, p95=453ms, p99=466ms, max=466ms
- Detalle: `{"cuentaId":"7a689a11-b71b-4216-8345-ca10bc0bddd4","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":67}`

### C6 stock compartido iter 67/100

- Invariante: OK
- Duracion: 598ms
- Latencia: p50=392ms, p95=588ms, p99=592ms, max=592ms
- Detalle: `{"productId":"29779911-084b-4256-96b1-a662af1e4617","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":67}`

### C7 reservas mismo slot iter 67/100

- Invariante: OK
- Duracion: 245ms
- Latencia: p50=184ms, p95=239ms, p99=243ms, max=243ms
- Detalle: `{"fecha":"2222-12-17","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":67}`

### C5 pago duplicado concurrente iter 68/100

- Invariante: OK
- Duracion: 435ms
- Latencia: p50=273ms, p95=420ms, p99=433ms, max=433ms
- Detalle: `{"cuentaId":"dd55c971-a1fb-4761-bb76-797eb8ac75da","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":68}`

### C6 stock compartido iter 68/100

- Invariante: OK
- Duracion: 758ms
- Latencia: p50=503ms, p95=748ms, p99=756ms, max=756ms
- Detalle: `{"productId":"d4e4a055-d020-4b0b-8a67-949da84ac4e5","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":68}`

### C7 reservas mismo slot iter 68/100

- Invariante: OK
- Duracion: 256ms
- Latencia: p50=166ms, p95=246ms, p99=254ms, max=254ms
- Detalle: `{"fecha":"2222-12-18","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":68}`

### C5 pago duplicado concurrente iter 69/100

- Invariante: OK
- Duracion: 520ms
- Latencia: p50=331ms, p95=504ms, p99=517ms, max=517ms
- Detalle: `{"cuentaId":"1c6163df-0aff-4f6b-9d59-3de7589b983c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":69}`

### C6 stock compartido iter 69/100

- Invariante: OK
- Duracion: 673ms
- Latencia: p50=432ms, p95=665ms, p99=671ms, max=671ms
- Detalle: `{"productId":"83df496c-43e0-464a-87c0-a1091b588486","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":69}`

### C7 reservas mismo slot iter 69/100

- Invariante: OK
- Duracion: 217ms
- Latencia: p50=135ms, p95=209ms, p99=214ms, max=214ms
- Detalle: `{"fecha":"2222-12-19","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":69}`

### C5 pago duplicado concurrente iter 70/100

- Invariante: OK
- Duracion: 519ms
- Latencia: p50=323ms, p95=501ms, p99=517ms, max=517ms
- Detalle: `{"cuentaId":"72dfb31e-6fdd-4796-aa17-9dc4a53af204","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":70}`

### C6 stock compartido iter 70/100

- Invariante: OK
- Duracion: 795ms
- Latencia: p50=528ms, p95=775ms, p99=788ms, max=788ms
- Detalle: `{"productId":"fedfcc4b-e5ce-4e85-9245-0bdf712d0211","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":70}`

### C7 reservas mismo slot iter 70/100

- Invariante: OK
- Duracion: 355ms
- Latencia: p50=256ms, p95=349ms, p99=352ms, max=352ms
- Detalle: `{"fecha":"2222-12-20","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":70}`

### C5 pago duplicado concurrente iter 71/100

- Invariante: OK
- Duracion: 483ms
- Latencia: p50=286ms, p95=466ms, p99=479ms, max=479ms
- Detalle: `{"cuentaId":"b972cf93-61b8-47ad-97e6-822593b9f1e1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":71}`

### C6 stock compartido iter 71/100

- Invariante: OK
- Duracion: 673ms
- Latencia: p50=432ms, p95=667ms, p99=670ms, max=670ms
- Detalle: `{"productId":"f6328230-ef9f-4627-9f91-fe60f4c4e9f8","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":71}`

### C7 reservas mismo slot iter 71/100

- Invariante: OK
- Duracion: 258ms
- Latencia: p50=142ms, p95=252ms, p99=256ms, max=256ms
- Detalle: `{"fecha":"2222-12-21","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":71}`

### C5 pago duplicado concurrente iter 72/100

- Invariante: OK
- Duracion: 518ms
- Latencia: p50=289ms, p95=499ms, p99=516ms, max=516ms
- Detalle: `{"cuentaId":"192f3a7b-f5b4-4fae-9181-57d24b25872b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":72}`

### C6 stock compartido iter 72/100

- Invariante: OK
- Duracion: 625ms
- Latencia: p50=407ms, p95=615ms, p99=622ms, max=622ms
- Detalle: `{"productId":"df97ba96-c344-487f-8011-7f19cd11bc8e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":72}`

### C7 reservas mismo slot iter 72/100

- Invariante: OK
- Duracion: 263ms
- Latencia: p50=192ms, p95=250ms, p99=254ms, max=254ms
- Detalle: `{"fecha":"2222-12-22","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":72}`

### C5 pago duplicado concurrente iter 73/100

- Invariante: OK
- Duracion: 451ms
- Latencia: p50=281ms, p95=435ms, p99=447ms, max=447ms
- Detalle: `{"cuentaId":"596fb432-956e-41bd-897e-b2c4ccf4b0df","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":73}`

### C6 stock compartido iter 73/100

- Invariante: OK
- Duracion: 618ms
- Latencia: p50=413ms, p95=605ms, p99=611ms, max=611ms
- Detalle: `{"productId":"da19c2f2-0b19-4209-99b9-fb4b2342ce5a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":73}`

### C7 reservas mismo slot iter 73/100

- Invariante: OK
- Duracion: 286ms
- Latencia: p50=192ms, p95=278ms, p99=282ms, max=282ms
- Detalle: `{"fecha":"2222-12-23","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":73}`

### C5 pago duplicado concurrente iter 74/100

- Invariante: OK
- Duracion: 546ms
- Latencia: p50=337ms, p95=527ms, p99=543ms, max=543ms
- Detalle: `{"cuentaId":"5ac419f6-8f13-416f-acd4-8567960cefe0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":74}`

### C6 stock compartido iter 74/100

- Invariante: OK
- Duracion: 794ms
- Latencia: p50=518ms, p95=744ms, p99=775ms, max=775ms
- Detalle: `{"productId":"77e70ad8-a0ee-429d-88ec-3ae19771a940","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":74}`

### C7 reservas mismo slot iter 74/100

- Invariante: OK
- Duracion: 239ms
- Latencia: p50=157ms, p95=230ms, p99=236ms, max=236ms
- Detalle: `{"fecha":"2222-12-24","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":74}`

### C5 pago duplicado concurrente iter 75/100

- Invariante: OK
- Duracion: 562ms
- Latencia: p50=350ms, p95=539ms, p99=558ms, max=558ms
- Detalle: `{"cuentaId":"af229953-b747-4312-856c-00c467d4e9a0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":75}`

### C6 stock compartido iter 75/100

- Invariante: OK
- Duracion: 678ms
- Latencia: p50=434ms, p95=647ms, p99=673ms, max=673ms
- Detalle: `{"productId":"29845ed8-106a-4d23-ba76-28167b2edc85","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":75}`

### C7 reservas mismo slot iter 75/100

- Invariante: OK
- Duracion: 223ms
- Latencia: p50=132ms, p95=215ms, p99=219ms, max=219ms
- Detalle: `{"fecha":"2222-12-25","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":75}`

### C5 pago duplicado concurrente iter 76/100

- Invariante: OK
- Duracion: 606ms
- Latencia: p50=321ms, p95=579ms, p99=603ms, max=603ms
- Detalle: `{"cuentaId":"20bf827b-27c6-47ff-9519-8a92868c0416","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":76}`

### C6 stock compartido iter 76/100

- Invariante: OK
- Duracion: 691ms
- Latencia: p50=447ms, p95=682ms, p99=683ms, max=683ms
- Detalle: `{"productId":"71463656-dce4-42a0-97c9-1cc3f0262bcc","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":76}`

### C7 reservas mismo slot iter 76/100

- Invariante: OK
- Duracion: 269ms
- Latencia: p50=173ms, p95=263ms, p99=266ms, max=266ms
- Detalle: `{"fecha":"2222-12-26","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":76}`

### C5 pago duplicado concurrente iter 77/100

- Invariante: OK
- Duracion: 496ms
- Latencia: p50=314ms, p95=480ms, p99=493ms, max=493ms
- Detalle: `{"cuentaId":"25c51867-dc53-4468-a0aa-3222b5abd131","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":77}`

### C6 stock compartido iter 77/100

- Invariante: OK
- Duracion: 658ms
- Latencia: p50=429ms, p95=641ms, p99=647ms, max=647ms
- Detalle: `{"productId":"0dd25e0f-7a1b-4f7f-a920-e9f02e2f84bb","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":77}`

### C7 reservas mismo slot iter 77/100

- Invariante: OK
- Duracion: 35688ms
- Latencia: p50=149ms, p95=35671ms, p99=35688ms, max=35688ms
- Detalle: `{"fecha":"2222-12-27","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":77}`

### C5 pago duplicado concurrente iter 78/100

- Invariante: OK
- Duracion: 568ms
- Latencia: p50=365ms, p95=545ms, p99=565ms, max=565ms
- Detalle: `{"cuentaId":"292b787b-9f2c-481a-8ffb-609de426b064","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":78}`

### C6 stock compartido iter 78/100

- Invariante: OK
- Duracion: 674ms
- Latencia: p50=437ms, p95=660ms, p99=670ms, max=670ms
- Detalle: `{"productId":"dc4c5ab1-7aff-48e7-b11c-193681e93c87","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":78}`

### C7 reservas mismo slot iter 78/100

- Invariante: OK
- Duracion: 181ms
- Latencia: p50=106ms, p95=164ms, p99=178ms, max=178ms
- Detalle: `{"fecha":"2222-12-28","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":78}`

### C5 pago duplicado concurrente iter 79/100

- Invariante: OK
- Duracion: 450ms
- Latencia: p50=277ms, p95=435ms, p99=448ms, max=448ms
- Detalle: `{"cuentaId":"cab9ca61-e5c1-4e47-b182-2f3944731ab1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":79}`

### C6 stock compartido iter 79/100

- Invariante: OK
- Duracion: 698ms
- Latencia: p50=448ms, p95=686ms, p99=691ms, max=691ms
- Detalle: `{"productId":"e86bdefe-3115-471b-8a9f-57148df4aca9","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":79}`

### C7 reservas mismo slot iter 79/100

- Invariante: OK
- Duracion: 316ms
- Latencia: p50=199ms, p95=304ms, p99=311ms, max=311ms
- Detalle: `{"fecha":"2222-12-29","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":79}`

### C5 pago duplicado concurrente iter 80/100

- Invariante: OK
- Duracion: 613ms
- Latencia: p50=386ms, p95=593ms, p99=609ms, max=609ms
- Detalle: `{"cuentaId":"5134157e-d0c8-4a79-94f6-b6a0e91f426b","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":80}`

### C6 stock compartido iter 80/100

- Invariante: OK
- Duracion: 654ms
- Latencia: p50=429ms, p95=643ms, p99=653ms, max=653ms
- Detalle: `{"productId":"57a35434-a6a9-43ba-ad1a-fd8dce25e602","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":80}`

### C7 reservas mismo slot iter 80/100

- Invariante: OK
- Duracion: 225ms
- Latencia: p50=146ms, p95=218ms, p99=222ms, max=222ms
- Detalle: `{"fecha":"2222-12-30","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":80}`

### C5 pago duplicado concurrente iter 81/100

- Invariante: OK
- Duracion: 536ms
- Latencia: p50=323ms, p95=514ms, p99=533ms, max=533ms
- Detalle: `{"cuentaId":"7e5359ab-e9fd-475e-9c17-7590ce4407b0","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":81}`

### C6 stock compartido iter 81/100

- Invariante: OK
- Duracion: 755ms
- Latencia: p50=497ms, p95=740ms, p99=749ms, max=749ms
- Detalle: `{"productId":"941c564d-efa9-4a92-9256-c5af55f73d6c","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":81}`

### C7 reservas mismo slot iter 81/100

- Invariante: OK
- Duracion: 411ms
- Latencia: p50=241ms, p95=393ms, p99=407ms, max=407ms
- Detalle: `{"fecha":"2222-12-31","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":81}`

### C5 pago duplicado concurrente iter 82/100

- Invariante: OK
- Duracion: 633ms
- Latencia: p50=424ms, p95=613ms, p99=631ms, max=631ms
- Detalle: `{"cuentaId":"cf369b61-891a-4862-8bb8-b5c7b79e226f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":82}`

### C6 stock compartido iter 82/100

- Invariante: OK
- Duracion: 60262ms
- Latencia: p50=495ms, p95=60012ms, p99=60012ms, max=60012ms
- Detalle: `{"productId":"e3847c6d-0dc6-4e2b-8889-ccba408edfac","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":5,"clientTimeouts":5,"stockActual":0,"statuses":{"0":5,"201":50,"400":5},"iteration":82}`

### C7 reservas mismo slot iter 82/100

- Invariante: OK
- Duracion: 330ms
- Latencia: p50=223ms, p95=320ms, p99=328ms, max=328ms
- Detalle: `{"fecha":"2223-01-01","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":82}`

### C5 pago duplicado concurrente iter 83/100

- Invariante: OK
- Duracion: 611ms
- Latencia: p50=339ms, p95=584ms, p99=608ms, max=608ms
- Detalle: `{"cuentaId":"fff90d12-e436-4a66-b3e4-a78ea78640cd","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":83}`

### C6 stock compartido iter 83/100

- Invariante: OK
- Duracion: 677ms
- Latencia: p50=457ms, p95=661ms, p99=674ms, max=674ms
- Detalle: `{"productId":"5a61b1d2-54e9-4744-92ae-24f8efdac1fe","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":83}`

### C7 reservas mismo slot iter 83/100

- Invariante: OK
- Duracion: 279ms
- Latencia: p50=183ms, p95=272ms, p99=276ms, max=276ms
- Detalle: `{"fecha":"2223-01-02","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":83}`

### C5 pago duplicado concurrente iter 84/100

- Invariante: OK
- Duracion: 522ms
- Latencia: p50=313ms, p95=500ms, p99=519ms, max=519ms
- Detalle: `{"cuentaId":"d6052610-c240-453a-b6f3-210588b799fa","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":84}`

### C6 stock compartido iter 84/100

- Invariante: OK
- Duracion: 698ms
- Latencia: p50=475ms, p95=676ms, p99=693ms, max=693ms
- Detalle: `{"productId":"54dbb4e8-5567-49de-ab23-a4dcff543eaf","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":84}`

### C7 reservas mismo slot iter 84/100

- Invariante: OK
- Duracion: 235ms
- Latencia: p50=152ms, p95=224ms, p99=231ms, max=231ms
- Detalle: `{"fecha":"2223-01-03","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":84}`

### C5 pago duplicado concurrente iter 85/100

- Invariante: OK
- Duracion: 661ms
- Latencia: p50=369ms, p95=628ms, p99=657ms, max=657ms
- Detalle: `{"cuentaId":"d04a0ff0-dfea-4506-bb8d-3160e8b523fa","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":85}`

### C6 stock compartido iter 85/100

- Invariante: OK
- Duracion: 860ms
- Latencia: p50=564ms, p95=840ms, p99=849ms, max=849ms
- Detalle: `{"productId":"0af3f185-66cf-4c68-a770-2e0f7005e49e","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":85}`

### C7 reservas mismo slot iter 85/100

- Invariante: OK
- Duracion: 285ms
- Latencia: p50=152ms, p95=275ms, p99=282ms, max=282ms
- Detalle: `{"fecha":"2223-01-04","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":85}`

### C5 pago duplicado concurrente iter 86/100

- Invariante: OK
- Duracion: 582ms
- Latencia: p50=378ms, p95=563ms, p99=578ms, max=578ms
- Detalle: `{"cuentaId":"3f41aa2f-8c39-4b67-9d11-6eb91e89ee85","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":86}`

### C6 stock compartido iter 86/100

- Invariante: OK
- Duracion: 745ms
- Latencia: p50=485ms, p95=732ms, p99=740ms, max=740ms
- Detalle: `{"productId":"86300a6e-4850-41e6-9f2e-7d796719ae52","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":86}`

### C7 reservas mismo slot iter 86/100

- Invariante: OK
- Duracion: 181ms
- Latencia: p50=122ms, p95=175ms, p99=178ms, max=178ms
- Detalle: `{"fecha":"2223-01-05","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":86}`

### C5 pago duplicado concurrente iter 87/100

- Invariante: OK
- Duracion: 510ms
- Latencia: p50=310ms, p95=488ms, p99=508ms, max=508ms
- Detalle: `{"cuentaId":"c40ef5a4-38f9-48eb-9e16-6f937c40d3ee","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":87}`

### C6 stock compartido iter 87/100

- Invariante: OK
- Duracion: 765ms
- Latencia: p50=528ms, p95=756ms, p99=761ms, max=761ms
- Detalle: `{"productId":"ef023295-8e52-42e6-8fc4-8655128d1cad","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":87}`

### C7 reservas mismo slot iter 87/100

- Invariante: OK
- Duracion: 190ms
- Latencia: p50=113ms, p95=183ms, p99=187ms, max=187ms
- Detalle: `{"fecha":"2223-01-06","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":87}`

### C5 pago duplicado concurrente iter 88/100

- Invariante: OK
- Duracion: 491ms
- Latencia: p50=308ms, p95=473ms, p99=488ms, max=488ms
- Detalle: `{"cuentaId":"88d25a95-f8e6-43a7-aa54-7f0952e98561","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":88}`

### C6 stock compartido iter 88/100

- Invariante: OK
- Duracion: 747ms
- Latencia: p50=491ms, p95=731ms, p99=745ms, max=745ms
- Detalle: `{"productId":"724797aa-84b3-4e17-9e83-8af10c6a9270","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":88}`

### C7 reservas mismo slot iter 88/100

- Invariante: OK
- Duracion: 250ms
- Latencia: p50=176ms, p95=245ms, p99=248ms, max=248ms
- Detalle: `{"fecha":"2223-01-07","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":88}`

### C5 pago duplicado concurrente iter 89/100

- Invariante: OK
- Duracion: 501ms
- Latencia: p50=314ms, p95=484ms, p99=498ms, max=498ms
- Detalle: `{"cuentaId":"0a0331ca-bc5d-4e75-b764-ade22eab1aad","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":89}`

### C6 stock compartido iter 89/100

- Invariante: OK
- Duracion: 739ms
- Latencia: p50=496ms, p95=729ms, p99=737ms, max=737ms
- Detalle: `{"productId":"efd61cbc-5269-4c45-929d-e0e2fc70127d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":89}`

### C7 reservas mismo slot iter 89/100

- Invariante: OK
- Duracion: 212ms
- Latencia: p50=140ms, p95=206ms, p99=208ms, max=208ms
- Detalle: `{"fecha":"2223-01-08","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":89}`

### C5 pago duplicado concurrente iter 90/100

- Invariante: OK
- Duracion: 486ms
- Latencia: p50=310ms, p95=470ms, p99=483ms, max=483ms
- Detalle: `{"cuentaId":"3f98335c-7b6a-48b5-8e8f-2f59963c40bf","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":90}`

### C6 stock compartido iter 90/100

- Invariante: OK
- Duracion: 753ms
- Latencia: p50=509ms, p95=748ms, p99=751ms, max=751ms
- Detalle: `{"productId":"b970907f-9072-49ae-98e9-ffe47c3f23aa","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":90}`

### C7 reservas mismo slot iter 90/100

- Invariante: OK
- Duracion: 279ms
- Latencia: p50=183ms, p95=273ms, p99=277ms, max=277ms
- Detalle: `{"fecha":"2223-01-09","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":90}`

### C5 pago duplicado concurrente iter 91/100

- Invariante: OK
- Duracion: 620ms
- Latencia: p50=413ms, p95=602ms, p99=617ms, max=617ms
- Detalle: `{"cuentaId":"73350414-4baf-4c40-abb2-24219f2771c1","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":91}`

### C6 stock compartido iter 91/100

- Invariante: OK
- Duracion: 759ms
- Latencia: p50=493ms, p95=749ms, p99=755ms, max=755ms
- Detalle: `{"productId":"ad87049a-d4dc-4846-8fdd-7ca1e52c5e75","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":91}`

### C7 reservas mismo slot iter 91/100

- Invariante: OK
- Duracion: 200ms
- Latencia: p50=136ms, p95=194ms, p99=198ms, max=198ms
- Detalle: `{"fecha":"2223-01-10","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":91}`

### C5 pago duplicado concurrente iter 92/100

- Invariante: OK
- Duracion: 562ms
- Latencia: p50=334ms, p95=537ms, p99=560ms, max=560ms
- Detalle: `{"cuentaId":"a16da6ec-f353-4448-a5fd-64b73b39d807","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":92}`

### C6 stock compartido iter 92/100

- Invariante: OK
- Duracion: 763ms
- Latencia: p50=505ms, p95=751ms, p99=759ms, max=759ms
- Detalle: `{"productId":"7716e19e-996c-451d-856c-1f663e284b76","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":92}`

### C7 reservas mismo slot iter 92/100

- Invariante: OK
- Duracion: 203ms
- Latencia: p50=141ms, p95=198ms, p99=201ms, max=201ms
- Detalle: `{"fecha":"2223-01-11","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":92}`

### C5 pago duplicado concurrente iter 93/100

- Invariante: OK
- Duracion: 513ms
- Latencia: p50=337ms, p95=495ms, p99=511ms, max=511ms
- Detalle: `{"cuentaId":"25df687e-47eb-4066-acf3-98844afa04c5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":93}`

### C6 stock compartido iter 93/100

- Invariante: OK
- Duracion: 712ms
- Latencia: p50=474ms, p95=700ms, p99=708ms, max=708ms
- Detalle: `{"productId":"7f9890f5-2078-4a49-a9b0-12f45a69bb79","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":93}`

### C7 reservas mismo slot iter 93/100

- Invariante: OK
- Duracion: 276ms
- Latencia: p50=159ms, p95=270ms, p99=273ms, max=273ms
- Detalle: `{"fecha":"2223-01-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":93}`

### C5 pago duplicado concurrente iter 94/100

- Invariante: OK
- Duracion: 536ms
- Latencia: p50=335ms, p95=519ms, p99=534ms, max=534ms
- Detalle: `{"cuentaId":"5eb83142-f404-49f5-b23d-a8db5c545e9f","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":94}`

### C6 stock compartido iter 94/100

- Invariante: OK
- Duracion: 686ms
- Latencia: p50=449ms, p95=661ms, p99=684ms, max=684ms
- Detalle: `{"productId":"c48e307a-afb2-447e-8dae-2388e941fdf7","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":94}`

### C7 reservas mismo slot iter 94/100

- Invariante: OK
- Duracion: 253ms
- Latencia: p50=195ms, p95=246ms, p99=250ms, max=250ms
- Detalle: `{"fecha":"2223-01-13","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":94}`

### C5 pago duplicado concurrente iter 95/100

- Invariante: OK
- Duracion: 500ms
- Latencia: p50=303ms, p95=482ms, p99=496ms, max=496ms
- Detalle: `{"cuentaId":"c613d9e1-c954-4567-8634-5012dc173150","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":95}`

### C6 stock compartido iter 95/100

- Invariante: OK
- Duracion: 980ms
- Latencia: p50=680ms, p95=964ms, p99=972ms, max=972ms
- Detalle: `{"productId":"1421cad0-6117-4b4c-acb4-66b3fc6c53da","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":95}`

### C7 reservas mismo slot iter 95/100

- Invariante: OK
- Duracion: 199ms
- Latencia: p50=135ms, p95=195ms, p99=196ms, max=196ms
- Detalle: `{"fecha":"2223-01-14","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":95}`

### C5 pago duplicado concurrente iter 96/100

- Invariante: OK
- Duracion: 687ms
- Latencia: p50=447ms, p95=665ms, p99=682ms, max=682ms
- Detalle: `{"cuentaId":"c034bd0f-5ed4-4df6-bb3b-0b8041009b9d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":96}`

### C6 stock compartido iter 96/100

- Invariante: OK
- Duracion: 835ms
- Latencia: p50=528ms, p95=824ms, p99=832ms, max=832ms
- Detalle: `{"productId":"563550fb-a7f9-448b-8906-c58da8360650","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":96}`

### C7 reservas mismo slot iter 96/100

- Invariante: OK
- Duracion: 435ms
- Latencia: p50=367ms, p95=428ms, p99=432ms, max=432ms
- Detalle: `{"fecha":"2223-01-15","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":96}`

### C5 pago duplicado concurrente iter 97/100

- Invariante: OK
- Duracion: 557ms
- Latencia: p50=354ms, p95=538ms, p99=554ms, max=554ms
- Detalle: `{"cuentaId":"e7f3ecdd-0f27-4791-baa1-94e69ebdd983","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":97}`

### C6 stock compartido iter 97/100

- Invariante: OK
- Duracion: 808ms
- Latencia: p50=530ms, p95=802ms, p99=805ms, max=805ms
- Detalle: `{"productId":"81ed90f3-340c-49bc-95d2-11b14e753d5a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":97}`

### C7 reservas mismo slot iter 97/100

- Invariante: OK
- Duracion: 282ms
- Latencia: p50=161ms, p95=275ms, p99=280ms, max=280ms
- Detalle: `{"fecha":"2223-01-16","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":97}`

### C5 pago duplicado concurrente iter 98/100

- Invariante: OK
- Duracion: 643ms
- Latencia: p50=424ms, p95=623ms, p99=641ms, max=641ms
- Detalle: `{"cuentaId":"2fc68433-d54f-4e1e-a7a0-e86f32340261","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":98}`

### C6 stock compartido iter 98/100

- Invariante: OK
- Duracion: 806ms
- Latencia: p50=516ms, p95=797ms, p99=803ms, max=803ms
- Detalle: `{"productId":"8b062981-dd56-460b-b0e9-e6086a376fab","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":98}`

### C7 reservas mismo slot iter 98/100

- Invariante: OK
- Duracion: 232ms
- Latencia: p50=143ms, p95=222ms, p99=229ms, max=229ms
- Detalle: `{"fecha":"2223-01-17","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":98}`

### C5 pago duplicado concurrente iter 99/100

- Invariante: OK
- Duracion: 516ms
- Latencia: p50=310ms, p95=497ms, p99=513ms, max=513ms
- Detalle: `{"cuentaId":"318f1b08-ff05-4fe5-ae47-05a9bdbdf12e","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":99}`

### C6 stock compartido iter 99/100

- Invariante: OK
- Duracion: 861ms
- Latencia: p50=562ms, p95=851ms, p99=859ms, max=859ms
- Detalle: `{"productId":"c35c859b-2801-499b-8732-9bd77fb8a62d","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":99}`

### C7 reservas mismo slot iter 99/100

- Invariante: OK
- Duracion: 265ms
- Latencia: p50=200ms, p95=258ms, p99=262ms, max=262ms
- Detalle: `{"fecha":"2223-01-18","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":99}`

### C5 pago duplicado concurrente iter 100/100

- Invariante: OK
- Duracion: 575ms
- Latencia: p50=338ms, p95=544ms, p99=571ms, max=571ms
- Detalle: `{"cuentaId":"05ba8840-b82d-406e-af14-8e8717883ac5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":100}`

### C6 stock compartido iter 100/100

- Invariante: OK
- Duracion: 652ms
- Latencia: p50=431ms, p95=644ms, p99=649ms, max=649ms
- Detalle: `{"productId":"263f35c0-5998-4530-9e62-61f59fd75f08","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":100}`

### C7 reservas mismo slot iter 100/100

- Invariante: OK
- Duracion: 264ms
- Latencia: p50=167ms, p95=254ms, p99=260ms, max=260ms
- Detalle: `{"fecha":"2223-01-19","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":100}`

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

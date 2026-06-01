# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:37:28.784Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 100
- Iteraciones: 3
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/3 | OK | 100 | {"201":1,"400":99} | 1118ms | 85.91 |
| C6 stock compartido iter 1/3 | OK | 120 | {"201":100,"400":20} | 1341ms | 86.15 |
| C7 reservas mismo slot iter 1/3 | OK | 100 | {"201":1,"409":99} | 616ms | 152.91 |
| C5 pago duplicado concurrente iter 2/3 | OK | 100 | {"201":1,"400":99} | 921ms | 104.82 |
| C6 stock compartido iter 2/3 | OK | 120 | {"201":100,"400":20} | 1295ms | 89.22 |
| C7 reservas mismo slot iter 2/3 | OK | 100 | {"201":1,"409":99} | 556ms | 171.53 |
| C5 pago duplicado concurrente iter 3/3 | OK | 100 | {"201":1,"400":99} | 991ms | 98.04 |
| C6 stock compartido iter 3/3 | OK | 120 | {"201":100,"400":20} | 1272ms | 91.46 |
| C7 reservas mismo slot iter 3/3 | OK | 100 | {"201":1,"409":99} | 669ms | 142.86 |

## Detalle

### C5 pago duplicado concurrente iter 1/3

- Invariante: OK
- Duracion: 1164ms
- Latencia: p50=712ms, p95=1118ms, p99=1147ms, max=1147ms
- Detalle: `{"cuentaId":"1bc24a28-dec7-4713-a0c9-38c608405fda","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":1}`

### C6 stock compartido iter 1/3

- Invariante: OK
- Duracion: 1393ms
- Latencia: p50=875ms, p95=1341ms, p99=1359ms, max=1362ms
- Detalle: `{"productId":"ac59f4dc-6d26-478f-8ed4-3ccdb201841e","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":55,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":45,"statuses":{"201":100,"400":20},"iteration":1}`

### C7 reservas mismo slot iter 1/3

- Invariante: OK
- Duracion: 654ms
- Latencia: p50=327ms, p95=616ms, p99=636ms, max=636ms
- Detalle: `{"fecha":"2172-10-24","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/3

- Invariante: OK
- Duracion: 954ms
- Latencia: p50=583ms, p95=921ms, p99=945ms, max=945ms
- Detalle: `{"cuentaId":"814295e4-b46e-4965-8939-0dfc20e3bded","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":2}`

### C6 stock compartido iter 2/3

- Invariante: OK
- Duracion: 1345ms
- Latencia: p50=861ms, p95=1295ms, p99=1308ms, max=1309ms
- Detalle: `{"productId":"8175fcdc-c5f1-4b7a-8398-d8feec154aa2","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":76,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":24,"statuses":{"201":100,"400":20},"iteration":2}`

### C7 reservas mismo slot iter 2/3

- Invariante: OK
- Duracion: 583ms
- Latencia: p50=342ms, p95=556ms, p99=570ms, max=570ms
- Detalle: `{"fecha":"2172-10-25","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/3

- Invariante: OK
- Duracion: 1020ms
- Latencia: p50=583ms, p95=991ms, p99=1014ms, max=1014ms
- Detalle: `{"cuentaId":"4cb5f915-bcc1-433d-be4c-861f0886a486","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":3}`

### C6 stock compartido iter 3/3

- Invariante: OK
- Duracion: 1312ms
- Latencia: p50=841ms, p95=1272ms, p99=1284ms, max=1288ms
- Detalle: `{"productId":"6974096c-fa50-4444-ae64-f8694a4cef09","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":80,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":20,"statuses":{"201":100,"400":20},"iteration":3}`

### C7 reservas mismo slot iter 3/3

- Invariante: OK
- Duracion: 700ms
- Latencia: p50=418ms, p95=669ms, p99=690ms, max=690ms
- Detalle: `{"fecha":"2172-10-26","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

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

## Decision

- Aceptado: la corrida focalizada no encontro inconsistencias con la concurrencia configurada.

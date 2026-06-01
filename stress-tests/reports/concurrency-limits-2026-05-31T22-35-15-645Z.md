# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:35:15.646Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 50
- Iteraciones: 3
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/3 | OK | 50 | {"201":1,"400":49} | 654ms | 73.31 |
| C6 stock compartido iter 1/3 | OK | 60 | {"201":50,"400":10} | 1077ms | 52.04 |
| C7 reservas mismo slot iter 1/3 | OK | 50 | {"201":1,"409":49} | 271ms | 176.06 |
| C5 pago duplicado concurrente iter 2/3 | OK | 50 | {"201":1,"400":49} | 553ms | 87.41 |
| C6 stock compartido iter 2/3 | OK | 60 | {"201":50,"400":10} | 771ms | 75.09 |
| C7 reservas mismo slot iter 2/3 | OK | 50 | {"201":1,"409":49} | 258ms | 181.82 |
| C5 pago duplicado concurrente iter 3/3 | OK | 50 | {"201":1,"400":49} | 517ms | 92.76 |
| C6 stock compartido iter 3/3 | OK | 60 | {"201":50,"400":10} | 659ms | 86.96 |
| C7 reservas mismo slot iter 3/3 | OK | 50 | {"201":1,"409":49} | 228ms | 210.97 |

## Detalle

### C5 pago duplicado concurrente iter 1/3

- Invariante: OK
- Duracion: 682ms
- Latencia: p50=467ms, p95=654ms, p99=673ms, max=673ms
- Detalle: `{"cuentaId":"cc1e59db-33d7-4afd-bf04-f6e7bc70d295","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":1}`

### C6 stock compartido iter 1/3

- Invariante: OK
- Duracion: 1153ms
- Latencia: p50=748ms, p95=1077ms, p99=1102ms, max=1102ms
- Detalle: `{"productId":"7c85cd7a-18a8-4400-ae1d-8f549dc88d43","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":1}`

### C7 reservas mismo slot iter 1/3

- Invariante: OK
- Duracion: 284ms
- Latencia: p50=179ms, p95=271ms, p99=277ms, max=277ms
- Detalle: `{"fecha":"2095-04-10","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/3

- Invariante: OK
- Duracion: 572ms
- Latencia: p50=367ms, p95=553ms, p99=567ms, max=567ms
- Detalle: `{"cuentaId":"54635eb8-566a-4d6c-8a82-ab0f1f116278","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":2}`

### C6 stock compartido iter 2/3

- Invariante: OK
- Duracion: 799ms
- Latencia: p50=520ms, p95=771ms, p99=777ms, max=777ms
- Detalle: `{"productId":"b685ae69-e16e-4c0c-a813-a0c76c3d34e5","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":2}`

### C7 reservas mismo slot iter 2/3

- Invariante: OK
- Duracion: 275ms
- Latencia: p50=180ms, p95=258ms, p99=269ms, max=269ms
- Detalle: `{"fecha":"2095-04-11","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/3

- Invariante: OK
- Duracion: 539ms
- Latencia: p50=302ms, p95=517ms, p99=535ms, max=535ms
- Detalle: `{"cuentaId":"2a23618d-c851-4c3e-aca3-2c8ec435b663","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":3}`

### C6 stock compartido iter 3/3

- Invariante: OK
- Duracion: 690ms
- Latencia: p50=444ms, p95=659ms, p99=663ms, max=663ms
- Detalle: `{"productId":"4a01e114-9586-4a39-b683-df014854fc4b","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":3}`

### C7 reservas mismo slot iter 3/3

- Invariante: OK
- Duracion: 237ms
- Latencia: p50=151ms, p95=228ms, p99=232ms, max=232ms
- Detalle: `{"fecha":"2095-04-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

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

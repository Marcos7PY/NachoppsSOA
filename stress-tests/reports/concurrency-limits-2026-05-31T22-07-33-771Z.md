# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:07:33.771Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 50
- Iteraciones: 3
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/3 | OK | 50 | {"201":1,"400":49} | 625ms | 75.87 |
| C6 stock compartido iter 1/3 | OK | 60 | {"201":50,"400":10} | 966ms | 60.79 |
| C7 reservas mismo slot iter 1/3 | OK | 50 | {"201":1,"409":49} | 231ms | 209.21 |
| C5 pago duplicado concurrente iter 2/3 | OK | 50 | {"201":1,"400":49} | 602ms | 80.26 |
| C6 stock compartido iter 2/3 | OK | 60 | {"0":14,"201":46} | 15011ms | 3.97 |
| C7 reservas mismo slot iter 2/3 | OK | 50 | {"201":1,"409":49} | 287ms | 168.92 |
| C5 pago duplicado concurrente iter 3/3 | OK | 50 | {"201":1,"400":49} | 604ms | 80 |
| C6 stock compartido iter 3/3 | OK | 60 | {"201":50,"400":10} | 691ms | 83.8 |
| C7 reservas mismo slot iter 3/3 | OK | 50 | {"201":1,"409":49} | 324ms | 150.6 |

## Detalle

### C5 pago duplicado concurrente iter 1/3

- Invariante: OK
- Duracion: 659ms
- Latencia: p50=407ms, p95=625ms, p99=651ms, max=651ms
- Detalle: `{"cuentaId":"494edfbd-82e8-4008-9aa7-adf721c4988c","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":1}`

### C6 stock compartido iter 1/3

- Invariante: OK
- Duracion: 987ms
- Latencia: p50=643ms, p95=966ms, p99=967ms, max=967ms
- Detalle: `{"productId":"8c67b67e-883b-4afb-99fc-76624182bfff","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":1}`

### C7 reservas mismo slot iter 1/3

- Invariante: OK
- Duracion: 239ms
- Latencia: p50=159ms, p95=231ms, p99=233ms, max=233ms
- Detalle: `{"fecha":"2180-01-29","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/3

- Invariante: OK
- Duracion: 623ms
- Latencia: p50=379ms, p95=602ms, p99=619ms, max=619ms
- Detalle: `{"cuentaId":"53c97296-da58-443c-a5e7-287ea29efcc5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":2}`

### C6 stock compartido iter 2/3

- Invariante: OK
- Duracion: 15104ms
- Latencia: p50=453ms, p95=15011ms, p99=15011ms, max=15011ms
- Detalle: `{"productId":"6fbc2b8f-dac8-4edf-9aa0-c43b9968b116","stockInicial":50,"attempts":60,"successfulPedidos":46,"effectiveSuccessfulPedidos":46,"rejectedPedidos":0,"clientTimeouts":14,"stockActual":4,"statuses":{"0":14,"201":46},"iteration":2}`

### C7 reservas mismo slot iter 2/3

- Invariante: OK
- Duracion: 296ms
- Latencia: p50=185ms, p95=287ms, p99=291ms, max=291ms
- Detalle: `{"fecha":"2180-01-30","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/3

- Invariante: OK
- Duracion: 625ms
- Latencia: p50=426ms, p95=604ms, p99=619ms, max=619ms
- Detalle: `{"cuentaId":"15f10f86-e346-4301-9ca4-bd2dc37260df","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":3}`

### C6 stock compartido iter 3/3

- Invariante: OK
- Duracion: 716ms
- Latencia: p50=459ms, p95=691ms, p99=697ms, max=697ms
- Detalle: `{"productId":"553b0129-75f1-4421-99a4-47d325cb0382","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":3}`

### C7 reservas mismo slot iter 3/3

- Invariante: OK
- Duracion: 332ms
- Latencia: p50=277ms, p95=324ms, p99=327ms, max=327ms
- Detalle: `{"fecha":"2180-01-31","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

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

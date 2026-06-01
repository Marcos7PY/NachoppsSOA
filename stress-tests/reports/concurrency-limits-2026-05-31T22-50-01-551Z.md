# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:50:01.552Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 50
- Iteraciones: 3
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/3 | OK | 50 | {"201":1,"400":49} | 605ms | 78.13 |
| C6 stock compartido iter 1/3 | OK | 60 | {"201":50,"400":10} | 944ms | 59.58 |
| C7 reservas mismo slot iter 1/3 | OK | 50 | {"201":1,"409":49} | 254ms | 187.97 |
| C5 pago duplicado concurrente iter 2/3 | OK | 50 | {"201":1,"400":49} | 677ms | 71.02 |
| C6 stock compartido iter 2/3 | OK | 60 | {"201":50,"400":10} | 996ms | 58.42 |
| C7 reservas mismo slot iter 2/3 | OK | 50 | {"201":1,"409":49} | 444ms | 109.41 |
| C5 pago duplicado concurrente iter 3/3 | OK | 50 | {"201":1,"400":49} | 817ms | 58.82 |
| C6 stock compartido iter 3/3 | OK | 60 | {"201":50,"400":10} | 1363ms | 41.78 |
| C7 reservas mismo slot iter 3/3 | OK | 50 | {"201":1,"409":49} | 595ms | 81.3 |

## Detalle

### C5 pago duplicado concurrente iter 1/3

- Invariante: OK
- Duracion: 640ms
- Latencia: p50=405ms, p95=605ms, p99=632ms, max=632ms
- Detalle: `{"cuentaId":"8724fb33-40b2-46b1-9f4b-d5b0eb1342db","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":1}`

### C6 stock compartido iter 1/3

- Invariante: OK
- Duracion: 1007ms
- Latencia: p50=653ms, p95=944ms, p99=954ms, max=954ms
- Detalle: `{"productId":"2be0ddac-f525-424f-aac5-8c34c6d69e2a","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":1}`

### C7 reservas mismo slot iter 1/3

- Invariante: OK
- Duracion: 266ms
- Latencia: p50=168ms, p95=254ms, p99=261ms, max=261ms
- Detalle: `{"fecha":"2094-05-12","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/3

- Invariante: OK
- Duracion: 704ms
- Latencia: p50=468ms, p95=677ms, p99=697ms, max=697ms
- Detalle: `{"cuentaId":"c31e2379-8fe4-4521-b347-ae10d4592760","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":2}`

### C6 stock compartido iter 2/3

- Invariante: OK
- Duracion: 1027ms
- Latencia: p50=656ms, p95=996ms, p99=1001ms, max=1001ms
- Detalle: `{"productId":"ba61e5c2-068a-49e5-ae7a-a1cc80089bdd","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":2}`

### C7 reservas mismo slot iter 2/3

- Invariante: OK
- Duracion: 457ms
- Latencia: p50=338ms, p95=444ms, p99=449ms, max=449ms
- Detalle: `{"fecha":"2094-05-13","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/3

- Invariante: OK
- Duracion: 850ms
- Latencia: p50=523ms, p95=817ms, p99=844ms, max=844ms
- Detalle: `{"cuentaId":"9fd0903c-f640-4adf-93e4-be19a250b89a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":49},"iteration":3}`

### C6 stock compartido iter 3/3

- Invariante: OK
- Duracion: 1436ms
- Latencia: p50=889ms, p95=1363ms, p99=1376ms, max=1376ms
- Detalle: `{"productId":"fa0e1189-39e9-4ec9-93ee-5e75d649f8fb","stockInicial":50,"attempts":60,"successfulPedidos":50,"effectiveSuccessfulPedidos":50,"rejectedPedidos":10,"clientTimeouts":0,"stockActual":0,"statuses":{"201":50,"400":10},"iteration":3}`

### C7 reservas mismo slot iter 3/3

- Invariante: OK
- Duracion: 615ms
- Latencia: p50=372ms, p95=595ms, p99=607ms, max=607ms
- Detalle: `{"fecha":"2094-05-14","hora":"18:15","successCount":1,"conflictCount":49,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

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

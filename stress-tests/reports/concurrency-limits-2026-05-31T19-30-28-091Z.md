# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T19:30:28.092Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 31.25 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 42.55 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 54.05 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 45.8 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 250 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 320ms
- Latencia: p50=233ms, p95=n/a, p99=n/a, max=316ms
- Detalle: `{"mesaId":"f289e951-19d7-4065-9dff-697abf9cafae","productId":"97a6c7e4-a592-4a6d-9dae-6d0eaa8e5b5a","successfulPedidos":10,"cuentaId":"79647720-8b0c-4e74-b060-03c797a6c4e1","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 235ms
- Latencia: p50=210ms, p95=n/a, p99=n/a, max=234ms
- Detalle: `{"fecha":"2043-05-11","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 185ms
- Latencia: p50=136ms, p95=n/a, p99=n/a, max=183ms
- Detalle: `{"cuentaId":"c5f6de2f-20e7-4fad-988b-40b506ee7b03","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 262ms
- Latencia: p50=171ms, p95=n/a, p99=n/a, max=255ms
- Detalle: `{"productId":"74c6b8a9-0618-44d1-932e-bdff750deebf","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 24ms
- Latencia: p50=2ms, p95=n/a, p99=n/a, max=16ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":1},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":2},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":2},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":1},{"label":"token invalido","status":401,"ok":true,"ms":2},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":16}],"iteration":1}`

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

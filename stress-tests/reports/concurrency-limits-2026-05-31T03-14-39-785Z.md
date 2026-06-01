# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T03:14:39.785Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 33.67 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 136.99 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 61.35 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 45.63 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 375 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 297ms
- Latencia: p50=214ms, p95=n/a, p99=n/a, max=292ms
- Detalle: `{"mesaId":"6e5995f1-1239-4499-a18e-d23cf11e2189","productId":"3d608aef-66b1-4423-8e3f-2f24c5517618","successfulPedidos":10,"cuentaId":"71e7e19d-bd31-4d69-97ed-b79d1d4f3382","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 73ms
- Latencia: p50=68ms, p95=n/a, p99=n/a, max=72ms
- Detalle: `{"fecha":"2184-01-28","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 163ms
- Latencia: p50=118ms, p95=n/a, p99=n/a, max=161ms
- Detalle: `{"cuentaId":"e64082db-6a95-48c7-8b41-2365367d950d","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 263ms
- Latencia: p50=172ms, p95=n/a, p99=n/a, max=257ms
- Detalle: `{"productId":"b1cebf54-1959-4f3f-acd4-020039710992","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 16ms
- Latencia: p50=2ms, p95=n/a, p99=n/a, max=9ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":1},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":1},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":1},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":2},{"label":"token invalido","status":401,"ok":true,"ms":2},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":9}],"iteration":1}`

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

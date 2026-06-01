# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T19:37:32.553Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 40.82 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 65.79 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 65.36 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 55.05 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 352.94 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 245ms
- Latencia: p50=168ms, p95=n/a, p99=n/a, max=240ms
- Detalle: `{"mesaId":"24f40b6c-fcd2-41fb-8409-2d5bb53350d4","productId":"dca9f957-50a0-42a8-b332-0ad031bee386","successfulPedidos":10,"cuentaId":"8216e26a-3ec0-4e0d-8b6d-2d0336315118","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 152ms
- Latencia: p50=141ms, p95=n/a, p99=n/a, max=151ms
- Detalle: `{"fecha":"2110-08-02","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 153ms
- Latencia: p50=112ms, p95=n/a, p99=n/a, max=151ms
- Detalle: `{"cuentaId":"d170851f-e432-4b71-b9e0-8f33276c8b7a","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 218ms
- Latencia: p50=143ms, p95=n/a, p99=n/a, max=210ms
- Detalle: `{"productId":"8ec38b40-028b-491b-aea3-b1c95ccb9497","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 17ms
- Latencia: p50=2ms, p95=n/a, p99=n/a, max=9ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":2},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":2},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":1},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":2},{"label":"token invalido","status":401,"ok":true,"ms":1},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":9}],"iteration":1}`

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

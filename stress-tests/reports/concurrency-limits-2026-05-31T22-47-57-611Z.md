# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:47:57.612Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 47.17 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 97.09 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 71.43 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 61.22 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 461.54 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 212ms
- Latencia: p50=148ms, p95=n/a, p99=n/a, max=208ms
- Detalle: `{"mesaId":"3727ba02-59cb-4205-8dec-26b2d4c83639","productId":"ad5e9243-0914-4420-a18c-2b92c7d3545b","successfulPedidos":10,"cuentaId":"fb7cc1b9-d8dd-4a1a-b968-bd4bf130406f","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 103ms
- Latencia: p50=92ms, p95=n/a, p99=n/a, max=101ms
- Detalle: `{"fecha":"2179-03-15","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 140ms
- Latencia: p50=103ms, p95=n/a, p99=n/a, max=139ms
- Detalle: `{"cuentaId":"e3ba1386-30ad-4dfe-b8d7-97414a62b798","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 196ms
- Latencia: p50=123ms, p95=n/a, p99=n/a, max=193ms
- Detalle: `{"productId":"ddecfda9-bda9-4797-819d-2511d352fba0","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 13ms
- Latencia: p50=1ms, p95=n/a, p99=n/a, max=7ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":2},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":1},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":1},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":1},{"label":"token invalido","status":401,"ok":true,"ms":1},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":7}],"iteration":1}`

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

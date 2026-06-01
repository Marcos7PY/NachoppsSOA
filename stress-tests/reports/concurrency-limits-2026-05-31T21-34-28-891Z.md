# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T21:34:28.891Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 41.15 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 102.04 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 64.1 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 52.17 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 285.71 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 243ms
- Latencia: p50=173ms, p95=n/a, p99=n/a, max=238ms
- Detalle: `{"mesaId":"f8c12713-f714-414f-b5b7-67574ba47c8b","productId":"f0ccbf92-e14c-409b-a16b-0d09b56934b6","successfulPedidos":10,"cuentaId":"7d235b26-65e1-4097-96a6-19f1727df051","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 98ms
- Latencia: p50=85ms, p95=n/a, p99=n/a, max=97ms
- Detalle: `{"fecha":"2154-01-08","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 156ms
- Latencia: p50=114ms, p95=n/a, p99=n/a, max=156ms
- Detalle: `{"cuentaId":"178f0dc4-4362-45f6-84e5-a5bf140f6bc9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 230ms
- Latencia: p50=158ms, p95=n/a, p99=n/a, max=223ms
- Detalle: `{"productId":"92768fcf-1d27-4ebd-8eb4-ec980e53ec1d","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 21ms
- Latencia: p50=2ms, p95=n/a, p99=n/a, max=13ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":1},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":2},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":1},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":2},{"label":"token invalido","status":401,"ok":true,"ms":2},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":13}],"iteration":1}`

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

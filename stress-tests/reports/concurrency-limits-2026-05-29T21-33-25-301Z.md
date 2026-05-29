# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-29T21:33:25.301Z
- Base URL: http://localhost:8000
- Rama: codex/concurrency-limits-tests
- Commit: 4f65c4a Merge pull request #2 from Marcos7PY/codex/docker-green-baseline
- Concurrencia base: 8
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 8 | {"201":8} | 179ms | 43.96 |
| C7 reservas mismo slot | OK | 8 | {"201":1,"409":7} | 63ms | 123.08 |
| C5 pago duplicado concurrente | OK | 8 | {"201":1,"400":7} | 113ms | 70.18 |
| C6 stock compartido | OK | 10 | {"201":8,"400":2} | 169ms | 58.82 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | 9ms | 0 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 182ms
- Latencia: p50=133ms, p95=179ms, p99=179ms, max=179ms
- Detalle: `{"mesaId":"b69186f8-2840-4be8-a0fe-374fb4c5e6eb","productId":"b52acebb-7570-45e0-82c5-cd567a3a6cfa","successfulPedidos":8,"cuentaId":"846b5349-684f-4ce5-bb1c-9aba0dee7bb8","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":8,"totalCuenta":78}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 65ms
- Latencia: p50=55ms, p95=63ms, p99=63ms, max=63ms
- Detalle: `{"fecha":"2026-07-08","hora":"18:15","successCount":1,"conflictCount":7,"activeReservationsForSlot":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 114ms
- Latencia: p50=83ms, p95=113ms, p99=113ms, max=113ms
- Detalle: `{"cuentaId":"f2abbefc-13d0-44fd-b18a-7cacfc7ccdd5","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":7}}`

### C6 stock compartido

- Invariante: OK
- Duracion: 170ms
- Latencia: p50=127ms, p95=169ms, p99=169ms, max=169ms
- Detalle: `{"productId":"59272a2e-389b-40a2-a83b-84b68483fd97","stockInicial":8,"attempts":10,"successfulPedidos":8,"stockActual":0,"statuses":{"201":8,"400":2}}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 16ms
- Latencia: p50=2ms, p95=9ms, p99=9ms, max=9ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":2},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":2},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":1},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":1},{"label":"token invalido","status":401,"ok":true,"ms":1},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":9}]}`

## RabbitMQ antes

```text
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
name	messages_ready	messages_unacknowledged	consumers
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
mesas_queue	0	0	1
dlq.pedidos_queue	0	0	0
dlq.reportes_queue	0	0	0
dlq.inventario_queue	0	0	0
caja_queue	0	0	1
pedidos_queue	0	0	1
dlq.cuentas_queue	0	0	0
inventario_queue	0	0	1
dlq.mesas_queue	0	0	0
reportes_queue	0	0	0
notificaciones_queue	0	0	1
dlq.caja_queue	0	0	0
cuentas_queue	0	0	1
```

## Decision

- Aceptado: la corrida focalizada no encontro inconsistencias con la concurrencia configurada.

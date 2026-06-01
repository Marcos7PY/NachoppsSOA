# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T02:35:14.911Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 10
- Iteraciones: 1
- Resultado: 5/5 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C3 misma mesa, muchos pedidos | OK | 10 | {"201":10} | n/a | 35.97 |
| C7 reservas mismo slot | OK | 10 | {"201":1,"409":9} | n/a | 45.45 |
| C5 pago duplicado concurrente | OK | 10 | {"201":1,"400":9} | n/a | 62.5 |
| C6 stock compartido | OK | 12 | {"201":10,"400":2} | n/a | 44.94 |
| S3/S4 seguridad y limites basicos | OK | 6 | {"400":1,"401":5} | n/a | 214.29 |

## Detalle

### C3 misma mesa, muchos pedidos

- Invariante: OK
- Duracion: 278ms
- Latencia: p50=194ms, p95=n/a, p99=n/a, max=274ms
- Detalle: `{"mesaId":"03741338-21bc-4b84-9ece-12d9cbe9e2f8","productId":"c863dd92-3260-4066-b2b2-43292d4e2377","successfulPedidos":10,"cuentaId":"0e601199-53d5-4817-bbae-6a44cbd80c1a","cuentaEstadoAntesDeLimpieza":"ABIERTA","pedidosInCuenta":10,"totalCuenta":97.5,"iteration":1}`

### C7 reservas mismo slot

- Invariante: OK
- Duracion: 220ms
- Latencia: p50=200ms, p95=n/a, p99=n/a, max=219ms
- Detalle: `{"fecha":"2281-08-08","hora":"18:15","successCount":1,"conflictCount":9,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente

- Invariante: OK
- Duracion: 160ms
- Latencia: p50=117ms, p95=n/a, p99=n/a, max=159ms
- Detalle: `{"cuentaId":"f6d64651-d277-4348-b522-706b03596df9","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":9},"iteration":1}`

### C6 stock compartido

- Invariante: OK
- Duracion: 267ms
- Latencia: p50=177ms, p95=n/a, p99=n/a, max=261ms
- Detalle: `{"productId":"195b0e13-b1e0-463a-8e5e-922bb481800e","stockInicial":10,"attempts":12,"successfulPedidos":10,"effectiveSuccessfulPedidos":10,"rejectedPedidos":2,"clientTimeouts":0,"stockActual":0,"statuses":{"201":10,"400":2},"iteration":1}`

### S3/S4 seguridad y limites basicos

- Invariante: OK
- Duracion: 28ms
- Latencia: p50=3ms, p95=n/a, p99=n/a, max=15ms
- Detalle: `{"probes":[{"label":"GET /mesas sin token","status":401,"ok":true,"ms":3},{"label":"GET /pedidos sin token","status":401,"ok":true,"ms":2},{"label":"GET /cuentas sin token","status":401,"ok":true,"ms":2},{"label":"GET /inventario/productos sin token","status":401,"ok":true,"ms":3},{"label":"token invalido","status":401,"ok":true,"ms":3},{"label":"pedido cantidad cero","status":400,"ok":true,"ms":15}],"iteration":1}`

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

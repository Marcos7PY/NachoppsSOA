# Informe de concurrencia, limites y seguridad

- Fecha: 2026-05-31T22:52:41.427Z
- Base URL: http://localhost:8000
- Rama: codex/aplica-auditoria-calidad-backend
- Commit: 31a8ed0 merge: documentacion atomica
- Concurrencia base: 100
- Iteraciones: 3
- Resultado: 9/9 invariantes OK

## Resumen

| Escenario | Invariante | Requests | Status | p95 | RPS |
|---|---:|---:|---|---:|---:|
| C5 pago duplicado concurrente iter 1/3 | OK | 100 | {"201":1,"400":99} | 2448ms | 39.7 |
| C6 stock compartido iter 1/3 | OK | 120 | {"201":100,"400":20} | 1778ms | 65.01 |
| C7 reservas mismo slot iter 1/3 | OK | 100 | {"201":1,"409":99} | 1085ms | 88.65 |
| C5 pago duplicado concurrente iter 2/3 | OK | 100 | {"201":1,"400":99} | 1197ms | 80.91 |
| C6 stock compartido iter 2/3 | OK | 120 | {"201":100,"400":20} | 1654ms | 67.04 |
| C7 reservas mismo slot iter 2/3 | OK | 100 | {"201":1,"409":99} | 692ms | 139.08 |
| C5 pago duplicado concurrente iter 3/3 | OK | 100 | {"201":1,"400":98,"502":1} | 1125ms | 86.21 |
| C6 stock compartido iter 3/3 | OK | 120 | {"201":100,"400":20} | 1970ms | 58.54 |
| C7 reservas mismo slot iter 3/3 | OK | 100 | {"201":1,"409":99} | 864ms | 112.23 |

## Detalle

### C5 pago duplicado concurrente iter 1/3

- Invariante: OK
- Duracion: 2519ms
- Latencia: p50=1772ms, p95=2448ms, p99=2507ms, max=2507ms
- Detalle: `{"cuentaId":"3ba2b670-b005-4dd9-8394-e8ee9666edbc","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":1}`

### C6 stock compartido iter 1/3

- Invariante: OK
- Duracion: 1846ms
- Latencia: p50=1213ms, p95=1778ms, p99=1801ms, max=1806ms
- Detalle: `{"productId":"8fa2bb8c-3078-4aee-b23f-6d2532800b75","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":62,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":38,"statuses":{"201":100,"400":20},"iteration":1}`

### C7 reservas mismo slot iter 1/3

- Invariante: OK
- Duracion: 1128ms
- Latencia: p50=661ms, p95=1085ms, p99=1124ms, max=1124ms
- Detalle: `{"fecha":"2154-01-03","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":1}`

### C5 pago duplicado concurrente iter 2/3

- Invariante: OK
- Duracion: 1236ms
- Latencia: p50=731ms, p95=1197ms, p99=1220ms, max=1220ms
- Detalle: `{"cuentaId":"33288e46-4ce8-4949-859a-569a453a1fb7","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":99},"iteration":2}`

### C6 stock compartido iter 2/3

- Invariante: OK
- Duracion: 1790ms
- Latencia: p50=1167ms, p95=1654ms, p99=1698ms, max=1726ms
- Detalle: `{"productId":"7c2ce6be-fc78-4a26-8968-fb5a5e312d34","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":56,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":44,"statuses":{"201":100,"400":20},"iteration":2}`

### C7 reservas mismo slot iter 2/3

- Invariante: OK
- Duracion: 719ms
- Latencia: p50=388ms, p95=692ms, p99=705ms, max=705ms
- Detalle: `{"fecha":"2154-01-04","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":2}`

### C5 pago duplicado concurrente iter 3/3

- Invariante: OK
- Duracion: 1160ms
- Latencia: p50=662ms, p95=1125ms, p99=1152ms, max=1152ms
- Detalle: `{"cuentaId":"76bf9295-96b2-43a5-8a99-c9bc567637ed","successPayments":1,"transactionsForCuenta":1,"finalCuentaEstado":"CERRADA","statuses":{"201":1,"400":98,"502":1},"iteration":3}`

### C6 stock compartido iter 3/3

- Invariante: OK
- Duracion: 2050ms
- Latencia: p50=1355ms, p95=1970ms, p99=1992ms, max=1997ms
- Detalle: `{"productId":"3bf68a1d-8c34-4e1e-817a-987acc81243e","stockInicial":100,"attempts":120,"successfulPedidos":100,"effectiveSuccessfulPedidos":66,"rejectedPedidos":20,"clientTimeouts":0,"stockActual":34,"statuses":{"201":100,"400":20},"iteration":3}`

### C7 reservas mismo slot iter 3/3

- Invariante: OK
- Duracion: 891ms
- Latencia: p50=531ms, p95=864ms, p99=885ms, max=885ms
- Detalle: `{"fecha":"2154-01-05","hora":"18:15","successCount":1,"conflictCount":99,"clientTimeouts":0,"activeReservationsForSlot":1,"iteration":3}`

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

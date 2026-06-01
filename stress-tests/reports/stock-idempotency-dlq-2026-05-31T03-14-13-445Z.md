# Informe stock idempotency, DLQ y reconciliacion

- Fecha: 2026-05-31T03:14:13.446Z
- Base URL: http://localhost:8000
- Rama: main
- Commit: 31a8ed0 merge: documentacion atomica
- Iteraciones: 1
- Modo alta contencion: no
- Resultado: 12/12 invariantes OK

## Resumen

| Escenario | Invariante |
|---|---:|
| T0 autoridad de stock y direccion de sync | OK |
| D1 redelivery secuencial idempotente pedido.creado | OK |
| D1c redelivery concurrente idempotente | OK |
| R1 reposicion inversa idempotente secuencial y concurrente | OK |
| R2 reposicion como delta durante ventana stale | OK |
| T7 consumo mal etiquetado no infla stock local | OK |
| DLQ inventario declarada y enrutable | OK |
| D2 fallo DLQ divergencia reinyeccion reconvergencia | OK |
| T3 deteccion de profundidad DLQ | OK |
| T9 deteccion de profundidad parking | OK |
| T4 mensaje veneno aparcado tras tope de reinyeccion | OK |
| Colas finales sin pendientes inesperados | OK |

## Detalle

### T0 autoridad de stock y direccion de sync

- Invariante: OK
- Detalle: `{"oversellGuard":"servicio-pedidos.productos_locales, decrementado transaccionalmente al crear pedido","reportingSource":"servicio-inventario.productos, actualizado asincronicamente por pedido.creado","risk":"servicio-pedidos consume producto.actualizado desde inventario; un inventario stale-alto podria re-inflar productos_locales si se emite una actualizacion stale.","evidence":["apps/servicio-pedidos/src/app/app.service.ts:persistirPedido usa productoLocal.updateMany(... stockActual decrement ...)","apps/servicio-pedidos/src/app/events.controller.ts escucha producto.creado/producto.actualizado y llama upsertProductoLocal","apps/servicio-inventario/src/app/app.service.ts procesa pedido.creado y emite producto.actualizado"],"iteration":1}`

### D1 redelivery secuencial idempotente pedido.creado

- Invariante: OK
- Detalle: `{"pedidoId":"933e7049-5b30-474a-bebc-2f9615cae0ff","productId":"0f75dab3-b06b-473a-b0ea-6a485a226b39","stockInicial":12,"cantidad":4,"stockFinal":8,"iteration":1}`

### D1c redelivery concurrente idempotente

- Invariante: OK
- Detalle: `{"duplicateCount":12,"pedidoId":"pedido-d1c-1780197209328-dg0n9k","productId":"a1d9b5d9-04d8-41f2-88fd-31ee4b3e9177","stockInicial":20,"cantidad":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql","dbIndex":"idempotency_keys_pkey\nidempotency_keys_key_key"},"dlqResidue":[],"iteration":1}`

### R1 reposicion inversa idempotente secuencial y concurrente

- Invariante: OK
- Detalle: `{"duplicateCount":12,"eventId":"repo-r1-1780197214124-4ocw6a","productId":"a286b583-cda2-4e53-9c95-b7e44f25f8cd","stockInicial":10,"stockDelta":5,"stockFinal":15,"uniqueEvidence":{"schema":"apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique","migration":"apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql"},"residue":[],"iteration":1}`

### R2 reposicion como delta durante ventana stale

- Invariante: OK
- Detalle: `{"productId":"49c18334-7a70-40d5-8df2-9874385fa6f8","stockInicial":12,"consumo":4,"reposicion":10,"absoluteStaleWouldHaveBeen":22,"expectedDuringStale":18,"pedidosDuranteStale":18,"pedidosFinal":18,"inventarioFinal":18,"iteration":1}`

### T7 consumo mal etiquetado no infla stock local

- Invariante: OK
- Detalle: `{"productId":"8282455d-e50b-465d-a82e-24a62f9e1409","stockInicial":10,"maliciousLabel":"REPOSICION","stockDelta":-4,"stockActualPayload":99,"stockFinal":10,"rule":"REPOSICION solo puede aumentar si stockDelta es positivo y el evento no fue procesado antes","iteration":1}`

### DLQ inventario declarada y enrutable

- Invariante: OK
- Detalle: `{"dlx":"NACHOPPS_DLX","dlq":"dlq.inventario_queue","recovery":"Si el consumidor agota reintentos, RabbitMQRetryInterceptor hace nack(false) y RabbitMQ enruta a esta DLQ.","iteration":1}`

### D2 fallo DLQ divergencia reinyeccion reconvergencia

- Invariante: OK
- Detalle: `{"pedidoId":"bdf13dfa-9bd1-4ffa-b335-84f465ee0cd3","productId":"590e22d4-c21b-48fe-bc6c-6fc08f6b755f","stockInicial":13,"cantidad":4,"pedidosStockDuranteDivergencia":9,"inventarioStockDuranteDivergencia":13,"dlqReadyDuranteFallo":1,"inventarioStockFinal":9,"dlqFinal":{"name":"dlq.inventario_queue","messages_ready":0,"messages_unacknowledged":0,"consumers":0},"iteration":1}`

### T3 deteccion de profundidad DLQ

- Invariante: OK
- Detalle: `{"detected":[{"name":"dlq.inventario_queue","messages_ready":1}],"productionAlertTarget":"health/job que consulte RabbitMQ management/rabbitmqctl y alerte si cualquier dlq.* o parking.* tiene messages_ready > 0","cleanup":"dlq.inventario_queue purgada tras la prueba","iteration":1}`

### T9 deteccion de profundidad parking

- Invariante: OK
- Detalle: `{"detected":[{"name":"parking.inventario_queue","messages_ready":1}],"retention":"idempotency_keys se purga por cron cada hora con retencion de 7 dias en inventario y pedidos","cleanup":"parking.inventario_queue purgada tras la prueba","iteration":1}`

### T4 mensaje veneno aparcado tras tope de reinyeccion

- Invariante: OK
- Detalle: `{"maxReinjections":2,"decision":{"parked":true,"reinjections":2},"parked":{"marker":"qa-poison-1780197249844-ra2x1r","reason":"reinjection limit 2"},"parkingQueue":"parking.inventario_queue","iteration":1}`

### Colas finales sin pendientes inesperados

- Invariante: OK
- Detalle: `{"backlog":[],"iteration":1}`

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

## Recuperacion y deteccion

1. La proyeccion que previene oversell es `servicio-pedidos.productos_locales`; inventario reporta y emite actualizaciones asincronas.
2. Ante fallos, revisar `dlq.inventario_queue`, corregir causa y reinyectar a `nachopps_exchange` con routing key `pedido.creado`.
3. El check de DLQ debe alertar si cualquier `dlq.*` tiene `messages_ready > 0`.
4. Mensajes con `x-reinjection-count >= 2` se aparcan en `parking.inventario_queue` para inspeccion manual.

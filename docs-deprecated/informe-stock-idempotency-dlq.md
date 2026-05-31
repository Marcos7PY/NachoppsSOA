# Informe stock idempotency, DLQ y alta contencion

- Fecha de cierre local: 2026-05-30
- Rama: `codex/stock-idempotency-dlq`
- Base URL: `http://localhost:8000`
- Resultado focalizado final: `npm run probar:stock` OK, 12/12 invariantes
- Reporte final stock: `stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md`
- Resultado integracion final: `npm run probar` OK, 49/49
- RabbitMQ final: todas las colas revisadas quedaron en `0 ready / 0 unacked`

## T0-T4 - Base Conservada

- `servicio-pedidos.productos_locales` sigue siendo la autoridad que previene oversell.
- `servicio-inventario.productos` queda como reporte/reposicion y converge asincronicamente por `pedido.creado`.
- `pedido.creado` en inventario mantiene idempotencia por `idempotency_keys.key @unique`; `P2002` se ackea como "ya procesado".
- El ciclo fallo -> DLQ -> reinyeccion -> reconvergencia queda cubierto por D2.
- La deteccion cubre `dlq.*` y `parking.*`; el parking usa `x-reinjection-count` y `MAX_REINJECTIONS`.

## T5 - Idempotencia Inversa

- Hipotesis confirmada: `servicio-pedidos` consumia `producto.creado` y `producto.actualizado` sin clave idempotente propia.
- Cambio: `apps/servicio-pedidos/prisma/schema.prisma` agrega `IdempotencyKey` con `key @unique`.
- Cambio: `procesarProductoCreado` y `procesarProductoActualizado` reclaman la clave en la misma transaccion que actualiza `productos_locales`.
- `P2002` se trata como evento ya procesado, sin mandar el mensaje a DLQ.
- R1 secuencial y concurrente queda cubierto en `stress-tests/run-stock-idempotency-dlq.js`.

## T6 - Reposicion Como Delta

- Hipotesis confirmada: aplicar reposicion como absoluto podia re-inflar una proyeccion stale.
- Cambio: `producto.actualizado` transporta `stockSyncMode` y `stockDelta`.
- `pedidos` solo aumenta stock local con `stockSyncMode === 'REPOSICION'` y `stockDelta > 0`; el aumento se aplica como delta sobre la proyeccion local.
- R2 cubre reposicion durante ventana stale-alto.

## T7 - Trust Boundary

- `stockSyncMode` ya no basta por si solo para aumentar stock.
- Un consumo mal etiquetado como `REPOSICION` con delta negativo o ausente no infla `productos_locales`.
- Los ecos `CONSUMO_PEDIDO` desde inventario no modifican el stock local de `pedidos`; la autoridad ya desconto al crear el pedido.
- `producto.creado` crea stock inicial si no existe, pero si llega tarde sobre una proyeccion existente no re-infla stock.

### T7 - Limite de confianza de `stockSyncMode` (residual)

`stockSyncMode` es un campo del payload del evento; el gate es tan fiable como el emisor. La defensa efectiva no se apoya solo en la etiqueta: para aumentar `productos_locales` se exige `stockSyncMode === 'REPOSICION'` y `stockDelta > 0`.

- Cubierto: un `CONSUMO_PEDIDO` mal etiquetado como `REPOSICION` llega con delta ausente o no-positivo y no infla el stock local. El gate no falla abierto en este caso.
- Residual asumido: un productor que emita `REPOSICION` con `stockDelta` positivo para un evento que en realidad es consumo. El consumidor no puede distinguirlo solo desde el payload. Mitigacion: el emisor de `producto.actualizado` es un servicio interno confiable que deriva el modo del propio cambio; el endurecimiento adicional, como validar el modo en origen o firmar el evento, queda fuera del alcance de esta fase.

## T8 - Alta Contencion

- D1c/R1 stock high-contention:
  - 50 x 100: `stress-tests/reports/stock-idempotency-dlq-2026-05-30T03-37-50-820Z.md`
  - 100 x 100: `stress-tests/reports/stock-idempotency-dlq-2026-05-30T05-40-26-658Z.md`
  - 200 x 100: `stress-tests/reports/stock-idempotency-dlq-2026-05-30T06-26-26-833Z.md`
- C5/C6/C7:
  - 50 x 100: `stress-tests/reports/concurrency-limits-2026-05-30T18-17-05-697Z.md` - 300/300 invariantes OK
  - 100 x 100: `stress-tests/reports/concurrency-limits-2026-05-30T19-39-26-268Z.md` - 300/300 invariantes OK
  - 200 x 100: `stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md` - 300/300 invariantes OK
- Ajustes necesarios descubiertos por T8:
  - `servicio-reservas` ahora garantiza un unico slot activo `(fecha, hora)` con indice unico parcial y traduce la carrera a `409`.
  - `servicio-pedidos` reserva stock con `UPDATE ... WHERE "stockActual" >= cantidad RETURNING` dentro de la transaccion y usa `pg_advisory_xact_lock` por producto.
  - `stress-tests/run-concurrency-limits.js` separa invariantes de consistencia de sintomas de carga, evita slots aleatorios reutilizados y endurece setup.
  - Kong mantiene defaults `3000/min` y `30000/h`, pero esos limites son parametrizables para corridas de stress controladas.

## T9 - Parking y Retencion

- El runner detecta profundidad en `parking.*` ademas de `dlq.*`.
- `servicio-pedidos` purga `idempotency_keys` procesadas con retencion de 7 dias.
- `servicio-inventario` purga `idempotency_keys` procesadas con la misma retencion de 7 dias.
- En ambos servicios la purga de `idempotency_keys` tiene `@Cron(CronExpression.EVERY_HOUR)` propio y esta fuera de `processOutboxEvents()`, de modo que corre aunque no haya outbox pendiente.
- Decision de alcance: el parking automatizado queda implementado para `parking.inventario_queue`, porque la prueba de poison/reinyeccion de esta fase ejercita el flujo `pedido.creado -> inventario` y su DLQ. No se generaliza a todas las DLQ en esta fase para no cambiar contratos operativos de servicios no cubiertos por el brief.
- Deteccion/alerta: `parking.*` se monitorea junto con `dlq.*`; cualquier mensaje ready en parking debe tratarse con prioridad igual o mayor porque ya representa fallo permanente y requiere intervencion humana.
- `T9 deteccion de profundidad parking` queda cubierto por `npm run probar:stock`.

## Validacion Final

- `npm.cmd exec nx build servicio-inventario`: OK.
- `npm.cmd exec nx build servicio-pedidos`: OK.
- `npm.cmd exec nx build servicio-reservas`: OK.
- `npm.cmd exec nx build servicio-reportes`: OK.
- Unitarias focalizadas:
  - `apps/servicio-pedidos/src/app/app.service.spec.ts`
  - `apps/servicio-pedidos/src/app/events.controller.spec.ts`
  - `apps/servicio-pedidos/src/app/outbox.processor.spec.ts`
  - `apps/servicio-reservas/src/app/reservas.service.spec.ts`
  - `apps/servicio-inventario/src/app/app.service.spec.ts`
  - `apps/servicio-inventario/src/app/outbox.processor.spec.ts`
- `npm.cmd run probar:stock`: OK, 12/12.
- `npm.cmd run probar`: OK, 49/49.
- Colas RabbitMQ finales: `0 ready / 0 unacked`.

## Notas Operativas

- `servicio-reportes` ahora declara `noAck: false` para alinearse con el `RabbitMQRetryInterceptor` que hace ACK/NACK manual.
- Para stress C5/C6/C7 se elevo temporalmente el rate limit global de Kong mediante variables de entorno; al terminar se restauro a `3000/min` y `30000/h`.
- Si aparece una DLQ real: revisar causa, corregir payload/bug, reinyectar con incremento de `x-reinjection-count`; si supera el umbral, aparcar en `parking.*`.

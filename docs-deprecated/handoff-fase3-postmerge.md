# Handoff atomico de resultados - Fase 3

Fecha local de handoff: 2026-05-30  
Workspace: `C:\Users\MARCOS\Desktop\BackActual`  
Rama actual: `main`  
HEAD actual: `31a8ed0 merge: documentacion atomica`  
Merge relevante previo: `4c186bb Merge pull request #5 from Marcos7PY/codex/stock-idempotency-dlq`

## Resultado ejecutivo atomico

Fase 3 quedo retomada desde las pruebas pendientes C5/C6/C7 y cerrada localmente con evidencia propia.

Resultado final de cierre antes del merge:

- C5/C6/C7 con concurrencia `50 x 100`: `300/300 invariantes OK`.
- C5/C6/C7 con concurrencia `100 x 100`: `300/300 invariantes OK`.
- C5/C6/C7 con concurrencia `200 x 100`: `300/300 invariantes OK`.
- `npm.cmd run probar:stock`: `12/12 invariantes OK`.
- `npm.cmd run probar`: `49/49`, `0` fallas.
- RabbitMQ final: todas las colas y DLQ en `0 ready / 0 unacked`.

Resultado final post-merge en `main`:

- `main` actualizado a `4c186bb Merge pull request #5 from Marcos7PY/codex/stock-idempotency-dlq` durante el cierre post-merge.
- Luego el repo avanzo a `31a8ed0 merge: documentacion atomica`.
- Rebuild Nx OK para los cuatro servicios tocados.
- Rebuild Docker OK para las cuatro imagenes de servicios tocados.
- Contenedores recreados y arriba.
- Kong healthy.
- Migraciones/indices verificados en DB.
- `npm.cmd run probar`: `49/49`, `0` fallas.
- `npm.cmd run probar:stock`: `12/12 invariantes OK`.
- RabbitMQ final post-merge: todas las colas revisadas quedaron en `0 ready / 0 unacked`.

El cierre post-merge incluyo:

- `main` sincronizado con `origin/main`.
- Rama `codex/stock-idempotency-dlq` eliminada local y remota despues del merge.
- Rebuild Nx OK para `servicio-inventario`, `servicio-pedidos`, `servicio-reservas` y `servicio-reportes`.
- Rebuild Docker explicito de las cuatro imagenes de servicios tocados.
- Recreate de contenedores de esos servicios y Kong.
- Verificacion de migraciones/indices en DB.
- Smoke tests post-merge en verde.
- RabbitMQ final sin mensajes pendientes ni unacked.

## Matriz atomica de resultados de Fase 3

| Bloque | Objetivo | Evidencia | Resultado | Estado |
|---|---|---|---|---|
| C5/C6/C7 50x100 | Concurrencia base 50 durante 100 iteraciones | `stress-tests/reports/concurrency-limits-2026-05-30T18-17-05-697Z.md` | `300/300 invariantes OK` | Cerrado |
| C5/C6/C7 100x100 | Concurrencia base 100 durante 100 iteraciones | `stress-tests/reports/concurrency-limits-2026-05-30T19-39-26-268Z.md` | `300/300 invariantes OK` | Cerrado |
| C5/C6/C7 200x100 | Concurrencia base 200 durante 100 iteraciones | `stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md` | `300/300 invariantes OK` | Cerrado |
| Stock/DLQ final | Idempotencia, DLQ, parking, reinyeccion, divergencia/reconvergencia | `stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md` | `12/12 invariantes OK` | Cerrado |
| Integracion final | Flujos funcionales, seguridad basica, health checks | `docs/informe-pruebas.md` | `49/49`, `0` fallas | Cerrado |
| RabbitMQ final | Sin backlog ni mensajes unacked | `rabbitmqctl list_queues name messages_ready messages_unacknowledged` | todas las colas `0 ready / 0 unacked` | Cerrado |
| V1 cierre auditable | Paralelismo real y contencion real | `docs/verificacion-cierre-fase3.md` | OK | Cerrado |
| V2 cierre auditable | Higiene de metricas sin p95/p99 indebidos ni RPS=0 por bug | `docs/verificacion-cierre-fase3.md` | OK | Cerrado |
| V3 cierre auditable | Residual de `stockSyncMode` documentado | `docs/verificacion-cierre-fase3.md`, `docs/informe-stock-idempotency-dlq.md` | OK | Cerrado |
| V4 cierre auditable | Retencion/parking simetricos y documentados | `docs/verificacion-cierre-fase3.md`, specs de outbox | OK | Cerrado |
| Post-merge integracion | Smoke funcional en `main` despues del merge | `npm.cmd run probar` | `49/49`, `0` fallas | Cerrado |
| Post-merge stock | Smoke stock/DLQ en `main` despues del merge | `npm.cmd run probar:stock` | `12/12 invariantes OK` | Cerrado |

## Detalle atomico - C5/C6/C7

### Corrida 50 x 100

Reporte:

```text
stress-tests/reports/concurrency-limits-2026-05-30T18-17-05-697Z.md
```

Resumen del reporte:

```text
Concurrencia base: 50
Iteraciones: 100
Resultado: 300/300 invariantes OK
```

Muestra de contencion real en iteracion 1:

```text
C5 pago duplicado concurrente: 50 requests -> {"201":1,"400":49}
C6 stock compartido: 60 requests -> {"201":50,"400":10}
C7 reservas mismo slot: 50 requests -> {"201":1,"409":49}
```

Criterios cerrados:

- C5: solo un pago exitoso para la misma cuenta; los demas intentos concurrentes fueron rechazados.
- C6: exitos <= stock disponible; rechazos cuando se agota stock; sin oversell.
- C7: una sola reserva activa para el slot; N-1 conflictos.

### Corrida 100 x 100

Reporte:

```text
stress-tests/reports/concurrency-limits-2026-05-30T19-39-26-268Z.md
```

Resumen del reporte:

```text
Concurrencia base: 100
Iteraciones: 100
Resultado: 300/300 invariantes OK
```

Muestra de contencion real en iteracion 1:

```text
C5 pago duplicado concurrente: 100 requests -> {"201":1,"400":99}
C6 stock compartido: 120 requests -> {"201":100,"400":20}
C7 reservas mismo slot: 100 requests -> {"201":1,"409":99}
```

Criterios cerrados:

- C5: exactamente 1 pago exitoso, 99 rechazos.
- C6: 100 pedidos aceptados contra stock 100, 20 rechazos; sin stock negativo.
- C7: exactamente 1 reserva creada, 99 conflictos.

### Corrida 200 x 100

Reporte:

```text
stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md
```

Resumen del reporte:

```text
Concurrencia base: 200
Iteraciones: 100
Resultado: 300/300 invariantes OK
```

Muestra de contencion real en iteracion 1:

```text
C5 pago duplicado concurrente: 200 requests -> {"201":1,"400":199}
C6 stock compartido: 240 requests -> {"201":200,"400":40}
C7 reservas mismo slot: 200 requests -> {"201":1,"409":199}
```

Criterios cerrados:

- C5: exactamente 1 pago exitoso, 199 rechazos.
- C6: 200 pedidos aceptados contra stock 200, 40 rechazos; sin oversell.
- C7: exactamente 1 reserva creada, 199 conflictos.

### Interpretacion de C5/C6/C7

- `C5` valida carrera sobre pago duplicado: el sistema permite un solo pago/cierre efectivo por cuenta.
- `C6` valida carrera sobre stock compartido: la reserva atomica en DB impide vender mas unidades que el stock disponible.
- `C7` valida carrera sobre reservas del mismo slot: el indice unico parcial y el manejo de `P2002` fuerzan un solo slot activo.
- Los runners usan `Promise.all` para lanzar workers concurrentes; no fue una secuencia escalonada disfrazada.
- En C7 se observan `N-1` respuestas `409`, lo cual demuestra contencion real.
- En C5 el rechazo se expresa como `400` por contrato actual de caja/cuentas, pero la invariante cerrada es la misma: 1 exito y N-1 rechazos.

## Detalle atomico - `npm.cmd run probar:stock`

Comando:

```powershell
npm.cmd run probar:stock
```

Reporte final pre-merge:

```text
stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md
```

Resultado:

```text
12/12 invariantes OK
```

Invariantes cerradas:

- T0 autoridad de stock y direccion de sync.
- D1 redelivery secuencial idempotente de `pedido.creado`.
- D1c redelivery concurrente idempotente.
- R1 reposicion inversa idempotente secuencial y concurrente.
- R2 reposicion como delta durante ventana stale.
- T7 consumo mal etiquetado no infla stock local.
- DLQ de inventario declarada y enrutable.
- D2 fallo -> DLQ -> divergencia -> reinyeccion -> reconvergencia.
- T3 deteccion de profundidad DLQ.
- T9 deteccion de profundidad parking.
- T4 mensaje veneno aparcado tras tope de reinyeccion.
- Colas finales sin pendientes inesperados.

Resultado post-merge:

```text
npm.cmd run probar:stock
12/12 invariantes OK
```

Reporte post-merge nuevo sin trackear:

```text
stress-tests/reports/stock-idempotency-dlq-2026-05-31T02-34-42-908Z.md
```

## Detalle atomico - `npm.cmd run probar`

Comando:

```powershell
npm.cmd run probar
```

Resultado final:

```text
Total: 49
Exitosas: 49
Fallidas: 0
```

Flujos cubiertos:

- Flujo 1: pedido -> cuenta automatica -> pago -> liberacion de mesa.
- Flujo 2: multiples pedidos a la misma mesa sobre la misma cuenta.
- Flujo 3: reutilizacion de mesa despues de pago con nueva cuenta.
- Flujo 4: varias mesas en simultaneo.
- Flujo 5: metodos de pago `EFECTIVO`, `TARJETA`, `YAPE`, `TRANSFERENCIA`.
- Flujo 6: validaciones y edge cases.
- Flujo 7: reduccion de stock.
- Flujo 8: health check de servicios.
- Regresion C1/A1/A4: JWT, auth y payloads invalidos.

Resultado post-merge:

```text
npm.cmd run probar
49/49
0 fallas
```

## Detalle atomico - RabbitMQ final

Comando:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged
```

Resultado final observado:

```text
parking.inventario_queue  0  0
mesas_queue               0  0
dlq.pedidos_queue         0  0
dlq.reportes_queue        0  0
dlq.inventario_queue      0  0
caja_queue                0  0
pedidos_queue             0  0
dlq.cuentas_queue         0  0
dlq.mesas_queue           0  0
inventario_queue          0  0
reportes_queue            0  0
notificaciones_queue      0  0
dlq.caja_queue            0  0
cuentas_queue             0  0
```

Criterio cerrado:

- No quedaron mensajes ready.
- No quedaron mensajes unacknowledged.
- No quedaron DLQ con backlog.
- No quedo parking con backlog.

## Cambios principales ya integrados

- `servicio-pedidos`
  - Idempotencia inversa para eventos de inventario con tabla `idempotency_keys`.
  - Reserva de stock atomica en DB con `UPDATE ... WHERE stockActual >= cantidad RETURNING`.
  - `pg_advisory_xact_lock` por producto para serializar mutaciones de proyeccion local.
  - `producto.creado` tardio ya no re-infla una proyeccion existente.
  - `CONSUMO_PEDIDO` no modifica stock local en pedidos.

- `servicio-inventario`
  - Idempotencia para consumo de `pedido.creado`.
  - Outbox y retencion de `idempotency_keys` por cron.
  - Flujo DLQ, reinyeccion y parking cubierto por runner focalizado.

- `servicio-reservas`
  - Indice unico parcial para slot activo `(fecha, hora)` con estados `PENDIENTE` y `CONFIRMADA`.
  - Dedupe defensivo en arranque para reservas activas duplicadas previas.
  - Carrera de reserva traducida a `409`.

- `servicio-reportes`
  - RMQ alineado con ACK/NACK manual usando `noAck: false`.
  - Esto corrigio el caso observado en Docker Desktop: `PRECONDITION_FAILED - unknown delivery tag`.

- Infra/stress/docs
  - Rate limit global de Kong parametrizado y restaurado a defaults.
  - Runners de stress endurecidos para C5/C6/C7 y stock/DLQ.
  - Informes de cierre y verificacion agregados en `docs/`.

## Evidencia post-merge ejecutada

Comandos ejecutados despues del merge:

```powershell
git pull --ff-only origin main
npm.cmd exec -- nx run-many --targets=build --projects=servicio-inventario,servicio-pedidos,servicio-reservas,servicio-reportes --parallel=4
docker build --build-arg APP_NAME=servicio-inventario -t infra-servicio-inventario .
docker build --build-arg APP_NAME=servicio-pedidos -t infra-servicio-pedidos .
docker build --build-arg APP_NAME=servicio-reservas -t infra-servicio-reservas .
docker build --build-arg APP_NAME=servicio-reportes -t infra-servicio-reportes .
docker compose -f infra/docker-compose.yml up -d --force-recreate --no-deps servicio-inventario servicio-pedidos servicio-reservas servicio-reportes
npm.cmd run probar
npm.cmd run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged
```

Resultados:

- `npm.cmd run probar`: `49/49`, `0` fallas.
- `npm.cmd run probar:stock`: `12/12 invariantes OK`.
- RabbitMQ: todas las colas revisadas quedaron en `0 ready / 0 unacked`.
- Contenedores tocados: arriba; Kong healthy.

Checks DB confirmados:

- `pedidos_db.public.idempotency_keys`: existe.
- `inventario_db.public.idempotency_keys`: existe.
- `reservas_db` indice `Reserva_fecha_hora_active_unique`: existe.

## Evidencia adicional actual sin trackear

Despues del avance a `31a8ed0`, existen tres reportes nuevos sin trackear:

- `stress-tests/reports/security-limits-2026-05-31T02-32-20-677Z.md`
  - Resultado observado: `7/7 invariantes OK`.
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T02-34-42-908Z.md`
  - Resultado observado: `12/12 invariantes OK`.
- `stress-tests/reports/concurrency-limits-2026-05-31T02-35-14-911Z.md`
  - Resultado observado: `5/5 invariantes OK`.

No fueron agregados al commit durante esta sesion. Decidir si se quieren conservar como evidencia adicional o eliminarlos como artefactos locales.

## Estado git actual

`git status --short --branch` al crear este handoff:

```text
## main...origin/main
?? stress-tests/reports/concurrency-limits-2026-05-31T02-35-14-911Z.md
?? stress-tests/reports/security-limits-2026-05-31T02-32-20-677Z.md
?? stress-tests/reports/stock-idempotency-dlq-2026-05-31T02-34-42-908Z.md
```

Este archivo de handoff tambien queda nuevo sin trackear hasta que se haga `git add`.

## Documentos importantes

- `docs/informe-stock-idempotency-dlq.md`
- `docs/verificacion-cierre-fase3.md`
- `docs/informe-pruebas.md`
- `docs/continuacion-stock-idempotency-dlq.md`
- `docs/revision-sistema-fase3-para-codex.md`

Nota importante de auditoria: la revision externa/documental validaba coherencia entre reportes y brief. La correccion del sistema en ejecucion se sostiene por las corridas locales propias (`probar`, `probar:stock`, runners de stress y colas 0/0), no por una ejecucion externa atribuida a Claude.

## Cosas a vigilar

- Si se despliega en otro ambiente, asegurar que corran las migraciones de:
  - `apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys`
  - `apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys`
  - `apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot`
- La purga de `idempotency_keys` ya fue confirmada fuera del camino de outbox pendiente:
  - `apps/servicio-pedidos/src/app/outbox.processor.ts`
  - `apps/servicio-inventario/src/app/outbox.processor.ts`
  - pruebas focalizadas en sus respectivos `outbox.processor.spec.ts`.
- El parking automatizado de esta fase es especifico para `parking.inventario_queue`; `parking.*` debe monitorearse con prioridad igual o mayor que `dlq.*`.
- Los reportes nuevos sin trackear pueden ensuciar futuras revisiones si no se agregan o eliminan.

## Siguiente paso recomendado

1. Decidir que hacer con los tres reportes nuevos sin trackear.
2. Decidir si este handoff se commitea o queda solo como nota local.
3. Si se va a seguir con otra fase, partir desde `main` actualizado y mantener los runners como evidencia reproducible.

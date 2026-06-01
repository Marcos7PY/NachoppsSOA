# Handoff resiliencia real

- Fecha local: 2026-05-31 14:42:06 -05:00 America/Lima
- Workspace: `C:\Users\MARCOS\Desktop\BackActual`
- Branch: `main`
- Commit: `31a8ed0`
- Gateway: `http://localhost:8000`
- Resultado: cerrado con observacion operativa inicial

## Resumen ejecutivo

Se ejecuto el plan de resiliencia real desde `docs/operacion/plan-resiliencia-ci-produccion.md` para backend local Docker. El sistema supero preflight, reinicios de servicios, reinicio de RabbitMQ, reinicios de DB criticas y smoke final sin corrupcion funcional ni backlog final en RabbitMQ.

Observacion inicial: al comenzar, Docker Desktop no estaba activo. Se inicio Docker Desktop localmente, luego se levanto la stack con `docker compose -f infra/docker-compose.yml --profile all up -d --wait --wait-timeout 180`. No se borraron volumenes.

## Estado local previo

```text
## main...origin/main
 M apps/servicio-pedidos/src/app/app.service.spec.ts
 M apps/servicio-pedidos/src/app/app.service.ts
?? docs/handoff-fase3-postmerge.md
?? docs/handoff-pruebas-tope-resiliencia-pentest.md
?? docs/informe-pruebas.md
?? docs/operacion/plan-pruebas-tope-resiliencia-pentest.md
?? docs/operacion/plan-resiliencia-ci-produccion.md
?? stress-tests/reports/*.md
```

Los cambios locales previos no se revirtieron.

## Comandos ejecutados

```powershell
Get-Content -Raw docs/operacion/plan-resiliencia-ci-produccion.md
Get-Content -Raw docs/handoff-pruebas-tope-resiliencia-pentest.md
git status --short --branch
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing -TimeoutSec 5
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers

Start-Process -FilePath 'C:\Program Files\Docker\Docker\Docker Desktop.exe' -WindowStyle Hidden
docker compose -f infra/docker-compose.yml --profile all up -d --wait --wait-timeout 180

npm run probar
Start-Sleep -Seconds 70
npm run probar:stock

docker restart nachopps-servicio-inventario
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-inventario

docker restart nachopps-servicio-pedidos
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-pedidos

docker restart nachopps-servicio-reservas
Start-Sleep -Seconds 20
npm run probar:concurrencia
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-reservas

docker restart nachopps-rabbitmq
Start-Sleep -Seconds 40
docker ps --format "table {{.Names}}\t{{.Status}}"
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers

docker restart nachopps-db-pedidos
Start-Sleep -Seconds 30
docker restart nachopps-servicio-pedidos
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers

docker restart nachopps-db-inventario
Start-Sleep -Seconds 30
docker restart nachopps-servicio-inventario
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers

docker restart nachopps-db-reservas
Start-Sleep -Seconds 30
docker restart nachopps-servicio-reservas
Start-Sleep -Seconds 20
npm run probar:concurrencia
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers

npm run probar
Start-Sleep -Seconds 70
npm run probar:stock
Start-Sleep -Seconds 70
npm run probar:seguridad
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
git status --short --branch
```

## Resultados por bloque

### Preflight

- Primer intento bloqueado por Docker apagado: el daemon no respondia y Kong no aceptaba conexion.
- Se levanto Docker Desktop y luego la stack `all`.
- Compose reporto contenedores principales healthy.
- Kong respondio en raiz con `404`, esperado porque no hay route raiz.
- RabbitMQ inicial quedo sin backlog inesperado: todas las colas revisadas en `0 ready / 0 unacked`.
- `npm run probar`: `49/49`, `0` fallas.
- `npm run probar:stock`: `12/12` invariantes OK.

### Reinicio de inventario

- `docker restart nachopps-servicio-inventario`.
- `npm run probar:stock`: `12/12` OK.
- RabbitMQ final: `0 ready / 0 unacked`.
- Logs relevantes: Prisma schema en sync, servicio conectado a `inventario_db`, microservicio iniciado y cola `inventario_queue` atada a `pedido.creado`.
- Observacion de logs: aparecen errores "Fallo QA controlado" y envio a DLQ propios del runner DLQ; no quedaron residuos.

### Reinicio de pedidos

- `docker restart nachopps-servicio-pedidos`.
- `npm run probar:stock`: `12/12` OK.
- RabbitMQ final: `0 ready / 0 unacked`.
- Logs relevantes: Prisma schema en sync, servicio conectado a `pedidos_db`, `pedidos_queue` atada a eventos de pago, mesas y productos.
- Observacion de logs: warnings de eventos `producto.actualizado` ya procesados, esperados por validacion de idempotencia.

### Reinicio de reservas

- `docker restart nachopps-servicio-reservas`.
- `npm run probar:concurrencia`: `5/5` OK.
- C7 reservas mismo slot: OK.
- RabbitMQ final: `0 ready / 0 unacked`.
- Logs relevantes: Prisma schema en sync, servicio conectado a `reservas_db`, servicio iniciado.

### Reinicio de RabbitMQ

- `docker restart nachopps-rabbitmq`.
- RabbitMQ volvio healthy.
- `npm run probar:stock`: `12/12` OK.
- Consumidores reconectados en colas principales: `mesas_queue`, `caja_queue`, `pedidos_queue`, `inventario_queue`, `reportes_queue`, `notificaciones_queue`, `cuentas_queue`.
- RabbitMQ final: `0 ready / 0 unacked`.

### Reinicio de DB pedidos

- `docker restart nachopps-db-pedidos`.
- `docker restart nachopps-servicio-pedidos`.
- `npm run probar:stock`: `12/12` OK.
- RabbitMQ final: `0 ready / 0 unacked`.

### Reinicio de DB inventario

- `docker restart nachopps-db-inventario`.
- `docker restart nachopps-servicio-inventario`.
- `npm run probar:stock`: `12/12` OK.
- RabbitMQ final: `0 ready / 0 unacked`.

### Reinicio de DB reservas

- `docker restart nachopps-db-reservas`.
- `docker restart nachopps-servicio-reservas`.
- `npm run probar:concurrencia`: `5/5` OK.
- C7 reservas mismo slot: OK.
- RabbitMQ final: `0 ready / 0 unacked`.

## Smoke final

- `npm run probar`: `49/49`, `0` fallas.
- `npm run probar:stock`: `12/12` invariantes OK.
- `npm run probar:seguridad`: `7/7` OK.
- Rate limit login validado por Kong: `{"401":2,"429":8}`.
- RabbitMQ final: todas las colas revisadas en `0 ready / 0 unacked`.
- Docker final: contenedores principales arriba; Kong, RabbitMQ y DB criticas healthy donde aplica.

## Reportes generados en esta ejecucion

- `docs/informe-pruebas.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-26-32-956Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-28-08-631Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-29-33-358Z.md`
- `stress-tests/reports/concurrency-limits-2026-05-31T19-30-28-091Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-32-17-148Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-34-11-345Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-36-06-137Z.md`
- `stress-tests/reports/concurrency-limits-2026-05-31T19-37-32-552Z.md`
- `stress-tests/reports/stock-idempotency-dlq-2026-05-31T19-40-32-365Z.md`
- `stress-tests/reports/security-limits-2026-05-31T19-41-51-736Z.md`

## Estado final RabbitMQ

```text
name                         ready  unacked  consumers
parking.inventario_queue     0      0        0
mesas_queue                  0      0        1
dlq.pedidos_queue            0      0        0
dlq.reportes_queue           0      0        0
dlq.inventario_queue         0      0        0
caja_queue                   0      0        1
pedidos_queue                0      0        1
dlq.cuentas_queue            0      0        0
inventario_queue             0      0        1
dlq.mesas_queue              0      0        0
reportes_queue               0      0        1
notificaciones_queue         0      0        1
dlq.caja_queue               0      0        0
cuentas_queue                0      0        1
```

## Estado final Docker

Contenedores principales arriba:

- `nachopps-kong`: healthy.
- `nachopps-rabbitmq`: healthy.
- DB criticas `pedidos`, `inventario`, `reservas`: healthy.
- Servicios `pedidos`, `inventario`, `reservas`, `cuentas`, `mesas`, `caja`, `reportes`, `notificaciones`, `identidad`: arriba.
- Observabilidad local `prometheus`, `grafana`, `jaeger`: arriba.

## Conclusion

Cerrado con observacion operativa inicial. La resiliencia real local quedo validada para reinicios individuales de servicios, RabbitMQ y DB criticas, con smoke final verde y sin backlog en RabbitMQ. La observacion no es funcional del backend: Docker Desktop estaba apagado al inicio y se levanto antes de ejecutar el plan.

Despues de esta validacion se avanzo CI rapido y CI de integracion Docker en GitHub Actions:

- `.github/workflows/ci.yml`: ahora calcula `NX_BASE`/`NX_HEAD`, ejecuta `npm exec -- nx affected -t build test` y sube logs si falla.
- `.github/workflows/integration-docker.yml`: workflow manual y en `main` que construye imagenes, levanta Compose, siembra admin, ejecuta `npm run probar`, `npm run probar:stock` y `npm run probar:seguridad`, y sube reportes/artifacts.

Queda fuera de esta ejecucion: resolver la separacion de rate limit para alta contencion extrema `200 x 100`, CI pesado manual/nightly de stress/resiliencia, CD staging/produccion, backups/restore, dashboards, alertas y runbooks de operacion.

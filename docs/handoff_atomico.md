# Handoff atomico - planeamiento continuacion

Fecha de cierre local: 2026-06-07

## Workspace

- Repo: `C:\Users\MARCOS\Desktop\BackActual`
- Rama: `chore/production-audit-fixes`
- Estado git: working tree masivamente sucio desde antes de esta ejecucion.
- No se hizo `commit`, `push` ni `PR` para no mezclar cambios preexistentes/ajenos con los cambios de esta continuacion.

## Trabajo realizado

### C5 - `meseroId` end-to-end

C5 quedo implementado y verificado contra el stack Docker.

- JWT propaga `nombre`.
- `@UsuarioActual()` soporta campos como `nombre`, `email` y `payload`.
- `servicio-pedidos` persiste `meseroId` y `meseroNombre` en pedido/items.
- `servicio-cuentas` deriva el mesero al cerrar cuenta y lo publica en `CuentaCerradaPayload`.
- `servicio-reportes` ya recibe datos reales para `/reportes/por-mesero`.

Archivos clave:

- `libs/observabilidad/src/lib/user.decorator.ts`
- `libs/shared-auth/src/lib/jwt.strategy.ts`
- `libs/shared-auth/src/lib/jwt.strategy.spec.ts`
- `apps/servicio-identidad/src/auth/auth.service.ts`
- `apps/servicio-identidad/src/auth/jwt.strategy.ts`
- `apps/servicio-identidad/src/auth/jwt.strategy.spec.ts`
- `libs/contracts/src/domains/pedidos.ts`
- `apps/servicio-pedidos/prisma/schema.prisma`
- `apps/servicio-pedidos/prisma/migrations/20260606000000_add_mesero_to_pedidos/migration.sql`
- `apps/servicio-pedidos/src/app/app.controller.ts`
- `apps/servicio-pedidos/src/app/app.service.ts`
- `apps/servicio-pedidos/src/app/app.service.spec.ts`
- `apps/servicio-pedidos/src/app/types.ts`
- `apps/servicio-cuentas/src/app/app.service.ts`
- `apps/servicio-cuentas/src/app/app.service.spec.ts`

### C6 - matriz completa de alta contencion

C6 quedo ejecutado y cerrado localmente.

Se endurecieron los runners para que la prueba mida invariantes reales y no ruido operacional:

- `stress-tests/run-concurrency-limits.js`
  - Refresh proactivo del access token antes de expirar.
  - Reintento serializado ante 401.
- `stress-tests/run-stock-idempotency-dlq.js`
  - Espera de drenaje real de colas finales.
  - Timeout configurable via `QUEUE_DRAIN_TIMEOUT_MS`.
  - Retry controlado para errores transitorios de transporte (`ECONNRESET`, status 0/502/503/504).
  - Retry de canal RabbitMQ ante cortes transitorios.

La matriz se ejecuto en niveles `50`, `100` y `200`, con `100` iteraciones por runner:

- Stock D1c/R1: 300/300 invariantes OK por nivel.
- Concurrencia C5/C6/C7: 300/300 invariantes OK por nivel.

Reportes finales relevantes (cifras canónicas consolidadas en
[`stress-tests/reports/BASELINE.md`](../stress-tests/reports/BASELINE.md); los reportes por
corrida con _timestamp_ salieron del control de versiones en T-20 y quedan en el historial de git):

- nivel 50 stock + concurrencia, 300/300.
- nivel 100 stock + concurrencia, 300/300.
- nivel 200 stock + concurrencia, 300/300.

Notas de ejecucion:

- La primera corrida completa paso niveles 50 y 100, pero en stock nivel 200 tuvo 294/300 por cortes transitorios (`ECONNRESET`/status 0), con colas limpias.
- Se parcheo el arnes con retry transitorio y se relanzo solo `HIGH_CONTENTION_LEVELS=200`.
- El relanzamiento nivel 200 termino con `.exit = 0`, sin `FAIL`, sin `429` y sin `token expired`.

## Verificacion ejecutada

- `npx prisma generate --schema apps/servicio-pedidos/prisma/schema.prisma`: OK.
- `npm exec -- nx run-many --target=build --projects=servicio-pedidos,servicio-cuentas,servicio-identidad`: OK.
- Tests focales con coverage desactivado para los specs tocados: OK.
- `npx vitest run`: 200/200 tests OK; cobertura sobre umbrales.
- Drift Prisma contra shadow DB: 9 servicios sin drift.
- `docker compose -f infra/docker-compose.yml --profile all up -d --force-recreate --wait`: OK.
- `scripts/build-all-services.sh`: imagenes backend reconstruidas OK.
- `node scripts/seed-admin.js`: OK.
- `npm run poblar`: OK.
- `npm run probar`: 49/49 OK.
- `npm run probar:stock`: 12/12 OK.
- `npm run probar:seguridad`: 7/7 OK.
- C5 end-to-end vivo:
  - Pedido autenticado con Admin.
  - Pago y cierre de cuenta.
  - `/reportes/por-mesero` subio de 3282 a 3283 ventas.
  - Ingresos subieron de 25172 a 25177.

## Estado del stack local

Al cierre de la ejecucion, los contenedores principales seguian healthy:

- `nachopps-kong`
- `nachopps-servicio-*`
- `nachopps-db-*`
- `nachopps-rabbitmq`

No quedo proceso `node` de la matriz de alta contencion en ejecucion.

## Cambios locales relevantes

Archivos modificados por esta continuacion:

- `apps/servicio-cuentas/src/app/app.service.ts`
- `apps/servicio-cuentas/src/app/app.service.spec.ts`
- `apps/servicio-identidad/src/auth/auth.service.ts`
- `apps/servicio-identidad/src/auth/jwt.strategy.ts`
- `apps/servicio-identidad/src/auth/jwt.strategy.spec.ts`
- `apps/servicio-pedidos/prisma/schema.prisma`
- `apps/servicio-pedidos/prisma/migrations/20260606000000_add_mesero_to_pedidos/migration.sql`
- `apps/servicio-pedidos/src/app/app.controller.ts`
- `apps/servicio-pedidos/src/app/app.service.ts`
- `apps/servicio-pedidos/src/app/app.service.spec.ts`
- `apps/servicio-pedidos/src/app/types.ts`
- `libs/contracts/src/domains/pedidos.ts`
- `libs/observabilidad/src/lib/user.decorator.ts`
- `libs/shared-auth/src/lib/jwt.strategy.ts`
- `libs/shared-auth/src/lib/jwt.strategy.spec.ts`
- `stress-tests/run-concurrency-limits.js`
- `stress-tests/run-stock-idempotency-dlq.js`

Nuevos reportes generados: corridas de stock y concurrencia (nivel 200) y sus intermedios.
Cifras canónicas en [`stress-tests/reports/BASELINE.md`](../stress-tests/reports/BASELINE.md);
los `*.md` por corrida ya no se versionan (T-20), quedan en el historial de git.

## Pendientes

### C1 - commit, push y PR

Pendiente. Requiere decision explicita porque el working tree trae muchos cambios preexistentes.

Recomendacion: no usar `git add .`. Hacer commits tematicos y revisar cuidadosamente que archivos/reportes incluir.

### C7 - CI real

Pendiente. Depende de abrir PR real y observar `integration-docker.yml`/Playwright en GitHub Actions.

### C2 - despliegue prod con Docker secrets

Pendiente. Requiere secretos reales de produccion:

- JWT private/public key.
- Service JWT secret.
- RabbitMQ URI.
- Database URLs por servicio.

### C4 - Slack real

Pendiente. Requiere webhook real de Slack y configurar `SLACK_WEBHOOK_URL`/Alertmanager.

## Siguiente paso recomendado

1. Revisar `git status --short`.
2. Separar commits:
   - `feat(pedidos): propagar mesero en pedidos y cuentas`
   - `test(reportes): cubrir mesero end-to-end`
   - `test(stress): endurecer runners de alta contencion`
3. Decidir si los reportes generados deben versionarse o mantenerse solo como evidencia local.
4. Abrir PR y validar C7 en CI real.

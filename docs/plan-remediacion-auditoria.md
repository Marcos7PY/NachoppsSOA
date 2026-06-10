# Plan de Remediación Atómico — NachoPps (v3)

> **Convención (alineada con `docs/invariantes/` y `docs/handoff_atomico.md`):**
> cada tarea es una unidad independiente — **1 tarea = 1 PR** — con:
> `Evidencia` (referencias `archivo:línea` **verificadas contra el código**),
> `Cambio`, `Archivos`, `Verificación` (comando o test concreto) y `Depende de`.
>
> **v3:** incorpora (a) las 5 decisiones del equipo (T-04, T-15, T-16, T-19, T-20) y
> (b) cinco hallazgos nuevos de la pasada granular sobre lógica de negocio, mensajería,
> infra y PWA: **T-23 a T-27**. Excluido por decisión del equipo: el seed de contraseñas.

## Índice

| ID | Tarea | Tipo | Severidad | Depende de |
|----|-------|------|-----------|------------|
| T-01 | Kong: rutas separadas para login / refresh / logout | seguridad-ops | alta | — |
| T-02 | Eliminar `POST /auth/validate` (cero consumidores) | seguridad | media | T-01 |
| T-03 | Lockout por cuenta en login | seguridad | alta | — |
| T-04 | Proteger al último ADMIN en `cambiarRol` *(decisión: rechazar siempre la auto-degradación)* | seguridad | alta | — |
| T-05 | bcrypt costo 12 + re-hash perezoso | seguridad | baja | — |
| T-06 | Purga de `IdempotencyKey` faltante en 4 servicios | bug | media | T-07 (parcial) |
| T-07 | Extraer `OutboxProcessor` a `libs/resiliencia` | dedupe | media | — |
| T-08 | Claim de lote con `FOR UPDATE SKIP LOCKED` | resiliencia | media | T-07 |
| T-09 | Stress test con 2 réplicas | validación | media | T-08 |
| T-10 | Bootstrap compartido para `main.ts` | dedupe | baja | — |
| T-11 | `GlobalExceptionFilter` único | dedupe | baja | T-10 |
| T-12 | Consolidar guards de identidad → `shared-auth` | dedupe | media | T-16 |
| T-13 | Pedidos: usar `ServiceTokenService` (token inline duplicado) | dedupe | media | — |
| T-14 | `Idempotency-Key` con hash del body (pedidos y caja) | seguridad | media | — |
| T-15 | Retirar el evento `UsuarioAutenticado` del catálogo *(decisión: retirarlo, no minimizarlo)* | privacidad | media | — |
| T-16 | Cerrar `/telemetry/metrics` en Kong *(decisión: en Kong)* | seguridad | media | — |
| T-17 | Tokens S2S con claim `aud` | seguridad | media | T-13 |
| T-18 | Tipar routing keys del outbox y frenar `any` | calidad | baja | T-07 |
| T-19 | WebSocket: rooms por rol *(matriz aprobada)* | seguridad | media | T-24 |
| T-20 | Higiene de repo *(decisión: eliminar, sin rama archive)* | higiene | baja | — |
| T-21 | Skills de agentes IA: fuente única + sync en CI | higiene | baja | — |
| T-22 | Backlog frontend: descomponer pantallas grandes | calidad | baja | — |
| **T-23** | **[nuevo] Publicar eventos RMQ como persistentes** | resiliencia | **alta** | — |
| **T-24** | **[nuevo] WS roto en prod: `ALLOWED_ORIGINS` nunca se define** | bug | **alta** | — |
| **T-25** | **[nuevo] Carrera en `abrirTurno`: dos turnos de caja abiertos** | bug | media | — |
| **T-26** | **[nuevo] Índice anti-doble-booking fuera de migraciones** | bug | media | — |
| **T-27** | **[nuevo] Service worker intercepta las rutas `/v1/` de API** | bug | media | — |

Orden sugerido por olas (paralelizables dentro de cada ola):
**Ola 1:** T-01, T-03, T-04, T-23, T-24 · **Ola 2:** T-02, T-05, T-07, T-13, T-16, T-20, T-25, T-26, T-27 ·
**Ola 3:** T-06, T-08, T-10, T-14, T-15, T-21 · **Ola 4:** T-09, T-11, T-12, T-17, T-18, T-19 ·
**Continuo:** T-22.

---

## T-01 — Kong: rutas separadas para login / refresh / logout

**Evidencia.** `infra/kong/kong.yml.template`: la ruta `identidad-login` declara
`paths: [/identidad/auth, /v1/identidad/auth]` con `methods: [POST]` y rate-limit
`minute: 5, limit_by: ip`. Por prefijo, ese límite de 5/min cubre **también**
`/auth/refresh`, `/auth/logout` y `/auth/validate`. Con access token de 15 min
(`ACCESS_TOKEN_TTL_SECONDS=900`, `apps/servicio-identidad/src/auth/auth.controller.ts:40`),
varios dispositivos detrás de un mismo NAT agotan el presupuesto solo con refresh.

**Cambio.**
1. `identidad-login`: paths exactos `/identidad/auth/login`, `/v1/identidad/auth/login`; mantiene 5/min por IP.
2. Nueva ruta `identidad-refresh`: paths exactos de `/auth/refresh`; rate-limit propio
   (sugerido 60/min por IP: 20 dispositivos × refresh cada 15 min ≈ 2/min en régimen, el resto es margen de ráfaga post-reconexión).
3. Nueva ruta `identidad-logout`: paths exactos de `/auth/logout`; sugerido 30/min por IP.
4. `/auth/validate` deja de estar cubierto por ninguna ruta pública (T-02 lo elimina).

**Archivos.** `infra/kong/kong.yml.template` · `README.md` · `docs/operacion/levantar-sistema.md`.

**Verificación.** Extender `scripts/probar-gateway.ps1` o spec e2e:
`POST /v1/identidad/auth/refresh` ×10 → ningún 429; `POST .../login` con credenciales malas ×6 → 429 en el 6.º;
`POST .../validate` → 404 (tras T-02).

**Depende de.** Nada.

---

## T-02 — Eliminar `POST /auth/validate`

**Evidencia.** El endpoint existe en `apps/servicio-identidad/src/auth/auth.controller.ts:138`
y su lógica (`validarToken`) en `auth.service.ts`. Verificado: **cero call-sites** —
`grep -rn "auth/validate" apps/pwa-cliente/src` → vacío; en el resto de apps/libs solo
aparece la propia declaración. La verificación de tokens en los demás servicios es local
vía `JwtStrategy` (`libs/shared-auth/src/lib/jwt.strategy.ts`), no remota. Es código muerto
expuesto públicamente que funciona como oráculo de validez de tokens.

**Cambio.** Borrar el handler `validate`, el método `validarToken`, sus casos de spec
(`auth.controller.spec.ts` / `security-coverage.spec.ts` si aplica) y la doc
`docs/servicios/servicio-identidad/endpoints/POST--auth-validate.md` (+ entrada en `_indice.md`).

**Archivos.** `apps/servicio-identidad/src/auth/{auth.controller.ts,auth.service.ts}` ·
specs asociados · docs del endpoint.

**Verificación.** `grep -rn "validarToken\|auth/validate" apps libs` → 0;
`POST /v1/identidad/auth/validate` vía gateway → 404; suite de identidad en verde.

**Depende de.** T-01.

---

## T-03 — Lockout por cuenta en login

**Evidencia.** `AuthService.login` (`apps/servicio-identidad/src/auth/auth.service.ts:41`)
no tiene contador de fallos ni bloqueo; `grep -rn "Throttler" apps/servicio-identidad/src` → 0.
El único freno es el rate-limit por IP de Kong (T-01), inoperante ante ataque distribuido
o tráfico interno que no pase por el gateway.

**Cambio.**
1. Migración Prisma en identidad: `failedLoginAttempts Int @default(0)`, `lockedUntil DateTime?` en `model Usuario`.
2. En `login`: si `lockedUntil > now()` → `UnauthorizedException('Credenciales inválidas')`
   (mensaje genérico). Password incorrecta → `update { failedLoginAttempts: { increment: 1 } }`
   (atómico); al alcanzar 5 fallos, `lockedUntil` con backoff 1 min → 5 min → 15 min (tope).
   Login exitoso → reset de ambos campos.
3. `AuditoriaLog` con `accion: 'CUENTA_BLOQUEADA'` (sin email en el mensaje — coherente con T-15).

**Archivos.** `apps/servicio-identidad/prisma/schema.prisma` + migración ·
`auth.service.ts` · `auth.service.spec.ts`.

**Verificación.** Specs: 5 fallos → 6.º intento rechazado aun con password correcta;
`lockedUntil` expirado → login válido resetea; fallos concurrentes no pierden incrementos.
`scripts/check-migration-drift.sh` en verde.

**Depende de.** Nada.

---

## T-04 — Proteger al último ADMIN en `cambiarRol` — **decisión: rechazar siempre la auto-degradación**

**Evidencia.** `AuthService.cambiarRol` hace `findUnique` + `update` sin validar cuántos
ADMIN activos quedan ni quién ejecuta; el controller (`PATCH usuarios/:id/rol`,
`auth.controller.ts`) no pasa el `sub` del ejecutante al service. Un ADMIN puede degradar
al último ADMIN (incluido él mismo) y dejar el sistema sin administración.

**Cambio.**
1. El controller pasa `req.user.sub` a `cambiarRol(id, command, ejecutadoPor)`.
2. En transacción: si el objetivo es ADMIN y el rol nuevo no lo es, contar ADMIN activos
   con bloqueo (`$queryRaw ... FOR UPDATE`); si ≤ 1 → `ConflictException('No se puede
   degradar al último administrador activo')`.
3. **Rechazar siempre** la auto-degradación (`id === ejecutadoPor` con rol nuevo ≠ ADMIN) → 409.
4. Registrar `ejecutadoPor` en la auditoría.

**Archivos.** `apps/servicio-identidad/src/auth/{auth.controller.ts,auth.service.ts}` ·
`auth.service.spec.ts` · `docs/servicios/servicio-identidad/endpoints/PATCH--usuarios-id-rol.md`.

**Verificación.** Specs: degradar al único ADMIN → 409; con 2 ADMIN activos → OK;
auto-degradación → 409 siempre; degradaciones concurrentes del penúltimo y último ADMIN
no dejan 0 admins.

**Depende de.** Nada.

---

## T-05 — bcrypt costo 12 + re-hash perezoso

**Evidencia.** `SALT_ROUNDS = 10` en `apps/servicio-identidad/src/auth/auth.service.ts:26`.

**Cambio.** `SALT_ROUNDS = 12`. En login exitoso, si `bcrypt.getRounds(usuario.password) < 12`,
re-hashear y persistir.

**Archivos.** `auth.service.ts` · `auth.service.spec.ts`.

**Verificación.** Spec: hash de costo 10 migra a 12 tras login válido; hashes nuevos nacen con 12.

**Depende de.** Nada. *(Mergeable junto con T-03: misma función.)*

---

## T-06 — Purga de `IdempotencyKey` faltante en 4 servicios

**Evidencia.** El modelo `IdempotencyKey` existe en **6** schemas
(`apps/servicio-{caja,inventario,mesas,notificaciones,pedidos,reportes}/prisma/schema.prisma`,
verificado con `grep -l`), pero el cron `purgarIdempotencyKeys` existe **solo** en los
processors de pedidos e inventario (verificado). En caja, mesas, notificaciones y reportes
la tabla **crece sin límite** — el riesgo que la propia invariante
`docs/invariantes/retencion-idempotency-keys.md` describe, cuya garantía cubre 2 de 6.
Notificaciones y reportes no tienen `outbox.processor.ts` (consumidores puros), así que la
purga no puede colgarse del processor.

**Cambio.** `IdempotencyPurgeService` en `libs/resiliencia` (cron horario, retención 7 días,
cliente inyectado por el token `IDEMPOTENCY_DB` ya existente,
`libs/resiliencia/src/lib/idempotency.interceptor.ts:22`). Registrar en los 6 servicios;
eliminar los crons locales de pedidos e inventario. Actualizar la invariante con 6 fuentes.

**Archivos.** `libs/resiliencia/src/lib/idempotency-purge.service.ts` (+ spec) · `index.ts` ·
`app.module.ts` ×6 · processors de pedidos/inventario (quitar cron local) ·
`docs/invariantes/retencion-idempotency-keys.md`.

**Verificación.** Spec: claves > 7 días se borran, recientes no.
`grep -rn "purgarIdempotencyKeys" apps/` → 0.

**Depende de.** Idealmente tras T-07 (no tocar dos veces los processors); ejecutable antes si se prioriza el bug.

---

## T-07 — Extraer `OutboxProcessor` a `libs/resiliencia`

**Evidencia.** **7** copias del processor (todos salvo notificaciones y reportes). Diff
verificado entre pedidos y caja: solo la constante `PRODUCER` (línea 8) y el cron extra
`purgarIdempotencyKeys` de pedidos/inventario (que T-06 extrae aparte). Métricas, reintentos
(`MAX_ATTEMPTS=5` → `FAILED`), `notifyOutboxFailed` y purga (24 h / 168 h) son idénticos.

**Cambio.** Processor genérico con tokens `OUTBOX_DB` y `OUTBOX_CONFIG`
(`{ producer, maxAttempts?, batchSize?, retencionProcessedHoras?, retencionFailedHoras? }`),
dynamic module `OutboxModule.forService(config)`. Migrar los 7 servicios (un commit por
servicio), borrar copias, consolidar los 7 specs en uno en la lib portando todos los casos.
**Sin cambio de semántica** (el `SKIP LOCKED` es T-08, separado a propósito).

**Archivos.** `libs/resiliencia/src/lib/outbox.processor.ts` (+ spec) · `index.ts` ·
`apps/servicio-{caja,cuentas,identidad,inventario,mesas,pedidos,reservas}/src/app/outbox.processor.ts`
(borrar) + sus `app.module.ts` y specs.

**Verificación.** `find apps -name "outbox.processor.ts"` → 0; suite completa en verde con
pisos de cobertura intactos; `pnpm probar:stock` sin regresión.

**Depende de.** Nada.

---

## T-08 — Claim de lote con `FOR UPDATE SKIP LOCKED`

**Evidencia.** El processor hace `findMany({ where: { status: 'PENDING' }, take: 50 })` sin
lock → 1 réplica por servicio (README, "⚠️ Restricción de escalado"). `OutboxEvent.status`
es `String @default("PENDING")` (verificado en schemas), **no** enum: agregar `PUBLISHING`
no requiere migración de enum; solo la columna `claimedAt`.

**Cambio.** En la lib (post T-07):
1. Migración ×7 (SQL idéntico): `ALTER TABLE "OutboxEvent" ADD COLUMN "claimedAt" TIMESTAMP NULL;`
   *(nota: la tabla está mapeada como `outbox_events` en al menos caja — usar el `@@map` de cada schema).*
2. Claim atómico vía `$queryRaw`:
   ```sql
   UPDATE "OutboxEvent" SET status = 'PUBLISHING', "claimedAt" = now()
   WHERE id IN (
     SELECT id FROM "OutboxEvent" WHERE status = 'PENDING'
     ORDER BY "createdAt" ASC LIMIT 50 FOR UPDATE SKIP LOCKED
   ) RETURNING *;
   ```
3. OK → `PROCESSED`; fallo → `PENDING` con `attempts+1` (o `FAILED` en el tope).
4. Cron de rescate (1 min): `PUBLISHING` con `claimedAt < now() - 60s` → `PENDING`
   (at-least-once preservado; el duplicado lo absorbe la idempotencia de consumidores).
5. README: quitar la restricción. Adenda en `docs/decisiones/ADR-002-transactional-outbox.md`.

**Archivos.** lib · 7 migraciones + schemas · `README.md` · ADR-002.

**Verificación.** Spec con dos instancias del processor sobre el mismo store: ningún evento
publicado dos veces en happy path. Drift de migraciones en verde.

**Depende de.** T-07.

---

## T-09 — Stress test con 2 réplicas

**Evidencia.** Los escenarios actuales (`stress-tests/run-*.js`) asumen 1 réplica; la
invariante `docs/invariantes/colas-limpias-happy-path.md` debe sostenerse con N réplicas tras T-08.

**Cambio.** Nuevo escenario: 2 instancias de un servicio contra la misma BD; verificar
(a) exactamente una publicación por evento en happy path, (b) cero eventos perdidos al matar
una réplica a mitad de lote.

**Archivos.** `stress-tests/run-outbox-replicas.js` · `package.json` (script `probar:replicas`) ·
`docs/invariantes/colas-limpias-happy-path.md`.

**Verificación.** Estable en 3 ejecuciones consecutivas.

**Depende de.** T-08.

---

## T-10 — Bootstrap compartido para `main.ts`

**Evidencia.** Diff verificado entre `main.ts` de pedidos y caja: difieren **solo** en
nombre de servicio (`initTracing`), cola/DLQ, metadatos de Swagger, puerto por defecto y el
orden de un import. El resto (fail-fast `RABBITMQ_URI`, Winston, prefijo `api`, `cookieParser`,
`helmet(buildHelmetOptions())`, CORS, `ValidationPipe` whitelist+forbid+transform, filter,
RMQ con DLX, Swagger solo fuera de prod) es idéntico ×9.

**Cambio.** `bootstrapNachoppsService({ serviceName, module, queue?, swagger?, defaultPort? })`
en `libs/observabilidad` (donde vive `initTracing`, que **debe ejecutarse antes de importar
Nest** — respetar ese orden o documentar el import en dos pasos). Replicar exactamente lo que
cada `main.ts` hace hoy, sin "mejorar" de paso. Migración servicio por servicio.

**Archivos.** `libs/observabilidad/src/lib/bootstrap.ts` (+ spec) · `apps/servicio-*/src/main.ts` ×9 ·
`libs/observabilidad/README.md`.

**Verificación.** `wc -l apps/servicio-*/src/main.ts` ≤ 15; los 9 levantan en compose dev y
responden health; Swagger ausente con `NODE_ENV=production`.

**Depende de.** Nada.

---

## T-11 — `GlobalExceptionFilter` único

**Evidencia.** Diff verificado entre las copias de pedidos y caja: **solo formato**, cero
diferencia funcional. 9 copias en `apps/servicio-*/src/filters/`.

**Cambio.** Mover a la lib del bootstrap (T-10), referenciar desde `bootstrapNachoppsService`,
borrar las 9 copias.

**Verificación.** `find apps -name "global-exception.filter.ts"` → 0; spec en la lib.

**Depende de.** T-10.

---

## T-12 — Consolidar los guards de identidad en `shared-auth`

**Evidencia.** El fork **diverge funcionalmente** (verificado con `diff`): la copia de
identidad no exime `/telemetry/metrics` y no tiene el override `handleRequest`;
`roles.guard.ts` difiere solo en comentarios.

**Cambio.** Identidad importa `JwtAuthGuard`/`RolesGuard` desde `@org/shared-auth`; borrar
copias locales **después** de T-16 (que elimina la relevancia de la exención de métricas en
el perímetro). Portar a la lib los casos de spec que no cubra; `security-coverage.spec.ts`
debe pasar sin cambios de comportamiento observable.

**Archivos.** `apps/servicio-identidad/src/auth/{jwt-auth.guard.ts,roles.guard.ts}` (borrar) ·
imports en controller/module · specs · `libs/shared-auth/src/lib/*.spec.ts`.

**Verificación.** `grep -rn "from './jwt-auth.guard'" apps/servicio-identidad` → 0;
suites de identidad y shared-auth en verde.

**Depende de.** T-16.

---

## T-13 — Pedidos: eliminar la firma inline de tokens S2S

**Evidencia.** `ServiceTokenService` (`libs/shared-auth/src/lib/service-token.service.ts`) lo
usa solo caja (`apps/servicio-caja/src/app/app.service.ts:60`). Pedidos duplica la lógica
inline en `apps/servicio-pedidos/src/app/app.service.ts:107` y `:158`
(`this.jwtService.sign({ sub: 'servicio-pedidos', email: 'pedidos@internal', rol: 'SISTEMA' }, ...)`).

**Cambio.** Inyectar `ServiceTokenService` (exportado por el `SharedAuthModule` global,
`shared-auth.module.ts:23`) y reemplazar ambas firmas, conservando el `try/catch` →
`ServiceUnavailableException` actual.

**Verificación.** `grep -n "jwtService.sign" apps/servicio-pedidos/src` → 0; specs de los
dos call-sites en verde.

**Depende de.** Nada. Prerrequisito de T-17.

---

## T-14 — `Idempotency-Key` con hash del body (pedidos y caja)

**Evidencia.** El interceptor (`libs/resiliencia/src/lib/idempotency.interceptor.ts`) cachea
por `key` sin huella del cuerpo: misma clave + payload distinto devuelve en silencio la
respuesta del primero. La idempotencia HTTP aplica solo donde existe la migración
`idempotency_http` — pedidos y caja (`.../migrations/20260605020000_idempotency_http/`) — y
donde el interceptor está registrado (`apps/servicio-pedidos/src/app/app.controller.ts:19`;
verificar el equivalente de caja en `POST /pagos` al implementar). El `IdempotencyKey` de los
otros 4 servicios es para claims de eventos y no necesita hash.

**Cambio.**
1. Migración en pedidos y caja: `requestHash String?` en `model IdempotencyKey`.
2. Interceptor: al reclamar, persistir `sha256(JSON.stringify(req.body) ?? '')`; en replay
   con hash distinto → 422 (`UnprocessableEntityException`, comportamiento tipo Stripe).
3. Actualizar `docs/invariantes/idempotencia-directa.md`.

**Verificación.** Specs: misma clave + mismo body → replay; misma clave + body distinto → 422;
`pnpm probar:stock` sin regresión.

**Depende de.** Nada.

---

## T-15 — Retirar el evento `UsuarioAutenticado` del catálogo — **decisión: retirarlo**

**Evidencia.** El emisor crea el evento en el outbox dentro del login
(`apps/servicio-identidad/src/auth/auth.service.ts:63-73`) con email en el payload, y
loguea el email en claro (`auth.service.ts:76`; los logs viajan a Loki vía promtail).
Verificado: **cero consumidores** — fuera de identidad solo existe la routing key
(`libs/contracts/src/events/routing-keys.ts:39`); `servicio-notificaciones` no se suscribe
(`apps/servicio-notificaciones/src/app/app.controller.ts`, patrones verificados).

**Cambio.**
1. Eliminar la emisión: la transacción del login queda solo con el `auditoriaLog.create`
   (evaluar si la transacción sigue siendo necesaria con una sola escritura).
2. Eliminar `RoutingKeys.UsuarioAutenticado` y `UsuarioAutenticadoPayload` de
   `libs/contracts` (`events/routing-keys.ts:39`, `domains/identidad.ts`); ajustar
   `contract-tests.spec.ts` si valida el shape.
3. Eliminar `docs/eventos/usuario.autenticado.md` y su entrada en `docs/eventos/_catalogo.md`.
4. Logs: `Login exitoso: ${usuario.id}` en lugar del email. Barrido:
   `grep -rn "logger" apps/*/src --include=*.ts | grep -i email` y limpiar coincidencias.

**Archivos.** `auth.service.ts` (+ spec) · `libs/contracts/src/{events/routing-keys.ts,domains/identidad.ts}` ·
`contract-tests.spec.ts` · `docs/eventos/usuario.autenticado.md` · `docs/eventos/_catalogo.md`.

**Verificación.** `grep -rn "UsuarioAutenticado\|usuario.autenticado" apps libs docs` → 0;
suites de identidad y contracts en verde; login funcional end-to-end.

**Depende de.** Nada.

---

## T-16 — Cerrar `/telemetry/metrics` en Kong — **decisión: bloqueo en el gateway**

**Evidencia.** `libs/shared-auth/src/lib/jwt-auth.guard.ts:15-20` exime
`/api/telemetry/metrics` de autenticación. Con el `strip_path` de Kong,
`GET /v1/pedidos/telemetry/metrics` llega al servicio: el plugin `jwt` exige *un* token
válido, pero cualquier empleado autenticado pasa y el guard lo deja entrar sin roles.
El guard local de identidad no tiene la exención (divergencia, ver T-12), o sea que el
comportamiento ya es inconsistente entre servicios.

**Cambio.** Ruta de bloqueo en Kong con plugin `request-termination` (404) para
`~/.+/telemetry/metrics$`, cubriendo ambas variantes de path (`/{servicio}/...` y
`/v1/{servicio}/...`). Prometheus no se afecta: scrapea por la red interna de Docker
(`infra/prometheus/prometheus.yml`), sin pasar por Kong.

**Archivos.** `infra/kong/kong.yml.template` · `docs/operacion/levantar-sistema.md` ·
`docs/libs/observabilidad.md`.

**Verificación.** Con JWT válido de MESERO: `GET /v1/pedidos/telemetry/metrics` vía gateway → 404;
`curl http://servicio-pedidos:3000/api/telemetry/metrics` desde la red interna → 200;
targets de Prometheus en `up`.

**Depende de.** Nada. Prerrequisito de T-12.

---

## T-17 — Tokens S2S con claim `aud`

**Evidencia.** El token S2S (`rol: 'SISTEMA'`, HS256 con `SERVICE_JWT_SECRET`) pasa todos los
`@Roles` de todos los servicios: pase maestro plano. Tras T-13 quedan dos consumidores del
service compartido: caja→cuentas y pedidos→mesas/inventario.

**Cambio.**
1. `generateServiceToken(serviceName, audience)`: claim `aud` (mantener `iss: 'nachopps-service'`
   que ya fija `SharedAuthModule`).
2. Verificación en `JwtStrategy.validate`: si `rol === 'SISTEMA'`, exigir
   `payload.aud === process.env.SERVICE_NAME`. **No** usar la opción `audience` de passport-jwt
   (aplicaría a los RS256 de usuario, que no llevan `aud`).
3. `SERVICE_NAME` en los 9 servicios en ambos compose.
4. Call-sites con audiencia destino correcta.
5. Rollout en dos pasos: primero emitir `aud` con verificación tolerante (warn), luego rechazo estricto.

**Archivos.** `libs/shared-auth/src/lib/{service-token.service.ts,jwt.strategy.ts}` (+ specs) ·
`apps/servicio-{caja,pedidos}/src/app/app.service.ts` · `infra/docker-compose{,.prod}.yml` ·
`.env.example` · `docs/operacion/jwt-rs256.md`.

**Verificación.** Spec: token con `aud: 'servicio-inventario'` rechazado con
`SERVICE_NAME=servicio-cuentas`, aceptado con el correcto; RS256 de usuario sin `aud` pasa.
E2e del flujo caja→cuentas.

**Depende de.** T-13.

---

## T-18 — Tipar routing keys del outbox y frenar `any`

**Evidencia.** `rabbitmq.publish(event.routingKey as any, ...)` en los processors. Conteo
verificado: **107** usos de `: any` / `as any` en backend no-test.

**Cambio.**
1. En el processor compartido (T-07): validar la key leída del outbox contra el union type
   de `libs/contracts/src/events/routing-keys.ts`; key no reconocida → `FAILED` con log.
2. Barrido de `any` priorizando cruces de contrato; irreductibles anotados
   `// any justificado: <motivo>`.
3. `eslint.config.cjs`: `@typescript-eslint/no-explicit-any` en `warn` (a `error` cuando
   el conteo tienda a 0).

**Verificación.** `grep -rn "as any" libs/resiliencia libs/shared-rabbitmq` → 0; lint global
en verde; conteo decreciente registrado en el PR.

**Depende de.** T-07.

---

## T-19 — WebSocket: rooms por rol — **matriz aprobada**

**Evidencia.** `NotificationsGateway.emitPedidoUpdate` hace `this.server.emit(...)` global
(`apps/servicio-notificaciones/src/app/notifications.gateway.ts:66-68`): cualquier empleado
autenticado recibe eventos de caja/pagos ajenos a su rol. El handshake ya verifica el JWT y
guarda `client.data.user` (líneas 45-57).

**Cambio.**
1. `handleConnection`: `client.join('rol:' + user.rol)`.
2. **Matriz evento→roles aprobada**, exportada desde `libs/contracts` (fuente única,
   alineada con los `@Roles` HTTP):
   `pago.*` / `arqueo.*` / `ticket.*` → ADMIN, CAJERO, GERENCIA;
   `pedido.*` / `mesa.*` / `cuenta.*` → ADMIN, SISTEMA, CAJERO, MESERO, COCINA;
   `stock.*` / `producto.*` → ADMIN, GERENCIA, COCINA;
   `reserva.*` → ADMIN, RECEPCION, GERENCIA, MESERO.
3. Emitir con `this.server.to(rooms).emit(...)` según el patrón.
4. Frontend: `storesForPattern` (`apps/pwa-cliente/src/services/socket.service.ts:28`) ya
   filtra por patrón — cambio transparente; smoke test por rol en cada pantalla.

**Archivos.** `notifications.gateway.ts` (+ spec) · `libs/contracts/src/events/` (matriz) ·
`docs/servicios/servicio-notificaciones/_indice.md`.

**Verificación.** Spec: MESERO no recibe `pago.registrado`; CAJERO sí. E2e manual por rol.

**Depende de.** T-24 (corrige primero el CORS del gateway para poder probar en condiciones de prod).

---

## T-20 — Higiene de repo — **decisión: eliminar del repo (sin rama archive)**

**Evidencia (verificada por listado).** Versionados:
`libs/resiliencia/tsconfig.tsbuildinfo`, `libs/shared-prisma/tsconfig.lib.tsbuildinfo`;
~60 reportes con timestamp en `stress-tests/reports/`;
`docs-deprecated/codebase-report/codebase-report.zip` y `docs-deprecated/doc-actualizada.zip`;
`docs/servicio_pedidos_backend.js`; `docs-deprecated/` (~70 archivos) y `design_handoff_nachopps/`.

**Cambio.**
1. `.gitignore`: `**/*.tsbuildinfo` y `stress-tests/reports/*`.
2. `git rm` de: tsbuildinfo, reportes con timestamp, los dos `.zip`,
   `docs/servicio_pedidos_backend.js`, **`docs-deprecated/` completa** y
   **`design_handoff_nachopps/`** (decisión: eliminar; el historial de git conserva todo
   si alguna vez hace falta recuperar algo).
3. Crear `stress-tests/reports/BASELINE.md` consolidado **antes** de borrar los reportes:
   varias invariantes los citan como `fuente:`
   (p. ej. `retencion-idempotency-keys.md` cita `stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md`);
   actualizar esas referencias al baseline en el mismo PR.

**Archivos.** `.gitignore` · borrados listados · `docs/invariantes/*.md` afectadas ·
`stress-tests/reports/BASELINE.md` (nuevo).

**Verificación.** `git ls-files | grep -E "tsbuildinfo|reports/.*Z\.md|\.zip$|docs-deprecated|design_handoff"` → 0;
ninguna invariante con `fuente:` rota.

**Depende de.** Nada.

---

## T-21 — Skills de agentes IA: fuente única + verificación en CI

**Evidencia.** Las mismas skills viven en `.agents/`, `.cursor/`, `.gemini/`, `.github/`,
`.opencode/` (más configs en `.claude/`, `.codex/`). Drift real verificado: `monitor-ci`
pesa 18 258 bytes en `.agents/skills/` y 32 210 en `.cursor/skills/` y `.gemini/skills/`.

**Cambio.** `.agents/` como fuente canónica; `scripts/sync-agent-skills.mjs` con los renombres
por herramienta (`skill.md` minúsculas en `.gemini`); reconciliar manualmente el drift de
`monitor-ci` antes del primer sync; job `--check` en `.github/workflows/ci.yml` (mismo patrón
que `check-migration-drift.sh`); regla en `CONTRIBUTING.md`.

**Verificación.** `node scripts/sync-agent-skills.mjs --check` → exit 0; modificar una copia
no canónica → CI en rojo.

**Depende de.** Nada.

---

## T-22 — Backlog frontend (continuo)

**Evidencia.** `Comandero.tsx` 445 líneas, `InventarioScreen.tsx` 425, `PedidosScreen.tsx` 388,
`InicioScreen.tsx` 350, `CajaScreen.tsx` 337.

**Cambio.** Pantallas ≤ ~250 líneas; lógica en hooks o `domain/` (patrón ya presente en
`apps/pwa-cliente/src/domain/pedido.flow.ts`). Orden: Comandero → Inventario → Pedidos.

**Verificación.** Pisos de cobertura intactos; e2e Playwright en verde.

**Depende de.** Nada.

---

## T-23 — **[nuevo · alta]** Publicar eventos RMQ como persistentes

**Evidencia.** `RabbitMQPublisherService.publish`
(`libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:58-77`) llama
`channelWrapper.publish(NACHOPPS_EXCHANGE, routingKey, {...}, { headers: carrier })` **sin
`persistent: true`** — verificado: `grep -rn "persistent" libs apps` → 0. Las colas y
exchanges son durables, pero los mensajes viajan con `deliveryMode: 1` (transient): un
reinicio del broker **pierde los eventos encolados aún no consumidos**, aunque el outbox ya
los marcó `PROCESSED`. Esto socava la garantía del patrón outbox (ADR-002) y las invariantes
de colas limpias: el productor cree haber entregado, el consumidor nunca recibe, y no hay
reintento posible porque el evento ya salió de `PENDING`.

**Cambio.** Agregar `persistent: true` a las opciones de `channelWrapper.publish`
(el canal ya es `ConfirmChannel`, así que el `await` sigue resolviendo en el confirm del broker).

**Archivos.** `libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts` (+ spec que
verifique las opciones pasadas al wrapper) · adenda en `docs/decisiones/ADR-002-transactional-outbox.md`
y `docs/operacion/rabbitmq.md`.

**Verificación.** Spec unitario de opciones. Prueba de caos (extender
`stress-tests/run-rabbitmq-chaos.js`): publicar N eventos con consumidores detenidos →
`docker restart rabbitmq` → los N mensajes siguen en cola (hoy se pierden).

**Depende de.** Nada. **Es un cambio de 1 línea con el mayor impacto en confiabilidad de todo el plan.**

---

## T-24 — **[nuevo · alta]** WebSocket roto en producción: `ALLOWED_ORIGINS` nunca se define

**Evidencia.** `NotificationsGateway` configura el CORS del WebSocket con
`process.env.ALLOWED_ORIGINS` y, si falta, cae a una lista de **localhost**
(`apps/servicio-notificaciones/src/app/notifications.gateway.ts:17-29`). Verificado:
`grep -n "ALLOWED_ORIGINS" infra/docker-compose.yml infra/docker-compose.prod.yml` → **0
resultados en ambos**; los compose solo definen `CORS_ORIGIN`. En producción, el handshake
de Socket.IO desde `https://app.tudominio.com` se rechaza por CORS → **todo el tiempo real
de la PWA (KDS, mesas, caja) está roto en prod**, silenciosamente.

**Cambio.** Unificar a la variable que ya existe: el gateway lee `CORS_ORIGIN`
(split por coma, mismo formato que los `main.ts`) y se elimina `ALLOWED_ORIGINS`.
Mantener los defaults localhost solo como fallback de desarrollo.

**Archivos.** `notifications.gateway.ts` (+ spec) · `.env.example` (si menciona la variable) ·
`docs/servicios/servicio-notificaciones/_indice.md` · `docs/operacion/levantar-sistema.md`.

**Verificación.** `grep -rn "ALLOWED_ORIGINS" apps infra` → 0. Test de integración: con
`CORS_ORIGIN=https://app.ejemplo.com`, un handshake con ese `Origin` conecta y uno con otro
origen se rechaza. Smoke en compose prod-like con la PWA real.

**Depende de.** Nada. Prerrequisito de T-19.

---

## T-25 — **[nuevo · media]** Carrera en `abrirTurno`: dos turnos de caja abiertos

**Evidencia.** `abrirTurno` hace check-then-create: `findFirst({ estado: 'ABIERTA' })` y, si
no hay, crea (`apps/servicio-caja/src/app/app.service.ts:96-115`). No existe índice único
que lo respalde — verificado en `apps/servicio-caja/prisma/schema.prisma` (modelo `TurnoCaja`,
solo `@@index` no únicos) y en `migrations/20260605000000_init/migration.sql` (el único
UNIQUE es `cierres_caja_turnoId_key`). Dos aperturas concurrentes (doble click sin
Idempotency-Key, o dos terminales) crean **dos turnos ABIERTA**; `registrarPago` y
`obtenerTurnoActivo` toman `findFirst(...orderBy abiertoAt desc)` (`app.service.ts:305-312`),
así que los pagos se reparten entre turnos y el arqueo/cierre Z queda inconsistente.
Contraste: reservas sí resuelve su carrera equivalente con índice único parcial (ADR-005).

**Cambio.**
1. Migración raw (Prisma no expresa índices parciales en el schema):
   `CREATE UNIQUE INDEX "turnos_caja_un_abierto" ON "turnos_caja"(("estado")) WHERE "estado" = 'ABIERTA';`
   *(si el modelo de negocio contempla varias cajas físicas simultáneas, indexar `("cajaId") WHERE estado='ABIERTA'` — confirmar con el equipo; hoy `cajaId` por defecto es `'T01'`.)*
2. En `abrirTurno`, capturar `P2002` y devolver el turno abierto existente (semántica
   actual de "si ya hay uno, devolverlo").
3. Documentar la invariante nueva en `docs/invariantes/` (patrón de `slot-reserva-activo-unico.md`).

**Archivos.** migración nueva en caja · `app.service.ts` (+ spec) ·
`docs/invariantes/turno-caja-abierto-unico.md` (nuevo, con `fuente:`).

**Verificación.** Spec: dos `abrirTurno` concurrentes → un solo turno ABIERTA y ambas
llamadas devuelven el mismo id. Drift de migraciones en verde.

**Depende de.** Nada.

---

## T-26 — **[nuevo · media]** Índice anti-doble-booking creado en runtime, fuera de migraciones

**Evidencia.** El índice único parcial que garantiza el slot único de reservas se crea **al
arrancar el servicio** con `$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS
"Reserva_fecha_hora_active_unique" ... WHERE estado IN (\'PENDIENTE\', \'CONFIRMADA\')')`
(`apps/servicio-reservas/src/app/reservas.service.ts:192-196`), precedido de una limpieza de
duplicados. No existe en `apps/servicio-reservas/prisma/migrations/` (verificado:
`grep -in unique .../migration.sql` → 0). Consecuencias: (a) una BD recién migrada con
`prisma migrate deploy` (el flujo de `infra/entrypoint.sh`) **no tiene la garantía hasta que
el servicio bootea** y ejecuta ese código; (b) el índice es invisible para
`scripts/check-migration-drift.sh`, exactamente la clase de deriva que ese script existe
para impedir; (c) la invariante `slot-reserva-activo-unico.md` apoya su `fuente:` en código
de runtime, no en el esquema versionado.

**Cambio.** Mover el `CREATE UNIQUE INDEX` (y la limpieza previa de duplicados, como paso
del mismo SQL) a una migración versionada en reservas; eliminar el bloque de
`$executeRawUnsafe` del service. Actualizar la invariante y el ADR-005 con la fuente nueva.

**Archivos.** `apps/servicio-reservas/prisma/migrations/<ts>_slot_unico_index/migration.sql` ·
`reservas.service.ts` (+ spec) · `docs/invariantes/slot-reserva-activo-unico.md` ·
`docs/decisiones/ADR-005-reserva-slot-unico.md`.

**Verificación.** BD limpia + `migrate deploy` (sin arrancar el servicio) → el índice existe
(`\di` o query a `pg_indexes`); dos reservas concurrentes al mismo slot → una 409;
drift en verde.

**Depende de.** Nada.

---

## T-27 — **[nuevo · media]** Service worker intercepta las rutas `/v1/` de la API

**Evidencia.** El filtro del SW ignora API con `event.request.url.includes('/api')`
(`apps/pwa-cliente/public/sw.js:34-37`, comentario: "Ignorar peticiones de API"), pero las
URLs reales del front van por `/v1/{servicio}/...` desde que `client.ts` antepone
`API_VERSION_PREFIX = '/v1'` (`apps/pwa-cliente/src/api/client.ts:7`) — **no contienen
`/api`**, así que el SW sí las intercepta con su handler cache-first. Hoy no llegan a
cachearse solo por un accidente: son cross-origin y el guard `response.type === 'basic'`
(`sw.js:52`) las excluye. Si la PWA y el gateway se sirvieran bajo el mismo dominio
(escenario plausible detrás de un reverse proxy), **respuestas autenticadas (cuentas, pagos,
usuarios) quedarían en Cache Storage** del dispositivo compartido y se servirían stale.

**Cambio.** Corregir el filtro para que la intención coincida con el código:
ignorar peticiones cuyo URL no sea del propio origen del SW **o** cuyo path empiece por
`/v1/`, y de paso ignorar todo método ≠ GET. Subir `CACHE_NAME` a `nachopps-pos-v4` para
invalidar el SW desplegado.

**Archivos.** `apps/pwa-cliente/public/sw.js` · (opcional) test e2e en
`apps/pwa-cliente/e2e/` que verifique que respuestas de API no aparecen en `caches`.

**Verificación.** Con la PWA servida y sesión activa: `caches.open('nachopps-pos-v4')` no
contiene ninguna entrada con `/v1/`; assets estáticos sí se cachean; navegación offline
sigue cayendo a `index.html`.

**Depende de.** Nada.

---

## Definición de hecho (global)

- CI completo en verde por PR: lint, build, tests con pisos de cobertura, drift de migraciones.
- Tras T-08/T-09, T-14 y T-23: re-ejecutar `probar:stock`, `probar:concurrencia`,
  `probar:seguridad` y `probar:caos`, comparando contra `BASELINE.md` (T-20).
- Documentación en el mismo PR que el código: README, ADRs, `docs/eventos/`,
  `docs/invariantes/` (con `fuente:` actualizado) y `docs/operacion/`.
- Cada PR referencia el ID de tarea (T-NN) de este plan.

## Decisiones del equipo (registradas)

| Decisión | Resolución | Reflejada en |
|----------|-----------|--------------|
| Auto-degradación de ADMIN | Rechazar siempre | T-04 |
| Evento `UsuarioAutenticado` sin consumidores | Retirarlo del catálogo | T-15 |
| Bloqueo de `/telemetry/metrics` | En Kong (`request-termination`) | T-16 |
| Matriz evento→roles del WebSocket | Aprobada la propuesta | T-19 |
| `docs-deprecated/` y `design_handoff_nachopps/` | Eliminar del repo | T-20 |
| **Pendiente (nueva, de T-25):** ¿un turno de caja abierto global o uno por `cajaId`? | — | T-25 |

## Riesgos aceptados (documentados, sin tarea)

- **`jwt-cache` en modo degradado** (`infra/kong/kong.yml.template`, `degraded_mode: true`):
  en caída de identidad, tokens ya cacheados siguen válidos hasta su `exp` — incluso si
  fueron revocados. Acotado por el access token de 15 min; trade-off documentado en
  `infra/kong/plugins/jwt-cache/handler.lua:66-76`. El diseño del plugin es correcto:
  solo cachea en fase `log` después de que el plugin `jwt` nativo validó la firma
  (`handler.lua:145-166`), por lo que no es envenenable con tokens inválidos.
- **Imagen de producción con fuentes TS de `libs/` + ts-node** (`Dockerfile:39`, shim
  `index.js` generado con `transpileOnly`): arranque más pesado y `ts-node` en runtime.
  Funcional y con `USER node` + imagen pineada por digest; optimizable a futuro
  (compilar libs en build), sin urgencia.

# Plan de Pruebas Post-Remediación — NachoPps

> **Propósito:** verificar que las 27 tareas del *Plan de Remediación Atómico (v3)* quedaron
> correctamente aplicadas y que no introdujeron regresiones. Se ejecuta **una vez mergeado
> todo el plan**, sobre la rama integrada.
>
> **Convención:** cada prueba tiene ID (`P-NN`), tipo (**A**utomática / **M**anual / **C**aos),
> los comandos exactos, el resultado esperado y el criterio pasa/falla. La matriz de
> trazabilidad del final garantiza que ninguna tarea T-NN queda sin prueba.
>
> **Registro:** copiar este archivo a `docs/informe-pruebas-remediacion.md` al ejecutarlo y
> marcar cada casilla con ✅/❌, fecha y commit (`git rev-parse --short HEAD`).

---

## 0. Prerrequisitos y entorno

```sh
# Commit bajo prueba
git rev-parse --short HEAD

# Infra completa (RabbitMQ, Postgres ×9, Kong, Jaeger, Prometheus, Grafana)
docker compose -f infra/docker-compose.yml --profile infra up -d

# Los 9 servicios + PWA levantados (dev) — o el stack docker prod-like para P-30+
pnpm nx run-many --target=serve --all   # o el flujo habitual del equipo
```

- Usuarios de prueba: los del seed de desarrollo (uno por rol: ADMIN, MESERO, CAJERO, COCINA, RECEPCION, GERENCIA).
- Variables: `.env` completo según `.env.example`; para las pruebas prod-like (P-30, P-31, P-36) usar `infra/docker-compose.prod.yml` con dominio/certificado de staging.
- Herramientas: `curl`, `jq`, `psql` (o `docker exec` a los contenedores de Postgres), navegador con DevTools.

**Gate de entrada:** ningún test de este plan se ejecuta si la Suite 1 no está en verde.

---

## Suite 1 — Gates automáticos globales (A)

| ID | Comando | Esperado |
|----|---------|----------|
| P-01 | `pnpm nx run-many --target=lint --all` | Exit 0. Sin errores; los `warn` de `no-explicit-any` (T-18) se cuentan y registran. |
| P-02 | `pnpm nx run-many --target=build --all` | Exit 0 en los 22 proyectos. |
| P-03 | `pnpm nx run-many --target=test --all` | Exit 0; cobertura ≥ pisos de `vitest.config.mts` (que **no** deben haberse bajado para "pasar"). |
| P-04 | `bash scripts/check-migration-drift.sh` | Exit 0 — incluye las migraciones nuevas de T-03, T-08, T-14, T-25 y T-26. |
| P-05 | `node scripts/sync-agent-skills.mjs --check` | Exit 0 (T-21). Modificar un byte en `.cursor/skills/nx-workspace/SKILL.md` → exit ≠ 0 → revertir. |
| P-06 | Greps de erradicación (ver bloque) | Todos devuelven **0 líneas**. |

```sh
# P-06 — el código eliminado no debe existir en ninguna parte
grep -rn "auth/validate\|validarToken" apps libs | wc -l                      # T-02 → 0
grep -rn "UsuarioAutenticado\|usuario\.autenticado" apps libs docs | wc -l     # T-15 → 0
grep -rn "ALLOWED_ORIGINS" apps infra | wc -l                                  # T-24 → 0
grep -rn "purgarIdempotencyKeys" apps | wc -l                                  # T-06 → 0 (solo en libs)
grep -n  "jwtService.sign" apps/servicio-pedidos/src -r | wc -l                # T-13 → 0
find apps -name "outbox.processor.ts" | wc -l                                  # T-07 → 0
find apps -name "global-exception.filter.ts" | wc -l                           # T-11 → 0
ls apps/servicio-identidad/src/auth/jwt-auth.guard.ts 2>/dev/null              # T-12 → no existe
git ls-files | grep -E "tsbuildinfo|reports/.*Z\.md|\.zip$|docs-deprecated|design_handoff" | wc -l  # T-20 → 0
grep -rn "persistent" libs/shared-rabbitmq/src | wc -l                         # T-23 → ≥ 1
```

---

## Suite 2 — Gateway y autenticación (T-01, T-02, T-03, T-04, T-05)

### P-10 (A) — Rate limits independientes por ruta — *T-01*

```sh
# Login: 6 intentos con credenciales malas desde la misma IP
for i in $(seq 1 6); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8000/v1/identidad/auth/login \
    -H 'Content-Type: application/json' -d '{"email":"x@x.com","password":"mal"}'
done
```
**Esperado:** cinco `401` y el 6.º → `429`.

```sh
# Refresh: 10 seguidos NO deben dar 429 (presupuesto propio)
# (con una sesión válida previa para tener cookie refresh_token)
for i in $(seq 1 10); do curl -s -o /dev/null -w "%{http_code}\n" -b cookies.txt -c cookies.txt \
  -X POST http://localhost:8000/v1/identidad/auth/refresh -H "X-CSRF-Token: $CSRF"; done
```
**Esperado:** ningún `429`. **Falla si** refresh comparte presupuesto con login.

### P-11 (A) — `/auth/validate` ya no existe — *T-02*

```sh
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/v1/identidad/auth/validate \
  -H 'Content-Type: application/json' -d '{"token":"abc"}'
```
**Esperado:** `404`.

### P-12 (A+M) — Lockout por cuenta — *T-03*

1. 5 logins fallidos contra `mesero@nachopps.pe` **desde IPs distintas** (o directo al servicio en `:3001` para esquivar Kong y probar que el lockout es del servicio, no del gateway).
2. 6.º intento **con la contraseña correcta** → `401` con mensaje genérico (no debe revelar el bloqueo).
3. Esperar el backoff (1 min) → login correcto → `200`; verificar en BD que el contador quedó en 0:
   ```sh
   docker exec -it db-identidad psql -U nachopps -d identidad_db \
     -c "SELECT email, \"failedLoginAttempts\", \"lockedUntil\" FROM \"Usuario\" WHERE email='mesero@nachopps.pe';"
   ```
4. Verificar `AuditoriaLog` con `accion='CUENTA_BLOQUEADA'` **sin email en el mensaje**.

**Falla si:** el 6.º intento con password correcta entra; o el mensaje delata el bloqueo; o el contador no se resetea.

### P-13 (A) — Último ADMIN protegido — *T-04*

Con un solo ADMIN activo en BD:
```sh
# como ADMIN, intentar degradarse a sí mismo
curl -s -w "\n%{http_code}" -X PATCH http://localhost:8000/v1/identidad/usuarios/$ADMIN_ID/rol \
  -b cookies_admin.txt -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' -d '{"rol":"MESERO"}'
```
**Esperado:** `409` siempre (decisión: rechazar auto-degradación). Crear un 2.º ADMIN →
degradar al 1.º → `200`. Volver a un solo ADMIN → degradarlo desde otro ADMIN inexistente
no aplica; degradar al único desde sí mismo → `409`. Verificación de carrera: spec
`auth.service.spec.ts` cubre dos degradaciones concurrentes (revisar que el caso existe y pasa).

### P-14 (A) — bcrypt 12 + re-hash perezoso — *T-05*

```sh
docker exec -it db-identidad psql -U nachopps -d identidad_db \
  -c "SELECT email, substring(password, 1, 7) FROM \"Usuario\";"
```
**Esperado:** usuarios nuevos → prefijo `$2b$12$`. Un usuario con hash `$2b$10$` que hace
login exitoso → su prefijo pasa a `$2b$12$` en la siguiente consulta.

---

## Suite 3 — Outbox, mensajería e idempotencia (T-06–T-09, T-14, T-23)

### P-20 (A) — Regresión de stress contra baseline

```sh
npm run probar:stock          # idempotencia + DLQ
npm run probar:concurrencia   # límites de concurrencia
npm run probar:seguridad      # límites de seguridad
npm run probar:alta-contencion
```
**Esperado:** resultados ≥ `stress-tests/reports/BASELINE.md` (creado en T-20). Sin oversell,
colas limpias en happy path, DLQ/parking funcionando. **Cualquier regresión bloquea el sign-off.**

### P-21 (A) — Outbox con 2 réplicas — *T-08, T-09*

```sh
npm run probar:replicas   # escenario nuevo de T-09
```
Ejecutar **3 veces consecutivas**. **Esperado:** (a) exactamente una publicación por evento
en happy path; (b) al matar una réplica a mitad de lote (`docker kill`), cero eventos
perdidos — el cron de rescate devuelve los `PUBLISHING` huérfanos a `PENDING` en ≤ 2 min.

Verificación directa del rescate:
```sh
docker exec -it db-pedidos psql -U nachopps -d pedidos_db \
  -c "SELECT status, count(*) FROM \"OutboxEvent\" GROUP BY status;"
```
**Esperado al estabilizar:** 0 filas en `PENDING`/`PUBLISHING`.

### P-22 (C) — Mensajes persistentes sobreviven al broker — *T-23*

1. Detener los consumidores de un dominio (p. ej. `docker stop servicio-inventario`).
2. Crear 20 pedidos (los eventos `pedido.creado` quedan encolados en `inventario_queue`).
3. `docker restart rabbitmq` y esperar el healthcheck.
4. Consultar la cola: `docker exec rabbitmq rabbitmqctl list_queues name messages`.

**Esperado:** los ~20 mensajes **siguen en cola** tras el reinicio (antes del fix se perdían).
5. Arrancar inventario → el stock se descuenta exactamente una vez por pedido (cruzar con P-20).

### P-23 (A) — Idempotency-Key estricta — *T-14*

```sh
KEY=$(uuidgen)
BODY1='{"mesaId":"<mesa>","items":[{"productoId":"<prod>","cantidad":1}]}'
BODY2='{"mesaId":"<mesa>","items":[{"productoId":"<prod>","cantidad":99}]}'
# 1ª vez
curl -s -w "\n%{http_code}" -X POST http://localhost:8000/v1/pedidos -b cookies.txt \
  -H "X-CSRF-Token: $CSRF" -H "Idempotency-Key: $KEY" -H 'Content-Type: application/json' -d "$BODY1"
# replay idéntico
curl -s -w "\n%{http_code}" ... -H "Idempotency-Key: $KEY" -d "$BODY1"
# misma clave, body distinto
curl -s -w "\n%{http_code}" ... -H "Idempotency-Key: $KEY" -d "$BODY2"
```
**Esperado:** `201` → `201` con **el mismo `pedido.id`** → **`422`**. Repetir el trío contra
`POST /v1/caja/pagos`. **Falla si** el body distinto devuelve la respuesta cacheada.

### P-24 (A) — Purga de IdempotencyKey en los 6 servicios — *T-06*

```sh
# Sembrar una clave vieja en un servicio que antes NO purgaba (p. ej. mesas)
docker exec -it db-mesas psql -U nachopps -d mesas_db -c \
  "INSERT INTO \"IdempotencyKey\" (id, key, \"createdAt\") VALUES (gen_random_uuid(), 'test:vieja', now() - interval '8 days');"
# Esperar el cron horario (o invocar la purga vía test de la lib) y verificar:
docker exec -it db-mesas psql -U nachopps -d mesas_db -c \
  "SELECT count(*) FROM \"IdempotencyKey\" WHERE key='test:vieja';"
```
**Esperado:** `0`. Repetir muestreo en caja, notificaciones y reportes. La invariante
`docs/invariantes/retencion-idempotency-keys.md` debe citar las 6 fuentes (revisión documental).

---

## Suite 4 — Perímetro, S2S y notificaciones (T-16, T-17, T-19, T-24)

### P-30 (A) — Métricas bloqueadas en el gateway — *T-16*

```sh
# Con un JWT válido de MESERO:
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/v1/pedidos/telemetry/metrics -b cookies_mesero.txt
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/pedidos/telemetry/metrics -b cookies_mesero.txt
# Desde la red interna:
docker exec servicio-pedidos wget -qO- http://localhost:3000/api/telemetry/metrics | head -3
```
**Esperado:** `404` / `404` por Kong; `200` con métricas Prometheus desde dentro.
En Prometheus (`:9090/targets`): todos los targets `up`.

### P-31 (A) — Audiencia S2S — *T-17*

1. Spec de `shared-auth` en verde (token `aud: servicio-inventario` rechazado con
   `SERVICE_NAME=servicio-cuentas`).
2. Prueba negativa en vivo: firmar manualmente un HS256 con `SERVICE_JWT_SECRET`,
   `rol: SISTEMA` y `aud: servicio-inventario`, y usarlo contra cuentas:
   ```sh
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/api/cuentas -H "Authorization: Bearer $TOKEN_AUD_INVENTARIO"
   ```
   **Esperado:** `401`.
3. Prueba positiva end-to-end: flujo completo de cobro (caja→cuentas) funciona — cubierto
   por P-50.

### P-32 (A+M) — Rooms por rol en WebSocket — *T-19*

1. Spec del gateway en verde: MESERO no recibe `pago.registrado`; CAJERO sí.
2. En vivo: dos navegadores, sesión MESERO y sesión CAJERO, ambos en la PWA.
   Registrar un pago desde la sesión CAJERO.
   **Esperado:** el toast/refresh de caja aparece en CAJERO; en MESERO **no** llega el evento
   de pago (verificar en DevTools → WS frames), pero **sí** le llegan eventos `pedido.*`.
3. Smoke por cada rol: cada pantalla sigue refrescando en vivo lo que le corresponde según
   la matriz de `libs/contracts`.

### P-33 (A) — CORS del WebSocket en prod-like — *T-24*

Con el stack prod-like (`docker-compose.prod.yml`, `CORS_ORIGIN=https://app.staging.ejemplo.com`):
```sh
# Handshake con el Origin correcto
curl -s -o /dev/null -w "%{http_code}" "https://api.staging.ejemplo.com/notificaciones/socket.io/?EIO=4&transport=polling" \
  -H "Origin: https://app.staging.ejemplo.com"
# Handshake con un Origin ajeno
curl -s -o /dev/null -w "%{http_code}" "https://api.staging.ejemplo.com/notificaciones/socket.io/?EIO=4&transport=polling" \
  -H "Origin: https://evil.example.com"
```
**Esperado:** `200` / bloqueado (4xx o sin headers CORS). Y lo esencial: **la PWA real en
staging recibe eventos en vivo** (antes del fix, el tiempo real estaba roto en prod).

---

## Suite 5 — Integridad de datos y carreras (T-25, T-26)

### P-40 (A) — Turno de caja único — *T-25*

```sh
# Dos aperturas concurrentes (sin Idempotency-Key, para forzar la carrera)
seq 1 2 | xargs -P2 -I{} curl -s -X POST http://localhost:8000/v1/caja/turnos -b cookies_cajero.txt \
  -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/json' -d '{"fondoInicial":100}' &
wait
docker exec -it db-caja psql -U nachopps -d caja_db \
  -c "SELECT count(*) FROM turnos_caja WHERE estado='ABIERTA';"
```
**Esperado:** `1`, y ambas respuestas HTTP devuelven **el mismo `turno.id`**. Repetir 5 veces.
Verificar que el índice existe:
```sh
docker exec -it db-caja psql -U nachopps -d caja_db \
  -c "SELECT indexname FROM pg_indexes WHERE tablename='turnos_caja' AND indexname='turnos_caja_un_abierto';"
```

### P-41 (A) — Índice anti-doble-booking en migraciones — *T-26*

```sh
# BD limpia + solo migraciones, SIN arrancar el servicio:
docker compose -f infra/docker-compose.yml up -d db-reservas
npx prisma migrate deploy --schema=apps/servicio-reservas/prisma/schema.prisma
docker exec -it db-reservas psql -U nachopps -d reservas_db \
  -c "SELECT indexname FROM pg_indexes WHERE indexname='Reserva_fecha_hora_active_unique';"
```
**Esperado:** el índice existe **antes** del primer boot del servicio. Luego, con el servicio
arriba: dos `POST /v1/reservas` concurrentes al mismo `fecha+hora` → una `201` y una `409`.
`grep -n "executeRawUnsafe" apps/servicio-reservas/src/app/reservas.service.ts` → solo debe
quedar lo que no sea la creación del índice (idealmente 0).

---

## Suite 6 — PWA (T-22, T-27)

### P-45 (A+M) — Service worker no toca la API — *T-27*

1. Build de producción de la PWA, servirla, iniciar sesión, navegar por caja/pedidos/cuentas.
2. DevTools → Application → Cache Storage → `nachopps-pos-v4`:
   **Esperado:** solo assets estáticos (html, ico, manifest, js/css); **ninguna entrada con `/v1/`**.
3. El nombre de caché viejo (`nachopps-pos-v3`) fue eliminado por el `activate`.
4. Modo offline (DevTools → Network → Offline): la navegación cae a `index.html` (el shell
   sigue funcionando); las llamadas API fallan limpio (estado offline visible vía `useOnlineStatus`).

### P-46 (A) — E2E Playwright

```sh
pnpm nx e2e pwa-cliente-e2e
```
**Esperado:** verde (incluye `paginacion.spec.ts` y lo agregado en T-22 si se refactorizó alguna pantalla).

---

## Suite 7 — Smoke funcional end-to-end por flujo de negocio (M)

Recorrer los 6 flujos documentados en `docs/flujos/` con usuarios reales de cada rol.
Ninguna remediación debe haber roto el negocio:

| ID | Flujo (doc) | Pasos mínimos | Esperado |
|----|-------------|---------------|----------|
| P-50 | `pago-cierra-cuenta-libera-mesa.md` | MESERO crea pedido → COCINA lo despacha → CAJERO cobra | Pago `201`, ticket generado, cuenta CERRADA, mesa LIBRE, evento en vivo en pantallas CAJERO/ADMIN |
| P-51 | `crear-pedido-descuenta-stock.md` | Crear pedido con stock=1, intentar 2.º pedido del mismo producto | 1.º OK, 2.º rechazado/compensado sin oversell (invariante `no-oversell`) |
| P-52 | `apertura-cuenta-ocupa-mesa.md` | Abrir cuenta sobre mesa libre | Mesa pasa a OCUPADA vía evento |
| P-53 | `reserva-crear-cancelar-notificar.md` | RECEPCION crea, confirma y cancela reserva | Estados correctos, notificación en vivo, slot liberado tras cancelar |
| P-54 | `reposicion-stock-proyeccion-local.md` | ADMIN repone stock | Proyección de pedidos refleja el delta (eventual, < ~5 s) |
| P-55 | `fallo-consumidor-dlq-reinyeccion-parking.md` | Forzar fallo de consumidor (cubierto por P-20) | Mensaje a DLQ tras 3 reintentos; reinyección funciona |
| P-56 | Sesión completa | Login → trabajar > 15 min (expira access) → seguir operando → logout | El refresh renueva en silencio (sin re-login ni 429); logout limpia cookies y revoca refresh |

---

## Suite 8 — Caos y resiliencia (C)

| ID | Prueba | Esperado |
|----|--------|----------|
| P-60 | `npm run probar:caos` (RabbitMQ chaos, ahora con mensajes persistentes) | Sin pérdida de eventos; comparar contra BASELINE |
| P-61 | `docker stop servicio-identidad` con sesiones activas | Con `jwt-cache` en modo degradado, los usuarios ya autenticados siguen operando hasta el `exp` de su token (≤ 15 min) — riesgo aceptado documentado |
| P-62 | `docker restart db-pedidos` durante carga | El servicio se reconecta; outbox drena `PENDING` al volver; cero pedidos perdidos confirmados contra la BD |
| P-63 | Kill de 1 de 2 réplicas a mitad de lote (parte de P-21) | Rescate de `PUBLISHING` ≤ 2 min |

---

## Suite 9 — Revisión documental (M)

| ID | Verificar | Criterio |
|----|-----------|----------|
| P-70 | README sin la sección "⚠️ Restricción de escalado"; nueva garantía multi-réplica documentada | T-08 |
| P-71 | ADR-002 (adenda SKIP LOCKED + persistencia), ADR-005 (índice en migración) actualizados | T-08, T-23, T-26 |
| P-72 | `docs/eventos/_catalogo.md` sin `usuario.autenticado`; archivo del evento eliminado | T-15 |
| P-73 | Invariantes con `fuente:` válidas — script rápido: extraer rutas de los front-matter y verificar que existen (`test -f`) | T-20, T-26, nueva invariante de T-25 |
| P-74 | `BASELINE.md` existe y las invariantes que citaban reportes con timestamp apuntan a él | T-20 |
| P-75 | `CONTRIBUTING.md` documenta el flujo de skills (`.agents/` + sync) | T-21 |

---

## Matriz de trazabilidad

| Tarea | Pruebas que la cubren |
|-------|------------------------|
| T-01 | P-10 |
| T-02 | P-06, P-11 |
| T-03 | P-12 |
| T-04 | P-13 |
| T-05 | P-14 |
| T-06 | P-06, P-24 |
| T-07 | P-06, P-20 |
| T-08 | P-04, P-21, P-70, P-71 |
| T-09 | P-21, P-63 |
| T-10 | P-02, arranque de los 9 en P-0 (entorno) |
| T-11 | P-06 |
| T-12 | P-06, suite de identidad en P-03 |
| T-13 | P-06, P-50 |
| T-14 | P-04, P-23 |
| T-15 | P-06, P-72 |
| T-16 | P-30 |
| T-17 | P-31, P-50 |
| T-18 | P-01, P-06 |
| T-19 | P-32 |
| T-20 | P-06, P-73, P-74 |
| T-21 | P-05, P-75 |
| T-22 | P-46 |
| T-23 | P-06, P-22, P-60 |
| T-24 | P-06, P-33 |
| T-25 | P-04, P-40 |
| T-26 | P-04, P-41 |
| T-27 | P-45 |

---

## Criterios de salida (sign-off)

Se firma el cierre de la remediación cuando **todo** lo siguiente se cumple:

1. Suite 1 completa en verde (gates automáticos + greps de erradicación en 0).
2. P-10 a P-46: 100 % en pasa (las automáticas) y checklist manual completo sin hallazgos bloqueantes.
3. Suite 7 (smoke de negocio): los 7 flujos operan end-to-end sin regresión funcional.
4. Suite 8 (caos): P-22 y P-60 sin pérdida de eventos; P-62/P-63 con recuperación dentro de los tiempos.
5. Suite 9: documentación consistente con el código (ninguna `fuente:` rota).
6. Resultados archivados en `docs/informe-pruebas-remediacion.md` con fecha, commit y ejecutor,
   y los números de stress incorporados como nuevo `BASELINE.md`.

**Cualquier ❌ se trata como reapertura de la tarea T-NN correspondiente** (vía la matriz de
trazabilidad), se corrige y se re-ejecuta como mínimo la suite afectada + Suite 1 completa.

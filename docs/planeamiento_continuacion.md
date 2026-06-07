# Plan de continuación — NachoPps

> Estado de partida: el plan `docs/planeamiento_mejoras.md` está **100% implementado y
> verificado** contra el stack Docker (49/49 integración, 7/7 seguridad, 12/12
> stock/DLQ, 300/300 alta contención, C5/C6/C7 concurrencia). Todo está en el
> working tree **sin commitear**. Este documento cubre los follow-ups opcionales.
>
> Esfuerzo: **S** ≤ medio día · **M** ≤ 2 días · **L** ≥ 3 días.
> Severidad: 🔴 bloqueante · 🟠 importante · 🟡 calidad · 🟢 proceso.

---

## Cómo retomar el entorno (apéndice rápido)

```sh
# 1. Levantar el stack (imágenes ya construidas; si cambió código: añadir build)
docker compose -f infra/docker-compose.yml --profile all up -d --wait
# 2. Sembrar admin + datos de referencia
DATABASE_URL="postgresql://nachopps:secret@localhost:5439/identidad_db?schema=public" node scripts/seed-admin.js
npm run poblar
# 3. Smokes (espaciar seguridad/stock ~1 min por el rate-limit de login 5/min)
npm run probar          # integración 49/49
npm run probar:seguridad
npm run probar:stock
# 4. Tests unitarios + drift
npx vitest run
SHADOW_DATABASE_URL='postgresql://postgres:postgres@localhost:55432/drift_shadow' bash scripts/check-migration-drift.sh
```

Credenciales dev: `admin@nachopps.pe` / `nachopps123`. Gateway `:8000`, PWA `:4200`,
Grafana `:3000`, Prometheus `:9090`, RabbitMQ UI `:15672`.

Drift check: requiere un Postgres shadow descartable:
`docker run -d --name drift-shadow -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=drift_shadow -p 55432:5432 postgres:16-alpine`.

---

## C1 — Git: commit + push de todo lo implementado — **S** 🟠

- **Objetivo:** versionar el trabajo (~290 archivos sin commitear).
- **Pasos:**
  1. `git rm -r --cached docs-deprecated` (sale del control de versiones; los archivos quedan en disco; ya está en `.gitignore`).
  2. Crear `infra/secrets/` real **no** se commitea (gitignorado salvo `README.md`).
  3. Commits temáticos siguiendo Conventional Commits (ver `CONTRIBUTING.md`),
     sugerido por fase: `feat(pedidos): compensación saga stock`, `feat(auth): RS256 + refresh tokens`,
     `feat(obs): métricas outbox + negocio + Loki`, `ci: drift guard + e2e gate`, `chore: limpieza repo + CHANGELOG`, etc.
  4. Push a una rama y abrir PR.
- **Criterio:** PR abierto; el CI (`.github/workflows/ci.yml` + `integration-docker.yml`)
  corre el guard de drift + los 9 `*-e2e` + Playwright en verde.
- **Ojo:** es la primera vez que el CI corre los nuevos gates; revisar que pasen
  (ver C7).

---

## C2 — Validar despliegue prod con Docker secrets — **M** 🟠

- **Objetivo:** confirmar end-to-end el camino de producción (RS256 + secrets + Kong sin admin expuesto).
- **Archivos:** `infra/docker-compose.prod.yml`, `infra/docker-compose.secrets.yml`,
  `infra/secrets/*`, `docs/operacion/secrets.md`, `docs/operacion/jwt-rs256.md`.
- **Pasos:**
  1. `node scripts/generate-jwt-keys.mjs` → poblar `infra/secrets/jwt_private_key`, `jwt_public_key`.
  2. Crear `service_jwt_secret`, `rabbitmq_uri`, `database_url_<servicio>` en `infra/secrets/`.
  3. `.env` con placeholders para los `${VAR:?}` (ver `docs/operacion/secrets.md`).
  4. `docker compose -f infra/docker-compose.prod.yml -f infra/docker-compose.secrets.yml up -d`.
  5. Verificar: login RS256 vía Kong, `:8001` no accesible desde el host, métricas/health OK.
- **Criterio:** stack prod arranca leyendo secretos de `/run/secrets/*`; login + ruta protegida 200; Admin API no accesible.
- **Riesgo:** medio — la interpolación de compose es host-side; el entrypoint hace el `*_FILE → VAR`. Validar que los 9 servicios cargan sus secretos en arranque (log `[entrypoint] … cargado desde Docker secret`).

---

## C3 — Subir cobertura de tests (continuo) — **L** 🟡

- **Estado:** umbrales en `vitest.config.mts` = branches 32 / functions 29 / lines 35 / statements 34 (cobertura real ~37/35/31/38).
- **Foco siguiente** (bajo %): controllers de servicios, `app.service` de cuentas/mesas/reservas/notificaciones, `outbox.processor` (ramas de error), mappers del PWA.
- **Pasos:** añadir specs por servicio; subir umbrales por escalones (45 → 60 → 80) **solo** tras medir; nunca bajarlos.
- **Criterio:** cada escalón con CI verde; objetivo 80% en plomería crítica.

---

## C4 — Alertas a Slack reales — **S** 🟠

- **Objetivo:** que las alertas de outbox lleguen a Slack de verdad (hoy hay dos caminos preparados pero sin webhook).
- **Archivos:**
  - App: `libs/resiliencia/src/lib/outbox-alert.ts` ya postea a `SLACK_WEBHOOK_URL` si está definido → setear la env en los servicios (compose).
  - Infra: `infra/alertmanager/alertmanager.yml` → descomentar el `slack_configs` con el `api_url` real (o inyectarlo por secreto).
- **Pasos:** crear un Incoming Webhook en Slack; setear `SLACK_WEBHOOK_URL`; forzar un `FAILED` (marcador `__QA_INVENTARIO_FORCE_DLQ__`) y/o disparar la regla `OutboxEventosFallidos`; confirmar el mensaje.
- **Criterio:** un evento FAILED produce mensaje en el canal; alerta de Prometheus visible en Alertmanager.

---

## C5 — Poblar `meseroId` end-to-end (cierra 6.3) — **M** 🟢

- **Estado:** el read-model de reportes ya agrupa por `meseroId`/`meseroNombre` (campos opcionales en `CuentaCerradaPayload`), pero **cuentas no los propaga** todavía → `/reportes/por-mesero` agrupa todo en "(sin asignar)".
- **Archivos:**
  - `apps/servicio-pedidos`: capturar el usuario que crea el pedido (del JWT, `@UsuarioActual()`), persistirlo en `PedidoItem`/`Pedido` (nueva migración) y exponerlo.
  - `apps/servicio-cuentas`: al cerrar cuenta, derivar el mesero (del/los pedido(s)) y poblar `meseroId`/`meseroNombre` en `CuentaCerradaPayload`.
- **Criterio:** `/reportes/por-mesero` muestra ventas reales por mesero tras pagar cuentas.
- **Riesgo:** medio — toca pedidos + cuentas + 1-2 migraciones.

---

## C6 — Corrida completa de la matriz de alta contención — **S** 🟡

- **Estado:** los fixes del harness ya están (re-login proactivo en `run-stock-idempotency-dlq.js`, `extractArray` con `.data` en `run-concurrency-limits.js`). Falta correr la matriz **completa** a fondo.
- **Pasos:** con el stack arriba y poblado: `npm run probar:alta-contencion` (3 niveles 50/100/200 × 100 iter × 2 runners; ~1 h). Vigilar `token expired` (debe ser 0 gracias al refresco proactivo).
- **Criterio:** exit 0 limpio en los 3 niveles; 0 `token expired`; invariantes de stock y concurrencia OK.
- **Nota:** validación de carga, no de correctitud (la correctitud ya está probada: 300/300 + C5/C6/C7).

---

## C7 — Confirmar e2e + Playwright en CI — **S** 🟡

- **Estado:** `integration-docker.yml` ya ejecuta los 9 `*-e2e` (jest directo contra el stack, puertos del compose) + Playwright PWA, gatillado por `pull_request`. Cableado pero **no corrido en pipeline real**.
- **Pasos:** abrir un PR (C1) y revisar que el job pase; ajustar tiempos/esperas si algún `*-e2e` o Playwright es flaky en el runner.
- **Criterio:** el job `docker-integration` verde en un PR.

---

## Secuencia recomendada

```
1. C1 (commit + push)  →  C7 (ver que el CI pase)
2. C4 (Slack)  →  C6 (matriz completa)         # rápidos, alto valor operativo
3. C2 (deploy prod con secrets)                # antes de un release real
4. C5 (meseroId end-to-end)                    # cierra 6.3
5. C3 (cobertura, continuo en paralelo)
```

**Camino mínimo para un release:** C1 → C7 → C2.

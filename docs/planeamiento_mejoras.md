# Plan de implementación — Mejoras NachoPps

> Generado a partir de la auditoría del código (única fuente de verdad).
> Verificado atómicamente contra el código el 2026-06-05.
> Esfuerzo: **S** ≤ medio día · **M** ≤ 2 días · **L** ≥ 3 días.
> Severidad: 🔴 bloqueante real · 🟠 importante · 🟡 calidad · 🟢 producto/proceso.

---

## Fase 0 — Cerrar lo ya hecho (commit pendiente)

| # | Tarea | Estado |
|---|-------|--------|
| 0.1 | Migraciones regeneradas (`init` por servicio = `schema.prisma`); resuelve drift schema↔migraciones | ✅ hecho · falta commitear + rebuild imágenes |
| 0.2 | `migrate deploy` en entrypoint; CORS/secretos/OTEL en compose; cookie 24h; README + `.env.example` | ✅ hecho · falta commitear |
| 0.3 | Verificación E2E en Docker (outbox sano + login vía Kong) | ⏳ a medias — terminar antes del commit |

**Criterio de aceptación:** stack `up` limpio, 9 servicios *healthy*, 0 errores de outbox en logs, login + ruta protegida → 200. Luego commit temático.

---

## Fase 1 — Correctitud de datos (🔴)

### 1.1 Compensación de la saga de stock — **M** 🔴
- **Problema:** pedidos ya protege su proyección local con `pg_advisory_xact_lock` + descuento atómico condicional (`UPDATE productos_locales … WHERE "stockActual" >= cantidad RETURNING`, `pedidos/app.service.ts:203-216`), así que el doble-gasto sobre la *misma* proyección está cubierto. La carrera residual es por **divergencia/staleness entre `productos_locales` y el stock real de inventario** (lag del evento `ProductoActualizado`): si la proyección quedó alta, dos pedidos la descuentan y ambos se crean. Inventario descuenta atómicamente (nunca queda negativo), pero el segundo falla el `where: stockActual >= cantidad` → `count === 0` y **solo loguea** (`inventario/app.service.ts:288`). El pedido sobrante queda en firme: inconsistencia silenciosa pedido↔stock, sin compensación ni aviso.
- **Archivos:**
  - `libs/contracts/src/events/routing-keys.ts` → `StockInsuficiente: 'stock.insuficiente'`.
  - `libs/contracts/src/domains/inventario.ts` → `StockInsuficientePayload { pedidoId, productoId, solicitado, disponible }`.
  - `apps/servicio-inventario/src/app/app.service.ts` → al `count === 0`, persistir `StockInsuficiente` en el outbox (mismo `$transaction`).
  - `apps/servicio-pedidos/src/app/events.controller.ts` + `app.service.ts` → consumer que marca ítem/pedido `RECHAZADO_SIN_STOCK` y emite `PedidoActualizado`.
  - Schema pedidos: nuevo valor de enum de estado → **nueva migración**.
- **Criterio:** `stress-tests/run-high-contention.js` deja 0 ítems "fantasma"; todo sobre-pedido queda marcado.
- **Riesgo:** medio (2 servicios + migración). Ventana estrecha (requiere divergencia de proyección), pero el impacto es inconsistencia silenciosa de datos. Cubrir con test de integración.

### 1.2 Guard de drift de migraciones en CI — **S** 🔴
- **Objetivo:** que `schema.prisma` ≠ migraciones rompa el build (evita que recaiga el problema de hoy).
- **Archivos:** `.github/workflows/ci.yml` + `scripts/check-migration-drift.sh` → por servicio: `prisma migrate diff --from-migrations … --to-schema … --exit-code` (falla si hay drift).
- **Criterio:** CI rojo si se edita un schema sin generar migración.

### 1.3 Idempotencia HTTP en mutaciones críticas — **M** 🔴
- **Objetivo:** evitar duplicados por doble-click/retry en `POST /pedidos` y `POST /caja/pagos`.
- **Enfoque:** header `Idempotency-Key` → interceptor que persiste la clave **y la respuesta** para devolverla cacheada en reintentos.
- **Estado de la tabla:** el modelo `IdempotencyKey` existe solo en 5/9 servicios (inventario, mesas, notificaciones, pedidos, reportes) y solo guarda `key` + `createdAt` (`@@map("idempotency_keys")`) — es un marcador de dedup de **eventos**, no almacena la respuesta HTTP. No existe ningún `idempotency.interceptor.ts`.
  - **pedidos:** reusa la tabla pero requiere **ampliar el schema** (status/body/headers) para poder hacer *replay* de la respuesta.
  - **caja:** **no tiene la tabla** → requiere **nueva migración** para crearla (con los campos de respuesta).
- **Archivos:** `libs/shared-*/idempotency.interceptor.ts`; migraciones en pedidos (ampliar) y caja (crear); controllers de pedidos y caja; el front (`api/client.ts`) genera la key en POST.
- **Criterio:** dos POST idénticos con misma key → un solo recurso, misma respuesta.
- **Nota de esfuerzo:** la **M** incluye migración + diseño del almacenamiento de respuesta (no es solo un interceptor).

### 1.4 Refresh tokens (o decisión explícita) — **M** 🔴
- **Problema:** el Swagger de identidad menciona "refresh tokens" (`identidad/main.ts:48`) pero el flujo no existe: no hay `POST /auth/refresh`, no hay modelo `RefreshToken` y `login()` solo devuelve `access_token`. El JWT caduca en `JWT_EXPIRES_IN` (default `12h` en código `auth.module.ts:18`, sobrescrito a `24h` en el compose de prod); la cookie `access_token` vive 24h.
- **Scaffolding huérfano:** ya existen DTOs sin usar `RefreshTokenDto` y `AuthTokensResponseDto` (con `expires_in: 900`) en `dto/refresh-token.dto.ts` — reaprovechables en el Enfoque A o a borrar en el B.
- **Enfoque A (implementar):** `POST /auth/refresh`, modelo `RefreshToken` (+ migración), cookie `refresh_token` httpOnly de larga duración con rotación; alinear `JWT_EXPIRES_IN`/cookie con un access corto.
- **Enfoque B (descartar):** quitar la mención del Swagger, borrar los DTOs huérfanos y asumir corte a 24h.
- **➡ Requiere decisión del usuario.**

---

## Fase 2 — Seguridad (🟠)

### 2.1 JWT RS256 en vez de HS256 compartido — **M** 🟠
- **Problema:** el mismo `JWT_SECRET` firma y verifica en los 9 servicios; filtrarlo en uno permite forjar tokens para todos.
- **Archivos:** identidad firma con `JWT_PRIVATE_KEY`; `libs/shared-auth/jwt.strategy.ts` y Kong (`kong.yml.template`: `algorithm: RS256`, `rsa_public_key`) verifican con la pública.
- **Criterio:** tokens RS256 validados por Kong y servicios; rotación documentada.
- **Riesgo:** medio — coordinar identidad + 8 servicios + Kong en una sola PR.

### 2.2 Ocultar Kong Admin API en prod — **S** 🟠
- **Archivos:** `infra/docker-compose.prod.yml` → quitar mapeo `8001:8001` (dejar `KONG_ADMIN_LISTEN` solo en red interna / `127.0.0.1`).
- **Criterio:** `:8001` no accesible desde fuera del host.

### 2.3 Gestor de secretos — **M** 🟠
- **Enfoque:** Docker secrets o SSM/Vault; sacar valores de `.env` en disco. Mínimo: migrar `JWT_*`, `DB_PASS`, `RABBITMQ_PASS` y documentar el flujo.

### 2.4 CSP explícita en Helmet — **S** 🟠
- **Estado:** los 9 `main.ts` usan `app.use(helmet())` sin argumentos. Helmet v8 **ya aplica un CSP por defecto**, así que la tarea es **adaptarlo** a la PWA (no añadirlo desde cero), no dejarlo en valores genéricos.
- **Archivos:** los 9 `main.ts` → `helmet({ contentSecurityPolicy: {…} })` con directivas para la PWA; validar que no rompe Swagger UI en dev (el CSP por defecto de helmet sí lo rompe).

---

## Fase 3 — Fiabilidad y escalado (🟠)

### 3.1 Métrica + alerta de profundidad del outbox — **S** 🟠 (alto valor)
- **Objetivo:** canario de salud del sistema event-driven.
- **Archivos:** cada `outbox.processor.ts` expone gauges `outbox_pending_total` / `outbox_failed_total`; `infra/prometheus` + regla Alertmanager (pending > N o cualquier FAILED).
- **Criterio:** dashboard Grafana con profundidad por servicio + alerta disparable.


### 3.3 Reprocesamiento del outbox + alerta real — **S** 🟠
- **Estado:** el marcador `[ALERTA][OUTBOX_FAILED]` **ya se loguea** (`outbox.processor.ts:51`); falta solo enrutarlo a un webhook real (Slack). No existe endpoint de reproceso.
- **Archivos:** endpoint admin `POST /outbox/:id/retry` (reset de outbox-DB `FAILED → PENDING`) protegido por rol; enrutar `[ALERTA][OUTBOX_FAILED]` a webhook real (Slack).
- **Ojo:** son **dos** mecanismos dead-letter distintos: (a) el outbox en BD (lo que ataca este endpoint) y (b) el DLQ de broker (`NACHOPPS_DLX` + `dlq.<cola>` en `rabbitmq-publisher.service.ts`), que este punto **no** cubre. Además los `FAILED` del outbox se purgan a los 7 días (`RETENCION_FAILED_HORAS = 168`) → ventana de retry acotada.

### 3.5 Backups de las 9 BDs — **M** 🟠
- **Enfoque:** sidecar/cron `pg_dump` por BD a almacenamiento externo + retención; documentar restore (ops, sin código).

### 3.6 Resiliencia de reconexión a RabbitMQ en caliente — **S** 🟠
- **Estado:** ya se usa `amqp-connection-manager` (reconexión automática con backoff y `setup` re-ejecutado al reconectar), así que la base de resiliencia **ya existe**. Esto es sobre todo **verificación / test de caos**, no implementación.
- **Verificar:** que la caída de RabbitMQ no mate el proceso y que colas/bindings se reasienten. Test: matar RabbitMQ y reanudar.

---

## Fase 4 — Testing y CI (🟡)

### 4.1 e2e en CI — **M** 🟡
- **Estado:** `.github/workflows/integration-docker.yml` **ya existe**: levanta el stack y corre smokes (`probar`, `probar:stock`, `probar:seguridad`). Pero dispara solo en `push` a `main` + `workflow_dispatch` (**no gatea PRs**) y **no** corre los 9 proyectos `*-e2e` de Nx ni Playwright PWA.
- **Gap real:** (a) añadir trigger `pull_request` para gatear; (b) ejecutar los 9 `*-e2e` + Playwright PWA.
- **Archivos:** `.github/workflows/integration-docker.yml`.

### 4.2 Subir cobertura en plomería crítica — **L** (incremental) 🟡
- **Umbrales actuales** (`vitest.config.mts`): branches 31 / functions 28 / lines 34 / statements 33.
- **Foco (bajo % según la auditoría — re-confirmar al medir):** `outbox.processor`, controllers, `shared-auth/jwt.strategy` y `shared-auth/service-token.service` (estos dos últimos sin spec).
- **Criterio:** subir umbrales de `vitest.config.mts` por escalones (≈34→45→60→80); nunca bajarlos.

### 4.3 Contract tests entre servicios — **M** 🟡
- **Enfoque:** tests que validen que cada `@EventPattern` consume el payload exacto de `@org/contracts`; un cambio de contrato debe fallar en CI.

---

## Fase 5 — Observabilidad (🟡)

### 5.1 Agregación de logs + correlationId — **M** 🟡
- **Estado:** `EventMetadata` declara `correlationId?` (`contracts/messaging/envelope.ts`) pero **no se popula**: `createEventEnvelope` solo setea `occurredAt`/`producer`, y el publicador propaga la correlación vía contexto de OpenTelemetry en headers AMQP (`propagation.inject` en `rabbitmq-publisher.service.ts`), no por ese campo del envelope.
- **Archivos:** logger JSON estructurado que propague el `trace_id`/`correlationId` (poblándolo si se usa) en los 9 servicios; Loki + Grafana para correlacionar traza ↔ logs.

### 5.2 Métricas de negocio — **S** 🟡
- **Enfoque:** counters/histograms de dominio (pedidos/min, lag evento→consumo, pagos). Complementa 3.1.

---

## Fase 6 — Producto y proceso (🟢)

| # | Tarea | Esfuerzo |
|---|-------|----------|
| 6.2 | Versionado de API (`/v1` en gateway + prefijo) | S |
| 6.3 | Reportes más ricos (por producto/turno/mesero) | M |
| 6.4 | Limpieza de repo: `dist/` y `tmp/` ya están en `.gitignore`; `docs-deprecated/` está **trackeado** (requiere `git rm`, no basta ignorar); `new-front/` está sin trackear y sin ignorar | S |
| 6.5 | CHANGELOG + convención de commits | S |

---

## Secuencia recomendada (respeta dependencias)

```
Sprint 1 (correctitud + base): 0.1–0.3 → 1.2 → 1.1 → 3.1
Sprint 2 (seguridad):          2.2 → 2.4 → 2.1 → 1.3
Sprint 3 (escalado):           3.3 → 3.6 → 4.1
Sprint 4 (robustez):           4.2 (continuo) → 4.3 → 5.1 → 5.2 → 3.5
Sprint 5 (producto):           6.2 → 6.3 → 6.4 → 6.5 → (1.4 según decisión) → 2.3
```

> Nota: este plan no incluye tareas 3.2, 3.4 ni 6.1 (numeración no contigua heredada de versiones previas); la secuencia solo referencia tareas existentes.

**Camino crítico mínimo para "producción seria"** (si hay que recortar):
`0.x → 1.1 → 1.2 → 2.1 → 2.2 → 3.1 → 4.1`
Cierra correctitud de datos, la mayor superficie de seguridad y el canario de salud.

---

## Decisiones abiertas
1. **1.4 Refresh tokens:** ¿implementar o asumir corte a 24h? Implementar refresh tokens
2. **Arranque del Sprint 1:** ¿empezar por 1.1 (compensación de stock) o primero terminar la prueba en Docker + commit Fase 0? Terminar prueba docker + commit Fase 0

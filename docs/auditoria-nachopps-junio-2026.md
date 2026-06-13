# Auditoría atómica — NachoppsSOA (rama dev, junio 2026)

**Alcance:** 9 microservicios NestJS + PWA React 19, 6 libs compartidas, infra (Kong, RabbitMQ, Postgres ×9, observabilidad), CI/CD, documentación. ~290 archivos TS backend, ~11k líneas de frontend, 64 suites de specs.

**Veredicto general:** el proyecto ya opera muy por encima del promedio de un proyecto personal — en varias áreas (mensajería, autenticación, resiliencia) está a nivel de un equipo senior. Los hallazgos que siguen son el delta que falta para que un revisor externo no encuentre nada que objetar.

---

## 1. Fortalezas verificadas (no tocar, son tu carta de presentación)

Estas no son cortesía: las verifiqué en el código.

- **Transactional Outbox consolidado** (`libs/resiliencia`): claim con `FOR UPDATE SKIP LOCKED`, rescate de eventos `PUBLISHING` huérfanos, métricas de profundidad y lag, purga con retención diferenciada. Réplicas múltiples seguras.
- **Autenticación de nivel producción**: RS256 para usuarios con clave privada solo en identidad, HS256 con secreto distinto para S2S (cierra la confusión RS256→HS256 explícitamente en `makeJwtSecretOrKeyProvider`), claim `aud` por servicio destino, rotación de refresh tokens con detección de reuso y compare-and-swap transaccional, mitigación de timing attack con hash dummy, lockout exponencial, re-hash perezoso de bcrypt.
- **CSRF double-submit** con `timingSafeEqual` y manejo del caso de longitudes distintas.
- **Dinero en `Decimal(10,2)`** en todos los schemas; aritmética con `Decimal` en caja antes de convertir a número solo en los bordes.
- **Decremento de stock condicional** (`updateMany where stockActual >= cantidad`) con compensación de saga (`StockInsuficiente`) emitida en la misma transacción. Advisory lock para reposición.
- **Kong bien configurado**: login 5/min/IP, refresh 60/min, bloqueo explícito de `/telemetry/metrics`, JWT en el gateway además del servicio (defensa en profundidad real).
- **CI seria**: `nx affected`, `npm audit` de prod como gate, guard de drift de migraciones con shadow DB, e2e en workflow aparte, logs subidos en fallo.
- **Dockerfile multi-stage** con digest pinning, `npm ci --ignore-scripts`, imagen final sin toolchain.
- **Service worker que jamás cachea la API** (verificado: filtra por método, origen y prefijo `/v1/`).
- **Higiene de tipos**: `strict: true`, `no-explicit-any: error` en código de producción (relajado solo en specs), token de acceso en memoria (no localStorage) con limpieza del legado.
- **Documentación**: 10 ADRs, CHANGELOG en formato Keep a Changelog, runbooks de operación, README que explica el escalado del outbox.

---

## 2. Hallazgos por severidad

### 🔴 H-01 — Clave privada RSA committeada en `infra/docker-compose.yml`

**Dónde:** líneas 1–2 del compose dev (anchors `&jwt_private` / `&jwt_public`).

El comentario "SOLO DESARROLLO" es honesto, pero una clave privada PEM completa en control de versiones es el primer hallazgo que reportaría cualquier scanner (gitleaks, trufflehog) o revisor humano, y descalifica el repo ante un filtro automático de empresas. Riesgos concretos: (a) si el repo es o será público, la clave queda en el historial para siempre; (b) cualquiera que levante el compose dev en un host expuesto tiene un par conocido públicamente; (c) normaliza el patrón "secreto en YAML".

**Remediación:**
1. Generar el par dev al vuelo: un script `scripts/dev-keys.sh` que escriba a `infra/secrets/` (ya gitignoreado) y que el compose lea vía `env_file` o `secrets:`.
2. Rotar la clave (aunque sea "solo dev", trátala como comprometida).
3. Si el repo será público: purgar del historial con `git filter-repo`.

### 🟠 H-02 — Snapshot JSON `pedidos` sin tipo: ~25 `any` con `eslint-disable` concentrados en cuentas/caja/reportes

**Dónde:** `apps/servicio-cuentas/src/app/app.service.ts` (líneas 153–403), `servicio-caja` (`buildResumen`), `servicio-reportes` (iteración de `items`).

El campo `pedidos` (columna JSON) es de facto un **contrato entre servicios** (cuentas lo escribe, caja y reportes lo leen), pero vive sin tipo, así que la regla `no-explicit-any` que tanto cuidaste está agujereada justo en la lógica monetaria, que es donde más duele un campo renombrado silenciosamente.

**Remediación:** definir `PedidoSnapshot` / `ItemSnapshot` en `@org/contracts` (donde ya viven los payloads de eventos) y, idealmente, validar al deserializar (Zod o class-validator) para que un snapshot corrupto falle ruidosamente en vez de producir un `NaN` en un total. Esto elimina de golpe la mayoría de los 40 `any` del backend.

### 🟠 H-03 — `Idempotency-Key` se regenera en el retry post-refresh del cliente

**Dónde:** `apps/pwa-cliente/src/api/client.ts` — `applyHeaders` genera la clave sobre el objeto `Headers` local; al reintentar tras un 401+refresh, `request()` reconstruye headers desde `init` y genera una clave **nueva**.

Hoy el impacto es bajo (el primer intento devolvió 401 sin procesarse), pero el diseño es frágil: el día que añadas retry por error de red o 5xx, el mecanismo de deduplicación que construiste en el backend no te protegerá, porque cada reintento llevará clave distinta.

**Remediación:** generar la clave una sola vez por *operación* (en `client.post`, antes del primer fetch) y propagarla al retry.

### 🟠 H-04 — Modo "tolerante" de `SERVICE_AUD_ENFORCE` sigue en el código

**Dónde:** `libs/shared-auth/src/lib/jwt.strategy.ts` + nota en `.env.example` (T-56b ya lo reconoce).

Un token S2S con audiencia incorrecta pasa con un warn si la variable no está en `'true'`. Es un fail-open controlado por configuración: un despliegue donde alguien olvide la variable degrada silenciosamente la seguridad. La propia documentación dice que debe retirarse — hazlo: elimina la rama tolerante y que la ausencia de la variable equivalga a estricto.

### 🟡 H-05 — `mapToDto` enmascara datos faltantes con `new Date()`

**Dónde:** `servicio-cuentas` — `createdAt: c.createdAt?.toISOString() || new Date().toISOString()`.

Si `createdAt` llega nulo hay un bug aguas arriba; reportar "ahora" lo oculta y corrompe reportes y auditoría. Mejor lanzar o loguear y devolver el campo como opcional.

### 🟡 H-06 — Cobertura en ~53% líneas / 45% branches

Los pisos anti-regresión calibrados con honestidad brutal en `vitest.config.mts` son una práctica excelente, pero el número sigue lejos del 80% objetivo. Prioriza por riesgo: `servicio-caja` (arqueo, cierre Z, diferencias) y `servicio-cuentas` (totales, división de cuenta) concentran la lógica monetaria; el "escalón 3" que ya tienes anotado (`use*Query` + `*.api.ts`) es el camino correcto en frontend.

### 🟡 H-07 — `console.log` en `libs/observabilidad/src/lib/tracing.ts`

Las dos llamadas del shutdown del SDK deberían usar `Logger` (o `process.stderr.write` si Winston ya está caído en ese punto, que es lo más probable durante el apagado — documenta el porqué con un comentario). Es menor, pero está en la lib que define el estándar de logging del resto.

### 🟡 H-08 — Throttling solo en el gateway

Kong limita login a 5/min/IP, pero los servicios no tienen `@nestjs/throttler`. Si algo dentro de la red interna queda comprometido (o un despliegue futuro expone un puerto), el login solo lo protege el lockout por cuenta. Como defensa en profundidad, un throttler por ruta en identidad (login/refresh) cuesta poco. Severidad baja porque el lockout exponencial ya mitiga el caso por-cuenta.

---

## 3. Higiene del repositorio

**H-09 — Sprawl de configuración de agentes IA (~1.2 MB duplicado).** `.agents/`, `.cursor/`, `.gemini/`, `.opencode/` y `.github/skills/` contienen las mismas skills byte a byte (verifiqué hashes). Cinco copias divergen tarde o temprano. Mantén una fuente canónica (`.agents/`) y genera el resto con un script de sync (o symlinks donde la herramienta lo soporte), o saca todo esto del repo principal — un revisor externo lo lee como ruido.

**H-10 — `docs/` raíz con ~25 planes/handoffs/auditorías históricas.** `plan-remediacion-auditoria.md`, `_v5`, `handoff-SA…SE`, dos informes de pruebas… Son valiosos como historia, pero entierran los documentos vivos (ADRs, runbooks). Mueve lo cerrado a `docs/archive/` con un índice de una línea por documento. Borra `docs/servicio_pedidos_backend.js` (28 líneas de JS sueltas en docs).

**H-11 — `packages/` vacío pero declarado en `workspaces`.** Elimina la entrada o el directorio; las inconsistencias pequeñas son lo que un auditor usa para calibrar cuánto desconfiar del resto.

**H-12 — Seed `nachopps123` sin guard de entorno.** `scripts/poblar-datos.ts` está documentado como dev-only, pero nada impide ejecutarlo apuntando a una `DATABASE_URL` de producción. Añade un guard que aborte si `NODE_ENV === 'production'` o si la URL no apunta a localhost/red conocida.

**H-13 — Módulo Compras mock.** Bien documentado (README + comentario en el archivo, punto único de reemplazo). Solo asegúrate de que la UI lo señale al usuario (badge "demo" o similar) para que nadie cargue órdenes de compra reales contra datos que se evaporan.

---

## 4. Plan de acción sugerido (en orden)

| # | Acción | Esfuerzo | Cierra |
|---|--------|----------|--------|
| 1 | Sacar la clave PEM del compose dev, rotar, (purgar historial si será público) | 1–2 h | H-01 |
| 2 | Tipar `PedidoSnapshot` en `@org/contracts` + validación al deserializar | 3–5 h | H-02, parte de H-05 |
| 3 | Eliminar modo tolerante de `SERVICE_AUD_ENFORCE` | 30 min | H-04 |
| 4 | Fijar `Idempotency-Key` por operación en el cliente | 30 min | H-03 |
| 5 | Archivar docs históricos, borrar JS suelto, limpiar `packages/` | 1 h | H-10, H-11 |
| 6 | Unificar configs de agentes a una fuente | 1 h | H-09 |
| 7 | Guard de entorno en seeds | 15 min | H-12 |
| 8 | Throttler en identidad + Logger en tracing | 1 h | H-07, H-08 |
| 9 | Escalón 3 de cobertura (caja/cuentas primero) | continuo | H-06 |

Los puntos 1–4 son los que marcarían la diferencia ante una revisión externa; el resto es pulido.

---

## 5. Nota sobre lo que NO encontré

Busqué activamente y no hallé: inyección SQL (raw queries parametrizadas, `$queryRawUnsafe` solo con identificador de tabla constante), fugas de stack traces al cliente (el `GlobalExceptionFilter` normaliza), secretos de producción (todo `${VAR:?}` con fail-fast), floats para dinero, cachés del SW sobre la API, CORS permisivo en prod, ni dependencias obviamente abandonadas. El reporte de auditoría previo (`docs/production-audit-report.md`) y la trazabilidad T-XX en comentarios indican que el grueso de la deuda ya fue atacado sistemáticamente.

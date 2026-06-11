# Plan de Remediación — NachoPps (v5.1 · Documento de cierre)

> **v5.1 — cierre, G-0 cumplido.** Consolida el estado tras la 2.ª corrida de runtime **y el
> cierre del gate G-0** (HEAD `4f0fddb`, 7 commits atómicos, Suite 1 re-corrida en verde sobre
> el hash, M-01 y P-46 cerrados): **27 de 30 tareas cerradas con evidencia anclada a commit**.
> La firma final depende solo del runbook manual de la §4 (4 verificaciones) y de la
> ratificación/ejecución de la **fase 2 de T-17** (§3).
>
> Trazabilidad: cada estado cita las pruebas P-NN del
> [plan de pruebas](plan-pruebas-post-remediacion.md) y del
> [informe de ejecución](informe-pruebas-remediacion.md).

---

## 1. Gate G-0 — Commit del estado verificado — ✅ **CUMPLIDO (2026-06-10)**

**Resultado.** El working tree de la corrida 2 quedó commiteado en `dev` en **7 commits
atómicos** (HEAD **`4f0fddb`**), en el orden y agrupación que pedía este gate:
`97d9b61` T-05 · `b0d7d07` reportes (incidental) · `1057552` T-29 · `ec0a0cf` T-28 ·
`ae7686b` T-30 · `003e5a2` T-20 · `4f0fddb` docs/M-01. La **Suite 1 completa se re-corrió
en verde sobre el HEAD** (473/473 specs, cobertura 53.72/52.92 con pisos intactos, drift 9/9,
greps en 0), el runtime se reconfirmó sobre el stack vivo (http 8/8, smoke 4/4, caos 3/3,
P-46 1/1) y el informe quedó re-anclado al hash con las corridas previas como apéndice
histórico. `git status` limpio.

**Hallazgo del propio gate (validado):** la verificación §1.2 atrapó un bug real — la
excepción `!stress-tests/reports/BASELINE.md` era inerte porque el patrón padre
`stress-tests/reports/` (con `/` final) excluía el **directorio**, y git no re-incluye
archivos bajo un directorio excluido. Corregido al patrón canónico `stress-tests/reports/*`;
`git ls-files stress-tests/reports/` → solo `BASELINE.md`. Este es exactamente el tipo de
defecto que justificaba que G-0 fuera un gate con verificación y no un trámite.

---

## 2. Tablero final (T-01 … T-30)

| ID | Tarea | Estado | Evidencia de cierre / pendiente |
|----|-------|--------|----------------------------------|
| T-01 | Kong: login/refresh/logout separados | ✅ | P-10 completo: login 5×401+429; **refresh ×10 sin ningún 429** (los 401 observados son rotación one-time, no rate-limit). |
| T-02 | Eliminar `/auth/validate` | ✅ | P-06 + P-11 (404 directo, 401 perímetro). |
| T-03 | Lockout por cuenta | ✅ | P-12 **completo** con cuenta dedicada: 5 fallos → bloqueo; password correcta durante bloqueo → 401 genérico; backoff 60 s → 200 + contador en 0; `CUENTA_BLOQUEADA` sin email (el esquema guarda `usuarioId`). |
| T-04 | Último ADMIN protegido | ✅ | P-13 (409 a la auto-degradación del único ADMIN). |
| T-05 | bcrypt 12 + re-hash perezoso | 🔄✅ | Bug crítico (re-hash del hash) hallado por P-14, corregido + spec que lo codificaba corregido; verificado E2E; todos los usuarios en `$2b$12$`. |
| T-06 | Purga IdempotencyKey ×6 | ✅ | P-24: purga viva demostrada en los 4 servicios que no purgaban; módulo registrado en los 6; spec de lib verde. |
| T-07 | OutboxProcessor en lib | ✅ | P-06 (0 copias) + `probar:stock` 12/12. |
| T-08 | SKIP LOCKED + claimedAt | ✅ | P-21 ×3 (9/9): claim exclusivo, 0 duplicados, rescate de PUBLISHING → 100/100 PROCESSED. |
| T-09 | Stress 2 réplicas | ✅ | P-21 ×3 consecutivas estables; cubre P-63 (kill a mitad de lote). |
| T-10 | Bootstrap compartido | ✅ | P-02 + stack 9/9 healthy. |
| T-11 | Filter único | ✅ | P-06. |
| T-12 | Guards identidad → lib | ✅ | P-06 + suites verdes. |
| T-13 | Pedidos usa ServiceTokenService | ✅ | P-06 (0 firmas inline) + P-50 (flujo de cobro end-to-end OK). |
| T-14 | Idempotency-Key + requestHash | ✅ | P-23: 201 → 201 mismo id → **422** con body distinto. |
| T-15 | `UsuarioAutenticado` retirado | ✅ | P-06 + P-72. |
| T-16 | Métricas bloqueadas en Kong | ✅ | P-30: 404/404 externo, 200 interno, Prometheus `up`. |
| T-17 | S2S con claim `aud` | ⏳ **fase 1/2** | Emisión + lógica de verificación cubiertas (spec 45/45 incl. rechazo por `aud` ajeno). **El enforcement está apagado** (`SERVICE_AUD_ENFORCE=off`, rollout tolerante por diseño): el control no está activo en ningún entorno. Ficha de fase 2 en §3. |
| T-18 | Routing keys tipadas / `any` | ✅ | P-01 verde. Todos los `any` eliminados (catch→`unknown`, specs→`Record<string,unknown>`, casts seguros). Regla subida a `error` en `eslint.config.cjs` [`6517db6`]. |
| T-19 | WS rooms por rol | ⏳ | Spec del gateway verde (en P-03). **Falta P-32** (manual, 2 navegadores) — runbook §4.1. |
| T-20 | Higiene de repo | ✅ | Resuelta **no destructiva**: `git rm --cached` ×142 (disco + historial intactos), `BASELINE.md` versionado por excepción, 9 invariantes repuntadas. P-06/T-20 → 0 y P-74 ✅. Decisión del equipo cumplida en sus criterios. |
| T-21 | Skills fuente única + CI | ✅ | P-05 (con negativo) + P-75. |
| T-22 | Backlog frontend | ✅ milestone | 5 pantallas descompuestas siguiendo patrón Comandero [`ecb3342`]: 9 archivos nuevos en `components/` y `hooks/`; pantallas resultantes todas bajo ~200l. **P-46 ✅** (Playwright, paginación infinita). Trabajo continuo no bloquea firma. |
| T-23 | Mensajes RMQ persistentes | ✅ | **P-22**: 20 mensajes encolados sobreviven a `docker restart rabbitmq`; al reanudar, stock 100→80 (exactamente 1 descuento por pedido). |
| T-24 | WS CORS unificado a `CORS_ORIGIN` | ⏳ | Grep ✅. **Falta P-33** (prod-like con dominio/cert) — runbook §4.4. |
| T-25 | Turno de caja único (global) | ✅ | P-40: 5 aperturas concurrentes → 1 ABIERTA, mismo `turno.id`. |
| T-26 | Slot único en migración | ✅ | P-41: índice vía `migrate deploy`; 1×201 / 5×409 en carrera. |
| T-27 | SW no intercepta `/v1/` | ⏳ | Código ✅ + **P-46 ✅** (Playwright 1/1 sobre stack vivo, paginación infinita en Inventario/Pedidos/Cocina). **Falta solo P-45 en vivo** (Cache Storage + offline) — runbook §4.2. |
| T-28 | Fixtures de stress | ✅ | Saneados (los 4 + 2 flecos: poll en vez de `sleep` en C5, envoltura `{mesa:{...}}`) y **re-corridos**: concurrencia 5/5, caos 8/8, run-all con presupuesto de login como assert. |
| T-29 | Cobertura al piso | ✅ | P-03 exit 0: **53.72 / 52.92** con pisos intactos (52/53); caja 40→88.6 % lines; 473/473 specs. |
| T-30 | `zona` → `ubicacion` en PWA | ✅ | 7 archivos + nota en doc del endpoint; typecheck+lint+unit verdes; el caos de T-28 ya ejercita `ubicacion` contra la API. |

**Verificación bonus registrada:** el `[200, 401×9]` del refresh ×10 validó incidentalmente
la **detección de reuso** de refresh tokens — las 9 reutilizaciones del token consumido
fueron rechazadas, exactamente lo que la rotación one-time con revocación debía hacer.

**Micro-tareas (no bloqueantes):**
- **M-01 ✅ resuelta** (en G-0, commit `4f0fddb`): el placeholder `fuente: [E:1]` de
  `_indice.md` (preexistente, `53877c8`) repuntado a `BASELINE.md`; resuelve con `test -f`.
- **M-02 ✅ resuelta — Harness e2e reproducible:** `apps/pwa-cliente/vite.config.e2e.ts`
  (proxy `/v1`→`:8000` y `/notificaciones`→`:8000` con WS, `VITE_API_BASE_URL` vacío) +
  `webServer` en `playwright.config.ts` que lo arranca automáticamente. `pnpm nx e2e
  pwa-cliente` funciona de cero, sin montaje manual.
- **M-03 ✅ resuelta:** `run-remediacion-runtime.js` consulta `outbox_events` (el `@@map`
  real); P-62 ya no imprime el error de diagnóstico.
- **M-04 ✅ resuelta:** ítems 3 y 5 de "Hallazgos que reabren tarea" tachados y anotados
  `→ ✅ RESUELTO`; cero afirmaciones contradictorias activas (criterio §5.5 satisfecho).

---

## 3. T-17 · Fase 2 — Activar el enforcement de audiencia S2S

**Por qué es una ficha y no una nota.** El destino clásico de un flag de rollout tolerante
es quedarse apagado para siempre; mientras `SERVICE_AUD_ENFORCE=off`, la verificación de
`aud` existe solo en el spec y cualquier token `SISTEMA` sigue siendo pase maestro entre
servicios. La fase 2 es parte de T-17, no una mejora opcional.

**Criterio de flip (propuesto — ratificar):** tras **7 días** de operación con la emisión
de `aud` activa y **cero** warnings de "aud faltante/incorrecta" en los logs de los 9
servicios (consulta en Loki/Grafana sobre el patrón de warning del modo tolerante).

**Acción.**
1. Verificar la ventana de logs (cero warnings de audiencia).
2. `SERVICE_AUD_ENFORCE=true` en `infra/docker-compose.yml` **y** `docker-compose.prod.yml`;
   redeploy de los 9.
3. Ejecutar el **negativo en vivo de P-31**: token HS256 forjado con `aud: servicio-inventario`
   contra cuentas → **401**; positivo: flujo caja→cuentas (P-50) sigue OK.
4. Registrar el resultado en el informe y marcar T-17 ✅.

**Verificación.** P-31 completo (spec + negativo en vivo + positivo E2E).
**Riesgo si se omite:** el control de seguridad diseñado en T-17 nunca entra en vigor.

---

## 4. Runbook — Verificaciones manuales restantes

Pensado para ejecutarse en una sesión de ~1 h (4.1–4.3 y 4.5 en local) + una ventana en
staging (4.4). Registrar cada resultado en el informe con fecha y ejecutor.

### 4.1 · P-32 — WS rooms por rol (T-19) · ~10 min, local
1. Stack arriba. Navegador A: sesión **CAJERO**; navegador B (perfil/incógnito): sesión **MESERO**. Ambos con DevTools → Network → WS → frames del socket.
2. Desde A, registrar un pago (`POST /v1/caja/pagos` o desde la pantalla de Caja).
3. **Esperado:** el frame `pago.registrado` aparece en A; **no** aparece en B. Crear luego un pedido desde B: el frame `pedido.*` llega a **ambos**.
4. Pasar por cada pantalla con cada rol y confirmar que sigue refrescando en vivo lo que le corresponde según la matriz de `libs/contracts`.

### 4.2 · P-45 — Service worker en vivo (T-27) · ~10 min, local
1. `pnpm nx build pwa-cliente` y servir el build (`npx serve dist/...` o el flujo del equipo). Iniciar sesión y navegar Mesas → Pedidos → Caja.
2. DevTools → Application → Cache Storage → `nachopps-pos-v4`: **solo assets estáticos, ninguna entrada con `/v1/`**; el caché `v3` ya no existe.
3. Network → Offline → recargar: el shell (`index.html`) carga; las llamadas API fallan limpio y la UI muestra el estado offline.

### 4.3 · P-46 — E2E Playwright (T-22/T-27) · ✅ HECHA (corrida G-0)
`paginacion.spec.ts` 1/1 (17.8 s) sobre el stack vivo: Inventario, Pedidos y Cocina cargan
su 2.ª página con ~50 productos+pedidos sembrados vía API. **Pendiente derivado (M-02):**
el montaje same-origin usado (proxy Vite temporal) debe commitearse como harness e2e
reproducible para que `pnpm nx e2e pwa-cliente-e2e` funcione de cero.

### 4.4 · P-33 — CORS del WS en prod-like (T-24) · ventana de staging
1. Desplegar `docker-compose.prod.yml` en staging con `CORS_ORIGIN=https://app.<staging>`.
2. `curl` del handshake Socket.IO con `Origin` correcto → 200; con `Origin: https://evil.example.com` → bloqueado.
3. La prueba que importa: abrir la **PWA real** en staging y confirmar que recibe eventos en vivo (antes del fix de T-24, esto era exactamente lo que fallaba en prod).

### 4.5 · P-56 — Ciclo de sesión completo (T-01) · ~20 min de espera, local
1. Login y dejar la sesión abierta **> 15 min** (expira el access token) sin recargar.
2. Ejecutar una acción: debe completarse sin re-login (refresh silencioso, sin 429 — DevTools confirma el `POST /auth/refresh` 200).
3. Logout: cookies limpiadas; reintentar una acción → 401; el refresh token quedó revocado (un `POST /auth/refresh` manual con la cookie vieja → 401).

---

## 5. Criterios de firma final

Estado por criterio:

1. ✅ **G-0** cumplido: HEAD `4f0fddb`, Suite 1 verde sobre el hash, informe re-anclado (§1).
   **HEAD vigente:** `6517db6` (T-18/T-22, 2 commits sobre M-02/03/04). Informe re-anclado en §"Cierre T-18/T-22". `nx lint pwa-cliente` y `nx lint servicio-pedidos-e2e` exit 0 sobre el HEAD.
2. ⏳ Runbook §4: **P-46 ✅**; faltan **P-32, P-45, P-56** (local, ~45 min en total) y
   **P-33** (staging) — sin hallazgos bloqueantes hasta ahora.
3. ⏳ **T-17 fase 2** según §3: ratificar el criterio de flip y **arrancar ya la ventana de
   7 días de logs** (corre desde que la emisión de `aud` está viva en el entorno observado;
   cada día sin iniciarla es un día más con el control apagado).
4. ✅ M-01…M-04 aplicadas.
5. ✅ **Informe sin contradicciones activas** (M-04): corrida 1 como apéndice, fixtures
   HECHO, hallazgos 3 y 5 tachados-resueltos. Falta solo añadir la línea del bonus de
   detección de reuso de refresh al archivar.
6. ⏳ Archivado final: informe con fecha, **HEAD `6517db6`** y ejecutor; las cifras
   de la corrida 2 ya son el `BASELINE.md` vigente.

---

## 6. Decisiones — registro final

| Decisión | Resolución | Estado |
|----------|-----------|--------|
| Auto-degradación de ADMIN | Rechazar siempre | ✅ implementada y verificada (P-13) |
| Evento `UsuarioAutenticado` | Retirado del catálogo | ✅ (P-06/P-72) |
| Bloqueo de `/telemetry/metrics` | En Kong | ✅ (P-30) |
| Matriz evento→roles del WS | Aprobada | ⏳ spec verde; P-32 manual pendiente |
| Turno de caja único | Global (índice sobre `estado`) | ✅ (P-40); reabrir solo si llega multi-caja |
| `docs-deprecated/` y `design_handoff/` | Fuera de control de versiones, vía `git rm --cached` (no destructivo) | ✅ criterios cumplidos (P-06/T-20, P-74) |
| Copy visible "Zona" en la UI | Identificadores homologados a `ubicacion`; la palabra "Zona" se mantiene como copy | ✅ (T-30) |
| Pisos de cobertura | No se bajan | ✅ ratificada y cumplida (T-29: 53.72/52.92 con pisos 52/53) |
| **Flip de `SERVICE_AUD_ENFORCE`** | **Propuesto: 7 días sin warnings de `aud` → true + P-31 en vivo** | 🆕 a ratificar (§3) |

---

## 7. Lecciones registradas (entregable de prácticas)

1. **Los tests del mismo autor comparten los puntos ciegos del código** (T-05): el spec
   codificaba el bug que debía atrapar; lo detectó la capa E2E (P-14) por verificar estado
   real en BD y logins *sucesivos*. Acción permanente: caso e2e de "doble login" en identidad.
2. **La matriz de trazabilidad ordenó ambas corridas**: cada ❌ mapeó a una T-NN, se corrigió
   con rastro y se re-verificó (T-05, reportes, `fuente:`, fixtures).
3. **Un baseline vale lo que sus fixtures**: T-28 precedió al `BASELINE.md`; los dos flecos
   extra (sleep→poll, envoltura del DTO) solo aparecieron al *desbloquear* los escenarios —
   los falsos negativos esconden otros falsos negativos detrás.
4. **Las decisiones de equipo no se revierten en ejecución, se escalan** (T-20): la objeción
   ("destructiva") tenía una salida técnica (`git rm --cached`) que cumplía la decisión sin
   el costo temido; escalarla antes habría ahorrado una corrida con el gate inalcanzable.
5. **Un flag de rollout tolerante sin fecha de flip es un control de seguridad apagado**
   (T-17): la fase 2 se calendariza al activar la fase 1, no después.
6. **La evidencia sin commit no es evidencia** (G-0): el estado verificado debe quedar
   anclado a un hash antes de firmar; y los informes append-only se reorganizan al cierre
   para no archivar contradicciones activas.

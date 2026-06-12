# Plan de Remediación — NachoPps (v5 · Documento de cierre)

> **v5 — cierre.** Reemplaza al v4. Consolida el estado tras la **2.ª corrida de runtime**
> (informe 2026-06-10, stack 9/9): **25 de 30 tareas cerradas con evidencia**, 4 pendientes
> de verificación manual/entorno, 1 en rollout por fases. La firma final queda **condicionada
> al gate G-0 (commit)** y al runbook manual de la §4.
>
> Trazabilidad: cada estado cita las pruebas P-NN del
> [plan de pruebas](plan-pruebas-post-remediacion.md) y del
> [informe de ejecución](informe-pruebas-remediacion.md).

---

## 1. Gate G-0 — Commit del estado verificado (BLOQUEANTE de la firma)

**Situación.** Todo lo verificado en la corrida 2 vive en un **working tree sin commitear**
sobre `03e359f` (lo declara el propio informe). La evidencia certifica un estado que ningún
hash captura: un `git reset` accidental borra el fix de T-05, T-20, T-28/29/30, los specs
nuevos y `BASELINE.md`. Un informe de cierre que apunta a un working tree no es auditable.

**Acción (en este orden):**
1. Commitear el working tree en commits atómicos con referencia de tarea. Agrupación sugerida:
   - `fix(identidad): re-hash perezoso sobre texto plano [T-05]` (service + spec corregido)
   - `fix(reportes): deps reales de shared-auth en package.json [incidental]`
   - `test(caja,pwa): cobertura turnos/arqueo/registrarPago y format [T-29]`
   - `test(stress): fixtures saneados — ubicacion, turno en C5, sin validate, resetRateLimit [T-28]`
   - `refactor(pwa): zona→ubicacion en identificadores + nota en doc del endpoint [T-30]`
   - `chore(repo): git rm --cached de 142 artefactos, BASELINE.md + excepción .gitignore, invariantes repuntadas [T-20]`
   - `docs: fuente: repuntadas + ADR-005 [P-73]`
2. Verificar que la **excepción de `.gitignore` para `BASELINE.md`** viaja en el commit
   (`git ls-files stress-tests/reports/` → solo `BASELINE.md`).
3. **Re-correr la Suite 1 completa sobre el HEAD commiteado** (P-01…P-06 — es barata) y
   anotar el hash nuevo.
4. Actualizar el encabezado del informe: commit real, sin "working tree".

**Criterio.** `git status` limpio; Suite 1 verde sobre un hash citable; informe re-anclado.

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
| T-18 | Routing keys tipadas / `any` | ✅ gate | P-01 verde, 2 `warn` registrados; reducción continua hasta subir la regla a `error`. |
| T-19 | WS rooms por rol | ⏳ | Spec del gateway verde (en P-03). **Falta P-32** (manual, 2 navegadores) — runbook §4.1. |
| T-20 | Higiene de repo | ✅ | Resuelta **no destructiva**: `git rm --cached` ×142 (disco + historial intactos), `BASELINE.md` versionado por excepción, 9 invariantes repuntadas. P-06/T-20 → 0 y P-74 ✅. Decisión del equipo cumplida en sus criterios. |
| T-21 | Skills fuente única + CI | ✅ | P-05 (con negativo) + P-75. |
| T-22 | Backlog frontend | ⏳ continuo | Sin bloqueo de firma; P-46 lo cubre incrementalmente. |
| T-23 | Mensajes RMQ persistentes | ✅ | **P-22**: 20 mensajes encolados sobreviven a `docker restart rabbitmq`; al reanudar, stock 100→80 (exactamente 1 descuento por pedido). |
| T-24 | WS CORS unificado a `CORS_ORIGIN` | ⏳ | Grep ✅. **Falta P-33** (prod-like con dominio/cert) — runbook §4.4. |
| T-25 | Turno de caja único (global) | ✅ | P-40: 5 aperturas concurrentes → 1 ABIERTA, mismo `turno.id`. |
| T-26 | Slot único en migración | ✅ | P-41: índice vía `migrate deploy`; 1×201 / 5×409 en carrera. |
| T-27 | SW no intercepta `/v1/` | ⏳ | Código ✅. **Falta P-45 en vivo** (Cache Storage + offline) y **P-46** (Playwright) — runbook §4.2/4.3. |
| T-28 | Fixtures de stress | ✅ | Saneados (los 4 + 2 flecos: poll en vez de `sleep` en C5, envoltura `{mesa:{...}}`) y **re-corridos**: concurrencia 5/5, caos 8/8, run-all con presupuesto de login como assert. |
| T-29 | Cobertura al piso | ✅ | P-03 exit 0: **53.72 / 52.92** con pisos intactos (52/53); caja 40→88.6 % lines; 473/473 specs. |
| T-30 | `zona` → `ubicacion` en PWA | ✅ | 7 archivos + nota en doc del endpoint; typecheck+lint+unit verdes; el caos de T-28 ya ejercita `ubicacion` contra la API. |

**Verificación bonus registrada:** el `[200, 401×9]` del refresh ×10 validó incidentalmente
la **detección de reuso** de refresh tokens — las 9 reutilizaciones del token consumido
fueron rechazadas, exactamente lo que la rotación one-time con revocación debía hacer.

**Micro-tarea M-01 (no bloqueante):** `_indice.md` con `fuente: [E:1]` — placeholder roto
**preexistente** (commit `53877c8`, 2026-06-02), ajeno a la remediación. Reemplazar por la
ruta real o eliminar la línea; re-correr el check de `fuente:` (54+1 refs).

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

### 4.3 · P-46 — E2E Playwright (T-22/T-27) · ~15 min, local
```sh
npx playwright install   # si faltan los browsers
pnpm nx e2e pwa-cliente-e2e
```
**Esperado:** verde. Cualquier rojo se triaja contra T-27/T-30 (selectores que digan `zona` serían restos del rename).

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

Se firma cuando, **en este orden**, se cumple todo:

1. **G-0**: working tree commiteado, Suite 1 re-corrida en verde sobre el HEAD citable, informe re-anclado al hash.
2. Runbook §4 completo (P-32, P-45, P-46, P-56 en local; P-33 en staging) sin hallazgos bloqueantes.
3. **T-17 fase 2** ejecutada según §3 (o, como mínimo, su criterio de flip ratificado y calendarizado con responsable — en cuyo caso la firma deja constancia explícita de que el enforcement queda pendiente con fecha).
4. M-01 aplicada (placeholder de `_indice.md`).
5. **Informe final reorganizado** antes de archivar: corrida 1 como apéndice histórico, corrida 2 como estado vigente, **cero afirmaciones contradictorias activas** (hoy conviven "Suite 1 ✅" y "Gate NO superado", tablas viejas con P-21 ⏳ junto a la sección que lo cierra, y la nota de fixtures recomendando lo ya hecho). Incluir la verificación bonus de reuso de refresh.
6. Archivado: informe con fecha, commit y ejecutor; las cifras de la corrida 2 ya son el `BASELINE.md` vigente.

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

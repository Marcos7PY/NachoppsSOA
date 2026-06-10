# Informe de Pruebas Post-Remediación — NachoPps

> Ejecución del [plan de pruebas post-remediación](plan-pruebas-post-remediacion.md).
>
> - **Commit bajo prueba:** `03e359f` + working tree de la sesión 2026-06-10 (T-28/T-29/T-30/T-20 + suites de prueba; sin commitear).
> - **Rama:** `dev`
> - **Fecha:** 2026-06-10
> - **Ejecutor:** Claude Code (Opus 4.8)
> - **Entorno:** Windows 11, Docker 29.4.3, Node + nx local. La 1.ª corrida fue **sin stack**; la **2.ª corrida (runtime completa, §"Ejecución de runtime 2026-06-10")** se hizo con el **stack 9/9 healthy** (Kong `:8000`, RabbitMQ, 9 Postgres, observabilidad) ya levantado.

## Resumen ejecutivo

> Estado **tras la 2.ª corrida (runtime, 2026-06-10)**. Detalle por P-NN en §"Ejecución de runtime 2026-06-10".

| Suite | Estado | Nota |
|-------|--------|------|
| 1 — Gates automáticos | ✅ | P-01/P-02/P-04/P-05 ✅; **P-03 ✅** (cobertura 53.72/52.92, T-29); P-06 ✅ incl. T-20 → 0 |
| 9 — Revisión documental | ✅ | P-70/P-71/P-72/P-75 ✅; **P-73 ✅** (54 refs ok; placeholder `_indice.md` aparte); **P-74 ✅** (BASELINE.md, T-20) |
| 2 — Gateway/Auth | ✅ | P-10..P-14 ✅ (lockout completo con reset + auditoría sin email). Fix crítico T-05 mantenido. |
| 3 — Outbox/Mensajería | ✅ | P-20 (stock 12/12, conc 5/5, seg 7/7), P-21 ×3 (9/9), P-22 (persistencia), P-23 (422), P-24 (purga ×4 svc). |
| 4 — Perímetro/S2S/WS | ⚠️ Parcial | P-30 ✅. P-31 spec ✅ (live gated por `SERVICE_AUD_ENFORCE`). P-32/P-33 manual/prod-like. |
| 5 — Integridad/carreras | ✅ | P-40 (turno único) y P-41 (anti-doble-booking) verificados en carrera. |
| 6 — PWA | ⏳ | P-45 código ✅, en vivo manual; P-46 e2e pendiente. |
| 7 — Smoke negocio | ✅ | P-50..P-55 ✅ (pago/cierre/mesa, no-oversell, reserva, reposición, DLQ). P-56 parcial. |
| 8 — Caos/resiliencia | ✅ | P-60 (caos 8/8), P-61 (identidad down), P-62 (db restart), P-63 (kill réplica vía P-21). |

> **🐞 Hallazgo crítico (T-05):** el re-hash perezoso en `auth.service.ts` re-hasheaba el **hash almacenado** en vez del texto plano → tras el primer login la credencial quedaba corrupta (401 permanente). Corregido (1 línea) + test que codificaba el bug corregido. Detalle en la sección de hallazgos. **Sin este fix, todo el runtime fallaba en cascada.**

**Gate de entrada (Suite 1 en verde): NO superado** por P-03 (cobertura) y T-20 (excluido por diseño). Por tanto, según el propio plan, las suites de runtime no deberían firmarse hasta resolver esos puntos. **Stack:** levantado **9/9 servicios** (tras corregir el build de `servicio-reportes`) + RabbitMQ + 9 Postgres + Kong + observabilidad, con seed completo y 6 usuarios por rol.

---

## Suite 1 — Gates automáticos globales

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-01 lint | ✅ | `nx run-many --target=lint --all` exit 0. 25 proyectos. 2 `warning` `no-explicit-any` en `apps/servicio-pedidos-e2e/.../servicio-pedidos.spec.ts:14,24` (registrados, T-18). |
| P-02 build | ✅ | `nx run-many --target=build --all` exit 0. 10 proyectos con target `build`, todos OK. (El plan menciona "22 proyectos"; en el workspace actual solo 10 tienen target de build; el resto son libs/e2e.) |
| P-03 test | ✅ (corregido, T-29) | Estado original: `nx run-many --target=test --all` **exit 1** por cobertura bajo el piso (líneas 48.53% < 53%, statements 47.62% < 52%). **Cerrado en T-29** (2026-06-10): exit 0 con **líneas 53.72% / statements 52.92%** (branches 50%, functions 47.5%), **pisos intactos (52/53)**. Se añadió cobertura a lo más delicado y nuevo: `servicio-caja` 40%→**88.6%** lines (apertura/cierre/arqueo/movimientos de turno — T-25 — y caminos de error de `registrarPago` — T-14/T-17 — + controller) y `format.ts` de la PWA. **473/473** specs en verde. |
| P-04 migration-drift | ✅ | `scripts/check-migration-drift.sh` exit 0 — "Sin drift" en los 9 servicios. *Nota de entorno:* había un PostgreSQL **nativo** ocupando `:5432`; hubo que levantar el Postgres shadow en `:5544` (`SHADOW_DATABASE_URL=postgresql://postgres:postgres@localhost:5544/drift_shadow`) para no autenticar contra el nativo (P1000). |
| P-05 sync-skills | ✅ | `node scripts/sync-agent-skills.mjs --check` exit 0. Negativo: tras alterar `.cursor/skills/nx-workspace/SKILL.md` → exit 1; tras `git checkout` → exit 0. |
| P-06 greps erradicación | ⚠️ | Ver desglose abajo. Todo en 0 real salvo **T-20** (excluido). |

### P-06 — desglose

| Tarea | Patrón | Resultado | Veredicto |
|-------|--------|-----------|-----------|
| T-02 | `auth/validate\|validarToken` | 0 en fuente real. Las 2 coincidencias (`security-coverage.spec.ts:58,67`) son un test que **asserta la eliminación** (`expect(...).not.toContain("auth/validate")`). | ✅ |
| T-15 | `UsuarioAutenticado\|usuario.autenticado` | 0 artefactos reales. Las coincidencias son comentarios (`auth.service.ts:94`), docs del plan y este informe. | ✅ |
| T-24 | `ALLOWED_ORIGINS` | 0 | ✅ |
| T-06 | `purgarIdempotencyKeys` en `apps` | 0 (solo en libs) | ✅ |
| T-13 | `jwtService.sign` en pedidos | 0 | ✅ |
| T-07 | `outbox.processor.ts` en apps | 0 | ✅ |
| T-11 | `global-exception.filter.ts` en apps | 0 | ✅ |
| T-12 | `jwt-auth.guard.ts` identidad | no existe | ✅ |
| T-20 | artefactos versionados (`tsbuildinfo`, `reports/*Z.md`, `.zip`, `docs-deprecated`, `design_handoff`) | **0** tras T-20 (eran 142, sacados con `git rm --cached`, no destructivo) | ✅ **cerrado (2026-06-10)** — ver §sesión 2026-06-10 |
| T-23 | `persistent` en `shared-rabbitmq` | 1 (≥1) | ✅ |

> *Aclaración importante:* el grep del plan (`grep -rn ... apps libs`) matchea también el JS compilado en `dist/` (no versionado). Excluyendo `dist/`, los conteos reales de T-02 y T-15 son 0 de artefacto. `dist/` no está versionado en git (0 archivos).

---

## Suite 9 — Revisión documental

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-70 | ✅ | README sin "Restricción de escalado" (0). Garantía multi-réplica documentada (`README.md:90`: SKIP LOCKED + cron de rescate, T-08). |
| P-71 | ✅ | ADR-002 con adendas **T-23** (persistencia `deliveryMode:2`), **T-07** (processor unificado) y **T-08** (SKIP LOCKED + escalado horizontal). ADR-005 cita la migración (pero su `fuente:` está rota → ver P-73). |
| P-72 | ✅ | `docs/eventos/usuario.autenticado.md` eliminado; `_catalogo.md` sin `usuario.autenticado` (0). |
| P-73 | ✅ (corregido) | Eran **3 `fuente:` rotas** + ADR-005, ya **reparadas** en esta corrida (repuntadas a migraciones reales): `exactamente-un-exito-bajo-carrera.md` y ADR-005 → `20260609010000_slot_unico_index/migration.sql`; `idempotencia-directa.md` → `servicio-inventario/.../20260605000000_init/migration.sql:59`; `idempotencia-inversa.md` → `servicio-pedidos/.../20260605000000_init/migration.sql:108`. Re-check: **57 refs, 0 faltantes**. |
| P-74 | ✅ (cerrado en T-20, 2026-06-10) | `stress-tests/reports/BASELINE.md` creado (versionado vía excepción en `.gitignore`) con las cifras canónicas; las **9 invariantes** que citaban reportes con timestamp ahora apuntan a él. `git ls-files | grep -E "tsbuildinfo\|reports/.*Z\.md\|\.zip$\|docs-deprecated\|design_handoff"` → **0**. |
| P-75 | ✅ | `CONTRIBUTING.md:47-54` documenta el flujo de skills (`.agents/skills` como fuente única + `node scripts/sync-agent-skills.mjs`). |

---

## Suites 2–5 — Runtime (stack levantado, 8/9 servicios)

Stack levantado vía `scripts/build-and-test-all.ps1` (build de imágenes + `docker compose --profile all`). Infra sana (RabbitMQ, 9 Postgres, Kong, observabilidad). Servicios: 8/9 healthy (**reportes no compiló**). Seed con `seed-admin.js` + `poblar-datos.ts` (6 cat., 25 prod., 14 mesas) + 6 usuarios por rol creados vía API.

### Suite 2 — Gateway y autenticación

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-11 (T-02) | ✅ | `/api/auth/validate` directo al servicio → **404** (endpoint eliminado). Vía Kong → 401 en el perímetro (ruta no pública, sin token); con cualquier token el servicio responde 404. |
| P-12 (T-03) | ✅ (incidental) | El lockout se disparó realmente sobre `admin` (`failedLoginAttempts` llegó a 6, `lockedUntil` futuro) devolviendo **401 genérico** "Credenciales inválidas" que **no revela el bloqueo**. Coincide con el criterio T-03. |
| P-13 (T-04) | ✅ | Admin único intenta auto-degradarse a MESERO → **409** "No se puede auto-degradar: use otro administrador…". |
| P-14 (T-05) | ✅ (tras fix) | Tras corregir el bug de re-hash: login con `$2b$10$` → 200 + re-hash a `$2b$12$`; logins sucesivos → 200; `bcrypt.compare(plano, hashFinal)=true`. |
| P-10 (T-01) | ✅ | 6 logins con credenciales malas → **5×401 y el 6.º 429** (rate-limit por ruta exacto). La 2.ª mitad (presupuesto independiente de `/auth/refresh`) queda pendiente (requiere sesión válida con cookie refresh + CSRF). |

### Suite 3 — Outbox, mensajería e idempotencia

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-20 (`probar:stock`) | ✅ | Todos OK: T0 autoridad de stock, D1/D1c redelivery idempotente, R1/R2 reposición inversa/delta, T7 etiqueta errónea no infla, DLQ declarada/enrutable, **D2 fallo→DLQ→reinyección→reconvergencia**, T3/T9 profundidad DLQ/parking, T4 mensaje veneno aparcado, colas finales sin pendientes. Sin oversell. |
| P-20 (`concurrencia`/`seguridad`/`alta-contencion`) | ⏳ | En ejecución. |
| P-21 (`probar:replicas`, T-08/T-09) | ⏳ | Pendiente (requiere 2 réplicas). |
| P-23/P-24 | ⏳ | Cubiertos parcialmente por `probar:stock`; checks HTTP directos pendientes. |

### Suite 4 — Perímetro, S2S y notificaciones

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-30 (T-16) | ✅ | Kong bloquea `/v1/pedidos/telemetry/metrics` y `/pedidos/telemetry/metrics` → **404/404**; métricas Prometheus **accesibles desde dentro** del contenedor (`:3000/api/telemetry/metrics`). |
| P-31 (T-17) | ⏳ | Audiencia S2S — pendiente (firma manual HS256). |
| P-32 (T-19) | ⏸️ | Rooms por rol WS — requiere 2 navegadores (manual). |
| P-33 (T-24) | ⏸️ | CORS WS — requiere stack prod-like con dominio/cert staging. |

### Suite 5 — Integridad de datos y carreras

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-40 (T-25) | ✅ | Índice `turnos_caja_un_abierto` existe. Carrera de aperturas múltiples (incl. concurrentes) → queda **1 turno ABIERTA**; aperturas extra devuelven 201 idempotente sobre el turno abierto. |
| P-41 (T-26) | ✅ | Índice `Reserva_fecha_hora_active_unique` existe en `db-reservas`. C7 del stress de concurrencia confirma 1×201 / 9×409 sobre el mismo slot. |

### Suite 8 — Caos y resiliencia

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-60 (`probar:caos`) | ✅ (resiliencia) | Con todos los servicios arriba: RabbitMQ matado (`docker kill`) → **los 9 servicios sobreviven sin reiniciar**; el plano HTTP sigue respondiendo con el broker caído (`GET /pedidos 200`); al reanudar, **las colas recuperan consumidores** (bindings reasentados, todas las `*_queue`=1). Los únicos ❌ del reporte son la mutación baseline de mesa → **fixture obsoleto** (ver nota). |
| P-61/P-62/P-63 | ⏳ | Pendientes (degradación de identidad, restart de db-pedidos bajo carga, kill de réplica). |

### Suites 6–7 — Pendientes

- **Suite 6** (PWA, P-45/P-46): build prod PWA + e2e Playwright — no ejecutadas.
- **Suite 7** (Smoke negocio, P-50…P-56): pendientes. Con el stack 9/9 y turno de caja abierto, el flujo de pago ya es ejecutable.

---

## Nota: fixtures de stress desactualizados (falsos negativos)

Varias "fallas" de los harnesses de stress NO son regresiones de producto, sino **fixtures obsoletos** en los scripts de `stress-tests/`:

- **`property zona should not exist`** — `run-rabbitmq-chaos.js` y otros crean mesas con un campo `zona` que el DTO de mesas ya no acepta (validación whitelist). Crear mesa sin `zona` funciona.
- **`No hay turno de caja abierto`** — `run-concurrency-limits.js` (C5 "pago duplicado") intenta pagar sin abrir un turno de caja primero → 400×10. El rechazo es correcto; el test no monta el precondición.
- **`/auth/validate` / token validation burst** — `run-all-stress-tests.js` (Test 2) golpea el endpoint eliminado en T-02 → 100% "fallo" esperado.
- **Rate-limit de login saturado** — al encadenar muchos scripts, el presupuesto por IP de `/auth/login` ya estaba agotado, dando falsos negativos en "Rate limit login por Kong"; en una corrida limpia, P-10 da 5×401+429 correctamente.

> **Recomendación:** actualizar estos fixtures (quitar `zona`, abrir turno antes de C5, retirar el burst de `/auth/validate`) para que el `run-all-stress-tests.js` vuelva a ser una señal limpia y se pueda regenerar el `BASELINE.md` (T-20/P-74).

---

## Hallazgos que reabren tarea (según matriz de trazabilidad)

1. **🐞 T-05 (CRÍTICO) — re-hash perezoso corrompía la credencial.** `apps/servicio-identidad/src/auth/auth.service.ts` re-hasheaba `usuario.password` (hash) en vez de `command.password` (texto plano). Tras el primer login, el usuario quedaba con 401 permanente. El test `auth.service.spec.ts` "T-05 re-hash perezoso" **codificaba el bug** (esperaba `hash(usuarioBase.password,12)`). **Corregido y verificado E2E** en esta sesión. → Reabre y cierra T-05.
2. **🐞 `servicio-reportes` no compilaba (CORREGIDO)** — el Dockerfile compila `libs/shared-auth` (que usa `@nestjs/jwt`/`@nestjs/passport`/`passport-jwt`) y reportes no declaraba esas deps, así que `npm install` no las traía al construir su imagen → `tsc` fallaba. reportes **usa** `JwtAuthGuard` de shared-auth ([app.module.ts:30](apps/servicio-reportes/src/app/app.module.ts:30)), así que son deps reales. **Fix:** añadidas a `apps/servicio-reportes/package.json` (como en identidad). Imagen reconstruida y servicio **healthy** (9/9 arriba).
3. **P-03 — cobertura bajo el piso** (líneas 48.53% < 53%, statements 47.62% < 52%). Bloquea el gate de entrada. No es bajada de pisos; es cobertura insuficiente.
4. **P-73 / ADR-005 — 4 referencias `fuente:` rotas** por renombrado/consolidación de migraciones (T-26, T-14/T-06). **Corregidas** en esta sesión.
5. **T-20 (excluida por destructiva)** — explica P-06/T-20 (142 artefactos versionados) y P-74 (sin `BASELINE.md`). Decisión previa registrada; no es regresión nueva.

## Ejecución de runtime 2026-06-10 (stack 9/9 levantado)

Segunda corrida, **con el stack completo arriba**, ejecutando la batería de runtime que la 1.ª
corrida dejó pendiente. Automatizada en `stress-tests/run-remediacion-runtime.js`
(suites `http`/`smoke`/`caos`) + los `probar:*` de stress + verificaciones SQL directas.

### Suite 2 — Gateway y autenticación

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-10 | ✅ | Login 5×401 + 6.º 429 (presupuesto por ruta). **Refresh ×10 sin ningún 429** (presupuesto propio): `[200,401×9]` — los 401 son la **rotación one-time** del refresh token (no recapturada por el script), no rate-limit. |
| P-11 | ✅ | `POST /api/auth/validate` directo al servicio (`:3001`) → **404**; vía Kong → 401 (ruta no pública). |
| P-12 | ✅ | Lockout **completo** sobre cuenta dedicada (`mesero.seguridad@`, directo a `:3001`): 5 fallos → `failedLoginAttempts=5` + `lockedUntil>now`; 401 genérico; **estando bloqueado, la contraseña correcta también da 401** (no revela el bloqueo); `AuditoriaLog.CUENTA_BLOQUEADA` **sin email** (el esquema solo guarda `usuarioId`); tras el backoff de **60 s** → login correcto **200** y contador **reseteado a 0**. |
| P-13 | ✅ | Auto-degradación del único ADMIN → **409**. |
| P-14 | ✅ | Todos los usuarios con prefijo `$2b$12$` (re-hash de T-05 ya aplicado). |

### Suite 3 — Outbox, mensajería e idempotencia

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-20 | ✅ | `probar:stock` **12/12** (incl. D2 fallo→DLQ→reinyección→reconvergencia, T4 veneno aparcado, colas finales limpias); `probar:concurrencia` **5/5**; `probar:seguridad` **7/7**. `probar:alta-contencion` re-corrido tras saneamiento de fixtures. |
| P-21 | ✅ | `probar:replicas` **×3 consecutivas, 9/9** cada una: happy path (cada evento reclamado por **exactamente un** worker, 0 duplicados, todos PROCESSED, 0 atascados) **y** rescate (réplica muere con 40 en PUBLISHING → rescate los devuelve a PENDING → 100/100 PROCESSED, 0 perdidos). Cubre también **P-63**. |
| P-22 | ✅ | Consumidor inventario detenido → 20 pedidos → **20 mensajes encolados** en `inventario_queue` → `docker restart rabbitmq` → **siguen los 20** (persistencia `deliveryMode:2`, T-23) → al reanudar inventario, stock `100→80` (**exactamente 1 descuento por pedido**). |
| P-23 | ✅ | Idempotency-Key sobre `POST /pedidos`: **201 → 201 (mismo `pedido.id`) → 422** (misma clave, body distinto). |
| P-24 | ✅ | Purga viva demostrada en los 4 servicios que antes no purgaban (mesas, caja, notificaciones, reportes): clave de **8 días** eliminada por el predicado del cron (retención 7 d), clave fresca conservada. `IdempotencyPurgeModule` registrado en los **6** servicios + spec de la lib en verde. |

### Suite 4 — Perímetro, S2S y notificaciones

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-30 | ✅ | `/pedidos/telemetry/metrics` y `/v1/pedidos/telemetry/metrics` vía Kong → **404/404**; métricas Prometheus **accesibles desde dentro** del contenedor. |
| P-31 | ⚠️ parcial | Spec de `shared-auth` **45/45** (incluye rechazo de token con `aud` ajeno). El **negativo en vivo** queda **gated por `SERVICE_AUD_ENFORCE`**, que está **off** en este stack (rollout tolerante por diseño, T-17): el token forjado con `aud: servicio-inventario` no se rechaza por audiencia. Para el negativo en vivo: levantar cuentas con `SERVICE_AUD_ENFORCE=true`. |
| P-32 | ⏸️ manual | WS rooms por rol — requiere 2 navegadores. Spec del gateway cubierto en P-03. |
| P-33 | ⏸️ prod-like | CORS del WS — requiere staging con dominio/cert. |

### Suite 5 — Integridad de datos y carreras

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-40 | ✅ | 5 aperturas concurrentes de turno → **1 ABIERTA**, todas devuelven **el mismo `turno.id`**, índice `turnos_caja_un_abierto` presente. |
| P-41 | ✅ | Índice `Reserva_fecha_hora_active_unique` presente; 6 reservas concurrentes al mismo slot → **1×201 / 5×409**. |

### Suite 6 — PWA

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-45 | ⏸️ parcial | SW no intercepta `/v1/` y caché `v4`: verificado en código (T-27). Inspección en vivo de Cache Storage + offline shell → manual, no ejecutada. |
| P-46 | ⏳ | E2E Playwright — pendiente (requiere browsers de Playwright + PWA servida). |

### Suite 7 — Smoke de negocio

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-50 | ✅ | MESERO crea pedido → entregado → CAJERO cobra: pago **201**, cuenta **CERRADA**, mesa **LIBRE**. |
| P-51 | ✅ | Stock 1, 2.º pedido en otra mesa → rechazado (400), `stockFinal=0`, **sin oversell**. |
| P-52 | ✅ | Apertura de cuenta sobre mesa libre → mesa pasa a **OCUPADA** (vía evento). |
| P-53 | ✅ | Reserva crear (201) → confirmar (200) → cancelar (200) → **re-booking del mismo slot 201** (slot liberado). |
| P-54 | ✅ | Reposición (delta +50 sobre 10) → proyección de pedidos `productos_locales` refleja **60**. |
| P-55 | ✅ | Fallo de consumidor → DLQ → reinyección: cubierto por P-20 (`probar:stock` D2). |
| P-56 | ⚠️ parcial | Refresh silencioso verificado (P-10, sin 429); la expiración real del access (>15 min) y el logout no se esperaron. |

### Suite 8 — Caos y resiliencia

| ID | Resultado | Detalle |
|----|-----------|---------|
| P-60 | ✅ | `probar:caos` **8/8** (servicios sobreviven al `docker kill rabbitmq`, colas recuperan consumidores, mutación de mesa con `ubicacion`). |
| P-61 | ✅ | `docker stop servicio-identidad` con token vigente → `GET /pedidos` **200** (jwt-cache degradado: los ya autenticados siguen). |
| P-62 | ✅ | `docker restart db-pedidos` bajo carga → pedido tras reconexión **201** (servicio se reconecta, sin pedidos perdidos). |
| P-63 | ✅ | Cubierto por P-21 (kill de réplica a mitad de lote → rescate de PUBLISHING ≤ tiempos). |

### Hallazgos de esta corrida (no regresiones de producto)
- **Fixtures de stress** (T-28): además de los 4 falsos negativos del informe v1, al desbloquear los
  escenarios aparecieron 2 flecos más, también corregidos: C5 con `sleep` fijo → *flake* bajo
  contención del advisory lock (ahora pollea la cuenta CERRADA); el script de caos leía
  `mesa.data.id` plano cuando la API envuelve `{ mesa: {...} }`.
- **P-73 / `_indice.md`**: `fuente: [E:1]` es un **placeholder roto preexistente** (commit `53877c8`,
  2026-06-02), ajeno a la remediación; las 9 invariantes repuntadas a `BASELINE.md` y las 54 refs
  reales resuelven con `test -f`. Conviene corregir ese placeholder por separado.
- **P-31**: el negativo en vivo de audiencia S2S es inalcanzable con `SERVICE_AUD_ENFORCE` off
  (rollout tolerante por diseño); la lógica de enforcement está cubierta por el spec.

## Criterios de salida (sign-off)

**Estado tras la corrida de runtime 2026-06-10:** el grueso de los criterios se cumple. Detalle:

1. ✅ **Suite 1 en verde** (P-01..P-06, incl. cobertura P-03 y greps de erradicación T-20 → 0).
2. ✅ **T-20** cerrado: 142 artefactos fuera de control de versiones, `BASELINE.md` + invariantes (P-06/T-20, P-74).
3. ✅ **Runtime:** Suites 2, 3, 5, 7 (smoke), 8 (caos) en verde; 2.ª mitad de P-10 y P-21 ×3 hechas.
4. ✅ **Fixtures de stress** saneados y **re-corridos** (señal limpia).
5. ⏸️ **Falta para el sign-off pleno (no automatizable aquí o de bajo riesgo):**
   - **P-31** negativo en vivo de audiencia (requiere `SERVICE_AUD_ENFORCE=true`; lógica cubierta por spec).
   - **P-32** (WS, 2 navegadores) y **P-33** (CORS WS, staging con dominio/cert) — manuales/prod-like.
   - **P-45/P-46** (PWA: Cache Storage en vivo + e2e Playwright) y **P-56** (sesión >15 min real).
   - **`_indice.md`** con `fuente: [E:1]` (placeholder preexistente, corregir aparte).

**Lo positivo:** todos los invariantes de mensajería/idempotencia/carrera y de resiliencia pasan
(`probar:stock` 12/12, réplicas ×3, caos broker/identidad/db, persistencia de mensajes, turno único,
slot único); gateway/auth completo (P-10..P-14, lockout con reset y auditoría sin email); smoke de
negocio end-to-end (pago→cierre→mesa libre, no-oversell, reserva, reposición); y se mantuvo el fix
crítico de re-hash (T-05). Quedan solo verificaciones manuales/prod-like y un placeholder doc menor.

## Cambios de código aplicados en esta sesión

1. `apps/servicio-identidad/src/auth/auth.service.ts` — fix re-hash perezoso (T-05): re-hashear `command.password`, no `usuario.password`.
2. `apps/servicio-identidad/src/auth/auth.service.spec.ts` — corregido el test que codificaba el bug.
3. `apps/servicio-reportes/package.json` — añadidas `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` (build de imagen).
4. `docs/invariantes/{exactamente-un-exito-bajo-carrera,idempotencia-directa,idempotencia-inversa}.md` y `docs/decisiones/ADR-005-...md` — `fuente:` repuntadas a migraciones reales (P-73).

### Sesión 2026-06-10 (cierre de T-28/T-29/T-30)

5. **T-29 (cobertura, P-03):** specs nuevos `apps/servicio-caja/src/app/app.service.turnos.spec.ts` (21 casos: turno activo/resumen, movimientos, arqueo, cierre y caminos de error de `registrarPago`) y `app.controller.spec.ts` (delegación), más `apps/pwa-cliente/src/utils/format.spec.ts`. Resultado: P-03 exit 0, **lines 53.72% / stmts 52.92%** con pisos sin tocar (52/53).
6. **T-28 (fixtures de stress) — verificado en runtime (stack 9/9):** `run-rabbitmq-chaos.js` (`zona`→`ubicacion` + extracción `mesa.data.mesa.id`), `run-concurrency-limits.js` (C5 abre/cierra turno + poll de cuenta CERRADA en vez de `sleep` fijo), `run-all-stress-tests.js` (fuera `/auth/validate`; presupuesto de login como assert; `resetRateLimit()`). Resultados: **`probar:concurrencia` 5/5** (C5: `{201:1, 400/409:resto}`), **`probar:caos` 8/8**, **`run-all` Test 1** `{401:5, 429:3}`.
7. **T-30 (vocabulario de mesa):** `zona`→`ubicacion` / `mesaZona`→`mesaUbicacion` en los 7 archivos PWA + nota en `docs/servicios/servicio-mesas/endpoints/POST--raiz.md`. `typecheck`+`lint`+unit en verde.
8. **T-20 (higiene de repo) — completa, no destructiva:** `git rm --cached` de los 142 artefactos (siguen en disco + historial); `stress-tests/reports/BASELINE.md` creado y versionado (excepción en `.gitignore`); las 9 invariantes repuntadas a él. `git ls-files | grep -E "tsbuildinfo|reports/.*Z\.md|\.zip$|docs-deprecated|design_handoff"` → **0**. Cierra P-06/T-20 y P-74.

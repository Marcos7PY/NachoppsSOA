# Plan de Remediación Atómico — NachoPps (v4)

> **v4 — consolidación post-ejecución.** Integra los resultados del
> [informe de pruebas](informe-pruebas-remediacion.md) (commit `03e359f`, 2026-06-10)
> sobre el plan v3, y formaliza el trabajo restante. **Reemplaza al v3**: las tareas
> **cerradas** quedan archivadas en el tablero con su evidencia de cierre (el detalle de
> implementación ya vive en el código y sus PRs); las tareas **abiertas, reabiertas o
> nuevas** conservan la ficha atómica completa (1 tarea = 1 PR, con Evidencia, Cambio,
> Archivos, Verificación, Depende de).
>
> Excluido por decisión del equipo (sin cambios): el seed de contraseñas.

## Leyenda de estados

- ✅ **Cerrada** — implementada y verificada por las pruebas P-NN indicadas.
- 🔄 **Reabierta y cerrada en sesión** — la ejecución encontró un defecto, se corrigió y re-verificó.
- ⏳ **Parcial / pendiente de runtime** — código mergeado y gates estáticos en verde, pero faltan pruebas de ejecución.
- ❌ **Reabierta** — requiere acción o decisión.
- 🆕 **Nueva** — surgida de la ejecución de pruebas.

---

## Tablero de estado (T-01 … T-30)

| ID | Tarea | Estado | Evidencia / pendiente |
|----|-------|--------|------------------------|
| T-01 | Kong: rutas login/refresh/logout separadas | ⏳ | Login verificado (P-10: 5×401 + 429 exacto). **Falta** la 2.ª mitad: presupuesto independiente de `/auth/refresh` (10 refresh sin 429, con sesión + CSRF). |
| T-02 | Eliminar `POST /auth/validate` | ✅ | P-06 (0 referencias reales; las 2 restantes son un spec que *asserta* la eliminación) + P-11 (404 directo; 401 en perímetro). |
| T-03 | Lockout por cuenta | ⏳ | P-12 pasó **incidentalmente** (bloqueo real sobre `admin`, 401 genérico). **Falta**: reset tras backoff, incrementos concurrentes y `AuditoriaLog` sin email — re-ejecutar P-12 completo **con cuenta dedicada**, no con el admin. |
| T-04 | Último ADMIN protegido | ✅ | P-13: auto-degradación del único ADMIN → 409 con mensaje correcto. |
| T-05 | bcrypt 12 + re-hash perezoso | 🔄 | **Bug crítico hallado**: se re-hasheaba el hash, no el texto plano → credencial corrupta tras el 1.er login; el spec codificaba el bug. Corregido (`auth.service.ts` + spec) y verificado E2E (P-14: `$2b$10$`→`$2b$12$`, logins sucesivos OK). Ver §Lecciones. |
| T-06 | Purga IdempotencyKey ×6 | ⏳ | Greps ✅ (P-06). **Falta** P-24: purga viva verificada en BD de los 4 servicios que antes no purgaban. |
| T-07 | OutboxProcessor en lib | ✅ | P-06 (0 copias) + `probar:stock` completo OK (idempotencia, DLQ, reinyección, parking, no-oversell). |
| T-08 | SKIP LOCKED + claimedAt | ⏳ | Drift ✅ (P-04), README/ADR ✅ (P-70/71). **Falta** P-21: `probar:replicas` con 2 instancias. |
| T-09 | Stress 2 réplicas | ⏳ | No ejecutada (depende del entorno de P-21). |
| T-10 | Bootstrap compartido | ✅ | P-02 (build ×todos) + stack 9/9 healthy con health checks. |
| T-11 | Filter único | ✅ | P-06 (0 copias en apps). |
| T-12 | Guards de identidad → lib | ✅ | P-06 (archivos eliminados); suites de identidad y shared-auth pasan (el ❌ de P-03 es umbral global, no fallos de suite). |
| T-13 | Pedidos usa ServiceTokenService | ⏳ | Grep ✅ (0 `jwtService.sign` en pedidos). **Falta** confirmación funcional vía P-50 (flujo de cobro end-to-end). |
| T-14 | Idempotency-Key + requestHash | ⏳ | Migración ✅ (drift). **Falta** P-23: trío 201/201-mismo-id/**422** contra pedidos y caja. |
| T-15 | Retirar `UsuarioAutenticado` | ✅ | P-06 (0 artefactos; solo comentarios e informes) + P-72 (catálogo limpio). |
| T-16 | Métricas bloqueadas en Kong | ✅ | P-30: 404/404 vía gateway con JWT válido; 200 desde la red interna. |
| T-17 | S2S con claim `aud` | ⏳ | No verificada en runtime. **Falta** P-31 (token con `aud` ajeno → 401, firma manual HS256) + P-50 (positivo caja→cuentas). |
| T-18 | Tipar routing keys / frenar `any` | ✅ (gate) | P-01: lint verde; 2 `warn` registrados (`servicio-pedidos-e2e`). La reducción de `any` sigue como esfuerzo continuo hasta subir la regla a `error`. |
| T-19 | WS rooms por rol | ⏳ | **Falta** P-32 (spec + manual con 2 navegadores: MESERO no recibe `pago.registrado`, CAJERO sí). |
| T-20 | Higiene de repo | ✅ **Ratificada y completa** | Opción (a) ejecutada, no destructiva (`git rm --cached`: todo sigue en disco + historial). **142/142** artefactos fuera del control de versiones: `design_handoff_nachopps/` (14), `docs-deprecated/` (75, incl. 2 `.zip`), 2 `*.tsbuildinfo`, **51 `reports/*Z.md`**. `BASELINE.md` creado (versionado vía excepción en `.gitignore`) con las cifras canónicas; las **9 invariantes** repuntadas a él (sin timestamps). `git ls-files \| grep -E "tsbuildinfo\|reports/.*Z\.md\|\.zip$\|docs-deprecated\|design_handoff"` → **0**. **P-06/T-20 y P-74 en verde.** |
| T-21 | Skills: fuente única + CI | ✅ | P-05 (incluida la prueba negativa: alterar copia → exit 1) + P-75 (CONTRIBUTING). |
| T-22 | Backlog frontend | ⏳ continuo | **Falta** P-46 (e2e Playwright) en esta corrida. |
| T-23 | Mensajes RMQ persistentes | ⏳ | Código ✅ (grep `persistent` ≥1) + ADR ✅ (P-71). **Falta** la prueba que da sentido a la tarea: **P-22** — mensajes encolados sobreviven a `docker restart rabbitmq`. *Nota:* P-60 probó resiliencia de **servicios** ante broker caído, no persistencia de **mensajes**; no la sustituye. |
| T-24 | WS CORS: `CORS_ORIGIN` unificado | ⏳ | Grep ✅ (0 `ALLOWED_ORIGINS`). **Falta** P-33 en stack prod-like (handshake aceptado/rechazado por Origin + PWA real recibiendo eventos). |
| T-25 | Turno de caja único | ✅ | P-40: índice `turnos_caja_un_abierto` existe; carrera → 1 ABIERTA, respuestas idempotentes. **Decisión implícita registrada**: turno único **global** (índice sobre `estado`, no por `cajaId`) — ver §Decisiones. |
| T-26 | Slot único en migración | ✅ | P-41: índice presente vía `migrate deploy`; C7 confirma 1×201 / 9×409 al mismo slot. |
| T-27 | SW no intercepta `/v1/` | ⏳ | **Falta** Suite 6 completa (P-45: Cache Storage sin `/v1/`, caché v4, offline shell; P-46). |
| **T-28** | **Fixtures de stress obsoletos** | ✅ **verificada en runtime** | Los 4 falsos negativos corregidos y **re-corridos contra el stack 9/9**: `probar:concurrencia` **5/5** (C5 ahora 1×201 + duplicados rechazados), `probar:caos` **8/8** (mesa con `ubicacion`), `run-all` presupuesto login `{401:5,429:3}` sin `/auth/validate`. (Bonus: 2 flecos de fixture aflorados al desbloquear C5/caos — poll de cuenta cerrada y `mesa.data.mesa.id` — también corregidos.) |
| **T-29** | **Cobertura bajo el piso (gate P-03)** | ✅ | **P-03 en verde**: `nx run-many --target=test --all` exit 0; stmts **52.92%** ≥52, lines **53.72%** ≥53 (branches 50%, funcs 47.5%), **pisos intactos**. +specs de caja (service turnos/arqueo/cierre + controller) y `format.ts` PWA. 473/473 tests. |
| **T-30** | **Homologar `zona` → `ubicacion` en la PWA** | ✅ (código) / ⏳ smoke | Renombrados los identificadores en los 7 archivos PWA + nota en doc del endpoint. `typecheck`+`lint`+`mesa.mapper.spec` (10/10) en verde. e2e Playwright (P-46) y smoke visual pendientes de stack. |

**Correcciones incidentales aplicadas durante la ejecución** (cerradas, con trazabilidad en el informe):
fix del re-hash de T-05 (+ spec), dependencias faltantes de `servicio-reportes`
(`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt` — eran deps reales: usa `JwtAuthGuard`),
y 4 referencias `fuente:` repuntadas a migraciones reales (P-73 → 57 refs, 0 rotas).

---

## Fichas de trabajo abierto

### T-20 — Higiene de repo — **REABIERTA: requiere re-decisión**

**Situación.** La decisión del equipo registrada en v3 fue "eliminar del repo, sin rama
archive" (el historial de git conserva todo; la eliminación nunca fue destructiva en
sentido real). El ejecutor de las pruebas la excluyó por considerarla destructiva. Estado
medido: 142 artefactos versionados — `design_handoff_nachopps/` (14), `docs-deprecated/`
(75), `stress-tests/reports/*Z.md` (51), `*.tsbuildinfo` (2), `.zip` (2) — y sin
`BASELINE.md`, lo que mantiene P-74 en ❌ y a las invariantes citando reportes con timestamp.

**Opciones.** (a) Ratificar la decisión original y ejecutarla tal como estaba especificada;
(b) formalizar la conservación, en cuyo caso hay que **reescribir el criterio de P-06/T-20 y
P-74** para que el gate sea alcanzable (un plan cuyo criterio es imposible por diseño no es
un plan). No hay opción (c) de dejarlo en limbo: hoy el sign-off es inalcanzable por
definición.

**Recomendación.** (a). Los 51 reportes se consolidan primero en `BASELINE.md` (las cifras
que las invariantes citan no se pierden, se reubican), y `git log` conserva todo lo demás.

**Secuencia si se ratifica (a):** T-28 primero (fixtures limpios) → re-correr la batería de
stress → consolidar `BASELINE.md` con esas cifras nuevas → `git rm` del resto → repuntar
invariantes → P-06/T-20 y P-74 en verde.

**Verificación.** `git ls-files | grep -E "tsbuildinfo|reports/.*Z\.md|\.zip$|docs-deprecated|design_handoff"` → 0;
`BASELINE.md` existe y ninguna invariante cita reportes con timestamp.

**Estado (2026-06-10) — COMPLETA.** Ratificada (a) y ejecutada entera, **no destructiva**
(`git rm --cached`: todo queda en disco y en el historial). Sacados del control de versiones:
`design_handoff_nachopps/`, `docs-deprecated/` (con sus 2 `.zip`), los 2 `*.tsbuildinfo` y los
**51 `reports/*Z.md`** (142/142). Se creó `stress-tests/reports/BASELINE.md` (versionado vía
`!stress-tests/reports/BASELINE.md` en `.gitignore`) con las cifras canónicas de stock/concurrencia/
caos y la re-confirmación del 2026-06-10; las 9 invariantes que citaban reportes con timestamp
(`idempotencia-{directa,inversa}`, `reposicion-como-delta`, `no-oversell`, `slot-reserva-activo-unico`,
`exactamente-un-exito-bajo-carrera`, `retencion-idempotency-keys`, `trust-boundary-stock-sync-mode`,
`colas-limpias-happy-path`) ahora apuntan a `BASELINE.md`. **Verificación cumplida:**
`git ls-files | grep -E "tsbuildinfo|reports/.*Z\.md|\.zip$|docs-deprecated|design_handoff"` → **0**;
`BASELINE.md` existe; ninguna invariante cita reportes con timestamp. → **P-06/T-20 y P-74 en verde.**

---

### T-28 — 🆕 Actualizar fixtures de los harnesses de stress

**Evidencia (del informe).** Cuatro falsos negativos reproducibles, ninguno regresión de producto:
1. `run-rabbitmq-chaos.js` crea mesas con `zona`, campo que el `CrearMesaCommand` no acepta
   (`forbidNonWhitelisted` → `property zona should not exist`). Verificado en código: el
   backend siempre usó `ubicacion` (`libs/contracts/src/domains/mesas.ts:54`); "zona" es
   vocabulario del frontend (`apps/pwa-cliente/src/mappers/mesa.mapper.ts:23`).
2. `run-concurrency-limits.js` C5 ("pago duplicado") paga sin abrir turno de caja → 400×10;
   el rechazo es correcto (T-25), el script no monta la precondición.
3. `run-all-stress-tests.js` Test 2 hace burst contra `/auth/validate`, eliminado en T-02 → 100 % "fallo" esperado.
4. Encadenar scripts agota el presupuesto 5/min de `/auth/login` y contamina los asserts de
   rate-limit de las suites siguientes.

**Cambio.**
1. `zona: label` → `ubicacion: label` en `run-rabbitmq-chaos.js` (renombre, no eliminación:
   preserva la intención de etiquetar las mesas de caos y ejercita el campo opcional del DTO).
   Coordinar con T-30 en el mismo PR.
2. C5: precondición `POST /caja/turnos` (y cierre del turno al terminar el escenario, para
   no dejar estado que contamine corridas siguientes).
3. Retirar el burst de `/auth/validate` de `run-all-stress-tests.js`; si se quiere conservar
   una prueba de presupuesto de auth, apuntarla a `/auth/login` con criterio de éxito
   "429 a partir del 6.º" (convierte el límite en assert, no en ruido).
4. Higiene de rate-limit entre scripts encadenados: paso de reset (reinicio del contenedor
   Kong o espera de ventana) en `run-all-stress-tests.js`, documentado en el propio script.

**Archivos.** `stress-tests/run-rabbitmq-chaos.js` · `run-concurrency-limits.js` ·
`run-all-stress-tests.js` · `stress-tests/README` o cabeceras de los scripts.

**Verificación.** `npm run probar:caos` y `npm run probar:concurrencia` sin los 4 falsos
negativos; `run-all-stress-tests.js` termina con señal limpia (solo fallos que sean fallos).
→ ✅ **Código hecho** (2026-06-10), `node --check` OK en los 3 scripts:
(1) `zona`→`ubicacion` en `run-rabbitmq-chaos.js`; (2) C5 abre/cierra turno de caja como
precondición (`ensureTurnoCajaActivo`/`cerrarTurnoCaja`); (3) retirado el burst de
`/auth/validate`, reemplazado por un assert de presupuesto de login (429 desde el 6.º);
(4) `resetRateLimit()` documentado al arranque del suite y antes de medir el presupuesto.
**Pendiente:** la re-corrida real contra el stack levantado.

**Depende de.** Nada. **Prerrequisito de** la regeneración de `BASELINE.md` (T-20): un
baseline tomado con fixtures rotos nace contaminado.

---

### T-29 — 🆕 Cobertura bajo el piso (bloqueante del gate de entrada)

**Evidencia (P-03 ❌).** `nx run-many --target=test --all` exit 1 por umbral global de
`vitest.config.mts`: líneas **48.53 % < 53 %**, statements **47.62 % < 52 %** (branches
46.83 %, functions 40.2 %). Las suites pasan; falla el piso. Los pisos no fueron alterados.
**Diagnóstico probable:** la remediación *eliminó* código muy testeado (7 copias del outbox
processor con sus 7 specs, `validate` con sus casos) y *añadió* código nuevo con cobertura
corta (lockout T-03, guard del último ADMIN T-04, purge T-06, claim SKIP LOCKED T-08,
requestHash T-14, bootstrap T-10).

**Cambio.**
1. `vitest --coverage` y leer el reporte **por archivo** de los módulos tocados por
   T-03/T-04/T-06/T-08/T-10/T-14 — ahí está casi seguro el déficit, y cubrirlos es cubrir
   justamente lo más nuevo y delicado.
2. Escribir los specs faltantes hasta superar el piso. **Decisión ya tomada: los pisos no
   se bajan** — bajar el umbral para pasar el gate invalida el criterio del plan.
3. Al cerrar, registrar la cobertura alcanzada en el informe de pruebas.

**Archivos.** Specs nuevos junto a los módulos deficitarios (identidad, libs/resiliencia,
libs/observabilidad, caja/pedidos según el reporte).

**Verificación.** P-03: `nx run-many --target=test --all` exit 0 con pisos intactos (52/53).
→ ✅ **Hecho** (2026-06-10): exit 0; **stmts 52.92% / lines 53.72%** (branches 50%, funcs 47.5%),
umbrales sin tocar. Cobertura nueva en lo más delicado: `servicio-caja` 40%→**88.6%** lines
(specs de apertura/cierre/arqueo/movimientos de turno + caminos de error de `registrarPago` +
controller) y `format.ts` de la PWA. 473/473 specs en verde. *Nota de alcance:* el `include` de
cobertura abarca los 9 servicios + `pwa-cliente` + `shared-auth`; `libs/resiliencia` y
`libs/observabilidad` **no** cuentan, por lo que el déficit se cubrió en código de servicio/PWA.

**Depende de.** Nada. **Bloquea el sign-off** (gate de entrada de la Suite 1).

---

### T-30 — 🆕 Homologar vocabulario de mesa: `zona` → `ubicacion` en la PWA

**Evidencia.** El backend usa `ubicacion` en schema, DTO y eventos
(`apps/servicio-mesas/prisma/schema.prisma`, `libs/contracts/src/domains/mesas.ts:19,54`);
la PWA traduce silenciosamente en `mesa.mapper.ts:23` (`zona: dto.ubicacion`, comentario
`// ubicacion → zona`) y propaga `zona`/`mesaZona` por 7 archivos (`mesa.types.ts`,
`mesa.mapper.ts` + spec, `Comandero.tsx`, `MesasScreen.tsx`, `CajaScreen.tsx`,
`cajaConstants.ts`). La dualidad ya produjo un defecto real: el fixture de T-28.1 usó el
vocabulario del frontend contra la API del backend.

**Dirección elegida (asimetría de costo verificada):** el frontend adopta `ubicacion`.
La inversa exigiría migración de columna, romper `MesaDto`/`CrearMesaCommand` en la API
pública `/v1` y cambiar el contrato de eventos que consumen otros servicios — costo
desproporcionado para una ganancia léxica.

**Cambio.**
1. Renombrar identificadores: `zona` → `ubicacion`, `mesaZona` → `mesaUbicacion` en los 7
   archivos; el mapper queda passthrough (`ubicacion: dto.ubicacion`) — evaluar si el
   view-model sigue justificándose o se consume el DTO directo.
2. **El copy visible es decisión de producto, independiente del código**: la UI puede seguir
   mostrando la palabra "Zona" (pills, filtro "TODAS", tooltips) — default recomendado:
   mantenerla, los meseros la usan.
3. Nota en `docs/servicios/servicio-mesas/endpoints/POST--raiz.md`: «en la UI este campo se
   muestra como "Zona"».

**Archivos.** Los 7 de la PWA · doc del endpoint.

**Verificación.** `grep -rni "zona" apps/pwa-cliente/src --include='*.ts' --include='*.tsx'`
→ solo strings de presentación; suite PWA + e2e Playwright en verde; smoke visual de Mesas,
Comandero y Caja.
→ ✅ **Código hecho** (2026-06-10): `MesaVM.zona`→`ubicacion`, `mesaZona`→`mesaUbicacion`,
estado de filtro `zona`/`setZona`/`zonas`→`ubicacion`/`setUbicacion`/`ubicaciones` en los 7
archivos (`mesa.types`, `mesa.mapper` + spec, `ContextoCanal`, `Comandero`, `MesasScreen`,
`CajaScreen`). El grep solo deja: un comentario en `mesa.types.ts`, otro en `MesasScreen.tsx`,
la clase CSS `mt-zone` y `RESTO_FISCAL.zona` (ubicación **fiscal** del local, dominio distinto —
se deja). `typecheck`+`lint`+`mesa.mapper.spec` (10/10) en verde. **Pendiente:** e2e Playwright y
smoke visual contra el stack. *Aclaración:* la lista original de la ficha omitía `ContextoCanal.tsx`
(sí tenía `mesaZona`) e incluía `cajaConstants.ts` (su `zona` es fiscal, no de mesa).

**Depende de.** Nada. Mergear junto con T-28 (mismo motivo raíz, misma justificación de PR).

---

## Runtime pendiente (sin cambio de código — solo ejecutar pruebas)

En orden de menor a mayor fricción de entorno:

1. **Local/dev:** 2.ª mitad de P-10 (refresh ×10 sin 429) · P-12 completo con cuenta dedicada
   (reset post-backoff, concurrencia, auditoría sin email) · P-23 (trío idempotencia con 422)
   · P-24 (purga viva en caja/mesas/notificaciones/reportes) · P-31 (S2S `aud`, firma manual).
2. **Con 2 réplicas:** P-21 ×3 corridas + P-63 (kill a mitad de lote).
3. **Caos:** P-22 (mensajes sobreviven a restart del broker — la prueba que cierra T-23) ·
   P-61 (identidad caída + jwt-cache degradado) · P-62 (restart db-pedidos bajo carga).
4. **Manuales:** P-32 (WS por rol, 2 navegadores) · P-45/P-46 (PWA: Cache Storage + Playwright)
   · P-50–P-56 (smoke de los 7 flujos de negocio por rol).
5. **Prod-like (staging con dominio/cert):** P-33 (CORS del WS) — el único que genuinamente
   exige ese entorno.

---

## Ruta al sign-off (orden de dependencias)

```
1. T-29 (cobertura)  ──────────────► desbloquea el gate de entrada (Suite 1)
2. Re-decisión T-20  ──┐
3. T-28 + T-30 (1 PR) ─┴──► stress limpio ──► BASELINE.md ──► P-06/T-20 y P-74 en verde
4. Runtime pendiente §anterior (bloques 1→5)
5. Re-ejecución de Suite 1 completa sobre el commit final + informe v2 archivado
```

El sign-off se firma con los criterios de salida del plan de pruebas **sin enmiendas**:
Suite 1 íntegra en verde, 100 % de P-NN automáticas en pasa, smoke de negocio completo,
caos sin pérdida de eventos, documentación con `fuente:` íntegras, y resultados archivados
con commit y ejecutor.

---

## Decisiones (registro actualizado)

| Decisión | Resolución | Estado |
|----------|-----------|--------|
| Auto-degradación de ADMIN | Rechazar siempre | ✅ Implementada y verificada (P-13) |
| Evento `UsuarioAutenticado` | Retirado del catálogo | ✅ Implementada y verificada (P-06/P-72) |
| Bloqueo de `/telemetry/metrics` | En Kong | ✅ Implementada y verificada (P-30) |
| Matriz evento→roles del WS | Aprobada | ⏳ Implementada; verificación P-32 pendiente |
| Turno de caja único: ¿global o por `cajaId`? | **Resuelta por implementación: global** (índice sobre `estado`) | ✅ Verificada (P-40). Si el negocio incorpora varias cajas físicas simultáneas, reabrir con índice por `cajaId`. |
| `docs-deprecated/` y `design_handoff/` | Era "eliminar, sin archive" | ✅ **Ratificada (a)** (2026-06-10) y **ejecutada completa** vía `git rm --cached` (142/142, no destructivo); `BASELINE.md` creado + invariantes repuntadas → P-06/T-20 y P-74 verdes |
| Copy visible "Zona" en la UI (T-30) | Default: mantener la palabra en pantalla; solo se homologan identificadores | 🆕 A confirmar por producto (decisión menor) |
| Pisos de cobertura | **No se bajan** para pasar P-03 | ✅ Ratificada (T-29) |

---

## Lecciones registradas (para el informe final de prácticas)

1. **Los tests del mismo autor comparten los puntos ciegos del código** (T-05): el spec
   unitario codificaba el bug que debía atrapar; lo detectó la capa E2E del plan (P-14)
   porque verificaba el estado real en BD y *logins sucesivos*, independiente del código
   bajo prueba. Acción permanente: caso e2e de "doble login" en la suite de identidad —
   el patrón "funciona la 1.ª vez, rompe la 2.ª" escapa a casi cualquier test de un paso.
2. **La matriz de trazabilidad funcionó**: cada ❌ mapeó a una T-NN concreta y ordenó la
   sesión (T-05 reabierta y cerrada con evidencia; reportes y `fuente:` corregidos con rastro).
3. **Un baseline solo vale tanto como sus fixtures** (T-28 antes que `BASELINE.md`).
4. **Las decisiones de equipo no se revierten en ejecución** (T-20): si el ejecutor —humano
   o agente— discrepa, se escala la decisión, no se omite la tarea; el limbo resultante dejó
   dos criterios del plan inalcanzables por definición.

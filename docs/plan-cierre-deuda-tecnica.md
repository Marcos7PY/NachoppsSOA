# Plan de cierre de deuda técnica — próxima sesión

> **Estado 2026-06-11:** D-0 ✅ · D-1 ✅ · D-2 ✅ | D-3 ⏳ (Docker) · D-4 ⏳ (Docker) · D-5 ⏳ (manual) · D-6 parcial

> **Propósito.** Cerrar todo lo que quedó pendiente tras completar el plan SonarQube
> (quality gate PASSED, 0 issues, 2026-06-11): publicar el trabajo, dejar el lint y la
> cobertura verdes en CI, validar en runtime el refactor masivo, correr ZAP y encaminar
> el sign-off manual.
>
> **HEAD de referencia:** `6d230d8` (rama `dev`, 10 commits sin push).
> **HEAD actual:** `4a2f6fe` (rama `dev`, pushed — D-1 + D-2 incluidos).
> **Duración estimada:** 1 sesión (~3-4 h); D-5 requiere además una ventana en staging.
> **Orden:** D-0 → D-3 es secuencial (no publicar sin validar runtime sería razonable
> invertirlo: si se prefiere prudencia, ejecutar D-3 antes de D-0). D-4/D-5/D-6 son
> independientes entre sí.

---

## Estado de partida (no re-hacer)

- Plan SonarQube **completado**: gate PASSED, 0 issues, perfil "Nachopps way (TS)"
  (S7764 off), gate "Nachopps way" (`new_coverage` 50%), baseline New Code fijada.
  Ver `docs/seguridad-owasp-top10.md` §Estado SonarQube.
- Plan de remediación v5.1 **cerrado** (G-0 + M-01..M-04), incluida T-20.
- Plan de pruebas: Suites 1-5 y 7-9 ✅ en runtime (2026-06-10). Solo quedan las
  manuales del runbook (P-32/P-45/P-56/P-33) y T-17 fase 2 → cubiertas por
  `docs/plan-sign-off-final.md` (D-5 de este plan).
- 473/473 tests verdes, 10 builds OK, lint de `pwa-cliente` limpio.

---

## D-0 · Push de `dev` · ~5 min

Publicar los 10 commits del plan SonarQube (S-1..S-5 + remediación post-scan + docs).

```sh
git push origin dev
```

- `gh` no está instalado; si se quiere PR `dev → main`, crearlo desde la web de GitHub.
- **Criterio:** `git status` reporta `up to date with origin/dev`.

## D-1 · Lint verde en todos los proyectos (no-explicit-any en specs) · ~60-90 min

`nx run-many -t lint` falla hoy en ~9 proyectos por `@typescript-eslint/no-explicit-any`
**solo en archivos `*.spec.ts`** (mocks tipados como `any`). Conteos aproximados de esta
sesión: servicio-caja ~61, identidad ~31, inventario ~13, notificaciones ~9,
resiliencia ~41 (repartidos en outbox/idempotency specs), y resto menor en cuentas,
mesas, reportes, reservas.

> Nota: en `libs/resiliencia` y `shared-rabbitmq` la regla quedó en `warn` (T-18);
> en los servicios sigue en `error`. Decidir UNA política y aplicarla pareja.

**Enfoque recomendado (a):** tipar los mocks — `jest.Mocked<T>`/`Partial<T>` o
interfaces mínimas (`IdempotencyDb`, `PrismaService` parcial). Es la opción alineada
con T-18 ("0 `as any` en resiliencia").
**Enfoque alternativo (b):** override de eslint para `**/*.spec.ts` con
`no-explicit-any: off` documentándolo en CONTRIBUTING. Más barato, menos valioso.

```sh
# enumerar el universo exacto primero
npm exec nx -- run-many -t lint 2>&1 | grep -c "no-explicit-any"
```

- **Criterio:** `npm exec nx -- run-many -t lint` → 25/25 proyectos verdes.
- **Commit sugerido:** `test(lint): tipar mocks de specs y eliminar no-explicit-any [D-1]`

## D-2 · Recuperar los pisos de cobertura de vitest · ~45-60 min

`npx vitest run` falla los umbrales globales: **51.94% líneas (piso 53) / 50.84%
stmts (piso 52)**. El déficit es pre-existente al plan SonarQube (verificado con
stash) — los pisos estaban verdes en `4f0fddb` (53.72/52.92) y algún commit S-1..S-3
añadió líneas `.ts` sin cubrir. Política del repo: **no bajar pisos, solo subirlos**.

Candidatos de bajo esfuerzo (dentro del `include` de cobertura — recordar que
`libs/resiliencia` y `observabilidad` NO cuentan para el piso):
- `apps/servicio-notificaciones/src/app/app.service.ts` — los helpers nuevos
  (`texto`, `resolveMesa`, `formatPedidoCreado/Actualizado`) son funciones puras.
- `apps/pwa-cliente/src/utils/feedback.ts` (`primerMensaje`) — trivial.
- `apps/pwa-cliente/src/mappers/notificacion.mapper.ts` (`textLabel`, `numberLabel`).
- `apps/pwa-cliente/src/api/client.ts` (`buildUrl`, `parseErrorBody`) si se mockea fetch.
- `apps/pwa-cliente/src/domain/pedido.flow.ts` (`canalFromModalidad`, `urgClass`).

- **Criterio:** `npx vitest run` termina sin `ERROR: Coverage ... does not meet`.
  Si la cobertura real supera los pisos con margen, subir los números en
  `vitest.config` (escalón 3) según la política del repo.
- **Commit sugerido:** `test(cobertura): specs de helpers puros para recuperar pisos 53/52 [D-2]`

## D-3 · Validación runtime del refactor SonarQube · ~45 min

El plan SonarQube tocó código de runtime crítico **sin validación más allá de los
unit tests**: `persistirPedido` (firma nueva), `idempotency.interceptor` (descompuesto),
`rabbitmq-retry.interceptor` (`retryWhen`→`retry`), `socket.service`, `sw.js`,
`api/client.ts`, seed de identidad (ahora exige `SEED_DEFAULT_PASSWORD`).

```sh
# 1. Stack completo
docker compose -f infra/docker-compose.yml --profile all up -d
# esperar 9/9 healthy; si está frío: node scripts/seed-admin.js && npx ts-node scripts/poblar-datos.ts
# OJO: el seed de identidad ahora requiere SEED_DEFAULT_PASSWORD (está en apps/servicio-identidad/.env)

# 2. Runner de remediación (SERVICE_JWT_SECRET desde el contenedor)
docker exec nachopps-servicio-identidad printenv SERVICE_JWT_SECRET
SUITE=http  node stress-tests/run-remediacion-runtime.js   # 8/8
SUITE=smoke node stress-tests/run-remediacion-runtime.js   # 4/4
SUITE=caos  node stress-tests/run-remediacion-runtime.js   # 3/3

# 3. Suites npm (idempotencia/stock/concurrencia ejercitan persistirPedido + interceptor)
npm run probar:stock
npm run probar:concurrencia
```

Gotchas conocidos (memoria 2026-06-10): encadenar corridas satura el rate-limit de
login → `docker restart nachopps-kong`; P-62 imprime un error cosmético de tabla
`OutboxEvent` pero el assert pasa.

- **Criterio:** mismos resultados que la corrida del 2026-06-10 (http 8/8, smoke 4/4,
  caos 3/3, stock 12/12, concurrencia 5/5). Cualquier regresión se arregla ANTES
  de dar el refactor por bueno.

## D-4 · ZAP baseline · ~20 min (requiere stack de D-3 arriba)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/zap-baseline.ps1
```

- Triage de alertas: las aceptadas/justificadas van a `docs/seguridad-owasp-top10.md`
  §Hallazgos aceptados (mismo tratamiento que Google Fonts/SRI).
- **Criterio:** 0 alertas High; Medium/Low triadas y documentadas.
- **Commit sugerido:** `docs(seguridad): resultados ZAP baseline + triage [D-4]`

## D-5 · Sign-off manual · ~45 min local + ventana staging

Ejecutar `docs/plan-sign-off-final.md` tal cual (no duplicar aquí):
- P-32 (WS rooms, 2 navegadores) · P-45 (SW Cache Storage) · P-56 (sesión >15 min) — local.
- P-33 (CORS WS) — staging.
- T-17 fase 2: iniciar la ventana de 7 días de observación de logs antes del flip
  `SERVICE_AUD_ENFORCE=true`. **Es decisión del equipo, no flip unilateral.**
- **Criterio:** tabla §6 del plan de sign-off firmada.

## D-6 · Housekeeping · ~10 min

1. **Bajar SonarQube** cuando no se use (libera ~2 GB):
   ```sh
   docker compose -f infra/sonarqube/docker-compose.sonarqube.yml down
   ```
   (los volúmenes persisten; el perfil/gate/baseline no se pierden).
2. **Rutina Sonar en adelante** (ya documentada): re-scan semanal o pre-release con
   `pwsh scripts/sonar-scan.ps1 -Token (Get-Content infra/sonarqube/.sonar-token.local) -WithCoverage`.
   El gate exige 0 issues nuevos y 50% de cobertura en código nuevo.
3. Actualizar `docs/plan_proximas_sesiones.md` / archivar este plan al terminar.

---

## Resumen de criterios de salida

| ID  | Entregable | Verificación |
|-----|-----------|--------------|
| D-0 | `dev` publicado | `git status` limpio vs origin |
| D-1 | Lint 25/25 verde | `nx run-many -t lint` |
| D-2 | Pisos de cobertura verdes | `npx vitest run` sin ERROR |
| D-3 | Runtime sin regresiones del refactor | http 8/8 · smoke 4/4 · caos 3/3 · stock 12/12 · conc 5/5 |
| D-4 | ZAP triado | 0 High; doc actualizado |
| D-5 | Sign-off manual | tabla §6 de plan-sign-off-final firmada |
| D-6 | Sonar abajo + rutina anotada | `docker ps` sin contenedores sonar |

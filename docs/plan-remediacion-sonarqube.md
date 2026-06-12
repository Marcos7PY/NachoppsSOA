# Plan de remediación — Hallazgos SonarQube

**Anclado a HEAD:** `5eb4f17` (dev) · **Análisis:** 2026-06-10, quality gate PASSED
**Baseline:** 313 issues abiertos — 13 bugs, 2 vulnerabilidades (ya remediadas/aceptadas en `54decc7`), 300 code smells (0 blocker, 14 critical, 133 major, 166 minor)

## Contexto para la sesión que ejecute esto

- SonarQube local: `http://localhost:9000` (admin / `NachoppsSonar2026!`). Si está caído: `docker compose -f infra/sonarqube/docker-compose.sonarqube.yml up -d`.
- Token de análisis en `infra/sonarqube/.sonar-token.local` (gitignored). Re-escanear: `pwsh scripts/sonar-scan.ps1 -Token (Get-Content infra/sonarqube/.sonar-token.local)`.
- Issues por API: `GET /api/issues/search?componentKeys=nachopps-restobar&resolved=false&rules=<regla>` con header `Authorization: Bearer <token>`.
- Flujo de trabajo: commits temáticos por fase, verificar con `npm exec nx affected -t lint test` antes de cada commit, re-escanear Sonar al cierre de cada fase para confirmar que el contador baja.

## Fase S-1 — Bug real potencial + puntuales (prioridad alta, ~30 min)

| ID | Regla | Ubicación | Arreglo |
| --- | --- | --- | --- |
| S1-01 | `javascript:S4123` | `apps/pwa-cliente/public/sw.js:22` | `Promise.all` recibe iterable de no-promesas en el service worker. **Investigar primero**: puede ser bug funcional de precache. Corregir la construcción del array. |
| S1-02 | `typescript:S3735` | `apps/servicio-caja/src/app/app.service.ts:186` | Eliminar operador `void`; si es para ignorar una promesa, usar `.catch()` explícito o `await`. |
| S1-03 | `typescript:S1135` | `apps/servicio-pedidos/src/app/app.service.ts:390` y `apps/servicio-identidad/src/auth/auth.service.ts:157` | Resolver el TODO o convertirlo en tarea del plan y borrar el comentario. |
| S1-04 | `docker:S8431` | `apps/pwa-cliente/Dockerfile:1,21` | La imagen base usa tag+digest a la vez; dejar solo el digest (pin reproducible). |

Commit sugerido: `fix(sonar): bug de precache en sw.js y puntuales de caja/pedidos [S-1]`

## Fase S-2 — Accesibilidad PWA (los 13 "bugs" + reglas a11y, ~65 issues)

Todas en `apps/pwa-cliente`. Continúa el trabajo de focus-trap (PR #14).

- **`S1082` (13 bugs):** elementos no interactivos con `onClick` sin soporte de teclado. Convertir a `<button>` cuando sea posible; si no, `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Espacio). Archivos: `DetallePedido.tsx:31`, `TableroView.tsx:54`, `AperturaCajaModal.tsx:17`, `Header.tsx:113,170`, `CajaScreen.tsx:195`, `CierreDrawer.tsx:47`, `CobroMesaDrawer.tsx:69`, `MovimientoModal.tsx:45`, `CartaScreen.tsx:185`, `ComprasScreen.tsx:188,249`, `MesasScreen.tsx:159`.
- **`S6853` (26):** `<label>` sin asociar → `htmlFor` apuntando al `id` del control (o envolver el control).
- **`S6848` (13) y `S6819` (11):** handlers/roles ARIA en elementos no interactivos → usar el elemento semántico nativo (`button`, `nav`, etc.).
- Considerar extraer un componente `ClickableCard`/`PressableDiv` compartido para no repetir el patrón teclado en 13 sitios.

Commit sugerido: `fix(pwa,a11y): soporte de teclado y semántica en elementos clicables [S-2]`

## Fase S-3 — Mecánicos de alto volumen (~120 issues, riesgo nulo)

| Regla | Nº | Arreglo |
| --- | --- | --- |
| `S3358` | 45 | Ternarios anidados → extraer a variable intermedia, `if/else` o función auxiliar. |
| `S6759` | 33 | Props de componentes React → `Readonly<Props>` (o `readonly` por campo). |
| `S4325` | 27 | Aserciones de tipo (`as X`) redundantes → eliminarlas. |
| `S3863` | 4 | Imports duplicados del mismo módulo → fusionar. |
| `S6582` | 5 | Usar optional chaining (`?.`) en lugar de `a && a.b`. |
| `S6571`/`S6551` | 8 | Tipos redundantes en uniones / `toString` implícito → limpiar. |

Tip: activar las reglas ESLint equivalentes (`no-nested-ternary`, `prefer-read-only-props`, `@typescript-eslint/no-unnecessary-type-assertion`, `no-duplicate-imports`, `prefer-optional-chain`) y pasar `eslint --fix` cubre gran parte automáticamente; subirlas a `error` en `eslint.config.cjs` evita regresiones.

Commit sugerido: `refactor(lint): limpieza mecánica de ternarios, props readonly y aserciones [S-3]`

## Fase S-4 — Critical de complejidad (14 issues, requiere refactor con tests)

Mismo patrón que T-22 (descomposición tipo Comandero): extraer hooks/funciones auxiliares hasta bajar de 15 de complejidad cognitiva / 4 niveles de anidamiento.

- `S3776` (complejidad >15): `apps/pwa-cliente/src/api/client.ts:96` (22), `screens/caja/CierreDrawer.tsx:25` (22), `screens/caja/CobroMesaDrawer.tsx:27` (22), `screens/ops/MesasScreen.tsx:145` (20), `screens/caja/CajaScreen.tsx:259` (17), `apps/servicio-notificaciones/src/app/app.service.ts:40` (17), `libs/resiliencia/src/lib/idempotency.interceptor.ts:68` (16).
- `S2004` (anidamiento >4): `components/ui/ToastProvider.tsx:44`, `hooks/queries/usePedidosQuery.ts:200,202,209`, `screens/compras/ComprasScreen.tsx:104`.
- ⚠ `idempotency.interceptor.ts` es código crítico de resiliencia: refactor solo con su suite en verde (`npm exec nx test resiliencia`).

Commit sugerido: `refactor: reducir complejidad cognitiva en caja, pedidos e idempotencia [S-4]`

## Fase S-5 — Estilo y deprecaciones (~80 issues, triaje incluido)

- **`css:S4666` (15):** selectores CSS duplicados → fusionar declaraciones.
- **`S1874` (12):** APIs deprecadas → migrar según el aviso de cada una.
- **Reglas S77xx (~55, estilo TS moderno) — decidir regla por regla** si se corrige o se desactiva en el Quality Profile (Quality Profiles → clonar el perfil Sonar way, desactivar, asignar al proyecto):
  - `S7735` (23) condiciones negadas con `else` → invertir ramas. Corregir: mejora legibilidad.
  - `S7772` (10) imports `node:` en built-ins → corregir (solo backend, mecánico).
  - `S7764` (11) `globalThis` vs `window` → en una PWA `window` es razonable; candidata a desactivar.
  - `S7755` (6) `.at()`, `S7749` (3) separadores numéricos, `S7781` (3) `replaceAll`, `S7784` (2) `structuredClone` → mecánicas; corregir o desactivar por gusto del equipo.
- `css:S7924` (2) y resto menor: al criterio del ejecutor.

Commit sugerido: `style: modernizar TS/CSS y triaje de reglas S77xx [S-5]`

## Cierre

1. Re-escanear: `pwsh scripts/sonar-scan.ps1 -Token (Get-Content infra/sonarqube/.sonar-token.local)`.
2. Meta: quality gate PASSED con **0 bugs, 0 critical** y <60 issues totales (los restantes, aceptados o con regla desactivada documentada).
3. Actualizar `docs/seguridad-owasp-top10.md` (sección "Hallazgos aceptados") con cualquier regla desactivada y su justificación.
4. Suite completa: `npm exec nx run-many -t lint test build`.

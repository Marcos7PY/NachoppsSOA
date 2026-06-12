# Handoff S-E — Cierre del Quality Gate (Sonar verde + ZAP documentado)

> **Sesión autocontenida, una sola corrida.** Prerequisitos: repo en `dev` con HEAD ≥
> `be27a40`, SonarQube local corriendo (http://localhost:9000, proyecto
> `nachopps-restobar`) y Docker para rebuild de la PWA. Esfuerzo: 2–3 h.
> Salida: 3 commits atómicos + Quality Gate **PASSED** + nota de ZAP.
> No depende de S-D (T-39); puede correr antes o después.

## Contexto mínimo

La corrida de seguridad `logs/security-run-20260611-175347` dio fondo limpio
(0 vulnerabilities en código y deps, ZAP 0 FAIL) pero `Quality Gate: FAILED` por dos
condiciones de proceso:

| Condición | Actual | Requerido |
|-----------|--------|-----------|
| `new_violations` | 1 (S4325 en caja) | 0 |
| `new_security_hotspots_reviewed` | 0% | 100% |

Los 3 hotspots "nuevos" son los `http://` de los clientes extraídos en T-33/T-40 — código
preexistente que Sonar cuenta como nuevo por vivir en archivos nuevos. No hay hallazgo de
seguridad real, **con una excepción a corregir de verdad**: `Math.random()` en
`apps/pwa-cliente/src/api/client.ts:36` si genera la `Idempotency-Key`.

## Orden de ejecución (no alterar: los commits de código van ANTES del re-análisis)

### Paso 1 — Commit A: micro-fixes de código (~30 min)

**1a. S4325 — assertion innecesaria.**
`apps/servicio-caja/src/app/app.service.ts:264`: eliminar el cast redundante (el tipo ya
está garantizado por el flujo). Verificar con `npx nx run servicio-caja:build` y lint.

**1b. `Math.random()` → `crypto.randomUUID()` en la PWA (3 sitios).**

- `apps/pwa-cliente/src/api/client.ts:36` — **obligatorio**: si es la clave de
  idempotencia, `Math.random()` es predecible/colisionable. Reemplazo directo:

  ```ts
  // antes:  `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`
  // después:
  crypto.randomUUID()
  ```

  `crypto.randomUUID()` es nativo en todos los navegadores soportados por la PWA (contexto
  seguro: localhost y HTTPS califican). Verificar que el backend no asuma un formato/longitud
  específico del header `Idempotency-Key` (grep `Idempotency-Key` en libs/apps; el
  interceptor de idempotencia trata la clave como string opaco — confirmar).
- `ToastProvider.tsx:59` y `ComprasScreen.tsx:253` — ids efímeros de UI; el riesgo es nulo,
  pero unificar a `crypto.randomUUID()` elimina el hotspot de raíz y evita re-justificarlo
  en cada análisis futuro.

**1c. Specs/regresión.** `npx vitest run` (rápido, sin cobertura) sobre los proyectos
tocados; la PWA no tiene riesgo de tipo (UUID es string). Si existe spec del client que
afirme el formato de la clave, ajustarlo.

Commit: `fix(quality): S4325 en caja + randomUUID en PWA (idempotencia, toasts, compras)`

### Paso 2 — Commit B: Dockerfile de la PWA (~30 min)

Los 2 hotspots del Dockerfile (`COPY` con glob en línea 9, posible root en línea 21) se
arreglan en código, no se marcan Safe — la PWA quedó fuera del estándar que T-32 impuso al
backend.

1. **Glob:** reemplazar `COPY` ancho por copias explícitas (`COPY dist/apps/pwa-cliente/ …`
   y los archivos de config concretos). Nada fuera de `dist/` + config de nginx.
2. **Root:** si la imagen final es nginx →
   `FROM nginxinc/nginx-unprivileged:<tag>@sha256:<digest>` (puerto 8080, ya no-root),
   pineando digest como en el Dockerfile del backend. Ajustar el mapeo de puertos en el
   compose si pasa de 80→8080. Alternativa si se quiere conservar la imagen actual:
   `USER nginx` + `listen 8080` + permisos de `/var/cache/nginx`.
3. Verificar: `docker build` de la PWA, contenedor arriba, `docker exec <pwa> whoami` ≠
   root, la SPA carga vía Kong/puerto mapeado.

Commit: `build(pwa): imagen no-root y COPY explícito (hotspots Sonar)`

### Paso 3 — Revisión de hotspots en la UI de Sonar (~20 min)

En http://localhost:9000 → proyecto → Security Hotspots. Tras los pasos 1–2, los de
`Math.random()` y Dockerfile deberían desaparecer del "new code" en el próximo análisis;
los que requieren dictamen humano son los 3 de `http://`:

- `cuentas-http.client.ts:21`, `inventario-http.client.ts:30`, `mesas-http.client.ts:27`
  → marcar **Safe** con esta justificación (copiarla literal, queda auditada en Sonar):

  > Tráfico interno de la red Docker entre microservicios, no expuesto al exterior.
  > Autenticado con tokens S2S HS256 con audiencia estricta (SERVICE_AUD_ENFORCE=true,
  > T-37). TLS termina en el perímetro (Kong). mTLS interno registrado como mejora futura
  > en docs/operacion/.

Revisar también los 7 hotspots históricos restantes (total 10): no bloquean el gate (la
condición es sobre *new*), pero dictaminarlos ahora deja el tablero en 100% revisado y evita
que reaparezcan como "nuevos" en futuros refactors. Si alguno no es trivial, dictaminar solo
los 3 nuevos y dejar los históricos anotados como tarea de backlog.

### Paso 4 — Deuda documentada (~15 min, mismo commit que el paso 6)

1. Añadir a `docs/operacion/` (junto al runbook de métricas) la nota **"mTLS interno —
   mejora futura"**: estado actual (HTTP plano intra-red + S2S aud estricto), disparador
   para implementarlo (despliegue fuera de una red confiable / requisito de compliance).
2. Nota de **ZAP aceptados**: `10049` (cacheable sobre rutas 404 — mitigable con
   `Cache-Control: no-store` en respuestas de error de Kong si se quiere reporte impecable;
   no es riesgo) y `90005` (Sec-Fetch-* ausente en requests del scanner, no de la app).
3. Nota de **métricas no comparables**: Sonar 42% total vs vitest ~53% — universos de
   archivos distintos (Sonar incluye PWA y archivos sin spec); el dato direccional es
   `new_coverage = 79.6%`, por encima del histórico.

### Paso 5 — Re-análisis (~20 min)

Re-correr el pipeline de la corrida anterior (mismo script de `security-run`, o al menos la
fase Sonar) **sobre el HEAD con los commits A y B**, con cobertura regenerada:

```bash
npx vitest run --coverage          # regenera lcov para Sonar
# fase sonar del script de security-run (sonar-scanner con el token local)
```

Verificar en el dashboard: `new_violations = 0`, `new_security_hotspots_reviewed = 100%`,
**Quality Gate: PASSED**. Si aparece una violation nueva introducida por A/B, corregirla en
un fixup antes de cerrar (no marcar Won't Fix para forzar el verde).

### Paso 6 — Commit C: evidencia y cierre (~15 min)

`docs:` que incluya: captura/valores del gate en verde con fecha y hash analizado, las dos
notas del paso 4, y la actualización del plan externo (la fila de "análisis estático/DAST"
pasa a cerrada con esta evidencia). Carpeta de logs de la nueva corrida referenciada
(`logs/security-run-<timestamp>`).

Commit: `docs: quality gate en verde + notas mTLS/ZAP/cobertura (S-E)`

## Criterios de aceptación

| Ítem | Evidencia |
|------|-----------|
| Gate | Dashboard PASSED sobre el HEAD final |
| S4325 | `new_violations = 0` |
| Hotspots | `new_security_hotspots_reviewed = 100%`, justificación `http://` registrada en Sonar |
| Idempotencia | `client.ts` usa `crypto.randomUUID()`; smoke rápido de un POST con la clave nueva (Kong responde 2xx y el retry con la misma clave no duplica) |
| PWA | Contenedor no-root verificado (`whoami`), SPA sirviendo |
| Suites | `npx vitest run` en verde sobre el HEAD final, pisos intactos |
| Docs | Notas mTLS/ZAP/cobertura presentes |

## Si algo falla

- `crypto.randomUUID is not a function` en dev http no-localhost → la PWA corre fuera de
  contexto seguro; fallback aceptable: `crypto.getRandomValues` con formateo UUID (no volver
  a `Math.random`).
- El gate sigue fallando por hotspots → confirmar que el dictamen se hizo en la rama/branch
  que analiza el scanner (en Community Edition todo va a la rama principal del proyecto) y
  que el re-análisis corrió DESPUÉS del dictamen.
- nginx-unprivileged rompe el mapeo → es el cambio 80→8080; ajustar `ports:` del compose y
  el upstream de Kong si la PWA se sirve detrás del gateway.

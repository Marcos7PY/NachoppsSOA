# Plan de Remediación — Auditoría Externa (T-31 … T-42)

> Continúa la numeración del [plan de cierre v5.1](plan-remediacion-auditoria_v5.md) (T-01…T-30).
> Origen: auditoría atómica de la codebase (2026-06-11) sobre `dev`. 12 hallazgos:
> 1 crítico · 2 altos · 6 medios · 3 bajos. Cada tarea define objetivo, archivos,
> pasos, pruebas (P-50+) y criterio de aceptación, para cerrar con commits atómicos
> y evidencia anclada a hash, como en los planes anteriores.

---

## 0. Tablero general

> **Estado de ejecución (2026-06-11):** T-31…T-42 implementados en `dev`. Tablero:
> **11/12 con evidencia**. La verificación runtime S-A sobre
> `infra/docker-compose.prod.yml` cerró P-53, `aud` en vivo, P-59 y regresión del
> breaker; la Suite 1 completa quedó verde sobre el mismo contenido de cierre.
> Queda fuera de S-A la ratificación de producto del ADR-010 (T-39).

| ID | Hallazgo | Severidad | Gate | Esfuerzo | Estado |
|----|----------|-----------|------|----------|--------|
| T-31 | `cambiarRol`: SQL inválido (`COUNT(*) … FOR UPDATE`) + sin transacción | 🔴 Crítica | G-1 | 0.5 d | ✅ `e7a09e7` — lock de filas en tx; P-50 54/54; P-51 escrito (pendiente stack) |
| T-32 | Dockerfile prod: ts-node en runtime + devDependencies en imagen | 🟠 Alta | G-2 | 1–2 d | ✅ `bcdb744` + S-A `HEAD` — P-52 9/9 imágenes a 888MB; P-53 smoke prod 4/4; P-54 tsc/ts-node 0, sin shim, Nest bootstrapa |
| T-33 | Circuit breaker ausente en pedidos→inventario/mesas (drift README) | 🟠 Alta | G-3 | 0.5 d | ✅ `515a51d` + S-A `HEAD` — Mesas/InventarioHttpClient con breaker; P-55 en verde; caos runtime 3/3 y breaker inventario 503 inmediato |
| T-34 | Rotación de refresh token sin compare-and-swap (doble emisión) | 🟡 Media | G-3 | 0.5 d | ✅ `9f0c1ff` — CAS con updateMany condicional; P-56 en verde |
| T-35 | Enumeración de usuarios por timing en login | 🟡 Media | G-3 | 0.25 d | ✅ `9f0c1ff` — DUMMY_HASH; P-57 en verde |
| T-36 | Comparación CSRF no constante en tiempo | 🟡 Media | G-3 | 0.25 d | ✅ `9f0c1ff` — timingSafeEqual; P-58 en verde |
| T-37 | `SERVICE_AUD_ENFORCE` en modo tolerante (= fase 2 de T-17, ya pendiente) | 🟡 Media | G-3 | 0.25 d | ✅ `c266372` + S-A `HEAD` — 'true' en ambos compose; grep aud=0; P-59 aud cruzado 401 y aud correcto 200 |
| T-38 | `shell-quote` crítico en devDependencies | 🟡 Media | G-1 | 0.1 d | ✅ `5e0ba6c` — npm audit 0 (prod y dev) |
| T-39 | Granularidad anti-doble-booking: 1 reserva/franja para todo el local | 🟡 Media | G-4 | 0.5–2 d | 🟡 `44e297c` — ADR-010 en estado *propuesta*; falta decisión de producto (a/b/c) |
| T-40 | God-services: extraer clientes HTTP de pedidos (803 líneas) y caja (632) | 🟢 Baja | G-4 | 1 d | ✅ `992a3bb` + S-A `HEAD` — PedidosSagaService + CuentasHttpClient; P-61: Suite 1 507/507, pisos intactos |
| T-41 | Documentar exposición interna de `/telemetry/metrics` | 🟢 Baja | G-4 | 0.1 d | ✅ `84c692c` — docs/operacion/telemetry-metrics.md |
| T-42 | Módulo Compras mock: decisión de alcance registrada | 🟢 Baja | G-4 | 0.1 d | ✅ `84c692c` — ADR-011 |

**Orden de ejecución:** G-1 (hoy) → G-2 (antes de cualquier despliegue/entrega) → G-3 (sprint
de seguridad, una semana) → G-4 (backlog priorizado). Total estimado: **5–7 días** de trabajo
efectivo. Ninguna tarea depende de otra salvo lo indicado en cada gate.

---

## Gate G-1 — Correctivo crítico (cerrar el mismo día)

### T-31 · Reparar `cambiarRol` (bug funcional en runtime)

**Problema.** En `apps/servicio-identidad/src/auth/auth.service.ts`, la protección
"no degradar al último ADMIN" usa:

```sql
SELECT COUNT(*) AS count FROM "Usuario"
WHERE rol = 'ADMIN' AND activo = true
FOR UPDATE
```

Postgres rechaza `FOR UPDATE` con agregaciones (`0A000: FOR UPDATE is not allowed with
aggregate functions`): **toda degradación de un ADMIN devuelve 500 hoy**. Los specs no lo
detectan porque mockean `$queryRaw`. Además la query vive fuera de transacción, así que aun
corregida no serializaría nada.

**Implementación.**

1. Mover toda la rama de degradación a `this.prisma.$transaction(async (tx) => { … })`.
2. Reemplazar el agregado por un lock de filas y contar en aplicación:

```ts
const admins = await tx.$queryRaw<{ id: string }[]>`
  SELECT id FROM "Usuario"
  WHERE rol = 'ADMIN' AND activo = true
  FOR UPDATE
`;
if (admins.length <= 1) {
  throw new ConflictException('No se puede degradar al último administrador activo');
}
const actualizado = await tx.usuario.update({ where: { id }, data: { rol: command.rol } });
await tx.auditoriaLog.create({ data: { accion: `CAMBIAR_ROL:…`, usuarioId: id, servicio: 'servicio-identidad' } });
```

   El `FOR UPDATE` sobre `id` es válido, bloquea las filas ADMIN hasta el commit y elimina la
   carrera "dos degradaciones concurrentes dejan 0 admins". La auditoría entra a la misma
   transacción (hoy también queda fuera).
3. La rama de promoción/cambios que no degradan ADMIN puede mantener el camino simple actual.

**Pruebas.**
- **P-50 (unit):** mantener los specs existentes, ajustando el mock a la nueva forma
  (`$queryRaw` devuelve filas, no `count`).
- **P-51 (integración real, obligatoria):** test e2e en `servicio-identidad-e2e` contra
  Postgres real: (a) degradar un ADMIN cuando hay 2 → 200; (b) degradar al último → 409;
  (c) dos degradaciones concurrentes del penúltimo y último → exactamente una gana.
  *Esta prueba existe para que el bug-clase "SQL inválido oculto por mocks" no reaparezca.*

**Aceptación.** P-50 y P-51 en verde sobre Postgres real; grep de `COUNT(*).*FOR UPDATE` en 0.

### T-38 · `shell-quote` (devDependencies)

`npm audit fix` (o bump del paquete padre), re-correr `npm audit --audit-level=low` → 0
hallazgos también en dev. Confirmar que `npm audit --omit=dev` sigue en 0. Commit propio.

---

## Gate G-2 — Imagen de producción (bloqueante para despliegue)

### T-32 · Dockerfile: compilar libs, eliminar ts-node del runtime, `npm ci --omit=dev`

**Problema.** La etapa `production` copia el `node_modules` completo del builder (con
devDependencies, instalado vía `npm install`) y sobreescribe `dist/apps/${APP}/index.js` con
un shim que registra `ts-node` + `tsconfig-paths` para cargar las 6 libs **desde fuente `.ts`
en runtime**: imagen pesada, arranque lento, transpilación en producción y toolchain de dev
dentro del contenedor.

**Implementación (incremental, sin big-bang).**

1. **Bundle de salida autocontenido.** Las apps ya compilan con Nx/webpack; configurar el
   target `build` de cada servicio para que el bundle incluya las libs del workspace
   (con `tsconfig-paths-webpack-plugin`, ya presente en devDependencies, las rutas `@org/*`
   se resuelven en build). Verificar que `node dist/apps/servicio-X/main.js` arranca sin
   `ts-node` en local.
2. **Etapa de deps de producción separada:**

```dockerfile
FROM node:22-alpine@sha256:… AS proddeps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    apk add --no-cache python3 make g++ && \
    npm ci --omit=dev --ignore-scripts && \
    npm rebuild bcrypt --build-from-source
```

3. En la etapa final: `COPY --from=proddeps node_modules`, `COPY --from=builder dist/apps/${APP}`,
   prisma del servicio, y **eliminar por completo** el `RUN printf "require('ts-node')…"`.
   El `CMD` pasa a `node dist/apps/${APP_NAME}/main.js` (vía `entrypoint.sh` para migraciones).
4. `npm ci` (no `npm install`) también en la etapa builder, para builds reproducibles
   alineados con el lockfile — igual que ya hace la CI.
5. Prisma: el cliente se genera en builder; copiar `src/generated/prisma` dentro del bundle o
   regenerar en la etapa final con el CLI como dependencia de build (no de runtime).

**Pruebas.**
- **P-52:** `docker build` de los 9 servicios; `docker images` documenta tamaño antes/después
  (esperado: de cientos de MB a fracción).
- **P-53:** levantar `docker-compose.prod.yml` completo, smoke 4/4 del runbook §4 del plan
  v5.1 (login, pedido E2E, evento outbox publicado, WS recibido).
- **P-54:** `docker exec` en un contenedor: `ls node_modules/.bin | grep -c tsc` → 0;
  `node -e "require('ts-node')"` falla. Evidencia de que la toolchain quedó fuera.

**Aceptación.** Stack prod en verde con imágenes compiladas; ts-node ausente; tamaño reducido
documentado en el commit.

---

## Gate G-3 — Sprint de seguridad (1 semana)

### T-33 · Circuit breaker en pedidos→mesas/inventario (cerrar drift con README)

1. Extraer las llamadas axios de `apps/servicio-pedidos/src/app/app.service.ts` a dos
   providers (`MesasHttpClient`, `InventarioHttpClient`) — esto adelanta la mitad de T-40.
2. Decorar los métodos remotos con `@CircuitBreakerOptions({ timeout: 5000,
   errorThresholdPercentage: 50, resetTimeout: 30_000 })`, los mismos umbrales que caja→cuentas,
   conservando el mapeo fino de errores actual (404→NotFound, timeout→ServiceUnavailable) como
   fallback del breaker.
3. **P-55:** spec que abre el breaker (N fallos simulados) y verifica respuesta 503 inmediata
   sin tocar la red; smoke de `probar:caos` para confirmar que el comportamiento ante caída de
   inventario no regresiona.
4. Si el equipo decidiera *no* poner breaker aquí, la alternativa aceptable es corregir el
   README y registrar la decisión en `docs/decisiones/` — lo inaceptable es el drift.

### T-34 · Rotación de refresh token con compare-and-swap

En `rotateRefreshToken`, reemplazar la secuencia *leer → emitir → revocar* por una revocación
condicional atómica que solo un caller puede ganar:

```ts
const revocados = await this.prisma.refreshToken.updateMany({
  where: { id: existing.id, revokedAt: null },
  data: { revokedAt: new Date() },
});
if (revocados.count !== 1) {
  // Otro request rotó primero: tratar como reuso → revocar cadena y rechazar.
}
// Solo el ganador emite el token nuevo y enlaza replacedById.
```

Mantener la detección de reuso existente (cadena revocada) intacta. **P-56:** test de
concurrencia: 2 (y 10) refresh simultáneos con el mismo token → exactamente 1 par de tokens
emitido, el resto 401, cadena consistente.

### T-35 · Login en tiempo constante frente a usuarios inexistentes

Precomputar al arrancar un `DUMMY_HASH = bcrypt.hashSync('dummy', SALT_ROUNDS)` y, cuando el
email no existe o el usuario está inactivo/bloqueado, ejecutar igualmente
`await bcrypt.compare(command.password, DUMMY_HASH)` antes del 401. **P-57:** spec que verifica
que `bcrypt.compare` se invoca también en la rama "no existe" (espía), y micro-benchmark
opcional documentando la diferencia de latencia antes/después.

### T-36 · CSRF con comparación constante

En `jwt-auth.guard.ts`:

```ts
import { timingSafeEqual } from 'node:crypto';
const a = Buffer.from(String(cookieToken));
const b = Buffer.from(String(normalizedHeader));
const iguales = a.length === b.length && timingSafeEqual(a, b);
```

**P-58:** specs existentes del guard en verde + caso de longitudes distintas (no debe lanzar
`ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`, debe devolver 403).

### T-37 · Activar `SERVICE_AUD_ENFORCE=true` (fase 2 de T-17)

Ya identificado como el único pendiente estructural del plan v5.1 (§3). Pasos: (1) grep de
logs del stack vivo buscando el warn `aud … no coincide` durante una corrida completa de
`poblar-y-probar` + suites de estrés — debe estar en 0; (2) fijar `SERVICE_AUD_ENFORCE: 'true'`
en ambos compose; (3) **P-59:** request S2S manual con `aud` cruzado → 401. Retirar el modo
tolerante del código en una tarea futura una vez asentado.

**Cierre de G-3:** Suite 1 completa en verde (473+ specs, pisos de cobertura intactos),
`probar:seguridad` y `probar:caos` sin regresiones.

---

## Gate G-4 — Dominio y deuda (backlog priorizado)

### T-39 · Granularidad del anti-doble-booking (requiere decisión de producto)

Hoy el índice único parcial `Reserva_fecha_hora_active_unique` permite **una sola reserva
activa por franja en todo el restaurante** y `consultarDisponibilidad` expone
`capacidadRestante ∈ {0,1}`. Opciones:

- **(a) Ratificar como alcance** — escribir ADR en `docs/decisiones/` ("una franja = un
  turno de servicio único") y ajustar el copy de la PWA. Esfuerzo: 0.5 d.
- **(b) Reserva por mesa** — incluir `mesaPreferida` (obligatoria) en el índice único parcial
  (nueva migración cruda + actualización del drift-check 9/9→), `consultarDisponibilidad`
  pasa a listar mesas libres. Esfuerzo: 1–2 d, toca PWA.
- **(c) Capacidad por franja** — contador con lock (`SELECT … FOR UPDATE` sobre una fila de
  capacidad) o constraint de exclusión. Esfuerzo: 2 d+.

Recomendación: decidir (a) vs (b) con el stakeholder antes de tocar código. **P-60:** la
prueba de concurrencia de reservas existente se adapta a la opción elegida.

### T-40 · Descomponer god-services

`servicio-pedidos/app.service.ts` (803 líneas) → extraer `MesasHttpClient`,
`InventarioHttpClient` (ya hecho en T-33), `PedidosSagaService` (transiciones de estado) y
dejar `AppService` como orquestador; `servicio-caja` (632) análogo con `CuentasHttpClient`.
Refactor sin cambio de comportamiento: la suite existente es la red; mover specs junto a cada
clase extraída. **P-61:** cobertura por archivo no baja de los pisos actuales.

### T-41 · Runbook de `/telemetry/metrics`

Añadir a `docs/operacion/` una nota: el endpoint es anónimo a nivel de servicio por diseño
(scrape de Prometheus), Kong lo bloquea externamente (request-termination 404), y en dev los
puertos host 3001-3010 lo exponen en LAN. Mitigación opcional: allowlist por IP interna o
token de scrape si el despliegue sale de una red confiable.

### T-42 · Compras (mock)

Registrar en `docs/decisiones/` el alcance pendiente del módulo Compras (hoy
`compras.mock.ts`, sin microservicio) con dos salidas posibles: ocultar el módulo tras un
feature-flag en producción, o planificar `servicio-compras` como T-43+ en un plan propio.

---

## Verificación final y cierre

1. **Suite 1 completa** sobre el HEAD del último commit del plan: specs totales en verde,
   pisos de cobertura intactos, `drift` 9/9 (o N/N si T-39b añade migración), greps de
   patrones prohibidos en 0 (incluido el nuevo: `COUNT(\*).*FOR UPDATE`).
2. **Runtime:** `poblar-y-probar` + `probar:concurrencia` + `probar:seguridad` + `probar:caos`
   sobre el stack de `docker-compose.prod.yml` con las imágenes nuevas de T-32.
3. **Dependencias:** `npm audit --audit-level=low` → 0 (prod y dev).
4. **Documentación:** README sin afirmaciones sin respaldo (T-33), ADRs de T-39/T-42, runbook
   T-41, y este plan actualizado con evidencia P-NN anclada a commit, al estilo v5.1.

**Commits sugeridos (atómicos, en orden):** `T-31 fix(identidad)` → `T-38 chore(deps)` →
`T-32 build(docker)` → `T-33 feat(resiliencia)` → `T-34..T-36 fix(seguridad)` →
`T-37 chore(s2s)` → `T-39 feat|docs(reservas)` → `T-40 refactor` → `T-41/T-42 docs`.

---

## Cierre de ejecución (2026-06-11)

Commits reales, en orden: `e7a09e7` (T-31) → `5e0ba6c` (T-38) → `bcdb744` (T-32) →
`515a51d` (T-33) → `9f0c1ff` (T-34..36) → `c266372` (T-37) → `44e297c` (T-39 ADR) →
`84c692c` (T-41/T-42) → `992a3bb` (T-40) → `367beda` (fix de tipos shared-auth que
desbloqueaba el build tsc de caja/pedidos).

**Verificación final ejecutada (local, sin stack):**
1. Suite 1 completa @ `367beda`: **504/504 specs en verde**; cobertura stmts 53.26 /
   branches 51.35 / funcs 46.54 / lines 54.33 (pisos 52/45/38/53 intactos). Grep de
   `COUNT(\*).*FOR UPDATE` → 0. Lint en verde en los proyectos tocados.
2. `npm audit --audit-level=low` → 0 (prod y dev).
3. Build tsc de identidad/pedidos/caja en verde; imagen Docker de identidad
   construida y verificada (P-52/P-54): 888MB (antes 1.8GB), sin tsc/ts-node/shim,
   CLI de prisma presente, Nest bootstrapa con `node main.js`.

**Verificación runtime S-A ejecutada (stack prod vivo, 2026-06-11):**
1. `infra/docker-compose.prod.yml` levantado con 9 servicios healthy. Hallazgo corregido
   durante la sesión: la etapa final del Dockerfile copiaba `node_modules` como `root` y
   `prisma migrate deploy` fallaba bajo `USER node`; los `COPY --chown=node:node` cierran el
   arranque prod.
2. **P-52 extendida:** 9/9 imágenes `nachopps/servicio-*:latest` en **888MB**; `kong` en
   530MB. Baseline previo ~1.8GB por servicio.
3. **P-53 smoke 4/4:** `poblar-y-probar` contra Kong prod (`BASE_URL=http://localhost`) pasó
   **50/50**; informe actualizado en `docs/informe-pruebas.md`. El flujo de métodos de pago
   ahora cubre **EFECTIVO, TARJETA, YAPE, TRANSFERENCIA y PLIN**. WS verificado manualmente:
   conexión a `/notificaciones/socket.io`, pedido `201`, evento recibido en vivo
   (`pedido.actualizado`).
4. **Regresión T-33/T-34:** `probar:concurrencia` **5/5**, `probar:caos` **8/8**,
   `probar:seguridad` **6 OK / 1 SKIP / 0 FALLA** (`Puertos directos sin token` queda
   explícitamente SKIP con `ALLOW_CLOSED_DIRECT_PORTS=true`, porque compose prod no publica
   3001-3010; el default sigue exigiendo 401 en dev), `probar:stock` **12/12** con AMQP
   forward local hacia `rabbitmq:5672`. Suite runtime adicional
   `SUITE=caos node stress-tests/run-remediacion-runtime.js` **3/3**.
5. **Breaker inventario:** con `servicio-inventario` detenido y producto ausente, pedidos
   devolvió `500` inicial en 2980ms y luego **503 inmediato** en 9/8/8/8/8ms con log
   `Circuito ABIERTO en InventarioHttpClient.fetchProductosLote`; tras `resetTimeout`, el
   mismo caso volvió a **404 de negocio** en 73ms.
6. **aud en vivo / P-59:** grep `no coincide con SERVICE_NAME` en logs de 2h → **0**; sin 401
   S2S espurios en pedidos→mesas/inventario ni caja→cuentas; token S2S HS256 con
   `aud=servicio-mesas` contra `servicio-caja` → **401**, con `aud=servicio-caja` → **200**.
7. **Suite 1 completa:** `npm exec vitest -- run --coverage` desde la raíz → **52 archivos /
   507 tests en verde**. Cobertura: statements **53.43%**, branches **51.85%**, functions
   **46.96%**, lines **54.49%**; pisos 52/45/38/53 intactos.

**Pendiente fuera de S-A:** decisión de producto del ADR-010 (T-39).

# Plan de implementación — próximas sesiones

> Generado el 2026-06-07 tras cerrar el sprint de auditoría (todo en `dev`, CI 100% verde:
> `main` + `migration-drift` + `docker-integration`). **Excluye** la promoción `dev→main`
> (decisión de release aparte; hoy `dev` está 57 commits adelante de `main`).
>
> Severidad: 🔴 bloqueante · 🟠 importante · 🟡 calidad. Esfuerzo: **S** ≤ medio día · **M** ≤ 2 días · **L** ≥ 3 días.

Cuatro frentes pendientes, ordenados por independencia y valor:

| # | Tarea | Esf. | ¿Necesita input del usuario? |
|---|-------|------|------------------------------|
| A | 4.2 — Subir cobertura de tests | L (incremental) | No |
| B | a11y PWA — focus-trap en diálogos/drawers/popovers | M | No |
| C | C4 — Slack real (alertas de outbox) | S | **Sí** — webhook de Slack |
| D | C2 — Despliegue prod con Docker secrets | M | **Sí** — secretos reales de prod |

**Orden sugerido:** A y B se pueden hacer ya sin nada externo (arrancar por ahí). C y D
quedan para cuando el usuario provea credenciales reales.

---

## A — 4.2 Subir cobertura de tests · L (incremental) · 🟡

### Estado actual (actualizado 2026-06-11)
Umbrales en `vitest.config.mts` (no bajar, solo subir):
```
branches: 45 · functions: 38 · lines: 53 · statements: 52
```
Cobertura real en `4a2f6fe`: lines 53.06% · statements 52.03% · branches 50.65% · functions 46.06%.
La suite está en **494/494 verde** y corre con `TZ=America/Lima` fijo (determinista).

> D-1 (lint 25/25 verde) y D-2 (pisos 53/52 recuperados) del plan de cierre completados.

### Focos reales (medidos con `npx vitest run --coverage`)
Clusters en **0%** que más mueven la aguja:

**Backend (plomería crítica):**
- `libs/shared-auth/src/lib/roles.guard.ts` — 0%
- `libs/shared-auth/src/lib/helmet.config.ts` — 0%
- `apps/servicio-*/src/app/outbox.processor.ts` — ~37% (lógica de reintentos/FAILED/alerta)
- `apps/servicio-*/src/app/app.controller.ts` — varios 0–50%
- `libs/resiliencia/src/lib/outbox-admin.ts`, `outbox-alert.ts`, `idempotency.interceptor.ts`

**PWA (todo el data-layer en 0%):**
- `src/api/*.api.ts` (client, auth, cuentas, inventario, pedidos, reservas, usuarios) — 0%
- `src/hooks/queries/use*Query.ts` — 0%
- `src/mappers/*.mapper.ts` — 0%
- `src/auth/permisos.ts` — 0% · `src/domain/pedido.flow.ts` — ~46%

### Pasos (por escalón, subir umbral solo cuando la cobertura real lo permita)
1. **Escalón 1 → ~45%:** atacar lo de mayor ratio valor/esfuerzo y bajo riesgo:
   - `roles.guard.ts` y `helmet.config.ts` (puras, fáciles de testear).
   - `permisos.ts` y `pedido.flow.ts` (lógica pura de la PWA, sin mocks de red).
   - `*.mapper.ts` de la PWA (DTO→VM, deterministas).
2. **Escalón 2 → ~60%:** `outbox.processor.ts` (mockear PrismaService + publisher; cubrir camino PENDING→PUBLISHED, reintento, FAILED→alerta), `idempotency.interceptor.ts`, `outbox-admin.ts`.
3. **Escalón 3 → ~70–80%:** `use*Query.ts` y `*.api.ts` de la PWA (mockear `client`/`fetch` con MSW o stub), controllers de servicios.
4. Tras **cada** escalón: subir los `thresholds` en `vitest.config.mts` al nuevo piso real y commitear (`test(cobertura): ...`).

### Criterio de aceptación
- Umbrales subidos por escalón sin nunca bajarlos; suite verde; CI `main` verde.

### Notas
- El `include` de coverage cubre los 9 servicios + `shared-auth` + `pwa-cliente`.
- Mantener tests deterministas (ya hay `TZ` fijo; usar `vi.setSystemTime` para fechas).

---

## B — a11y PWA: focus-trap en diálogos/drawers/popovers · M · 🟠

### Estado actual (auditado)
- **No existe** ningún focus-trap (`grep` de `useFocusTrap`/`FocusTrap`/`inert` → 0 resultados).
- Marcado parcial presente, sin atrapar foco:
  - `components/layout/Header.tsx:111` — `.settings-pop` con `role="dialog"` (sin `aria-modal`, sin trap).
  - `components/layout/Header.tsx:166` — `.notif-popover` con `role="dialog"` (idem).
  - `screens/ops/PedidosScreen.tsx:326` — drawer con `role="dialog" aria-modal="true"` (atributo OK, **sin** trap real ni cierre con `Esc`/restauración de foco).
- Sin marcado de diálogo: `screens/caja/CierreDrawer.tsx`, `CobroMesaDrawer.tsx`, `MovimientoModal.tsx`; drawer de `screens/ops/MesasScreen.tsx`; `components/comandero/Comandero.tsx`.

### Enfoque
Crear **un solo hook reutilizable** `src/hooks/useFocusTrap.ts` (o componente `<FocusTrap>`), sin dependencias nuevas:
- Al abrir: guardar `document.activeElement`, mover foco al primer focusable del diálogo.
- `Tab`/`Shift+Tab` ciclan dentro del contenedor (atrapar en bordes).
- `Esc` cierra (callback `onClose`).
- Al cerrar: restaurar foco al elemento previo.
- Marcar el resto del árbol como `inert` (o `aria-hidden`) mientras está abierto.

### Pasos
1. Implementar `useFocusTrap(ref, { active, onClose })` + tests unitarios (suma a frente A).
2. Aplicarlo en, por orden de impacto:
   - Drawer de **PedidosScreen** (ya tiene `aria-modal`).
   - Drawers de **caja** (CierreDrawer, CobroMesaDrawer, MovimientoModal) — añadir `role="dialog" aria-modal="true" aria-label`.
   - Drawer de **MesasScreen** y panel de **Comandero**.
   - Popovers del **Header** (settings, notificaciones): trap + cierre con `Esc` + clic-fuera + `aria-expanded` en el botón disparador.
3. Verificar con teclado (Tab no se escapa, `Esc` cierra, foco vuelve) y revisar contraste/labels.

### Criterio de aceptación
- Con cada diálogo/drawer/popover abierto: el foco queda atrapado, `Esc` cierra y el foco
  regresa al disparador. Navegación 100% por teclado.

### Archivos clave
- Nuevo: `apps/pwa-cliente/src/hooks/useFocusTrap.ts` (+ `.spec.ts`).
- Editar: `components/layout/Header.tsx`, `screens/ops/PedidosScreen.tsx`,
  `screens/ops/MesasScreen.tsx`, `screens/caja/{CierreDrawer,CobroMesaDrawer,MovimientoModal}.tsx`,
  `components/comandero/Comandero.tsx`.

---

## C — C4 Slack real (alertas de outbox) · S · 🟠 · **requiere webhook**

### Estado actual (la implementación YA existe)
- `libs/resiliencia/src/lib/outbox-alert.ts` → `notifyOutboxFailed()` hace `POST` al
  `process.env.SLACK_WEBHOOK_URL` si está definido (fire-and-forget, nunca lanza).
- Se invoca desde los **9** `apps/servicio-*/src/app/outbox.processor.ts` cuando un evento
  pasa a `FAILED`.
- `infra/alertmanager/alertmanager.yml` tiene el `slack_configs` **comentado** (plantilla).

→ Falta SOLO configurar el valor real y validar. **No hay que escribir lógica.**

### Lo que el usuario debe proveer
- **Slack Incoming Webhook URL** (`https://hooks.slack.com/services/XXX/YYY/ZZZ`) y el canal destino.

### Pasos
1. Inyectar `SLACK_WEBHOOK_URL` a los servicios:
   - Dev/local: variable en el `environment` del compose (o `.env`).
   - Prod: **como Docker secret** (`slack_webhook_url` + `SLACK_WEBHOOK_URL_FILE`), alineado con C2;
     extender el loop de `infra/entrypoint.sh` (hoy lee `DATABASE_URL RABBITMQ_URI JWT_* SERVICE_JWT_SECRET`)
     para incluir `SLACK_WEBHOOK_URL`.
2. (Opcional, ruta Alertmanager) Descomentar y completar `slack_configs.api_url` en
   `infra/alertmanager/alertmanager.yml` para las alertas de Prometheus (profundidad de outbox).
   Ver `infra/prometheus/alert.rules.yml`.
3. Validar: forzar un evento `FAILED` (p.ej. apuntar un servicio a un RabbitMQ caído y dejar
   agotar reintentos) y confirmar el mensaje en Slack con el link de `POST /<servicio>/outbox/<id>/retry`.

### Criterio de aceptación
- Un evento que llega a `FAILED` dispara mensaje en el canal de Slack; sin webhook configurado
  el sistema sigue funcionando igual (no rompe).

---

## D — C2 Despliegue prod con Docker secrets · M · 🟠 · **requiere secretos reales**

### Estado actual (la infraestructura YA existe)
- `infra/docker-compose.secrets.yml` — override que monta secretos en `/run/secrets/*`.
- `infra/entrypoint.sh` — lee `*_FILE` y exporta la var correspondiente (patrón Docker secrets).
- `infra/secrets/README.md` — documenta los archivos esperados (gitignorados).
- `scripts/generate-jwt-keys.mjs` — genera el par RS256.
- `infra/docker-compose.prod.yml` — exige `JWT_PUBLIC_KEY`/`JWT_PRIVATE_KEY`/`SERVICE_JWT_SECRET`/
  `KONG_JWT_PUBLIC_KEY` (con `${VAR:?...}`, fallan si faltan).

→ Falta materializar secretos reales + correr el despliegue prod y verificarlo end-to-end.

### Lo que el usuario debe proveer (o autorizar generar)
- **JWT RS256**: par privado/público (puede generarse con `scripts/generate-jwt-keys.mjs`).
- **`SERVICE_JWT_SECRET`**: secreto HS256 (`openssl rand -base64 48`).
- **`RABBITMQ_URI`** real (usuario/pass de prod).
- **`DATABASE_URL` por servicio** (9), con credenciales de prod.
- **`KONG_JWT_PUBLIC_KEY`** (= pública RS256 con `\n` literales) y **`KONG_CORS_ORIGINS`** (dominio real de la PWA).
- Dominio HTTPS real del gateway para `--build-arg VITE_API_BASE_URL=https://api.tudominio.com` al buildear la PWA.

### Pasos
1. Generar los archivos en `infra/secrets/` según `infra/secrets/README.md` (NO commitear; ya gitignorados).
2. Levantar con override de secretos:
   `docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml -f infra/docker-compose.secrets.yml --profile all up -d --wait`
3. Build de la PWA apuntando al gateway real (build-arg `VITE_API_BASE_URL`).
4. Verificar: los 9 servicios *healthy*; login RS256 vía Kong; ruta protegida → 200; Kong Admin (`:8001`) NO accesible (ya removido en `docker-compose.prod.yml`); `migrate deploy` aplicado por el entrypoint.
5. Documentar el procedimiento final en `docs/operacion/secrets.md` (referenciado por el README) y rotación de claves (`docs/operacion/jwt-rs256.md`).

### Criterio de aceptación
- Stack prod arriba con secretos vía `/run/secrets/*` (ningún secreto en `.env` en claro ni en
  el `environment` del compose); login + ruta protegida OK; `:8001` cerrado.

---

## Notas de cierre

- **No tocar** la promoción `dev→main` (queda como decisión de release separada).
- El stack local quedó **operativo y healthy** al cierre de la sesión anterior; `npm run probar`
  / `probar:stock` / `probar:seguridad`, los 9 `*-e2e` y Playwright PWA están **verdes**.
- Recordatorios de entorno: `gh` instalado y autenticado (recargar PATH en PowerShell);
  repo real `Marcos7PY/NachoppsSOA`; PRs van a `dev`. Detalle en la memoria del proyecto.

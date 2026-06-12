# Plan de Sign-off Final — NachoPps

> **Propósito.** Guía ejecutable para completar los 4 criterios de firma que no pudieron
> automatizarse (runbook manual §4 del plan v5.1) y para activar el control de seguridad
> T-17 fase 2. Al terminar, todos los criterios de firma estarán cumplidos y el plan de
> remediación quedará cerrado.
>
> **HEAD de referencia:** `67ea08c` (rama `dev`).
> **Duración estimada:** ~45 min en local + 1 ventana en staging.
> **Ejecutor:** registrar nombre real en la tabla §6 al archivar.

---

## Prerequisitos comunes

- Stack completo levantado y healthy: `docker compose -f infra/docker-compose.yml --profile all up -d`
- Verificar 9/9 servicios: `docker ps --format '{{.Names}}\t{{.Status}}' | grep -c healthy` → 9
- Seed activo (6 usuarios por rol, mesas y productos). Si el stack está frío, re-correr el seed:
  ```sh
  node scripts/seed-admin.js
  npx ts-node scripts/poblar-datos.ts
  ```
- Navegador con DevTools disponible (Chrome/Edge recomendado).
- Para P-33: entorno staging accesible con dominio real y TLS.

---

## 1 · P-32 — WS rooms por rol (T-19) · ~10 min, local

**Objetivo:** verificar que `pago.registrado` llega solo a los roles `['ADMIN','CAJERO','GERENCIA']`
y no a `MESERO`, según la matriz de `libs/contracts/src/events/ws-rooms.ts:10`.

### Pasos

1. Abrir dos perfiles de navegador distintos (perfil normal + incógnito, o dos perfiles de Chrome).
2. **Navegador A** — iniciar sesión como **CAJERO** (`cajero@nachopps.pe`). Ir a la pantalla de Caja.
3. **Navegador B** — iniciar sesión como **MESERO** (`mesero@nachopps.pe`). Ir a la pantalla de Pedidos o Mesas.
4. En ambos navegadores: DevTools → pestaña **Network** → filtro **WS** → hacer clic en la conexión activa `/notificaciones/...` → pestaña **Messages**.
5. Desde **Navegador A**, registrar un pago:
   - Abrir un turno de caja si no hay uno activo (`POST /v1/caja/turnos`).
   - Abrir una cuenta de mesa y confirmar un pedido.
   - Registrar el pago (`POST /v1/caja/pagos` o flujo de pantalla).
6. Observar los frames WS en ambos navegadores.

### Criterio de paso

| Verificación | Esperado |
|---|---|
| Frame `pago.registrado` en **Navegador A** (CAJERO) | **Aparece** |
| Frame `pago.registrado` en **Navegador B** (MESERO) | **No aparece** |
| Frame `pedido.*` en **Navegador B** (MESERO) tras crear un pedido desde B | Aparece (dominio `pedido` incluye MESERO) |
| Frame `mesa.*` en ambos (CAJERO + MESERO) | Aparece en ambos |

### Smoke por rol (opcional, +5 min)

Repetir con COCINA y RECEPCION abiertos en incógnito y confirmar que cada pantalla recibe
solo los eventos de su dominio según `ws-rooms.ts`.

---

## 2 · P-45 — Service worker en vivo (T-27) · ~10 min, local

**Objetivo:** confirmar que el SW `nachopps-pos-v4` no cachea rutas `/v1/` y que el modo
offline degradada limpiamente.

### Pasos

1. Build de producción de la PWA:
   ```sh
   node node_modules/.bin/nx.cmd build pwa-cliente
   # El artefacto queda en apps/pwa-cliente/dist/
   ```
2. Servir el build (ejemplo con `serve`; ajustar al flujo del equipo):
   ```sh
   npx serve apps/pwa-cliente/dist -p 4173
   # o: node node_modules/.bin/vite preview --config apps/pwa-cliente/vite.config.mts
   ```
3. Abrir `http://localhost:4173` en el navegador. Iniciar sesión y navegar: Mesas → Pedidos → Caja.
4. DevTools → **Application** → **Cache Storage**.

### Criterio de paso

| Verificación | Esperado |
|---|---|
| Cache `nachopps-pos-v4` existe | ✅ presente |
| Entradas del caché con `/v1/` en la URL | **0 entradas** |
| Cache `nachopps-pos-v3` (nombre anterior) | **No existe** (borrado en `activate`) |
| DevTools → Network → **Offline** → recargar | Shell (`index.html`) carga; las llamadas API fallan limpio (sin "stuck loading", UI muestra estado offline via `useOnlineStatus`) |

---

## 3 · P-56 — Ciclo de sesión completo (T-01) · ~20 min de espera, local

**Objetivo:** verificar el flujo completo de vida de sesión: refresh silencioso tras expiración
del access token, y revocación del refresh token en logout.

> La espera de >15 min es inevitable; se puede hacer en paralelo con P-32 y P-45.

### Pasos

1. Iniciar sesión con cualquier usuario y dejar la sesión **activa en el navegador** (no recargar, no cerrar pestaña).
   - Anotar la hora de inicio: _____
2. Esperar **> 15 minutos** (el `accessTokenTtl` del entorno dev es 15 min).
3. Sin recargar la página, ejecutar una acción que requiera autenticación (navegar a una pantalla con carga de datos, registrar un pedido, etc.).
4. Abrir DevTools → **Network** — buscar `POST /auth/refresh`.
5. Ejecutar logout (botón de salir en la PWA o `POST /v1/auth/logout`).
6. Tras el logout, intentar manualmente un `POST /v1/auth/refresh` con las cookies anteriores (copiar la cookie `nachopps.refresh_token` justo antes del logout desde DevTools → Application → Cookies):
   ```sh
   curl -s -X POST http://localhost:8000/identidad/auth/refresh \
     -H "Cookie: nachopps.refresh_token=<valor_copiado>; nachopps.csrf_token=<csrf>" \
     -H "X-CSRF-Token: <csrf>" | jq .
   ```

### Criterio de paso

| Verificación | Esperado |
|---|---|
| La acción tras >15 min se completa sin re-login | ✅ (refresh silencioso) |
| `POST /auth/refresh` aparece en Network con **200** | ✅ |
| El 200 del refresh **no** tiene código 429 | ✅ (presupuesto propio de refresh intacto) |
| Tras logout: cookies `nachopps.*` eliminadas en DevTools | ✅ |
| `POST /auth/refresh` manual con cookie vieja → | **401** (token revocado) |

---

## 4 · P-33 — CORS del WS en prod-like (T-24) · ventana de staging

**Objetivo:** confirmar que el gateway de notificaciones solo acepta handshakes del origen
configurado en `CORS_ORIGIN`.

### Prerequisito

Stack prod-like levantado en staging:
```sh
export CORS_ORIGIN=https://app.<tu-dominio-staging>
docker compose -f infra/docker-compose.prod.yml --profile all up -d
```

### Pasos

1. Probar el handshake Socket.IO con el **Origin correcto**:
   ```sh
   curl -s -o /dev/null -w "%{http_code}\n" \
     "https://api.<staging>/notificaciones/socket.io/?EIO=4&transport=polling" \
     -H "Origin: https://app.<tu-dominio-staging>"
   ```
   Esperado: **200**

2. Probar con un **Origin ajeno**:
   ```sh
   curl -s -o /dev/null -w "%{http_code}\n" \
     "https://api.<staging>/notificaciones/socket.io/?EIO=4&transport=polling" \
     -H "Origin: https://evil.example.com"
   ```
   Esperado: **4xx** o respuesta sin headers `Access-Control-Allow-Origin`.

3. Prueba funcional esencial: abrir la **PWA real** en staging (`https://app.<staging>`) en un navegador, iniciar sesión y verificar que la pantalla de Pedidos o Cocina recibe eventos en tiempo real (el ícono de conexión WS está activo en DevTools).

### Criterio de paso

| Verificación | Esperado |
|---|---|
| Curl Origin correcto | **200** |
| Curl Origin ajeno | **4xx / sin CORS headers** |
| PWA en staging recibe eventos en vivo | ✅ (antes del fix de T-24, esto fallaba silenciosamente en prod) |

---

## 5 · T-17 fase 2 — Activar enforcement de audiencia S2S

**Contexto.** La emisión de `aud` está activa desde `4f0fddb` (2026-06-10). Mientras
`SERVICE_AUD_ENFORCE=off`, cualquier token `SISTEMA` sigue siendo pase maestro entre
servicios y el control diseñado en T-17 no tiene efecto.

### 5.1 · Iniciar la ventana de observación (hacer ya)

La ventana de 7 días corre desde que la emisión de `aud` está activa en el entorno
observado. **Cada día sin iniciarla es un día más con el control apagado.**

1. Confirmar que el entorno objetivo (staging o prod) tiene el stack corriendo con la versión
   `≥ 4f0fddb` de `libs/shared-auth`.
2. Abrir el dashboard de Loki/Grafana (`http://localhost:3100` en local o el endpoint de staging).
3. Ejecutar la query de vigilancia durante 7 días:
   ```logql
   {service_name=~"servicio-.+"} |= "aud" |= "warn"
   ```
   o buscar el patrón de warning emitido por `jwt.strategy.ts` en modo tolerante
   (`"token S2S sin aud o aud incorrecto — modo tolerante"`).
4. Anotar la fecha de inicio de la ventana: _____

### 5.2 · Criterio de flip

Al cumplir **7 días** con **cero warnings** del patrón de audiencia en los logs de los 9 servicios:

1. Activar en `infra/docker-compose.yml` **y** `infra/docker-compose.prod.yml`:
   ```yaml
   # Añadir a los env de los 9 servicios:
   SERVICE_AUD_ENFORCE: 'true'
   ```
2. Redeploy de los 9 servicios:
   ```sh
   docker compose -f infra/docker-compose.yml up -d --no-deps \
     servicio-identidad servicio-mesas servicio-pedidos servicio-cuentas \
     servicio-reservas servicio-inventario servicio-notificaciones \
     servicio-caja servicio-reportes
   ```

### 5.3 · P-31 en vivo — verificación post-flip

Ejecutar inmediatamente después del redeploy:

**Negativo:** token S2S con `aud` incorrecto debe ser rechazado:
```sh
# Firmar un token HS256 con aud de inventario y atacar cuentas
node -e "
const crypto = require('crypto');
const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
const payload = Buffer.from(JSON.stringify({
  sub: 'svc-test', type: 'SISTEMA',
  aud: 'servicio-inventario',   // aud correcto para inventario, NO para cuentas
  iat: Math.floor(Date.now()/1000)
})).toString('base64url');
const sig = crypto.createHmac('sha256','nachopps_service_secret_dev')
  .update(header+'.'+payload).digest('base64url');
console.log(header+'.'+payload+'.'+sig);
"
# Usar el token resultante contra cuentas:
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/v1/cuentas/estado \
  -H "Authorization: Bearer <token_generado>"
```
Esperado: **401**

**Positivo:** flujo caja→cuentas (P-50) sigue funcionando:
```sh
node stress-tests/run-remediacion-runtime.js   # SUITE=smoke cubre P-50 (pago completo)
```
Esperado: PASS en todos los casos de smoke.

### 5.4 · Marcar T-17 cerrada

Una vez P-31 en vivo pasa (negativo **401** + positivo **PASS**):
- Actualizar `docs/plan-remediacion-auditoria.md` T-17: ⏳ → ✅
- Registrar en `docs/informe-pruebas-remediacion.md` §Cierre final: fecha, ejecutor, hash del commit donde se activó `SERVICE_AUD_ENFORCE`.
- Commit: `feat(infra): activar SERVICE_AUD_ENFORCE=true en los 9 servicios [T-17 fase 2]`

---

## 6 · Registro de ejecución

Completar esta tabla al archivar el sign-off:

| Prueba | Fecha | Ejecutor | Resultado | Observaciones |
|--------|-------|----------|-----------|---------------|
| P-32 (WS rooms) | | | ⏳ | |
| P-45 (SW cache) | | | ⏳ | |
| P-56 (sesión completa) | | | ⏳ | |
| P-33 (CORS WS staging) | | | ⏳ | |
| T-17 inicio ventana 7 días | | | ⏳ | Fecha inicio: |
| T-17 flip + P-31 en vivo | | | ⏳ | |

---

## 7 · Archivado final

Una vez **todas las filas de §6 tengan ✅**:

1. Actualizar `docs/informe-pruebas-remediacion.md`:
   - Cambiar todos los `⏳` de P-32/P-45/P-56/P-33 a ✅ con detalle.
   - Añadir el bonus de detección de reuso de refresh (ya en el plan v5.1 §2) si no está.
   - Actualizar la línea del resumen ejecutivo Suite 4 de "⚠️ Parcial" a ✅.
2. Actualizar `docs/plan-remediacion-auditoria.md`:
   - T-17, T-19, T-22 (continuo → cerrado si aplica), T-24 → ✅
   - §5 criterios de firma: todos en ✅.
3. Commit: `docs: sign-off final — todas las verificaciones manuales cerradas`

**El plan de remediación NachoPps queda cerrado.**

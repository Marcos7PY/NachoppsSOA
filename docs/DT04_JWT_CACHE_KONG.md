# DT-04: JWT — Caché, Resiliencia y Rendimiento

**Estado actual:** ✅ Completada (3 fases: LRU cache + degraded mode + refresh tokens)
**Severidad:** Alto
**Archivos de referencia:** `infra/kong/kong.yml` · `apps/servicio-identidad/`
**Ubicación de este documento:** `docs/DT04_JWT_CACHE_KONG.md`
**Monorepo:** `BackActual/` · Kong 3.9 · NestJS 11 · 9 microservicios

---

## 0. Instrucciones para el agente que implemente esta DT

Lee esta sección antes que nada.

1. **Este documento está dividido en tres fases independientes.** Cada una tiene su propia verificación y puede implementarse por separado. No mezcles código de distintas fases.
2. **El código Lua es ejecutable para Kong 3.9, no pseudocódigo.** La API de plugins de Kong 0.x/1.x (`BasePlugin`, `:new()`, `super`) fue eliminada en Kong 3.0 y no carga en 3.9. El código de este documento usa la API moderna (tabla simple con `PRIORITY` y métodos directos).
3. **Cada fase tiene un criterio de aceptación con logs observables.** Respuestas `200` solas no prueban nada — el plugin `jwt` nativo sigue validando por debajo. La fase no está completa hasta que los logs muestren el comportamiento esperado.
4. **No omitas la sección 3 (alcance y límites).** Es parte del valor del entregable académico, no relleno.
5. Si algo de la API de Kong 3.9 no coincide con lo documentado, consulta la documentación oficial antes de improvisar y registra la desviación en la sección "Notas de implementación" de cada fase.

---

## 1. Situación actual

Kong 3.9 valida JWT por firma HS256 de forma autónoma, sin consultar a `servicio-identidad`. Usa el plugin nativo `jwt` con esta configuración (repetida en 8 servicios):

```yaml
consumers:
  - username: nachopps-app
    jwt_secrets:
      - key: nachopps-identidad
        secret: nachopps_jwt_secret_dev
        algorithm: HS256

plugins:
  - name: jwt
    config:
      key_claim_name: iss
      claims_to_verify:
        - exp
```

El secreto `nachopps_jwt_secret_dev` está hardcodeado en `kong.yml` y debe coincidir con `JWT_SECRET` en `servicio-identidad` y `docker-compose.yml` (ver DT-09).

**Problemas actuales:**

| Problema | Impacto |
|---|---|
| Kong re-valida la firma HS256 en cada request | Overhead criptográfico innecesario (marginal con HS256, relevante si se migra a RS256) |
| Sin modo degradado ante caída de identidad | Si identidad cae y los tokens expiran, nadie puede hacer login ni renovar |
| Sin refresh tokens | Cada expiración de access token obliga al usuario a re-autenticarse manualmente |

---

## 2. Lo que pide ADR-005

> "JWT con caché en API Gateway"

El ADR pide que un token ya validado no se re-valide criptográficamente en cada request subsecuente. Este documento extiende ese objetivo para cubrir también resiliencia y ciclo de vida de tokens.

---

## 3. Alcance y límites honestos

> Esta sección es parte del entregable. Documenta qué resuelve cada fase y qué no.

### 3.1 Lo que resuelven las tres fases

- **Fase 1 (caché JWT en Kong):** cumple el ADR-005. Elimina re-validación criptográfica en Kong durante el TTL. Entregable académico principal.
- **Fase 2 (modo degradado):** si identidad cae, los usuarios que ya hicieron login siguen operando hasta que su token expire — aunque nadie puede hacer *nuevo* login. Resiliencia parcial sin nuevos servicios.
- **Fase 3 (refresh tokens):** solución completa al ciclo de vida de tokens. Access token de vida corta + refresh token de vida larga. Si identidad cae, los access tokens vigentes siguen sirviendo durante su TTL corto; al expirar, el cliente puede renovar automáticamente si identidad ya volvió.

### 3.2 Lo que NO resuelven

- **La caché de Fase 1 no mejora la disponibilidad ante caída de identidad.** Kong ya valida JWT por firma sin consultar a identidad. Si identidad cae, los tokens vigentes funcionan igual con o sin caché. El problema es cuando esos tokens *expiran* — ahí solo ayuda la Fase 2 o la Fase 3.
- **El ahorro de cómputo de la Fase 1 es parcial.** Cada microservicio NestJS revalida el JWT con `JwtAuthGuard` (lib `shared-auth`, "solo firma"). La caché actúa solo en Kong; la validación NestJS sigue ocurriendo en todos los requests.
- **El impacto en rendimiento de la Fase 1 es marginal con HS256.** HMAC-SHA256 cuesta microsegundos. El camino crítico actual (~990 ms, presupuesto 2000 ms) no es sensible a esto. La caché se vuelve relevante en rendimiento si el proyecto migra a RS256 asimétrico.
- **La Fase 2 no evita que nuevos usuarios no puedan hacer login** durante una caída de identidad. Solo preserva sesiones existentes.

### 3.3 Conclusión

El valor de la Fase 1 es cumplir el ADR-005 con implementación correcta y verificable. El valor de las Fases 2 y 3 es resiliencia real documentada con límites honestos. Se implementan como entregable de arquitectura.

---

## 4. Mapa de fases

```
FASE 1 — Caché JWT en Kong (ADR-005)
  └─ Plugin Lua jwt-cache
  └─ TTL: 60s (techo)
  └─ Resultado: elimina re-validación criptográfica en Kong

FASE 2 — Modo degradado ante caída de identidad
  └─ Extiende el plugin jwt-cache
  └─ TTL de caché = tiempo completo restante del token (no 60s)
  └─ Resultado: sesiones existentes sobreviven caída de identidad

FASE 3 — Refresh tokens en servicio-identidad
  └─ Access token: 15 min
  └─ Refresh token: 7 días, rotación en cada uso
  └─ Nuevo endpoint: POST /auth/refresh
  └─ Resultado: renovación automática, ciclo de vida completo
```

Las fases son acumulativas. Fase 2 modifica el plugin de Fase 1. Fase 3 es independiente de Kong.

---

## FASE 1 — Caché JWT en Kong (ADR-005)

### F1.1 Cómo funciona

El plugin `jwt-cache` actúa en dos fases de Kong:

**Fase `access`** (antes de enrutar al backend):
1. Extrae el token del header `Authorization: Bearer <token>`.
2. Calcula `SHA256(token)` como clave de caché (el hash es corto y uniforme; el token raw puede ser largo).
3. Busca la clave en un LRU en memoria.
   - **Cache hit** (entrada presente y `expires > now`): autentica el request con el consumer guardado y termina. El plugin `jwt` nativo, al ver el request ya autenticado, no recalcula la firma.
   - **Cache miss**: no autentica nada. Deja que el plugin `jwt` nativo haga la validación completa de firma y `exp`.

**Fase `log`** (después de responder, fuera de la latencia visible al cliente):
4. Si fue un miss y el plugin `jwt` autenticó correctamente, lee el consumer desde el PDK (`kong.client.get_consumer()`) y lo guarda en la caché con TTL efectivo = `min(cache_ttl, exp - now)`. Una entrada nunca vive más que el propio token.

**Por qué el orden importa:** `jwt-cache` tiene `PRIORITY = 1451`. El plugin `jwt` nativo tiene prioridad `1450`. Prioridad mayor → corre primero en `access`. Sin esta prioridad explícita, el orden es indefinido y la caché no puede saltar la validación nativa.

**Caché por worker:** Kong corre N workers con memoria separada. Un token validado en el worker 1 es miss la primera vez que llega al worker 2. Con N workers, los primeros ~N requests de un token pagan validación completa. Es esperado y aceptable.

### F1.2 Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `infra/kong/plugins/jwt-cache/handler.lua` | Crear |
| `infra/kong/plugins/jwt-cache/schema.lua` | Crear |
| `infra/kong/Dockerfile` | Crear |
| `infra/kong/kong.yml` | Modificar: agregar plugin global |
| `infra/docker-compose.yml` | Modificar: `image` → `build` |

### F1.3 `infra/kong/plugins/jwt-cache/handler.lua`

```lua
-- infra/kong/plugins/jwt-cache/handler.lua
-- Plugin de caché de JWT para Kong 3.9.
-- API moderna: tabla simple, sin BasePlugin, sin :new()/super (eliminados en Kong 3.0).

local sha256_hex = require("kong.tools.sha256").sha256_hex
-- NOTA: Si sha256_hex no está disponible en tu build de Kong 3.9,
-- sustituir por ngx.md5(token). md5 es suficiente como clave de índice
-- (no se usa con fin criptográfico). Anotar la desviación en "Notas de implementación".

local JwtCache = {
  PRIORITY = 1451,   -- Mayor que jwt nativo (1450): corre primero en access.
  VERSION  = "1.0.0",
}

-- Caché LRU en memoria, separada por worker process (cada worker tiene su pid).
-- Estructura: caches[pid] = {
--   entries = { [sha256_key] = { consumer, credential, expires } },
--   order   = { sha256_key, sha256_key, ... },  -- FIFO para desalojo
--   count   = N
-- }
local caches = {}

local function get_cache()
  local pid = ngx.worker.pid()
  local c = caches[pid]
  if not c then
    c = { entries = {}, order = {}, count = 0 }
    caches[pid] = c
  end
  return c
end

-- Extrae el Bearer token del header Authorization.
-- Acepta capitalización mixta ("bearer", "Bearer", "BEARER").
-- Devuelve nil si el header no existe o no tiene formato Bearer.
local function extract_token()
  local auth = kong.request.get_header("authorization")
  if not auth then
    return nil
  end
  return auth:match("^[Bb]earer%s+(.+)$")
end

-- Decodifica el claim `exp` del JWT SIN verificar la firma.
-- Solo se usa para calcular el TTL de la entrada de caché.
-- Si el token está malformado, devuelve nil (el plugin jwt nativo lo rechazará después).
local function token_exp(token)
  local ok, jwt_parser = pcall(require, "kong.plugins.jwt.jwt_parser")
  if not ok then
    return nil
  end
  local jwt_obj, err = jwt_parser:new(token)
  if err then
    return nil
  end
  return jwt_obj.claims and tonumber(jwt_obj.claims.exp) or nil
end

-- Guarda una entrada en la caché con el TTL efectivo.
-- TTL efectivo = min(conf.cache_ttl, exp - now).
-- Si la caché está llena, desaloja la entrada más antigua (FIFO).
local function cache_store(cache, cache_key, consumer, credential, conf, exp)
  local now = ngx.time()
  local ttl = conf.cache_ttl

  if exp then
    local remaining = exp - now
    if remaining <= 0 then
      return  -- Token ya vencido; no tiene sentido cachear.
    end
    if remaining < ttl then
      ttl = remaining
    end
  end

  -- Desalojo FIFO si la caché está llena.
  if cache.count >= conf.max_entries then
    local oldest = table.remove(cache.order, 1)
    if oldest then
      cache.entries[oldest] = nil
      cache.count = cache.count - 1
    end
  end

  -- No duplicar la clave en `order` si ya existe (entrada vencida que se refresca).
  if not cache.entries[cache_key] then
    table.insert(cache.order, cache_key)
    cache.count = cache.count + 1
  end

  cache.entries[cache_key] = {
    consumer   = consumer,
    credential = credential,
    expires    = now + ttl,
  }
end

-- ─── FASE ACCESS ──────────────────────────────────────────────────────────────
-- Corre antes del plugin jwt nativo (PRIORITY 1451 > 1450).
-- Cache hit  → autentica y termina (jwt nativo no recalcula firma).
-- Cache miss → deja pasar al jwt nativo; guarda datos para la fase log.
function JwtCache:access(conf)
  local token = extract_token()
  if not token then
    return  -- Sin token: el plugin jwt nativo lo rechazará con 401.
  end

  local cache_key = sha256_hex(token)
  local cache = get_cache()
  local entry = cache.entries[cache_key]

  if entry and entry.expires > ngx.time() then
    -- CACHE HIT
    kong.client.authenticate(entry.consumer, entry.credential)
    kong.log.notice("[jwt-cache] HIT key=", cache_key:sub(1, 12), " worker=", ngx.worker.pid())
    kong.ctx.plugin.cache_hit = true
    return
  end

  -- CACHE MISS
  kong.log.notice("[jwt-cache] MISS key=", cache_key:sub(1, 12), " worker=", ngx.worker.pid())
  kong.ctx.plugin.cache_key = cache_key
  kong.ctx.plugin.token_exp = token_exp(token)
end

-- ─── FASE LOG ─────────────────────────────────────────────────────────────────
-- Corre después de que el backend respondió (no afecta latencia del cliente).
-- Solo cachea si fue un MISS y el jwt nativo autenticó correctamente.
function JwtCache:log(conf)
  if kong.ctx.plugin.cache_hit then
    return  -- Ya era un hit; no hay nada que guardar.
  end

  local cache_key = kong.ctx.plugin.cache_key
  if not cache_key then
    return  -- No había token; tampoco hay nada que guardar.
  end

  -- kong.client.get_consumer() y get_credential() devuelven nil
  -- si el plugin jwt nativo rechazó el token (401). No cachear en ese caso.
  local consumer   = kong.client.get_consumer()
  local credential = kong.client.get_credential()
  if not consumer or not credential then
    return
  end

  local cache = get_cache()
  cache_store(cache, cache_key, consumer, credential, conf, kong.ctx.plugin.token_exp)
end

return JwtCache
```

### F1.4 `infra/kong/plugins/jwt-cache/schema.lua`

```lua
-- infra/kong/plugins/jwt-cache/schema.lua
return {
  name = "jwt-cache",
  fields = {
    { config = {
        type = "record",
        fields = {
          -- cache_ttl: segundos máximos que una entrada vive en caché.
          -- TTL efectivo = min(cache_ttl, exp - now). 60s es el techo por defecto.
          -- Subir este valor amplía la ventana en que un token revocado sigue siendo aceptado.
          { cache_ttl = {
              type     = "number",
              default  = 60,
              required = true,
              gt       = 0,
          } },
          -- max_entries: tamaño máximo del LRU por worker.
          -- Al superarse, se desaloja la entrada más antigua (FIFO).
          { max_entries = {
              type     = "number",
              default  = 10000,
              required = true,
              gt       = 0,
          } },
        },
    } },
  },
}
```

### F1.5 `infra/kong/Dockerfile`

```dockerfile
# infra/kong/Dockerfile
FROM kong:3.9

# Copia el plugin custom al path de plugins de Lua en Kong.
# El directorio debe contener handler.lua y schema.lua.
COPY plugins/jwt-cache /usr/local/share/lua/5.1/kong/plugins/jwt-cache

# Agrega el plugin a la lista de plugins cargados.
# "bundled" incluye todos los plugins nativos de Kong.
ENV KONG_PLUGINS=bundled,jwt-cache
```

### F1.6 Cambio en `infra/kong/kong.yml`

Agregar en la sección `plugins:` de nivel global (no por-servicio):

```yaml
plugins:
  # ... plugins existentes ...
  - name: jwt-cache
    config:
      cache_ttl: 60       # Segundos. TTL efectivo = min(60, exp - now).
      max_entries: 10000  # Entradas por worker process.
```

### F1.7 Cambio en `infra/docker-compose.yml`

En el servicio `kong`, reemplazar `image` por `build`:

```yaml
  kong:
    build:
      context: ./kong   # Apunta a infra/kong/, donde está el Dockerfile
    # image: kong:3.9   ← comentar o eliminar esta línea
```

### F1.8 Consideraciones de seguridad

**Revocación:** mientras una entrada está en caché, el token se acepta sin revalidar firma. Si un usuario cambia de contraseña o un administrador revoca un rol, el token anterior sigue siendo válido durante `min(cache_ttl, exp_restante)`. Con `cache_ttl = 60s`, la ventana máxima de exposición es 60 segundos.

**No subir `cache_ttl` sin justificarlo.** 60s es el techo deliberado. Subirlo a valores como 3600s (1h) amplía proporcionalmente la ventana de tokens comprometidos que siguen siendo aceptados.

**Secreto hardcodeado:** `nachopps_jwt_secret_dev` en `kong.yml` y `docker-compose.yml` es un riesgo pendiente (DT-09). No tiene impacto en esta DT, pero queda documentado.

### F1.9 Verificación (obligatoria — criterio de aceptación de Fase 1)

El objetivo es probar que la caché funciona, no solo que Kong arranca. Dos respuestas `200` no prueban nada — el plugin `jwt` nativo sigue validando por debajo. La evidencia son los logs.

```powershell
# ── Paso 1: Reconstruir Kong con el plugin custom
docker compose -f infra/docker-compose.yml build kong

# ── Paso 2: Levantar el entorno
docker compose -f infra/docker-compose.yml --profile dev up -d

# ── Paso 3: Verificar que Kong arrancó sin errores de carga del plugin
docker compose -f infra/docker-compose.yml ps kong
docker compose -f infra/docker-compose.yml logs kong | Select-String "error|jwt-cache|plugin"
# Si el plugin no cargó, habrá una línea de error al inicio. Corregir antes de continuar.

# ── Paso 4: Obtener un token válido
# Ajustar email/password a un usuario existente en identidad_db.
# Confirmar el nombre del campo del token contra apps/servicio-identidad (probablemente access_token).
$resp  = curl.exe -s -X POST http://localhost:8000/auth/login `
           -H "Content-Type: application/json" `
           -d '{"email":"admin@nachopps.com","password":"<password>"}'
$token = ($resp | ConvertFrom-Json).access_token
Write-Host "Token obtenido: $($token.Substring(0,20))..."

# ── Paso 5: Primer request → debe generar MISS en el log
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $token" `
  http://localhost:8000/pedidos

# ── Paso 6: Segundo request con el MISMO token → debe generar HIT
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $token" `
  http://localhost:8000/pedidos

# ── Paso 7: Verificar logs — debe aparecer MISS seguido de HIT
docker compose -f infra/docker-compose.yml logs kong | Select-String "jwt-cache"
# Salida esperada (puede variar el key y worker):
#   [jwt-cache] MISS key=a3f9c1d82b11 worker=0
#   [jwt-cache] HIT  key=a3f9c1d82b11 worker=0

# ── Paso 8: Verificar que tokens inválidos siguen siendo rechazados
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer tokeninvalido" `
  http://localhost:8000/pedidos
# Debe devolver 401.
```

**Criterios de aceptación — Fase 1:**

- [ ] Kong arranca sin errores de carga del plugin (paso 3).
- [ ] Requests con token válido devuelven `200` (pasos 5 y 6).
- [ ] Logs muestran `[jwt-cache] MISS` en el primer request y `[jwt-cache] HIT` en el segundo con el mismo token (paso 7).
- [ ] Token inválido devuelve `401` (paso 8).

> Si solo hay `MISS` y nunca `HIT`: verificar que `PRIORITY = 1451` está en el `handler.lua`, que `kong.client.get_consumer()` devuelve datos (el plugin `jwt` nativo debe estar corriendo), y que ambos requests usan exactamente el mismo string de token. Con N workers pueden necesitarse más de 2 requests para ver un `HIT`.

### F1.10 Notas de implementación (rellenar al implementar)

- Helper de hashing usado (`sha256_hex` o `ngx.md5`): …
- Número de workers de Kong en el entorno: …
- Desviaciones respecto al código documentado: …

---

## FASE 2 — Modo degradado ante caída de `servicio-identidad`

### F2.1 El problema que resuelve

**Situación sin Fase 2:** si `servicio-identidad` cae y los access tokens vigentes expiran, nadie puede hacer login ni obtener un nuevo token. Los usuarios con sesión activa dejan de poder operar en cuanto su token expira.

**Situación con Fase 2:** los usuarios que ya hicieron login antes de la caída tienen su token cacheado en Kong durante toda la vida restante del token (`exp - now`), no solo 60 segundos. Mientras el token no expire, siguen operando sin tocar identidad. Los nuevos logins siguen sin funcionar — eso requiere que identidad esté viva.

**Diferencia clave con Fase 1:** el `cache_ttl` de Fase 1 es un techo de 60s (corto a propósito, por seguridad de revocación). En Fase 2, el TTL de la entrada de caché se extiende hasta el tiempo completo restante del token. Se agrega un parámetro `degraded_mode` que controla este comportamiento.

### F2.2 Trade-off de seguridad explícito

Extender el TTL de caché tiene un costo: si un token se revoca (cambio de contraseña, revocación de rol), ese token seguirá siendo aceptado hasta que expire, no solo 60 segundos. Con tokens de larga vida (por ejemplo, 8 horas), la ventana puede ser significativa.

**Decisión de diseño:** el modo degradado es **opt-in** via configuración (`degraded_mode: true`). Por defecto está desactivado; el TTL se comporta como en Fase 1. Activarlo es una decisión consciente de aceptar ese trade-off a cambio de resiliencia.

### F2.3 Cambios en `handler.lua`

La Fase 2 **modifica el plugin de Fase 1**. El cambio es quirúrgico: solo afecta la función `cache_store`.

Reemplazar la función `cache_store` en `handler.lua` con esta versión:

```lua
-- Reemplazar cache_store en handler.lua por esta versión extendida.
local function cache_store(cache, cache_key, consumer, credential, conf, exp)
  local now = ngx.time()
  local ttl

  if conf.degraded_mode and exp then
    -- MODO DEGRADADO: el TTL de la entrada = tiempo completo restante del token.
    -- El usuario sigue operando aunque identidad caiga, mientras el token no expire.
    -- Trade-off: tokens revocados siguen siendo aceptados hasta su exp.
    local remaining = exp - now
    if remaining <= 0 then
      return  -- Token ya vencido.
    end
    ttl = remaining
    kong.log.notice("[jwt-cache] STORE degraded ttl=", ttl, "s key=", cache_key:sub(1, 12))
  else
    -- MODO NORMAL (Fase 1): TTL = min(cache_ttl, exp - now).
    ttl = conf.cache_ttl
    if exp then
      local remaining = exp - now
      if remaining <= 0 then
        return
      end
      if remaining < ttl then
        ttl = remaining
      end
    end
    kong.log.notice("[jwt-cache] STORE normal ttl=", ttl, "s key=", cache_key:sub(1, 12))
  end

  -- Desalojo FIFO si la caché está llena.
  if cache.count >= conf.max_entries then
    local oldest = table.remove(cache.order, 1)
    if oldest then
      cache.entries[oldest] = nil
      cache.count = cache.count - 1
    end
  end

  if not cache.entries[cache_key] then
    table.insert(cache.order, cache_key)
    cache.count = cache.count + 1
  end

  cache.entries[cache_key] = {
    consumer   = consumer,
    credential = credential,
    expires    = now + ttl,
  }
end
```

### F2.4 Cambio en `schema.lua`

Agregar el campo `degraded_mode` al schema:

```lua
-- infra/kong/plugins/jwt-cache/schema.lua — versión Fase 2
return {
  name = "jwt-cache",
  fields = {
    { config = {
        type = "record",
        fields = {
          { cache_ttl = {
              type     = "number",
              default  = 60,
              required = true,
              gt       = 0,
          } },
          { max_entries = {
              type     = "number",
              default  = 10000,
              required = true,
              gt       = 0,
          } },
          -- degraded_mode: cuando true, el TTL de la entrada = tiempo restante del token.
          -- Permite que sesiones existentes sobrevivan una caída de servicio-identidad.
          -- Activar solo si se acepta el trade-off: tokens revocados siguen válidos hasta exp.
          { degraded_mode = {
              type     = "boolean",
              default  = false,
              required = true,
          } },
        },
    } },
  },
}
```

### F2.5 Cambio en `kong.yml`

Actualizar la declaración del plugin para activar el modo degradado:

```yaml
plugins:
  - name: jwt-cache
    config:
      cache_ttl: 60          # Sigue siendo el techo en modo normal.
      max_entries: 10000
      degraded_mode: true    # Activa TTL = exp - now para sesiones existentes.
```

### F2.6 Verificación (criterio de aceptación de Fase 2)

```powershell
# ── Precondición: Fase 1 ya verificada y funcionando.

# ── Paso 1: Obtener un token y hacer un primer request (genera MISS + STORE)
$resp  = curl.exe -s -X POST http://localhost:8000/auth/login `
           -H "Content-Type: application/json" `
           -d '{"email":"admin@nachopps.com","password":"<password>"}'
$token = ($resp | ConvertFrom-Json).access_token

curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $token" `
  http://localhost:8000/pedidos

# ── Paso 2: Verificar que el STORE muestra ttl en segundos (no 60s fijo)
# Con degraded_mode=true, el ttl debería ser mucho mayor que 60
# (igual al tiempo de vida restante del token).
docker compose -f infra/docker-compose.yml logs kong | Select-String "jwt-cache"
# Esperado: [jwt-cache] STORE degraded ttl=<N>s  donde N >> 60

# ── Paso 3: Simular caída de identidad
docker compose -f infra/docker-compose.yml stop servicio-identidad
Write-Host "servicio-identidad detenido"

# ── Paso 4: Verificar que requests con token cacheado siguen funcionando
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $token" `
  http://localhost:8000/pedidos
# Debe devolver 200 (cache hit, no consulta a identidad)

# ── Paso 5: Verificar que nuevos logins fallan (esperado — identidad está caída)
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -X POST http://localhost:8000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@nachopps.com","password":"<password>"}'
# Debe devolver 502 o 503 (identidad no disponible)

# ── Paso 6: Restaurar identidad
docker compose -f infra/docker-compose.yml start servicio-identidad
Write-Host "servicio-identidad restaurado"
```

**Criterios de aceptación — Fase 2:**

- [ ] El log muestra `STORE degraded ttl=<N>s` donde N es el tiempo de vida restante del token (no fijo en 60).
- [ ] Con identidad detenida, requests con token cacheado devuelven `200`.
- [ ] Con identidad detenida, nuevos logins devuelven `502`/`503` (correcto — no hay modo mágico para nuevos logins sin identidad).
- [ ] Al restaurar identidad, nuevos logins vuelven a funcionar.

### F2.7 Notas de implementación (rellenar al implementar)

- TTL observado en logs al activar `degraded_mode`: …
- Tiempo de vida configurado en `JWT_SECRET`/`expiresIn` en `servicio-identidad`: …
- Desviaciones respecto al código documentado: …

---

## FASE 3 — Refresh tokens en `servicio-identidad`

### F3.1 El problema que resuelve

Con solo access tokens, cuando el token expira el usuario debe re-autenticarse manualmente. Si la aplicación es un POS (`pwa-cliente`, `appMesero`) en uso activo, una expiración en medio de una operación interrumpe el flujo. El patrón refresh token resuelve esto: el cliente renueva automáticamente el access token en segundo plano, sin que el usuario lo note.

**Ciclo de vida con refresh tokens:**

```
[Login]
  → identidad emite:
      access_token  (JWT, TTL: 15 min)
      refresh_token (opaco, TTL: 7 días, guardado en BD)

[Operación normal]
  → cliente envía access_token en cada request
  → Kong valida por firma (+ caché de Fase 1)

[Access token expira]
  → cliente detecta 401
  → cliente llama POST /auth/refresh con refresh_token
  → identidad valida el refresh_token contra BD
  → identidad emite nuevo access_token + nuevo refresh_token (rotación)
  → cliente reintenta el request original con el nuevo access_token

[Logout / refresh_token comprometido]
  → cliente llama POST /auth/logout
  → identidad invalida el refresh_token en BD
  → el access_token viejo expira en máximo 15 min
```

**Por qué rotación:** en cada `/auth/refresh`, el refresh_token viejo se invalida y se emite uno nuevo. Así, si un refresh_token es robado, el ataque queda acotado a un único uso — en el siguiente refresh legítimo, el refresh_token robado ya no sirve.

### F3.2 Cambios en `servicio-identidad`

#### F3.2.1 Modelo Prisma — nuevo modelo `RefreshToken`

Agregar al schema de Prisma de `servicio-identidad` (`apps/servicio-identidad/prisma/schema.prisma`):

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique  // Token opaco (UUID v4), no JWT
  usuarioId String
  expiresAt DateTime
  revocado  Boolean  @default(false)
  createdAt DateTime @default(now())

  usuario   Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([usuarioId])
  @@map("refresh_tokens")
}
```

Agregar la relación inversa en el modelo `Usuario` existente:

```prisma
model Usuario {
  // ... campos existentes ...
  refreshTokens RefreshToken[]
}
```

Crear y aplicar la migración:

```powershell
cd apps/servicio-identidad
npx prisma migrate dev --name add_refresh_tokens
cd ../..
```

#### F3.2.2 DTOs

Crear `apps/servicio-identidad/src/auth/dto/refresh-token.dto.ts`:

```typescript
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token emitido en el login o en el último refresh.' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class AuthTokensResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ example: 900 })
  expires_in: number;  // Segundos hasta expiración del access_token
}
```

#### F3.2.3 Servicio — `AuthService`

Modificar `apps/servicio-identidad/src/auth/auth.service.ts`. Agregar los tres métodos:

```typescript
import { v4 as uuidv4 } from 'uuid';
import { addDays, addMinutes } from 'date-fns';

// Constantes de TTL — centralizar aquí para no dispersarlas.
const ACCESS_TOKEN_TTL_MINUTES  = 15;
const REFRESH_TOKEN_TTL_DAYS    = 7;

// ── login() — modificar el existente para emitir también refresh_token
async login(dto: LoginDto): Promise<AuthTokensResponseDto> {
  const usuario = await this.validarCredenciales(dto.email, dto.password);
  // ... validación existente ...

  const access_token  = this.emitirAccessToken(usuario);
  const refresh_token = await this.emitirRefreshToken(usuario.id);

  return { access_token, refresh_token, expires_in: ACCESS_TOKEN_TTL_MINUTES * 60 };
}

// ── emitirAccessToken() — helper privado
private emitirAccessToken(usuario: Usuario): string {
  const payload = {
    sub : usuario.id,
    email: usuario.email,
    rol  : usuario.rol,
    iss  : 'nachopps-identidad',  // Debe coincidir con key_claim_name en kong.yml
  };
  return this.jwtService.sign(payload, {
    expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`,
  });
}

// ── emitirRefreshToken() — helper privado
private async emitirRefreshToken(usuarioId: string): Promise<string> {
  const token     = uuidv4();  // Token opaco; no es JWT.
  const expiresAt = addDays(new Date(), REFRESH_TOKEN_TTL_DAYS);

  await this.prisma.refreshToken.create({
    data: { token, usuarioId, expiresAt },
  });

  return token;
}

// ── refresh() — endpoint nuevo POST /auth/refresh
async refresh(dto: RefreshTokenDto): Promise<AuthTokensResponseDto> {
  const stored = await this.prisma.refreshToken.findUnique({
    where: { token: dto.refresh_token },
    include: { usuario: true },
  });

  if (!stored || stored.revocado || stored.expiresAt < new Date()) {
    throw new UnauthorizedException('Refresh token inválido o expirado.');
  }

  // Rotación: invalidar el token viejo y emitir uno nuevo.
  await this.prisma.refreshToken.update({
    where: { id: stored.id },
    data:  { revocado: true },
  });

  const access_token  = this.emitirAccessToken(stored.usuario);
  const refresh_token = await this.emitirRefreshToken(stored.usuarioId);

  return { access_token, refresh_token, expires_in: ACCESS_TOKEN_TTL_MINUTES * 60 };
}

// ── logout() — invalida el refresh_token activo
async logout(refreshToken: string): Promise<void> {
  await this.prisma.refreshToken.updateMany({
    where: { token: refreshToken, revocado: false },
    data:  { revocado: true },
  });
}
```

#### F3.2.4 Controlador — `AuthController`

Agregar los endpoints a `apps/servicio-identidad/src/auth/auth.controller.ts`:

```typescript
import { RefreshTokenDto, AuthTokensResponseDto } from './dto/refresh-token.dto';

@Post('refresh')
@ApiOperation({ summary: 'Renovar access token usando refresh token.' })
@ApiResponse({ status: 200, type: AuthTokensResponseDto })
@ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensResponseDto> {
  return this.authService.refresh(dto);
}

@Post('logout')
@ApiOperation({ summary: 'Revocar refresh token activo.' })
@ApiResponse({ status: 204 })
@HttpCode(204)
async logout(@Body() dto: RefreshTokenDto): Promise<void> {
  await this.authService.logout(dto.refresh_token);
}
```

#### F3.2.5 Kong — exponer los nuevos endpoints

Los endpoints `/auth/refresh` y `/auth/logout` no requieren JWT (son públicos — se llaman precisamente cuando el token expiró o se quiere cerrar sesión). Verificar que en `kong.yml` el servicio de identidad permite rutas sin plugin `jwt` para estas dos rutas, o agregar una regla de exclusión.

Ejemplo de cómo podría verse en `kong.yml` si identidad tiene su propio servicio declarado:

```yaml
services:
  - name: servicio-identidad
    url: http://servicio-identidad:3001
    routes:
      - name: auth-login
        paths: ["/auth/login"]
        # Sin plugin jwt — es el endpoint de autenticación
      - name: auth-refresh
        paths: ["/auth/refresh"]
        # Sin plugin jwt — se llama con refresh_token, no access_token
      - name: auth-logout
        paths: ["/auth/logout"]
        # Sin plugin jwt — se llama cuando el access_token ya expiró
      - name: auth-protegido
        paths: ["/auth/me", "/auth/usuarios", "/auth/auditoria"]
        plugins:
          - name: jwt  # Solo estas rutas requieren JWT
```

Ajustar según la estructura real de `kong.yml`.

### F3.3 Limpieza de refresh tokens expirados

Los refresh tokens revocados y expirados acumulan filas en `refresh_tokens`. En producción se necesitaría un job periódico; en desarrollo/proyecto es suficiente con una query manual:

```sql
-- Ejecutar periódicamente o agregar como tarea programada.
DELETE FROM refresh_tokens
WHERE revocado = true OR expires_at < NOW();
```

Para el proyecto académico es aceptable no implementar el job. Documentar la deuda como DT-10 si aplica.

### F3.4 Impacto en el frontend

Los tres clientes (React PWA, Flutter App, Electron POS) deben implementar la lógica de renovación automática. El patrón es el mismo en los tres:

1. Al recibir un `401` en cualquier request, intentar `POST /auth/refresh` con el `refresh_token` guardado.
2. Si el refresh es exitoso: guardar el nuevo `access_token` y `refresh_token`, reintentar el request original.
3. Si el refresh falla (refresh_token expirado o revocado): borrar ambos tokens y redirigir al login.

En React con `apiClient` (ya unificado en DT-07), esto se implementa como un interceptor de respuesta:

```typescript
// libs/api-client o donde viva apiClient
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post('/auth/refresh', { refresh_token: refreshToken });

        localStorage.setItem('access_token',  data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh falló: limpiar y redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

> Para Flutter y Electron el patrón es análogo usando los clientes HTTP respectivos (Dio en Flutter, axios en Electron/React).

### F3.5 Verificación (criterio de aceptación de Fase 3)

```powershell
# ── Paso 1: Login — verificar que la respuesta incluye refresh_token
$resp = curl.exe -s -X POST http://localhost:8000/auth/login `
          -H "Content-Type: application/json" `
          -d '{"email":"admin@nachopps.com","password":"<password>"}'
$resp | ConvertFrom-Json | Format-List
# Debe incluir: access_token, refresh_token, expires_in

$access  = ($resp | ConvertFrom-Json).access_token
$refresh = ($resp | ConvertFrom-Json).refresh_token

# ── Paso 2: Usar el access_token normalmente
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $access" `
  http://localhost:8000/pedidos
# Debe devolver 200

# ── Paso 3: Renovar usando el refresh_token
$renewResp = curl.exe -s -X POST http://localhost:8000/auth/refresh `
               -H "Content-Type: application/json" `
               -d "{`"refresh_token`":`"$refresh`"}"
$renewResp | ConvertFrom-Json | Format-List
# Debe incluir nuevo access_token y nuevo refresh_token (rotación)

$newAccess  = ($renewResp | ConvertFrom-Json).access_token
$newRefresh = ($renewResp | ConvertFrom-Json).refresh_token

# ── Paso 4: Verificar que el nuevo access_token funciona
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -H "Authorization: Bearer $newAccess" `
  http://localhost:8000/pedidos
# Debe devolver 200

# ── Paso 5: Verificar que el refresh_token viejo ya no sirve (rotación)
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -X POST http://localhost:8000/auth/refresh `
  -H "Content-Type: application/json" `
  -d "{`"refresh_token`":`"$refresh`"}"
# Debe devolver 401 (refresh_token viejo fue revocado en el paso 3)

# ── Paso 6: Logout — revocar el refresh_token activo
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -X POST http://localhost:8000/auth/logout `
  -H "Content-Type: application/json" `
  -d "{`"refresh_token`":`"$newRefresh`"}"
# Debe devolver 204

# ── Paso 7: Verificar que el refresh_token revocado no sirve
curl.exe -s -o NUL -w "HTTP status: %{http_code}`n" `
  -X POST http://localhost:8000/auth/refresh `
  -H "Content-Type: application/json" `
  -d "{`"refresh_token`":`"$newRefresh`"}"
# Debe devolver 401
```

**Criterios de aceptación — Fase 3:**

- [ ] `POST /auth/login` devuelve `access_token`, `refresh_token` y `expires_in`.
- [ ] `POST /auth/refresh` con refresh_token válido devuelve nuevos tokens.
- [ ] El refresh_token viejo es rechazado con `401` tras el refresh (rotación funcionando).
- [ ] `POST /auth/logout` devuelve `204` y el refresh_token queda invalidado.
- [ ] `POST /auth/refresh` y `POST /auth/logout` no requieren header `Authorization` (Kong los deja pasar sin validar JWT).

### F3.6 Notas de implementación (rellenar al implementar)

- `expiresIn` configurado en `JwtService` antes de la Fase 3: …
- Dependencia `uuid` ya instalada o agregada: …
- Dependencia `date-fns` ya instalada o agregada: …
- Desviaciones respecto al código documentado: …

---

## 5. Resumen de archivos tocados por fase

| Archivo | Fase 1 | Fase 2 | Fase 3 |
|---|---|---|---|
| `infra/kong/plugins/jwt-cache/handler.lua` | Crear | Modificar `cache_store` | — |
| `infra/kong/plugins/jwt-cache/schema.lua` | Crear | Agregar `degraded_mode` | — |
| `infra/kong/Dockerfile` | Crear | — | — |
| `infra/kong/kong.yml` | Agregar plugin | Activar `degraded_mode` | Excluir rutas `/auth/refresh` y `/auth/logout` de JWT |
| `infra/docker-compose.yml` | `image` → `build` | — | — |
| `apps/servicio-identidad/prisma/schema.prisma` | — | — | Agregar `RefreshToken` |
| `apps/servicio-identidad/src/auth/auth.service.ts` | — | — | `refresh()`, `logout()`, `emitirRefreshToken()` |
| `apps/servicio-identidad/src/auth/auth.controller.ts` | — | — | `POST /auth/refresh`, `POST /auth/logout` |
| `apps/servicio-identidad/src/auth/dto/refresh-token.dto.ts` | — | — | Crear |
| Frontend (React/Flutter/Electron) | — | — | Interceptor de renovación automática |

---

## 6. Riesgos abiertos post-implementación

| Riesgo | Fase | Mitigación |
|---|---|---|
| Tokens revocados aceptados hasta `exp` con `degraded_mode: true` | F2 | TTL de access token corto (15 min en F3 resuelve esto para la mayoría de casos) |
| Refresh tokens acumulan en BD sin limpieza | F3 | Query de limpieza periódica (DT-10 si se formaliza) |
| `jwt_secret` hardcodeado en `kong.yml` | F1 | DT-09 pendiente — no es parte de este DT |
| Sin tests unitarios en `servicio-identidad` | F3 | Anotado en estado del proyecto — los nuevos métodos deberían tener specs |

---

---

*Documento DT-04 expandido — tres fases independientes y acumulativas. Entregable académico orientado a cumplir ADR-005 y extenderlo con resiliencia real. Contiene código ejecutable para Kong 3.9 y NestJS 11, criterios de aceptación verificables y alcance honesto por fase.*

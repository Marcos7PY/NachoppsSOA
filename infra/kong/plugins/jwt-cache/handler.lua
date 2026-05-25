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
-- En modo normal: TTL = min(cache_ttl, exp - now).
-- En modo degradado: TTL = exp - now (tiempo completo restante del token).
-- Si la caché está llena, desaloja la entrada más antigua (FIFO).
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

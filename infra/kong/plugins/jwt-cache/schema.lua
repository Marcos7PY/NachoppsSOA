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

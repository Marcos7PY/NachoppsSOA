# Runbook: `degraded_mode` del jwt-cache de Kong

El plugin `jwt-cache` puede aceptar tokens cacheados cuando identidad no responde.
Con `degraded_mode: true`, un token ya cacheado sigue siendo valido hasta su `exp`
(15 minutos con la configuracion actual), incluso si el usuario hizo logout y el
token fue revocado en identidad durante la degradacion.

## Desactivar el modo degradado

Editar `infra/kong/kong.yml.template` y fijar `degraded_mode: false` en la
configuracion del plugin `jwt-cache`. Luego renderizar/reiniciar Kong segun el
procedimiento normal de despliegue.

## Vaciar la cache

La cache vive en memoria de Kong. Para vaciarla, hacer reload/restart de Kong:

```sh
docker compose -f infra/docker-compose.prod.yml restart kong
```

## Token comprometido durante degradacion

1. Rotar `JWT_PRIVATE_KEY` y `JWT_PUBLIC_KEY`.
2. Actualizar `KONG_JWT_PUBLIC_KEY` con la nueva publica.
3. Reiniciar identidad, servicios y Kong.

La rotacion del par RS256 invalida todos los access tokens de usuario emitidos
con la clave anterior.

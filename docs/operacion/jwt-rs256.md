# JWT RS256 — modelo de claves y rotación (plan 2.1)

## Modelo de confianza

| Token | Algoritmo | Firma | Verifica | Pasa por Kong |
|-------|-----------|-------|----------|---------------|
| **Usuario** (login) | RS256 | `servicio-identidad` con `JWT_PRIVATE_KEY` | Todos los servicios + Kong con `JWT_PUBLIC_KEY` | Sí (en el borde) |
| **Servicio** (S2S) | HS256 | Cualquier servicio con `SERVICE_JWT_SECRET` | El servicio destino con `SERVICE_JWT_SECRET` | No (red interna) |

Antes los 9 servicios compartían el mismo `JWT_SECRET` simétrico: filtrarlo en
cualquiera permitía forjar tokens para todos. Ahora:

- La **clave privada** (firma de usuarios) vive **solo en identidad**. Filtrar la
  pública en otro servicio **no** permite forjar.
- Los **tokens de servicio** usan un secreto **distinto** (`SERVICE_JWT_SECRET`),
  solo válido en la red interna; nunca llegan a Kong.
- La estrategia (`libs/shared-auth/src/lib/jwt-keys.ts`) elige la clave de
  verificación según el `alg` del token, devolviendo un secreto **distinto** para
  HS256 que para RS256 → cierra el ataque de confusión RS256→HS256.

## Variables de entorno

| Variable | Dónde | Formato |
|----------|-------|---------|
| `JWT_PRIVATE_KEY` | solo identidad | PEM PKCS8 en una línea con `\n` escapados |
| `JWT_PUBLIC_KEY` | todos los servicios | PEM SPKI en una línea con `\n` escapados |
| `KONG_JWT_PUBLIC_KEY` | Kong | == `JWT_PUBLIC_KEY` |
| `SERVICE_JWT_SECRET` | todos los servicios | cadena aleatoria larga |

Generar un par nuevo:

```sh
node scripts/generate-jwt-keys.mjs            # imprime las 3 líneas
node scripts/generate-jwt-keys.mjs claves.env # o las escribe a un archivo
```

En dev, las claves van embebidas como anclas YAML en `infra/docker-compose.yml`
(`&jwt_public` / `&jwt_private`). En prod, el compose las exige con `${VAR:?}`.

## Rotación (sin downtime)

1. Generar el par nuevo.
2. **Desplegar la pública nueva primero** en todos los servicios y Kong. Si se
   acepta validar con varias claves a la vez, mantener la antigua y la nueva
   durante la ventana de solape; si no, hacerlo en una ventana corta.
3. Desplegar la **privada nueva** en identidad. A partir de ese momento los
   tokens nuevos se firman con ella.
4. Esperar a que caduquen los tokens viejos (`JWT_EXPIRES_IN`, 24h) y retirar la
   pública antigua.

El `SERVICE_JWT_SECRET` se rota desplegando el nuevo valor en todos los servicios
a la vez (los tokens de servicio viven 1h).

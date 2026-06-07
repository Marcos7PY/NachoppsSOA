# Gestor de secretos — Docker secrets (plan 2.3)

Saca `JWT_*`, `DATABASE_URL` y `RABBITMQ_URI` del `.env` en claro y los inyecta
como Docker secrets montados en `/run/secrets/*`.

## Cómo funciona

1. `infra/entrypoint.sh` incluye un cargador de secretos: para cada variable de
   una lista (`DATABASE_URL`, `RABBITMQ_URI`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`,
   `SERVICE_JWT_SECRET`), si está definido `<VAR>_FILE` y el archivo existe,
   exporta `<VAR>` con su contenido **antes** de arrancar la app.
2. `infra/docker-compose.secrets.yml` declara los secretos (file-based), los monta
   en cada servicio y define los `<VAR>_FILE` apuntando a `/run/secrets/*`.

> **Caveat de interpolación.** Compose resuelve `${VAR:?}` en el host al generar la
> config, no dentro del contenedor. Por eso el `.env` debe definir *placeholders*
> para los `${VAR:?}` de `docker-compose.prod.yml` (`DB_PASS`, `JWT_PRIVATE_KEY`,
> etc.). Son valores **dummy**: el entrypoint los sobrescribe con el contenido real
> de los secretos en arranque. El valor verdadero nunca está en el entorno ni en
> `.env`.

## Despliegue

```sh
# 1. Crear los archivos de secreto (ver infra/secrets/README.md)
ls infra/secrets/   # jwt_private_key, jwt_public_key, service_jwt_secret,
                    # rabbitmq_uri, database_url_<servicio>…

# 2. .env con placeholders (NO secretos reales) que satisfagan los ${VAR:?}
cat > .env <<'EOF'
DB_PASS=placeholder
RABBITMQ_PASS=placeholder
JWT_PRIVATE_KEY=placeholder
JWT_PUBLIC_KEY=placeholder
SERVICE_JWT_SECRET=placeholder
KONG_JWT_PUBLIC_KEY=...    # la pública NO es secreta; va por env a Kong
CORS_ORIGIN=https://app.tudominio.com
KONG_CORS_ORIGINS=["https://app.tudominio.com"]
GRAFANA_PASS=...
EOF

# 3. Levantar con el overlay de secretos
docker compose -f infra/docker-compose.prod.yml -f infra/docker-compose.secrets.yml up -d
```

## Rotación

1. Reemplazar el archivo en `infra/secrets/` (o el secreto del orquestador).
2. `docker compose ... up -d <servicio>` para recrear el contenedor y recargar el
   secreto. Para JWT RS256 seguir además el orden de `docs/operacion/jwt-rs256.md`
   (pública primero en todos, luego privada en identidad).

## Migrar a un gestor externo (SSM / Vault)

El mismo contrato `<VAR>_FILE` permite usar un sidecar (Vault Agent, AWS Secrets
Manager CSI, etc.) que materialice los secretos como archivos en un volumen
montado en `/run/secrets`. No requiere cambios en la app: el entrypoint ya lee
`<VAR>_FILE`.

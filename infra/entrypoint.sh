#!/bin/sh
set -e

# ── Secretos vía *_FILE (plan 2.3 — Docker secrets) ──────────────────────────
# Si está definido <VAR>_FILE y el archivo existe, exporta <VAR> con su contenido.
# Permite inyectar JWT_*, DATABASE_URL y RABBITMQ_URI como Docker secrets en
# /run/secrets/* en vez de tenerlos en el entorno/.env en claro.
for var in DATABASE_URL RABBITMQ_URI JWT_PRIVATE_KEY JWT_PUBLIC_KEY SERVICE_JWT_SECRET; do
  eval "secret_file=\${${var}_FILE:-}"
  if [ -n "$secret_file" ] && [ -f "$secret_file" ]; then
    eval "export ${var}=\"\$(cat \"\$secret_file\")\""
    echo "==> [entrypoint] $var cargado desde Docker secret ($secret_file)"
  fi
done

echo "==> [entrypoint] Waiting for database..."
DB_HOST=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):\([0-9]*\)/.*|\1|p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):\([0-9]*\)/.*|\2|p')

until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  echo "    Database not ready, retrying in 2s..."
  sleep 2
done
echo "==> [entrypoint] Database is reachable on $DB_HOST:$DB_PORT"

sleep 3
echo "==> [entrypoint] Applying versioned Prisma migrations (migrate deploy)..."
# Producción: solo aplica migraciones versionadas y revisadas (carpeta prisma/migrations).
# NUNCA usar `db push --accept-data-loss` aquí: puede borrar columnas/tablas en silencio.
npx prisma migrate deploy --schema=./apps/${APP_NAME}/prisma/schema.prisma --config=./apps/${APP_NAME}/prisma/prisma.config.ts

echo "==> [entrypoint] Starting ${APP_NAME}..."
MAIN_JS=$(find dist/apps/${APP_NAME} -name "main.js" -path "*/src/main.js" | head -1)
exec node "$MAIN_JS"

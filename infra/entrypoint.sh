#!/bin/sh
set -e

echo "==> [entrypoint] Waiting for database..."
DB_HOST=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):\([0-9]*\)/.*|\1|p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):\([0-9]*\)/.*|\2|p')

until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  echo "    Database not ready, retrying in 2s..."
  sleep 2
done
echo "==> [entrypoint] Database is reachable on $DB_HOST:$DB_PORT"

sleep 3
echo "==> [entrypoint] Running Prisma migrations..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy --schema=./apps/${APP_NAME}/prisma/schema.prisma || true

echo "==> [entrypoint] Starting ${APP_NAME}..."
MAIN_JS=$(find dist/apps/${APP_NAME} -name "main.js" -path "*/src/main.js" | head -1)
exec node "$MAIN_JS"

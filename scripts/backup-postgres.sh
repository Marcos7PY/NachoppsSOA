#!/bin/sh
#
# Backup de las 9 BDs de NachoPps (plan 3.5).
#
# pg_dump por base a $BACKUP_DIR (comprimido) + retención por días. Pensado para
# correr como sidecar (ver servicio db-backup en docker-compose.prod.yml) o por
# cron. POSIX sh (compatible con postgres:16-alpine).
#
set -eu

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
PGUSER="${DB_USER:-nachopps}"
export PGPASSWORD="${DB_PASS:?DB_PASS requerido para los backups}"

mkdir -p "$BACKUP_DIR"
ts=$(date +%Y%m%d-%H%M%S)
fail=0

# pares "logical_db_name:host" (el host es el nombre de servicio del compose).
for pair in \
  reservas:db-reservas \
  mesas:db-mesas \
  pedidos:db-pedidos \
  cuentas:db-cuentas \
  inventario:db-inventario \
  caja:db-caja \
  reportes:db-reportes \
  identidad:db-identidad \
  notificaciones:db-notificaciones
do
  db="${pair%%:*}"
  host="${pair#*:}"
  out="$BACKUP_DIR/${db}_db-${ts}.sql.gz"
  if pg_dump -h "$host" -U "$PGUSER" -d "${db}_db" | gzip > "$out"; then
    echo "OK   backup ${db}_db -> $out ($(wc -c < "$out") bytes)"
  else
    echo "FALLO backup ${db}_db"
    rm -f "$out"
    fail=1
  fi
done

# Retención
find "$BACKUP_DIR" -name '*.sql.gz' -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true
echo "Retención aplicada: backups > ${RETENTION_DAYS} días eliminados"

exit "$fail"

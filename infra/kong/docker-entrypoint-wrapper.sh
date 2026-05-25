#!/bin/sh
set -e

# Genera kong.yml desde el template con variables de entorno.
# Kong 3.9 no soporta ${VAR} en config declarativa — envsubst resuelve esto.
# El template se copió a /tmp/ para que el usuario kong tenga permisos.
envsubst < /tmp/kong.yml.template > /kong/kong.yml

exec /docker-entrypoint.sh "$@"

#!/bin/bash
set -e

# Build all microservices (excluding PWA)
SERVICES=(
  "servicio-identidad"
  "servicio-mesas"
  "servicio-pedidos"
  "servicio-cuentas"
  "servicio-reservas"
  "servicio-inventario"
  "servicio-notificaciones"
  "servicio-caja"
  "servicio-reportes"
)

echo "=========================================="
echo "  Docker Build — All Services (no PWA)"
echo "=========================================="
echo ""

for svc in "${SERVICES[@]}"; do
  echo ">>> Building infra-${svc}..."
  docker build \
    --build-arg APP_NAME="${svc}" \
    -t "infra-${svc}" \
    -f Dockerfile \
    . 2>&1 | tee -a "logs/build-${svc}.log"
  echo ">>> Done: infra-${svc}"
  echo ""
done

echo "=========================================="
echo "  All services built successfully!"
echo "=========================================="
docker images | grep infra-

# Infra local: RabbitMQ, Postgres (todas las BD), Kong Gateway
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Set-Location $root

Write-Host "Levantando infra NachoPps (perfil dev)..." -ForegroundColor Cyan
docker compose -f infra/docker-compose.yml --profile dev up -d

Write-Host ""
Write-Host "Servicios:" -ForegroundColor Green
Write-Host "  RabbitMQ UI    http://localhost:15672  (nachopps / nachopps_secret)"
Write-Host "  Kong Proxy     http://localhost:8000"
Write-Host "  Kong Admin     http://localhost:8001"
Write-Host ""
Write-Host "Luego inicia los microservicios (nx serve) y prueba el gateway:" -ForegroundColor Yellow
Write-Host "  Invoke-RestMethod http://localhost:8000/pedidos"

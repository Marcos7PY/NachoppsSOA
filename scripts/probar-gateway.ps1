# Prueba HTTP vía Kong (puerto 8000). Requiere Kong + microservicios activos.
$ErrorActionPreference = "Continue"

Write-Host "`n=== Kong status ===" -ForegroundColor Cyan
try {
  Invoke-RestMethod http://localhost:8001/status | ConvertTo-Json -Depth 3
} catch {
  Write-Host "Kong Admin no responde en :8001. Ejecuta: .\scripts\levantar-infra.ps1" -ForegroundColor Red
  exit 1
}

Write-Host "`n=== GET /pedidos (gateway -> :3004) ===" -ForegroundColor Cyan
try {
  Invoke-RestMethod http://localhost:8000/pedidos
} catch {
  Write-Host "502/ error: ¿servicio-pedidos en nx serve con PORT=3004?" -ForegroundColor Yellow
}

Write-Host "`n=== POST /pedidos/pedidos ===" -ForegroundColor Cyan
$pedido = '{"mesa":7,"items":[{"producto":"Tacos","cantidad":3}]}'
try {
  Invoke-RestMethod -Method Post -Uri http://localhost:8000/pedidos/pedidos -Body $pedido -ContentType "application/json"
} catch {
  Write-Host "Error en POST pedidos" -ForegroundColor Yellow
}

Write-Host "`n=== GET /reservas ===" -ForegroundColor Cyan
try {
  Invoke-RestMethod http://localhost:8000/reservas
} catch {
  Write-Host "¿servicio-reservas en PORT=3006?" -ForegroundColor Yellow
}

Write-Host "`n=== POST /reservas/reservas ===" -ForegroundColor Cyan
$reserva = '{"clienteId":"g1","clienteNombre":"Ana","clienteTelefono":"600999888","fecha":"2026-05-25","hora":"21:00"}'
try {
  Invoke-RestMethod -Method Post -Uri http://localhost:8000/reservas/reservas -Body $reserva -ContentType "application/json"
} catch {
  Write-Host "Error en POST reservas" -ForegroundColor Yellow
}

Write-Host "`nRevisa logs de servicio-notificaciones si RabbitMQ está activo." -ForegroundColor Green

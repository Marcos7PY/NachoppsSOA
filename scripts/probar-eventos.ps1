# Prueba manual: pedidos/reservas -> notificaciones (RabbitMQ)
# Requisitos: infra levantada + los 3 servicios en nx serve

Write-Host "`n=== Health checks ===" -ForegroundColor Cyan
Invoke-RestMethod http://localhost:3008/api
Invoke-RestMethod http://localhost:3004/api
Invoke-RestMethod http://localhost:3006/api

Write-Host "`n=== Pedido -> notificaciones ===" -ForegroundColor Cyan
$pedido = @{
  mesaId = "mesa-5"
  items = @(
    @{ producto = "Hamburguesa"; cantidad = 2; area = "COCINA" }
    @{ producto = "Cerveza"; cantidad = 1; area = "BAR" }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri http://localhost:3004/api/pedidos -Body $pedido -ContentType "application/json"

Write-Host "`n=== Reserva -> notificaciones ===" -ForegroundColor Cyan
$reserva = @{
  clienteId = "cliente-001"
  clienteNombre = "María García"
  clienteTelefono = "+34600111222"
  fecha = "2026-05-20"
  hora = "20:30"
  mesaPreferida = "mesa-12"
  numComensales = 4
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:3006/api/reservas -Body $reserva -ContentType "application/json"

Write-Host "`nRevisa los logs de servicio-notificaciones (deberías ver pedido.creado y reserva.creada)" -ForegroundColor Green

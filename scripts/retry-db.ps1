$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot\..

Write-Host "`n>>> REINTENTANDO SINCRONIZACIÓN DE TODOS LOS ESQUEMAS <<<" -ForegroundColor Yellow

$services = @(
    "servicio-identidad",
    "servicio-mesas",
    "servicio-pedidos",
    "servicio-cuentas",
    "servicio-reservas",
    "servicio-inventario",
    "servicio-notificaciones",
    "servicio-caja",
    "servicio-reportes"
)

$dbPorts = @{
    "servicio-identidad" = "5439"
    "servicio-mesas" = "5433"
    "servicio-pedidos" = "5434"
    "servicio-cuentas" = "5435"
    "servicio-reservas" = "5441"
    "servicio-inventario" = "5436"
    "servicio-notificaciones" = "5440"
    "servicio-caja" = "5437"
    "servicio-reportes" = "5438"
}

foreach ($svc in $services) {
    $port = $dbPorts[$svc]
    $dbName = $svc -replace "servicio-", ""
    Write-Host "    $svc..." -NoNewline
    $env:DATABASE_URL = "postgresql://nachopps:secret@localhost:$port/$($dbName)_db?schema=public"
    Push-Location apps/$svc
    npx prisma db push --accept-data-loss 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green }
    else { Write-Host " FAIL" -ForegroundColor Red }
    Pop-Location
}

Write-Host "`n   Sembrando usuario admin..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://nachopps:secret@localhost:5439/identidad_db?schema=public"
Push-Location apps/servicio-identidad
node "..\..\scripts\seed-admin.js" 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "   Seed admin falló" -ForegroundColor Red }
else { Write-Host "   Seed completado" -ForegroundColor Green }
Pop-Location

Write-Host "`n>>> REINTENTANDO POBLACIÓN <<<" -ForegroundColor Cyan
npx tsx scripts/poblar-datos.ts

Write-Host "`n>>> PRUEBAS DE INTEGRACIÓN <<<" -ForegroundColor Cyan
npx tsx scripts/pruebas-integracion.ts

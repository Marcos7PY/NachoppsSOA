param(
  [Parameter(Mandatory = $true)]
  [string] $Service,
  [Parameter(Mandatory = $true)]
  [string] $Name
)

$ErrorActionPreference = "Stop"
$appPath = Join-Path $PSScriptRoot "..\apps\$Service"

if (-not (Test-Path $appPath)) {
  throw "No existe apps/$Service"
}

Push-Location $appPath
try {
  Write-Host "prisma migrate dev ($Service / $Name)..." -ForegroundColor Cyan
  npx prisma migrate dev --name $Name
  npx prisma generate
  Write-Host "Listo." -ForegroundColor Green
} finally {
  Pop-Location
}

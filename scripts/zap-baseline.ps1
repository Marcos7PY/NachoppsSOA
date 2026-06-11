<#
.SYNOPSIS
  Escaneo DAST pasivo (OWASP ZAP baseline) contra el gateway Kong local.
.DESCRIPTION
  Requiere el stack levantado (Kong en :8000). Genera informe HTML/JSON en logs/zap/.
.EXAMPLE
  pwsh scripts/zap-baseline.ps1                       # escanea Kong (API)
  pwsh scripts/zap-baseline.ps1 -Target http://host.docker.internal:4200  # PWA
#>
param(
  [string]$Target = 'http://host.docker.internal:8000',
  [int]$MaxMinutes = 5
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$reportDir = Join-Path $root 'logs\zap'
New-Item -ItemType Directory -Force $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

Write-Host "── ZAP baseline contra $Target (máx $MaxMinutes min)…"
docker run --rm `
  -v "${reportDir}:/zap/wrk:rw" `
  -v "${root}\infra\zap\zap-baseline.conf:/zap/wrk/zap-baseline.conf:ro" `
  zaproxy/zap-stable zap-baseline.py `
  -t $Target `
  -c zap-baseline.conf `
  -m $MaxMinutes `
  -r "zap-report-$stamp.html" `
  -J "zap-report-$stamp.json" `
  -a

# zap-baseline.py: 0 = limpio, 1 = FAIL encontrados, 2 = WARN encontrados, 3 = error de ejecución
switch ($LASTEXITCODE) {
  0 { Write-Host "✔ Sin hallazgos. Informe: logs/zap/zap-report-$stamp.html" }
  1 { Write-Error "✖ Hallazgos FAIL. Revisar logs/zap/zap-report-$stamp.html" }
  2 { Write-Warning "⚠ Hallazgos WARN. Revisar logs/zap/zap-report-$stamp.html" }
  default { Write-Error "Error de ejecución de ZAP (código $LASTEXITCODE). ¿Está el stack levantado?" }
}

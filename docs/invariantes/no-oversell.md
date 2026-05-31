---
tipo: invariante
slug: no-oversell
estado: verificada
fuente: [apps/servicio-inventario/src/app/app.service.ts:166, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# no-oversell

**Enunciado.** El sistema no descuenta stock por debajo de cero cuando el consumidor de inventario aplica `updateMany` con condicion de stock suficiente. [apps/servicio-inventario/src/app/app.service.ts:166]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [apps/servicio-inventario/src/app/app.service.ts:166]

**Mecanismo que la garantiza.** Ver mecanismo citado. [apps/servicio-inventario/src/app/app.service.ts:166]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

---
tipo: invariante
slug: retencion-idempotency-keys
estado: verificada
fuente: [apps/servicio-inventario/src/app/outbox.processor.ts:86, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# retencion-idempotency-keys

**Enunciado.** Pedidos e inventario purgan `idempotency_keys` con cron propio y retencion de siete dias. [apps/servicio-inventario/src/app/outbox.processor.ts:86]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [apps/servicio-inventario/src/app/outbox.processor.ts:86]

**Mecanismo que la garantiza.** Ver mecanismo citado. [apps/servicio-inventario/src/app/outbox.processor.ts:86]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

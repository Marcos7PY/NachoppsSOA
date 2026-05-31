---
tipo: invariante
slug: trust-boundary-stock-sync-mode
estado: verificada
fuente: [libs/contracts/src/domains/inventario.ts:125, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# trust-boundary-stock-sync-mode

**Enunciado.** El contrato limita `stockSyncMode` a `REPOSICION` o `CONSUMO_PEDIDO` y el consumidor citado decide como aplicarlo. [libs/contracts/src/domains/inventario.ts:125]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [libs/contracts/src/domains/inventario.ts:125]

**Mecanismo que la garantiza.** Ver mecanismo citado. [libs/contracts/src/domains/inventario.ts:125]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

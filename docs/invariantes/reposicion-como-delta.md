---
tipo: invariante
slug: reposicion-como-delta
estado: verificada
fuente: [libs/contracts/src/domains/inventario.ts:128, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# reposicion-como-delta

**Enunciado.** El contrato de producto actualizado transporta `stockSyncMode` y `stockDelta` para sincronizacion de stock. [libs/contracts/src/domains/inventario.ts:128]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [libs/contracts/src/domains/inventario.ts:128]

**Mecanismo que la garantiza.** Ver mecanismo citado. [libs/contracts/src/domains/inventario.ts:128]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

---
tipo: invariante
slug: idempotencia-directa
estado: verificada
fuente: [apps/servicio-inventario/src/app/app.service.ts:231, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# idempotencia-directa

**Enunciado.** El consumidor de `pedido.creado` reclama una clave de idempotencia y trata `P2002` como duplicado procesado. [apps/servicio-inventario/src/app/app.service.ts:231]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [apps/servicio-inventario/src/app/app.service.ts:231]

**Mecanismo que la garantiza.** Ver mecanismo citado. [apps/servicio-inventario/src/app/app.service.ts:231]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

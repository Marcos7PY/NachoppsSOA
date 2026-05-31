---
tipo: invariante
slug: idempotencia-inversa
estado: verificada
fuente: [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:9, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# idempotencia-inversa

**Enunciado.** Pedidos guarda claves de idempotencia para eventos de producto y el schema declara `idempotency_keys` con indice unico. [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:9]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:9]

**Mecanismo que la garantiza.** Ver mecanismo citado. [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:9]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:1]

---
tipo: invariante
slug: slot-reserva-activo-unico
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:1]
revisado: 2026-05-30
commit: 4c186bb
---

# slot-reserva-activo-unico

**Enunciado.** Reservas define una migracion de slot activo unico por fecha y hora. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20]

**Por que importa.** Protege consistencia de negocio en las rutas y consumidores enlazados. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20]

**Mecanismo que la garantiza.** Ver mecanismo citado. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20]

**Prueba que la verifica.** Reporte enlazado como evidencia de ejecucion. [stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:1]

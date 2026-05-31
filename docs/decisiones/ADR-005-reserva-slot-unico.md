---
tipo: adr
id: ADR-005
estado: aceptada
fecha: 2026-05-30
fuente: [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]
---

# ADR-005 - Reserva con slot activo unico

**Contexto.** La decision se materializa en las fuentes citadas. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

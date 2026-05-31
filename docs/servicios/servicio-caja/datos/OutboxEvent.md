---
tipo: modelo
servicio: servicio-caja
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-caja/prisma/schema.prisma:24, apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:25]
- `routingKey String`. [apps/servicio-caja/prisma/schema.prisma:26]
- `payload    String`. [apps/servicio-caja/prisma/schema.prisma:27]
- `status     String   @default("PENDING") // PENDING, PROCESSED, FAILED`. [apps/servicio-caja/prisma/schema.prisma:28]
- `attempts   Int      @default(0)`. [apps/servicio-caja/prisma/schema.prisma:29]
- `createdAt  DateTime @default(now())`. [apps/servicio-caja/prisma/schema.prisma:30]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-caja/prisma/schema.prisma:31]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:25]
- `@@index([status, createdAt])`. [apps/servicio-caja/prisma/schema.prisma:33]
- `@@map("outbox_events")`. [apps/servicio-caja/prisma/schema.prisma:34]

**Migraciones.** [apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-caja`; este atomo fija la estructura declarada por Prisma. [apps/servicio-caja/prisma/schema.prisma:24]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-caja/prisma/schema.prisma:24]

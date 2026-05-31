---
tipo: modelo
servicio: servicio-inventario
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-inventario/prisma/schema.prisma:38, apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:39]
- `routingKey String`. [apps/servicio-inventario/prisma/schema.prisma:40]
- `payload    String`. [apps/servicio-inventario/prisma/schema.prisma:41]
- `status     String   @default("PENDING")`. [apps/servicio-inventario/prisma/schema.prisma:42]
- `attempts   Int      @default(0)`. [apps/servicio-inventario/prisma/schema.prisma:43]
- `createdAt  DateTime @default(now())`. [apps/servicio-inventario/prisma/schema.prisma:44]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-inventario/prisma/schema.prisma:45]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:39]
- `@@index([status, createdAt])`. [apps/servicio-inventario/prisma/schema.prisma:47]
- `@@map("outbox_events")`. [apps/servicio-inventario/prisma/schema.prisma:48]

**Migraciones.** [apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-inventario`; este atomo fija la estructura declarada por Prisma. [apps/servicio-inventario/prisma/schema.prisma:38]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-inventario/prisma/schema.prisma:38]

---
tipo: modelo
servicio: servicio-reservas
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-reservas/prisma/schema.prisma:27, apps/servicio-reservas/prisma/migrations/20260525022523_init/migration.sql:1, apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-reservas/prisma/schema.prisma:28]
- `routingKey String`. [apps/servicio-reservas/prisma/schema.prisma:29]
- `payload    String`. [apps/servicio-reservas/prisma/schema.prisma:30]
- `status     String   @default("PENDING")`. [apps/servicio-reservas/prisma/schema.prisma:31]
- `attempts   Int      @default(0)`. [apps/servicio-reservas/prisma/schema.prisma:32]
- `createdAt  DateTime @default(now())`. [apps/servicio-reservas/prisma/schema.prisma:33]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-reservas/prisma/schema.prisma:34]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-reservas/prisma/schema.prisma:28]
- `@@index([status, createdAt])`. [apps/servicio-reservas/prisma/schema.prisma:36]
- `@@map("outbox_events")`. [apps/servicio-reservas/prisma/schema.prisma:37]

**Migraciones.** [apps/servicio-reservas/prisma/migrations/20260525022523_init/migration.sql:1], [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-reservas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-reservas/prisma/schema.prisma:27]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-reservas/prisma/schema.prisma:27]

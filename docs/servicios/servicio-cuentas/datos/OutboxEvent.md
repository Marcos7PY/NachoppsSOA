---
tipo: modelo
servicio: servicio-cuentas
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-cuentas/prisma/schema.prisma:30, apps/servicio-cuentas/prisma/migrations/20260525022109_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-cuentas/prisma/schema.prisma:31]
- `routingKey String`. [apps/servicio-cuentas/prisma/schema.prisma:32]
- `payload    String`. [apps/servicio-cuentas/prisma/schema.prisma:33]
- `status     String   @default("PENDING") // PENDING, PROCESSED, FAILED`. [apps/servicio-cuentas/prisma/schema.prisma:34]
- `attempts   Int      @default(0)`. [apps/servicio-cuentas/prisma/schema.prisma:35]
- `createdAt  DateTime @default(now())`. [apps/servicio-cuentas/prisma/schema.prisma:36]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-cuentas/prisma/schema.prisma:37]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-cuentas/prisma/schema.prisma:31]
- `@@index([status, createdAt])`. [apps/servicio-cuentas/prisma/schema.prisma:39]
- `@@map("outbox_events")`. [apps/servicio-cuentas/prisma/schema.prisma:40]

**Migraciones.** [apps/servicio-cuentas/prisma/migrations/20260525022109_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-cuentas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-cuentas/prisma/schema.prisma:30]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-cuentas/prisma/schema.prisma:30]

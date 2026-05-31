---
tipo: modelo
servicio: servicio-mesas
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-mesas/prisma/schema.prisma:31, apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-mesas/prisma/schema.prisma:32]
- `routingKey String`. [apps/servicio-mesas/prisma/schema.prisma:33]
- `payload    String`. [apps/servicio-mesas/prisma/schema.prisma:34]
- `status     String   @default("PENDING")`. [apps/servicio-mesas/prisma/schema.prisma:35]
- `attempts   Int      @default(0)`. [apps/servicio-mesas/prisma/schema.prisma:36]
- `createdAt  DateTime @default(now())`. [apps/servicio-mesas/prisma/schema.prisma:37]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-mesas/prisma/schema.prisma:38]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-mesas/prisma/schema.prisma:32]
- `@@index([status, createdAt])`. [apps/servicio-mesas/prisma/schema.prisma:40]
- `@@map("outbox_events")`. [apps/servicio-mesas/prisma/schema.prisma:41]

**Migraciones.** [apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-mesas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-mesas/prisma/schema.prisma:31]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-mesas/prisma/schema.prisma:31]

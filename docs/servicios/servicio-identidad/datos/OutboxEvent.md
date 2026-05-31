---
tipo: modelo
servicio: servicio-identidad
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-identidad/prisma/schema.prisma:33, apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1, apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:34]
- `routingKey String`. [apps/servicio-identidad/prisma/schema.prisma:35]
- `payload    String`. [apps/servicio-identidad/prisma/schema.prisma:36]
- `status     String   @default("PENDING")`. [apps/servicio-identidad/prisma/schema.prisma:37]
- `attempts   Int      @default(0)`. [apps/servicio-identidad/prisma/schema.prisma:38]
- `createdAt  DateTime @default(now())`. [apps/servicio-identidad/prisma/schema.prisma:39]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-identidad/prisma/schema.prisma:40]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:34]
- `@@index([status, createdAt])`. [apps/servicio-identidad/prisma/schema.prisma:42]
- `@@map("outbox_events")`. [apps/servicio-identidad/prisma/schema.prisma:43]

**Migraciones.** [apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1], [apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-identidad`; este atomo fija la estructura declarada por Prisma. [apps/servicio-identidad/prisma/schema.prisma:33]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-identidad/prisma/schema.prisma:33]

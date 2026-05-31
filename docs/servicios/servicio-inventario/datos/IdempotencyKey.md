---
tipo: modelo
servicio: servicio-inventario
tabla: idempotency_keys
modelo: IdempotencyKey
fuente: [apps/servicio-inventario/prisma/schema.prisma:51, apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# IdempotencyKey

**Campos.**

- `id        String   @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:52]
- `key       String   @unique`. [apps/servicio-inventario/prisma/schema.prisma:53]
- `createdAt DateTime @default(now())`. [apps/servicio-inventario/prisma/schema.prisma:54]

**Indices.**

- `id        String   @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:52]
- `key       String   @unique`. [apps/servicio-inventario/prisma/schema.prisma:53]
- `@@index([createdAt])`. [apps/servicio-inventario/prisma/schema.prisma:56]
- `@@map("idempotency_keys")`. [apps/servicio-inventario/prisma/schema.prisma:57]

**Migraciones.** [apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `IdempotencyKey` en el servicio `servicio-inventario`; este atomo fija la estructura declarada por Prisma. [apps/servicio-inventario/prisma/schema.prisma:51]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-inventario/prisma/schema.prisma:51]

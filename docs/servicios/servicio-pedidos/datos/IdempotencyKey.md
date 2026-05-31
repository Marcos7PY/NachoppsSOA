---
tipo: modelo
servicio: servicio-pedidos
tabla: idempotency_keys
modelo: IdempotencyKey
fuente: [apps/servicio-pedidos/prisma/schema.prisma:96, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# IdempotencyKey

**Campos.**

- `id        String   @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:97]
- `key       String   @unique`. [apps/servicio-pedidos/prisma/schema.prisma:98]
- `createdAt DateTime @default(now())`. [apps/servicio-pedidos/prisma/schema.prisma:99]

**Indices.**

- `id        String   @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:97]
- `key       String   @unique`. [apps/servicio-pedidos/prisma/schema.prisma:98]
- `@@index([createdAt])`. [apps/servicio-pedidos/prisma/schema.prisma:101]
- `@@map("idempotency_keys")`. [apps/servicio-pedidos/prisma/schema.prisma:102]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `IdempotencyKey` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:96]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:96]

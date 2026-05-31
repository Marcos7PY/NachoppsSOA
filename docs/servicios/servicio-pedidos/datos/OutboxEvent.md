---
tipo: modelo
servicio: servicio-pedidos
tabla: outbox_events
modelo: OutboxEvent
fuente: [apps/servicio-pedidos/prisma/schema.prisma:72, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# OutboxEvent

**Campos.**

- `id         String   @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:73]
- `routingKey String`. [apps/servicio-pedidos/prisma/schema.prisma:74]
- `payload    String`. [apps/servicio-pedidos/prisma/schema.prisma:75]
- `status     String   @default("PENDING")`. [apps/servicio-pedidos/prisma/schema.prisma:76]
- `attempts   Int      @default(0)`. [apps/servicio-pedidos/prisma/schema.prisma:77]
- `createdAt  DateTime @default(now())`. [apps/servicio-pedidos/prisma/schema.prisma:78]
- `updatedAt  DateTime @updatedAt`. [apps/servicio-pedidos/prisma/schema.prisma:79]

**Indices.**

- `id         String   @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:73]
- `@@index([status, createdAt])`. [apps/servicio-pedidos/prisma/schema.prisma:81]
- `@@map("outbox_events")`. [apps/servicio-pedidos/prisma/schema.prisma:82]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `OutboxEvent` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:72]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:72]

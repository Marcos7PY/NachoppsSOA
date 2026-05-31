---
tipo: modelo
servicio: servicio-pedidos
tabla: mesas_local
modelo: MesaLocal
fuente: [apps/servicio-pedidos/prisma/schema.prisma:54, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# MesaLocal

**Campos.**

- `id        String   @id`. [apps/servicio-pedidos/prisma/schema.prisma:55]
- `numero    Int`. [apps/servicio-pedidos/prisma/schema.prisma:56]
- `updatedAt DateTime @updatedAt`. [apps/servicio-pedidos/prisma/schema.prisma:57]

**Indices.**

- `id        String   @id`. [apps/servicio-pedidos/prisma/schema.prisma:55]
- `@@map("mesas_local")`. [apps/servicio-pedidos/prisma/schema.prisma:59]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `MesaLocal` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:54]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:54]

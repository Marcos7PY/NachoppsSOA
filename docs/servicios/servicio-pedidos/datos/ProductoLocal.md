---
tipo: modelo
servicio: servicio-pedidos
tabla: productos_locales
modelo: ProductoLocal
fuente: [apps/servicio-pedidos/prisma/schema.prisma:85, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# ProductoLocal

**Campos.**

- `id              String  @id`. [apps/servicio-pedidos/prisma/schema.prisma:86]
- `nombre          String`. [apps/servicio-pedidos/prisma/schema.prisma:87]
- `precio          Decimal @db.Decimal(10, 2)`. [apps/servicio-pedidos/prisma/schema.prisma:88]
- `stockActual     Int?`. [apps/servicio-pedidos/prisma/schema.prisma:89]
- `categoriaNombre String  @default("COCINA")`. [apps/servicio-pedidos/prisma/schema.prisma:90]
- `disponible      Boolean @default(true)`. [apps/servicio-pedidos/prisma/schema.prisma:91]

**Indices.**

- `id              String  @id`. [apps/servicio-pedidos/prisma/schema.prisma:86]
- `@@map("productos_locales")`. [apps/servicio-pedidos/prisma/schema.prisma:93]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `ProductoLocal` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:85]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:85]

---
tipo: modelo
servicio: servicio-inventario
tabla: categorias
modelo: Categoria
fuente: [apps/servicio-inventario/prisma/schema.prisma:11, apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Categoria

**Campos.**

- `id          String     @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:12]
- `nombre      String`. [apps/servicio-inventario/prisma/schema.prisma:13]
- `descripcion String?`. [apps/servicio-inventario/prisma/schema.prisma:14]
- `productos   Producto[]`. [apps/servicio-inventario/prisma/schema.prisma:15]
- `createdAt   DateTime   @default(now())`. [apps/servicio-inventario/prisma/schema.prisma:16]
- `updatedAt   DateTime   @updatedAt`. [apps/servicio-inventario/prisma/schema.prisma:17]

**Indices.**

- `id          String     @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:12]
- `@@map("categorias")`. [apps/servicio-inventario/prisma/schema.prisma:19]

**Migraciones.** [apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Categoria` en el servicio `servicio-inventario`; este atomo fija la estructura declarada por Prisma. [apps/servicio-inventario/prisma/schema.prisma:11]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-inventario/prisma/schema.prisma:11]

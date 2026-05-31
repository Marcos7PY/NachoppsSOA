---
tipo: modelo
servicio: servicio-inventario
tabla: productos
modelo: Producto
fuente: [apps/servicio-inventario/prisma/schema.prisma:22, apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Producto

**Campos.**

- `id          String    @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:23]
- `categoriaId String`. [apps/servicio-inventario/prisma/schema.prisma:24]
- `categoria   Categoria @relation(fields: [categoriaId], references: [id])`. [apps/servicio-inventario/prisma/schema.prisma:25]
- `nombre      String`. [apps/servicio-inventario/prisma/schema.prisma:26]
- `descripcion String?`. [apps/servicio-inventario/prisma/schema.prisma:27]
- `precio      Decimal   @db.Decimal(10, 2)`. [apps/servicio-inventario/prisma/schema.prisma:28]
- `disponible  Boolean   @default(true)`. [apps/servicio-inventario/prisma/schema.prisma:29]
- `stockActual Int?`. [apps/servicio-inventario/prisma/schema.prisma:30]
- `createdAt   DateTime  @default(now())`. [apps/servicio-inventario/prisma/schema.prisma:31]
- `updatedAt   DateTime  @updatedAt`. [apps/servicio-inventario/prisma/schema.prisma:32]

**Indices.**

- `id          String    @id @default(uuid())`. [apps/servicio-inventario/prisma/schema.prisma:23]
- `@@index([categoriaId])`. [apps/servicio-inventario/prisma/schema.prisma:34]
- `@@map("productos")`. [apps/servicio-inventario/prisma/schema.prisma:35]

**Migraciones.** [apps/servicio-inventario/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260528000000_add_outbox_events/migration.sql:1], [apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Producto` en el servicio `servicio-inventario`; este atomo fija la estructura declarada por Prisma. [apps/servicio-inventario/prisma/schema.prisma:22]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-inventario/prisma/schema.prisma:22]

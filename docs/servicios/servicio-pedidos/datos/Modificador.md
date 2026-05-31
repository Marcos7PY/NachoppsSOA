---
tipo: modelo
servicio: servicio-pedidos
tabla: modificadores
modelo: Modificador
fuente: [apps/servicio-pedidos/prisma/schema.prisma:62, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Modificador

**Campos.**

- `id           String     @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:63]
- `pedidoItemId String`. [apps/servicio-pedidos/prisma/schema.prisma:64]
- `pedidoItem   PedidoItem @relation(fields: [pedidoItemId], references: [id])`. [apps/servicio-pedidos/prisma/schema.prisma:65]
- `nombre       String`. [apps/servicio-pedidos/prisma/schema.prisma:66]
- `precioExtra  Decimal    @default(0) @db.Decimal(10, 2)`. [apps/servicio-pedidos/prisma/schema.prisma:67]

**Indices.**

- `id           String     @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:63]
- `@@map("modificadores")`. [apps/servicio-pedidos/prisma/schema.prisma:69]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Modificador` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:62]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:62]

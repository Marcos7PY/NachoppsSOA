---
tipo: modelo
servicio: servicio-pedidos
tabla: pedido_items
modelo: PedidoItem
fuente: [apps/servicio-pedidos/prisma/schema.prisma:36, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# PedidoItem

**Campos.**

- `id             String        @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:37]
- `pedidoId       String`. [apps/servicio-pedidos/prisma/schema.prisma:38]
- `pedido         Pedido        @relation(fields: [pedidoId], references: [id])`. [apps/servicio-pedidos/prisma/schema.prisma:39]
- `productoId     String`. [apps/servicio-pedidos/prisma/schema.prisma:40]
- `nombre         String`. [apps/servicio-pedidos/prisma/schema.prisma:41]
- `cantidad       Int`. [apps/servicio-pedidos/prisma/schema.prisma:42]
- `precioUnitario Decimal       @db.Decimal(10, 2)`. [apps/servicio-pedidos/prisma/schema.prisma:43]
- `area           String?       @default("COCINA")`. [apps/servicio-pedidos/prisma/schema.prisma:44]
- `notas          String?`. [apps/servicio-pedidos/prisma/schema.prisma:45]
- `estado         String        @default("PENDIENTE")`. [apps/servicio-pedidos/prisma/schema.prisma:46]
- `modificadores  Modificador[]`. [apps/servicio-pedidos/prisma/schema.prisma:47]
- `comensal       Int           @default(1)`. [apps/servicio-pedidos/prisma/schema.prisma:48]

**Indices.**

- `id             String        @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:37]
- `@@index([pedidoId])`. [apps/servicio-pedidos/prisma/schema.prisma:50]
- `@@map("pedido_items")`. [apps/servicio-pedidos/prisma/schema.prisma:51]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `PedidoItem` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:36]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:36]

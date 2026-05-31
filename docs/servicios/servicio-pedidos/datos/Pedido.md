---
tipo: modelo
servicio: servicio-pedidos
tabla: pedidos
modelo: Pedido
fuente: [apps/servicio-pedidos/prisma/schema.prisma:20, apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1, apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Pedido

**Campos.**

- `id             String       @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:21]
- `mesaId         String`. [apps/servicio-pedidos/prisma/schema.prisma:22]
- `numeroMesa     Int?`. [apps/servicio-pedidos/prisma/schema.prisma:23]
- `estado         PedidoEstado @default(PENDIENTE)`. [apps/servicio-pedidos/prisma/schema.prisma:24]
- `total          Decimal      @default(0) @db.Decimal(10, 2)`. [apps/servicio-pedidos/prisma/schema.prisma:25]
- `items          PedidoItem[]`. [apps/servicio-pedidos/prisma/schema.prisma:26]
- `comensales     Int          @default(1)`. [apps/servicio-pedidos/prisma/schema.prisma:27]
- `createdAt      DateTime     @default(now())`. [apps/servicio-pedidos/prisma/schema.prisma:28]
- `updatedAt      DateTime     @updatedAt`. [apps/servicio-pedidos/prisma/schema.prisma:29]

**Indices.**

- `id             String       @id @default(uuid())`. [apps/servicio-pedidos/prisma/schema.prisma:21]
- `@@index([mesaId])`. [apps/servicio-pedidos/prisma/schema.prisma:31]
- `@@index([estado])`. [apps/servicio-pedidos/prisma/schema.prisma:32]
- `@@map("pedidos")`. [apps/servicio-pedidos/prisma/schema.prisma:33]

**Migraciones.** [apps/servicio-pedidos/prisma/migrations/20260525022137_init/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1], [apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Pedido` en el servicio `servicio-pedidos`; este atomo fija la estructura declarada por Prisma. [apps/servicio-pedidos/prisma/schema.prisma:20]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-pedidos/prisma/schema.prisma:20]

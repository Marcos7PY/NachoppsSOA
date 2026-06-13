---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: PedidoItem
fuente: [apps/servicio-pedidos/prisma/schema.prisma:41]
revisado: 2026-06-02
commit: 53877c8
---

# PedidoItem

**Fuente.** Modelo Prisma `PedidoItem` definido en [apps/servicio-pedidos/prisma/schema.prisma:41].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:42 | `id             String        @id @default(uuid())` |
| apps/servicio-pedidos/prisma/schema.prisma:43 | `pedidoId       String` |
| apps/servicio-pedidos/prisma/schema.prisma:44 | `pedido         Pedido        @relation(fields: [pedidoId], references: [id])` |
| apps/servicio-pedidos/prisma/schema.prisma:45 | `productoId     String` |
| apps/servicio-pedidos/prisma/schema.prisma:46 | `nombre         String` |
| apps/servicio-pedidos/prisma/schema.prisma:47 | `cantidad       Int` |
| apps/servicio-pedidos/prisma/schema.prisma:48 | `precioUnitario Decimal       @db.Decimal(10, 2)` |
| apps/servicio-pedidos/prisma/schema.prisma:49 | `area           String?       @default("COCINA")` |
| apps/servicio-pedidos/prisma/schema.prisma:50 | `notas          String?` |
| apps/servicio-pedidos/prisma/schema.prisma:51 | `estado         String        @default("PENDIENTE")` |
| apps/servicio-pedidos/prisma/schema.prisma:53 | `comensal       Int           @default(1)` |
| apps/servicio-pedidos/prisma/schema.prisma:55 | `@@index([pedidoId])` |
| apps/servicio-pedidos/prisma/schema.prisma:56 | `@@map("pedido_items")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

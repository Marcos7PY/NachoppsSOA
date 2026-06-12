---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: Pedido
fuente: [apps/servicio-pedidos/prisma/schema.prisma:20]
revisado: 2026-06-02
commit: 53877c8
---

# Pedido

**Fuente.** Modelo Prisma `Pedido` definido en [apps/servicio-pedidos/prisma/schema.prisma:20].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:21 | `id             String       @id @default(uuid())` |
| apps/servicio-pedidos/prisma/schema.prisma:22 | `mesaId         String` |
| apps/servicio-pedidos/prisma/schema.prisma:23 | `numeroMesa     Int?` |
| apps/servicio-pedidos/prisma/schema.prisma:24 | `estado         PedidoEstado @default(PENDIENTE)` |
| apps/servicio-pedidos/prisma/schema.prisma:25 | `total          Decimal      @default(0) @db.Decimal(10, 2)` |
| apps/servicio-pedidos/prisma/schema.prisma:26 | `items          PedidoItem[]` |
| apps/servicio-pedidos/prisma/schema.prisma:27 | `comensales     Int          @default(1)` |
| apps/servicio-pedidos/prisma/schema.prisma:28 | `cliente        String?` |
| apps/servicio-pedidos/prisma/schema.prisma:29 | `telefono       String?` |
| apps/servicio-pedidos/prisma/schema.prisma:30 | `direccion      String?` |
| apps/servicio-pedidos/prisma/schema.prisma:31 | `proveedor      String?` |
| apps/servicio-pedidos/prisma/schema.prisma:32 | `modalidad      String?      @default("MESA")` |
| apps/servicio-pedidos/prisma/schema.prisma:33 | `createdAt      DateTime     @default(now())` |
| apps/servicio-pedidos/prisma/schema.prisma:34 | `updatedAt      DateTime     @updatedAt` |
| apps/servicio-pedidos/prisma/schema.prisma:36 | `@@index([mesaId])` |
| apps/servicio-pedidos/prisma/schema.prisma:37 | `@@index([estado])` |
| apps/servicio-pedidos/prisma/schema.prisma:38 | `@@map("pedidos")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

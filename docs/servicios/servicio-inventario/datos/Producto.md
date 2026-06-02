---
tipo: modelo-datos
servicio: servicio-inventario
modelo: Producto
fuente: [apps/servicio-inventario/prisma/schema.prisma:22]
revisado: 2026-06-02
commit: 53877c8
---

# Producto

**Fuente.** Modelo Prisma `Producto` definido en [apps/servicio-inventario/prisma/schema.prisma:22].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-inventario/prisma/schema.prisma:23 | `id          String    @id @default(uuid())` |
| apps/servicio-inventario/prisma/schema.prisma:24 | `categoriaId String` |
| apps/servicio-inventario/prisma/schema.prisma:25 | `categoria   Categoria @relation(fields: [categoriaId], references: [id])` |
| apps/servicio-inventario/prisma/schema.prisma:26 | `nombre      String` |
| apps/servicio-inventario/prisma/schema.prisma:27 | `descripcion String?` |
| apps/servicio-inventario/prisma/schema.prisma:28 | `precio      Decimal   @db.Decimal(10, 2)` |
| apps/servicio-inventario/prisma/schema.prisma:29 | `disponible  Boolean   @default(true)` |
| apps/servicio-inventario/prisma/schema.prisma:30 | `stockActual Int?` |
| apps/servicio-inventario/prisma/schema.prisma:31 | `createdAt   DateTime  @default(now())` |
| apps/servicio-inventario/prisma/schema.prisma:32 | `updatedAt   DateTime  @updatedAt` |
| apps/servicio-inventario/prisma/schema.prisma:34 | `@@index([categoriaId])` |
| apps/servicio-inventario/prisma/schema.prisma:35 | `@@map("productos")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

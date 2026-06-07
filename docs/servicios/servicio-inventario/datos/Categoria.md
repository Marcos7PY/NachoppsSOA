---
tipo: modelo-datos
servicio: servicio-inventario
modelo: Categoria
fuente: [apps/servicio-inventario/prisma/schema.prisma:11]
revisado: 2026-06-02
commit: 53877c8
---

# Categoria

**Fuente.** Modelo Prisma `Categoria` definido en [apps/servicio-inventario/prisma/schema.prisma:11].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-inventario/prisma/schema.prisma:12 | `id          String     @id @default(uuid())` |
| apps/servicio-inventario/prisma/schema.prisma:13 | `nombre      String` |
| apps/servicio-inventario/prisma/schema.prisma:14 | `descripcion String?` |
| apps/servicio-inventario/prisma/schema.prisma:15 | `productos   Producto[]` |
| apps/servicio-inventario/prisma/schema.prisma:16 | `createdAt   DateTime   @default(now())` |
| apps/servicio-inventario/prisma/schema.prisma:17 | `updatedAt   DateTime   @updatedAt` |
| apps/servicio-inventario/prisma/schema.prisma:19 | `@@map("categorias")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

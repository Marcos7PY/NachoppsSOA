---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: ProductoLocal
fuente: [apps/servicio-pedidos/prisma/schema.prisma:90]
revisado: 2026-06-02
commit: 53877c8
---

# ProductoLocal

**Fuente.** Modelo Prisma `ProductoLocal` definido en [apps/servicio-pedidos/prisma/schema.prisma:90].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:91 | `id              String  @id` |
| apps/servicio-pedidos/prisma/schema.prisma:92 | `nombre          String` |
| apps/servicio-pedidos/prisma/schema.prisma:93 | `precio          Decimal @db.Decimal(10, 2)` |
| apps/servicio-pedidos/prisma/schema.prisma:94 | `stockActual     Int?` |
| apps/servicio-pedidos/prisma/schema.prisma:95 | `categoriaNombre String  @default("COCINA")` |
| apps/servicio-pedidos/prisma/schema.prisma:96 | `disponible      Boolean @default(true)` |
| apps/servicio-pedidos/prisma/schema.prisma:98 | `@@map("productos_locales")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

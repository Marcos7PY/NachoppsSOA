---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: Modificador
fuente: [apps/servicio-pedidos/prisma/schema.prisma:67]
revisado: 2026-06-02
commit: 53877c8
---

# Modificador

**Fuente.** Modelo Prisma `Modificador` definido en [apps/servicio-pedidos/prisma/schema.prisma:67].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:68 | `id           String     @id @default(uuid())` |
| apps/servicio-pedidos/prisma/schema.prisma:69 | `pedidoItemId String` |
| apps/servicio-pedidos/prisma/schema.prisma:70 | `pedidoItem   PedidoItem @relation(fields: [pedidoItemId], references: [id])` |
| apps/servicio-pedidos/prisma/schema.prisma:71 | `nombre       String` |
| apps/servicio-pedidos/prisma/schema.prisma:72 | `precioExtra  Decimal    @default(0) @db.Decimal(10, 2)` |
| apps/servicio-pedidos/prisma/schema.prisma:74 | `@@map("modificadores")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

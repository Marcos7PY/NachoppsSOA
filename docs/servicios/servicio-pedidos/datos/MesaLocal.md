---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: MesaLocal
fuente: [apps/servicio-pedidos/prisma/schema.prisma:59]
revisado: 2026-06-02
commit: 53877c8
---

# MesaLocal

**Fuente.** Modelo Prisma `MesaLocal` definido en [apps/servicio-pedidos/prisma/schema.prisma:59].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:60 | `id        String   @id` |
| apps/servicio-pedidos/prisma/schema.prisma:61 | `numero    Int` |
| apps/servicio-pedidos/prisma/schema.prisma:62 | `updatedAt DateTime @updatedAt` |
| apps/servicio-pedidos/prisma/schema.prisma:64 | `@@map("mesas_local")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

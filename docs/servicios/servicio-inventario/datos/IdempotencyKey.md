---
tipo: modelo-datos
servicio: servicio-inventario
modelo: IdempotencyKey
fuente: [apps/servicio-inventario/prisma/schema.prisma:51]
revisado: 2026-06-02
commit: 53877c8
---

# IdempotencyKey

**Fuente.** Modelo Prisma `IdempotencyKey` definido en [apps/servicio-inventario/prisma/schema.prisma:51].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-inventario/prisma/schema.prisma:52 | `id        String   @id @default(uuid())` |
| apps/servicio-inventario/prisma/schema.prisma:53 | `key       String   @unique` |
| apps/servicio-inventario/prisma/schema.prisma:54 | `createdAt DateTime @default(now())` |
| apps/servicio-inventario/prisma/schema.prisma:56 | `@@index([createdAt])` |
| apps/servicio-inventario/prisma/schema.prisma:57 | `@@map("idempotency_keys")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

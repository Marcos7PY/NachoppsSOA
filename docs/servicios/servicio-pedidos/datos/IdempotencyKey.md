---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: IdempotencyKey
fuente: [apps/servicio-pedidos/prisma/schema.prisma:101]
revisado: 2026-06-02
commit: 53877c8
---

# IdempotencyKey

**Fuente.** Modelo Prisma `IdempotencyKey` definido en [apps/servicio-pedidos/prisma/schema.prisma:101].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:102 | `id        String   @id @default(uuid())` |
| apps/servicio-pedidos/prisma/schema.prisma:103 | `key       String   @unique` |
| apps/servicio-pedidos/prisma/schema.prisma:104 | `createdAt DateTime @default(now())` |
| apps/servicio-pedidos/prisma/schema.prisma:106 | `@@index([createdAt])` |
| apps/servicio-pedidos/prisma/schema.prisma:107 | `@@map("idempotency_keys")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

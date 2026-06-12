---
tipo: modelo-datos
servicio: servicio-mesas
modelo: IdempotencyKey
fuente: [apps/servicio-mesas/prisma/schema.prisma:44]
revisado: 2026-06-02
commit: 53877c8
---

# IdempotencyKey

**Fuente.** Modelo Prisma `IdempotencyKey` definido en [apps/servicio-mesas/prisma/schema.prisma:44].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-mesas/prisma/schema.prisma:45 | `key       String   @id` |
| apps/servicio-mesas/prisma/schema.prisma:46 | `createdAt DateTime @default(now())` |
| apps/servicio-mesas/prisma/schema.prisma:48 | `@@map("idempotency_keys")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

---
tipo: modelo-datos
servicio: servicio-reportes
modelo: IdempotencyKey
fuente: [apps/servicio-reportes/prisma/schema.prisma:23]
revisado: 2026-06-02
commit: 53877c8
---

# IdempotencyKey

**Fuente.** Modelo Prisma `IdempotencyKey` definido en [apps/servicio-reportes/prisma/schema.prisma:23].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-reportes/prisma/schema.prisma:24 | `key       String   @id` |
| apps/servicio-reportes/prisma/schema.prisma:25 | `createdAt DateTime @default(now())` |
| apps/servicio-reportes/prisma/schema.prisma:27 | `@@map("idempotency_keys")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

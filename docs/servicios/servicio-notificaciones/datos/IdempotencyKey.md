---
tipo: modelo-datos
servicio: servicio-notificaciones
modelo: IdempotencyKey
fuente: [apps/servicio-notificaciones/prisma/schema.prisma:21]
revisado: 2026-06-02
commit: 53877c8
---

# IdempotencyKey

**Fuente.** Modelo Prisma `IdempotencyKey` definido en [apps/servicio-notificaciones/prisma/schema.prisma:21].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-notificaciones/prisma/schema.prisma:22 | `key       String   @id` |
| apps/servicio-notificaciones/prisma/schema.prisma:23 | `createdAt DateTime @default(now())` |
| apps/servicio-notificaciones/prisma/schema.prisma:25 | `@@map("idempotency_keys")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

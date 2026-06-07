---
tipo: modelo-datos
servicio: servicio-reservas
modelo: OutboxEvent
fuente: [apps/servicio-reservas/prisma/schema.prisma:27]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-reservas/prisma/schema.prisma:27].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-reservas/prisma/schema.prisma:28 | `id         String   @id @default(uuid())` |
| apps/servicio-reservas/prisma/schema.prisma:29 | `routingKey String` |
| apps/servicio-reservas/prisma/schema.prisma:30 | `payload    String` |
| apps/servicio-reservas/prisma/schema.prisma:31 | `status     String   @default("PENDING")` |
| apps/servicio-reservas/prisma/schema.prisma:32 | `attempts   Int      @default(0)` |
| apps/servicio-reservas/prisma/schema.prisma:33 | `createdAt  DateTime @default(now())` |
| apps/servicio-reservas/prisma/schema.prisma:34 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-reservas/prisma/schema.prisma:36 | `@@index([status, createdAt])` |
| apps/servicio-reservas/prisma/schema.prisma:37 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

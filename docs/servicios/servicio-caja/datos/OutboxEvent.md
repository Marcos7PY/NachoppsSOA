---
tipo: modelo-datos
servicio: servicio-caja
modelo: OutboxEvent
fuente: [apps/servicio-caja/prisma/schema.prisma:24]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-caja/prisma/schema.prisma:24].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-caja/prisma/schema.prisma:25 | `id         String   @id @default(uuid())` |
| apps/servicio-caja/prisma/schema.prisma:26 | `routingKey String` |
| apps/servicio-caja/prisma/schema.prisma:27 | `payload    String` |
| apps/servicio-caja/prisma/schema.prisma:28 | `status     String   @default("PENDING") // PENDING, PROCESSED, FAILED` |
| apps/servicio-caja/prisma/schema.prisma:29 | `attempts   Int      @default(0)` |
| apps/servicio-caja/prisma/schema.prisma:30 | `createdAt  DateTime @default(now())` |
| apps/servicio-caja/prisma/schema.prisma:31 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-caja/prisma/schema.prisma:33 | `@@index([status, createdAt])` |
| apps/servicio-caja/prisma/schema.prisma:34 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

---
tipo: modelo-datos
servicio: servicio-mesas
modelo: OutboxEvent
fuente: [apps/servicio-mesas/prisma/schema.prisma:31]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-mesas/prisma/schema.prisma:31].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-mesas/prisma/schema.prisma:32 | `id         String   @id @default(uuid())` |
| apps/servicio-mesas/prisma/schema.prisma:33 | `routingKey String` |
| apps/servicio-mesas/prisma/schema.prisma:34 | `payload    String` |
| apps/servicio-mesas/prisma/schema.prisma:35 | `status     String   @default("PENDING")` |
| apps/servicio-mesas/prisma/schema.prisma:36 | `attempts   Int      @default(0)` |
| apps/servicio-mesas/prisma/schema.prisma:37 | `createdAt  DateTime @default(now())` |
| apps/servicio-mesas/prisma/schema.prisma:38 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-mesas/prisma/schema.prisma:40 | `@@index([status, createdAt])` |
| apps/servicio-mesas/prisma/schema.prisma:41 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

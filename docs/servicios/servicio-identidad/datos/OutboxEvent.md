---
tipo: modelo-datos
servicio: servicio-identidad
modelo: OutboxEvent
fuente: [apps/servicio-identidad/prisma/schema.prisma:33]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-identidad/prisma/schema.prisma:33].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-identidad/prisma/schema.prisma:34 | `id         String   @id @default(uuid())` |
| apps/servicio-identidad/prisma/schema.prisma:35 | `routingKey String` |
| apps/servicio-identidad/prisma/schema.prisma:36 | `payload    String` |
| apps/servicio-identidad/prisma/schema.prisma:37 | `status     String   @default("PENDING")` |
| apps/servicio-identidad/prisma/schema.prisma:38 | `attempts   Int      @default(0)` |
| apps/servicio-identidad/prisma/schema.prisma:39 | `createdAt  DateTime @default(now())` |
| apps/servicio-identidad/prisma/schema.prisma:40 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-identidad/prisma/schema.prisma:42 | `@@index([status, createdAt])` |
| apps/servicio-identidad/prisma/schema.prisma:43 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

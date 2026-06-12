---
tipo: modelo-datos
servicio: servicio-inventario
modelo: OutboxEvent
fuente: [apps/servicio-inventario/prisma/schema.prisma:38]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-inventario/prisma/schema.prisma:38].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-inventario/prisma/schema.prisma:39 | `id         String   @id @default(uuid())` |
| apps/servicio-inventario/prisma/schema.prisma:40 | `routingKey String` |
| apps/servicio-inventario/prisma/schema.prisma:41 | `payload    String` |
| apps/servicio-inventario/prisma/schema.prisma:42 | `status     String   @default("PENDING")` |
| apps/servicio-inventario/prisma/schema.prisma:43 | `attempts   Int      @default(0)` |
| apps/servicio-inventario/prisma/schema.prisma:44 | `createdAt  DateTime @default(now())` |
| apps/servicio-inventario/prisma/schema.prisma:45 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-inventario/prisma/schema.prisma:47 | `@@index([status, createdAt])` |
| apps/servicio-inventario/prisma/schema.prisma:48 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

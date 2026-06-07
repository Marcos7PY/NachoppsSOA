---
tipo: modelo-datos
servicio: servicio-pedidos
modelo: OutboxEvent
fuente: [apps/servicio-pedidos/prisma/schema.prisma:77]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-pedidos/prisma/schema.prisma:77].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-pedidos/prisma/schema.prisma:78 | `id         String   @id @default(uuid())` |
| apps/servicio-pedidos/prisma/schema.prisma:79 | `routingKey String` |
| apps/servicio-pedidos/prisma/schema.prisma:80 | `payload    String` |
| apps/servicio-pedidos/prisma/schema.prisma:81 | `status     String   @default("PENDING")` |
| apps/servicio-pedidos/prisma/schema.prisma:82 | `attempts   Int      @default(0)` |
| apps/servicio-pedidos/prisma/schema.prisma:83 | `createdAt  DateTime @default(now())` |
| apps/servicio-pedidos/prisma/schema.prisma:84 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-pedidos/prisma/schema.prisma:86 | `@@index([status, createdAt])` |
| apps/servicio-pedidos/prisma/schema.prisma:87 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

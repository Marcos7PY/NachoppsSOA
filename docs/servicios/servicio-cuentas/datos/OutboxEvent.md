---
tipo: modelo-datos
servicio: servicio-cuentas
modelo: OutboxEvent
fuente: [apps/servicio-cuentas/prisma/schema.prisma:30]
revisado: 2026-06-02
commit: 53877c8
---

# OutboxEvent

**Fuente.** Modelo Prisma `OutboxEvent` definido en [apps/servicio-cuentas/prisma/schema.prisma:30].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-cuentas/prisma/schema.prisma:31 | `id         String   @id @default(uuid())` |
| apps/servicio-cuentas/prisma/schema.prisma:32 | `routingKey String` |
| apps/servicio-cuentas/prisma/schema.prisma:33 | `payload    String` |
| apps/servicio-cuentas/prisma/schema.prisma:34 | `status     String   @default("PENDING") // PENDING, PROCESSED, FAILED` |
| apps/servicio-cuentas/prisma/schema.prisma:35 | `attempts   Int      @default(0)` |
| apps/servicio-cuentas/prisma/schema.prisma:36 | `createdAt  DateTime @default(now())` |
| apps/servicio-cuentas/prisma/schema.prisma:37 | `updatedAt  DateTime @updatedAt` |
| apps/servicio-cuentas/prisma/schema.prisma:39 | `@@index([status, createdAt])` |
| apps/servicio-cuentas/prisma/schema.prisma:40 | `@@map("outbox_events")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

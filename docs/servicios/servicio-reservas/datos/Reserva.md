---
tipo: modelo
servicio: servicio-reservas
tabla: Reserva
modelo: Reserva
fuente: [apps/servicio-reservas/prisma/schema.prisma:10, apps/servicio-reservas/prisma/migrations/20260525022523_init/migration.sql:1, apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Reserva

**Campos.**

- `id              String   @id @default(uuid())`. [apps/servicio-reservas/prisma/schema.prisma:11]
- `clienteId       String?`. [apps/servicio-reservas/prisma/schema.prisma:12]
- `clienteNombre   String`. [apps/servicio-reservas/prisma/schema.prisma:13]
- `clienteTelefono String?`. [apps/servicio-reservas/prisma/schema.prisma:14]
- `fecha           DateTime @db.Date`. [apps/servicio-reservas/prisma/schema.prisma:15]
- `hora            String`. [apps/servicio-reservas/prisma/schema.prisma:16]
- `mesaPreferida   String?`. [apps/servicio-reservas/prisma/schema.prisma:17]
- `numComensales   Int      @default(2)`. [apps/servicio-reservas/prisma/schema.prisma:18]
- `estado          String   @default("PENDIENTE")`. [apps/servicio-reservas/prisma/schema.prisma:19]
- `createdAt       DateTime @default(now())`. [apps/servicio-reservas/prisma/schema.prisma:20]
- `updatedAt       DateTime @updatedAt`. [apps/servicio-reservas/prisma/schema.prisma:21]

**Indices.**

- `id              String   @id @default(uuid())`. [apps/servicio-reservas/prisma/schema.prisma:11]
- `@@index([fecha, hora])`. [apps/servicio-reservas/prisma/schema.prisma:23]
- `@@index([estado])`. [apps/servicio-reservas/prisma/schema.prisma:24]

**Migraciones.** [apps/servicio-reservas/prisma/migrations/20260525022523_init/migration.sql:1], [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Reserva` en el servicio `servicio-reservas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-reservas/prisma/schema.prisma:10]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-reservas/prisma/schema.prisma:10]

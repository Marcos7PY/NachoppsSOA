---
tipo: modelo-datos
servicio: servicio-reservas
modelo: Reserva
fuente: [apps/servicio-reservas/prisma/schema.prisma:10]
revisado: 2026-06-02
commit: 53877c8
---

# Reserva

**Fuente.** Modelo Prisma `Reserva` definido en [apps/servicio-reservas/prisma/schema.prisma:10].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-reservas/prisma/schema.prisma:11 | `id              String   @id @default(uuid())` |
| apps/servicio-reservas/prisma/schema.prisma:12 | `clienteId       String?` |
| apps/servicio-reservas/prisma/schema.prisma:13 | `clienteNombre   String` |
| apps/servicio-reservas/prisma/schema.prisma:14 | `clienteTelefono String?` |
| apps/servicio-reservas/prisma/schema.prisma:15 | `fecha           DateTime @db.Date` |
| apps/servicio-reservas/prisma/schema.prisma:16 | `hora            String` |
| apps/servicio-reservas/prisma/schema.prisma:17 | `mesaPreferida   String?` |
| apps/servicio-reservas/prisma/schema.prisma:18 | `numComensales   Int      @default(2)` |
| apps/servicio-reservas/prisma/schema.prisma:19 | `estado          String   @default("PENDIENTE")` |
| apps/servicio-reservas/prisma/schema.prisma:20 | `createdAt       DateTime @default(now())` |
| apps/servicio-reservas/prisma/schema.prisma:21 | `updatedAt       DateTime @updatedAt` |
| apps/servicio-reservas/prisma/schema.prisma:23 | `@@index([fecha, hora])` |
| apps/servicio-reservas/prisma/schema.prisma:24 | `@@index([estado])` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

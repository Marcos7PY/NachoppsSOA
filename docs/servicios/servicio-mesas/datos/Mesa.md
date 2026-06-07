---
tipo: modelo-datos
servicio: servicio-mesas
modelo: Mesa
fuente: [apps/servicio-mesas/prisma/schema.prisma:17]
revisado: 2026-06-02
commit: 53877c8
---

# Mesa

**Fuente.** Modelo Prisma `Mesa` definido en [apps/servicio-mesas/prisma/schema.prisma:17].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-mesas/prisma/schema.prisma:18 | `id             String     @id @default(uuid())` |
| apps/servicio-mesas/prisma/schema.prisma:19 | `numero         Int        @unique` |
| apps/servicio-mesas/prisma/schema.prisma:20 | `capacidad      Int` |
| apps/servicio-mesas/prisma/schema.prisma:21 | `ubicacion      String     @default("Salon Principal")` |
| apps/servicio-mesas/prisma/schema.prisma:22 | `estado         MesaEstado @default(LIBRE)` |
| apps/servicio-mesas/prisma/schema.prisma:23 | `cuentaAsociada String?` |
| apps/servicio-mesas/prisma/schema.prisma:24 | `createdAt      DateTime   @default(now())` |
| apps/servicio-mesas/prisma/schema.prisma:25 | `updatedAt      DateTime   @updatedAt` |
| apps/servicio-mesas/prisma/schema.prisma:27 | `@@index([estado])` |
| apps/servicio-mesas/prisma/schema.prisma:28 | `@@map("mesas")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

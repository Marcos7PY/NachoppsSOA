---
tipo: modelo
servicio: servicio-mesas
tabla: mesas
modelo: Mesa
fuente: [apps/servicio-mesas/prisma/schema.prisma:17, apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Mesa

**Campos.**

- `id             String     @id @default(uuid())`. [apps/servicio-mesas/prisma/schema.prisma:18]
- `numero         Int        @unique`. [apps/servicio-mesas/prisma/schema.prisma:19]
- `capacidad      Int`. [apps/servicio-mesas/prisma/schema.prisma:20]
- `ubicacion      String     @default("Salon Principal")`. [apps/servicio-mesas/prisma/schema.prisma:21]
- `estado         MesaEstado @default(LIBRE)`. [apps/servicio-mesas/prisma/schema.prisma:22]
- `cuentaAsociada String?`. [apps/servicio-mesas/prisma/schema.prisma:23]
- `createdAt      DateTime   @default(now())`. [apps/servicio-mesas/prisma/schema.prisma:24]
- `updatedAt      DateTime   @updatedAt`. [apps/servicio-mesas/prisma/schema.prisma:25]

**Indices.**

- `id             String     @id @default(uuid())`. [apps/servicio-mesas/prisma/schema.prisma:18]
- `numero         Int        @unique`. [apps/servicio-mesas/prisma/schema.prisma:19]
- `@@index([estado])`. [apps/servicio-mesas/prisma/schema.prisma:27]
- `@@map("mesas")`. [apps/servicio-mesas/prisma/schema.prisma:28]

**Migraciones.** [apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Mesa` en el servicio `servicio-mesas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-mesas/prisma/schema.prisma:17]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-mesas/prisma/schema.prisma:17]

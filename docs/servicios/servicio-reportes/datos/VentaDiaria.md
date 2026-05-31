---
tipo: modelo
servicio: servicio-reportes
tabla: ventas_diarias
modelo: VentaDiaria
fuente: [apps/servicio-reportes/prisma/schema.prisma:11, apps/servicio-reportes/prisma/migrations/20260525022555_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# VentaDiaria

**Campos.**

- `id          String   @id @default(uuid())`. [apps/servicio-reportes/prisma/schema.prisma:12]
- `cuentaId    String   @unique`. [apps/servicio-reportes/prisma/schema.prisma:13]
- `mesaId      String`. [apps/servicio-reportes/prisma/schema.prisma:14]
- `total       Decimal  @db.Decimal(10, 2)`. [apps/servicio-reportes/prisma/schema.prisma:15]
- `fecha       DateTime @default(now())`. [apps/servicio-reportes/prisma/schema.prisma:16]

**Indices.**

- `id          String   @id @default(uuid())`. [apps/servicio-reportes/prisma/schema.prisma:12]
- `cuentaId    String   @unique`. [apps/servicio-reportes/prisma/schema.prisma:13]
- `@@index([fecha])`. [apps/servicio-reportes/prisma/schema.prisma:18]
- `@@map("ventas_diarias")`. [apps/servicio-reportes/prisma/schema.prisma:19]

**Migraciones.** [apps/servicio-reportes/prisma/migrations/20260525022555_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `VentaDiaria` en el servicio `servicio-reportes`; este atomo fija la estructura declarada por Prisma. [apps/servicio-reportes/prisma/schema.prisma:11]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-reportes/prisma/schema.prisma:11]

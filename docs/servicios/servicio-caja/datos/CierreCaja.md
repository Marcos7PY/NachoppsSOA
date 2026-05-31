---
tipo: modelo
servicio: servicio-caja
tabla: cierres_caja
modelo: CierreCaja
fuente: [apps/servicio-caja/prisma/schema.prisma:37, apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# CierreCaja

**Campos.**

- `id           String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:38]
- `montoEsperado Decimal  @db.Decimal(10, 2)`. [apps/servicio-caja/prisma/schema.prisma:39]
- `montoReal     Decimal  @db.Decimal(10, 2)`. [apps/servicio-caja/prisma/schema.prisma:40]
- `diferencia    Decimal  @db.Decimal(10, 2)`. [apps/servicio-caja/prisma/schema.prisma:41]
- `usuarioId     String`. [apps/servicio-caja/prisma/schema.prisma:42]
- `createdAt     DateTime @default(now())`. [apps/servicio-caja/prisma/schema.prisma:43]

**Indices.**

- `id           String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:38]
- `@@map("cierres_caja")`. [apps/servicio-caja/prisma/schema.prisma:45]

**Migraciones.** [apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]

**Escritores / lectores.** Buscar usos de `CierreCaja` en el servicio `servicio-caja`; este atomo fija la estructura declarada por Prisma. [apps/servicio-caja/prisma/schema.prisma:37]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-caja/prisma/schema.prisma:37]

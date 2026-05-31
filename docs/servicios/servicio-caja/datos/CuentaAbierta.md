---
tipo: modelo
servicio: servicio-caja
tabla: cuentas_abiertas
modelo: CuentaAbierta
fuente: [apps/servicio-caja/prisma/schema.prisma:48, apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# CuentaAbierta

**Campos.**

- `cuentaId String   @id`. [apps/servicio-caja/prisma/schema.prisma:49]
- `mesaId   String`. [apps/servicio-caja/prisma/schema.prisma:50]
- `total    Decimal  @db.Decimal(10, 2)`. [apps/servicio-caja/prisma/schema.prisma:51]
- `estado   String`. [apps/servicio-caja/prisma/schema.prisma:52]

**Indices.**

- `cuentaId String   @id`. [apps/servicio-caja/prisma/schema.prisma:49]
- `@@map("cuentas_abiertas")`. [apps/servicio-caja/prisma/schema.prisma:54]

**Migraciones.** [apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]

**Escritores / lectores.** Buscar usos de `CuentaAbierta` en el servicio `servicio-caja`; este atomo fija la estructura declarada por Prisma. [apps/servicio-caja/prisma/schema.prisma:48]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-caja/prisma/schema.prisma:48]

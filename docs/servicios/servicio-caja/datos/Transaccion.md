---
tipo: modelo
servicio: servicio-caja
tabla: transacciones
modelo: Transaccion
fuente: [apps/servicio-caja/prisma/schema.prisma:11, apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1, apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Transaccion

**Campos.**

- `id          String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:12]
- `cuentaId    String`. [apps/servicio-caja/prisma/schema.prisma:13]
- `monto       Decimal  @db.Decimal(10, 2)`. [apps/servicio-caja/prisma/schema.prisma:14]
- `metodo      String   // EFECTIVO, TARJETA, etc.`. [apps/servicio-caja/prisma/schema.prisma:15]
- `referencia  String?`. [apps/servicio-caja/prisma/schema.prisma:16]
- `notas       String?`. [apps/servicio-caja/prisma/schema.prisma:17]
- `createdAt   DateTime @default(now())`. [apps/servicio-caja/prisma/schema.prisma:18]

**Indices.**

- `id          String   @id @default(uuid())`. [apps/servicio-caja/prisma/schema.prisma:12]
- `@@index([cuentaId])`. [apps/servicio-caja/prisma/schema.prisma:20]
- `@@map("transacciones")`. [apps/servicio-caja/prisma/schema.prisma:21]

**Migraciones.** [apps/servicio-caja/prisma/migrations/20260525022555_init/migration.sql:1], [apps/servicio-caja/prisma/migrations/20260528000000_add_cuentas_abiertas/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Transaccion` en el servicio `servicio-caja`; este atomo fija la estructura declarada por Prisma. [apps/servicio-caja/prisma/schema.prisma:11]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-caja/prisma/schema.prisma:11]

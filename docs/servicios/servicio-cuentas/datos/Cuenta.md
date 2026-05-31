---
tipo: modelo
servicio: servicio-cuentas
tabla: cuentas
modelo: Cuenta
fuente: [apps/servicio-cuentas/prisma/schema.prisma:16, apps/servicio-cuentas/prisma/migrations/20260525022109_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Cuenta

**Campos.**

- `id        String       @id @default(uuid())`. [apps/servicio-cuentas/prisma/schema.prisma:17]
- `mesaId    String`. [apps/servicio-cuentas/prisma/schema.prisma:18]
- `pedidos   Json`. [apps/servicio-cuentas/prisma/schema.prisma:19]
- `total     Decimal      @default(0) @db.Decimal(10, 2)`. [apps/servicio-cuentas/prisma/schema.prisma:20]
- `estado    CuentaEstado @default(ABIERTA)`. [apps/servicio-cuentas/prisma/schema.prisma:21]
- `ticket    String?`. [apps/servicio-cuentas/prisma/schema.prisma:22]
- `createdAt DateTime     @default(now())`. [apps/servicio-cuentas/prisma/schema.prisma:23]
- `updatedAt DateTime     @updatedAt`. [apps/servicio-cuentas/prisma/schema.prisma:24]

**Indices.**

- `id        String       @id @default(uuid())`. [apps/servicio-cuentas/prisma/schema.prisma:17]
- `@@index([mesaId, estado])`. [apps/servicio-cuentas/prisma/schema.prisma:26]
- `@@map("cuentas")`. [apps/servicio-cuentas/prisma/schema.prisma:27]

**Migraciones.** [apps/servicio-cuentas/prisma/migrations/20260525022109_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Cuenta` en el servicio `servicio-cuentas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-cuentas/prisma/schema.prisma:16]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-cuentas/prisma/schema.prisma:16]

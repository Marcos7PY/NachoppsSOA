---
tipo: modelo
servicio: servicio-identidad
tabla: AuditoriaLog
modelo: AuditoriaLog
fuente: [apps/servicio-identidad/prisma/schema.prisma:22, apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1, apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# AuditoriaLog

**Campos.**

- `id        String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:23]
- `accion    String`. [apps/servicio-identidad/prisma/schema.prisma:24]
- `usuarioId String`. [apps/servicio-identidad/prisma/schema.prisma:25]
- `servicio  String`. [apps/servicio-identidad/prisma/schema.prisma:26]
- `ip        String?`. [apps/servicio-identidad/prisma/schema.prisma:27]
- `createdAt DateTime @default(now())`. [apps/servicio-identidad/prisma/schema.prisma:28]

**Indices.**

- `id        String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:23]
- `@@index([usuarioId])`. [apps/servicio-identidad/prisma/schema.prisma:30]

**Migraciones.** [apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1], [apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `AuditoriaLog` en el servicio `servicio-identidad`; este atomo fija la estructura declarada por Prisma. [apps/servicio-identidad/prisma/schema.prisma:22]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-identidad/prisma/schema.prisma:22]

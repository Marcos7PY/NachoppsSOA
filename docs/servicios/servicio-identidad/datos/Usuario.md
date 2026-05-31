---
tipo: modelo
servicio: servicio-identidad
tabla: Usuario
modelo: Usuario
fuente: [apps/servicio-identidad/prisma/schema.prisma:11, apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1, apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Usuario

**Campos.**

- `id        String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:12]
- `nombre    String`. [apps/servicio-identidad/prisma/schema.prisma:13]
- `email     String   @unique`. [apps/servicio-identidad/prisma/schema.prisma:14]
- `password  String`. [apps/servicio-identidad/prisma/schema.prisma:15]
- `rol       String   @default("MESERO")`. [apps/servicio-identidad/prisma/schema.prisma:16]
- `activo    Boolean  @default(true)`. [apps/servicio-identidad/prisma/schema.prisma:17]
- `createdAt DateTime @default(now())`. [apps/servicio-identidad/prisma/schema.prisma:18]
- `updatedAt DateTime @updatedAt`. [apps/servicio-identidad/prisma/schema.prisma:19]

**Indices.**

- `id        String   @id @default(uuid())`. [apps/servicio-identidad/prisma/schema.prisma:12]
- `email     String   @unique`. [apps/servicio-identidad/prisma/schema.prisma:14]

**Migraciones.** [apps/servicio-identidad/prisma/migrations/20260523215428_add_refresh_tokens/migration.sql:1], [apps/servicio-identidad/prisma/migrations/20260525022039_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Usuario` en el servicio `servicio-identidad`; este atomo fija la estructura declarada por Prisma. [apps/servicio-identidad/prisma/schema.prisma:11]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-identidad/prisma/schema.prisma:11]

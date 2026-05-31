---
tipo: modelo
servicio: servicio-reportes
tabla: idempotency_keys
modelo: IdempotencyKey
fuente: [apps/servicio-reportes/prisma/schema.prisma:22, apps/servicio-reportes/prisma/migrations/20260525022555_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# IdempotencyKey

**Campos.**

- `key       String   @id`. [apps/servicio-reportes/prisma/schema.prisma:23]
- `createdAt DateTime @default(now())`. [apps/servicio-reportes/prisma/schema.prisma:24]

**Indices.**

- `key       String   @id`. [apps/servicio-reportes/prisma/schema.prisma:23]
- `@@map("idempotency_keys")`. [apps/servicio-reportes/prisma/schema.prisma:26]

**Migraciones.** [apps/servicio-reportes/prisma/migrations/20260525022555_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `IdempotencyKey` en el servicio `servicio-reportes`; este atomo fija la estructura declarada por Prisma. [apps/servicio-reportes/prisma/schema.prisma:22]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-reportes/prisma/schema.prisma:22]

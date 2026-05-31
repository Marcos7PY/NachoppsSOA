---
tipo: modelo
servicio: servicio-mesas
tabla: idempotency_keys
modelo: IdempotencyKey
fuente: [apps/servicio-mesas/prisma/schema.prisma:44, apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# IdempotencyKey

**Campos.**

- `key       String   @id`. [apps/servicio-mesas/prisma/schema.prisma:45]
- `createdAt DateTime @default(now())`. [apps/servicio-mesas/prisma/schema.prisma:46]

**Indices.**

- `key       String   @id`. [apps/servicio-mesas/prisma/schema.prisma:45]
- `@@map("idempotency_keys")`. [apps/servicio-mesas/prisma/schema.prisma:48]

**Migraciones.** [apps/servicio-mesas/prisma/migrations/20260525022052_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `IdempotencyKey` en el servicio `servicio-mesas`; este atomo fija la estructura declarada por Prisma. [apps/servicio-mesas/prisma/schema.prisma:44]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-mesas/prisma/schema.prisma:44]

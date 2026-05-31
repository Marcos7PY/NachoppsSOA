---
tipo: modelo
servicio: servicio-notificaciones
tabla: idempotency_keys
modelo: IdempotencyKey
fuente: [apps/servicio-notificaciones/prisma/schema.prisma:21, apps/servicio-notificaciones/prisma/migrations/20260525022555_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# IdempotencyKey

**Campos.**

- `key       String   @id`. [apps/servicio-notificaciones/prisma/schema.prisma:22]
- `createdAt DateTime @default(now())`. [apps/servicio-notificaciones/prisma/schema.prisma:23]

**Indices.**

- `key       String   @id`. [apps/servicio-notificaciones/prisma/schema.prisma:22]
- `@@map("idempotency_keys")`. [apps/servicio-notificaciones/prisma/schema.prisma:25]

**Migraciones.** [apps/servicio-notificaciones/prisma/migrations/20260525022555_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `IdempotencyKey` en el servicio `servicio-notificaciones`; este atomo fija la estructura declarada por Prisma. [apps/servicio-notificaciones/prisma/schema.prisma:21]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-notificaciones/prisma/schema.prisma:21]

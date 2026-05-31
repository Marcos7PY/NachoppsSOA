---
tipo: modelo
servicio: servicio-notificaciones
tabla: Notificacion
modelo: Notificacion
fuente: [apps/servicio-notificaciones/prisma/schema.prisma:10, apps/servicio-notificaciones/prisma/migrations/20260525022555_init/migration.sql:1]
revisado: 2026-05-30
commit: 4c186bb
---

# Notificacion

**Campos.**

- `id          String   @id @default(uuid())`. [apps/servicio-notificaciones/prisma/schema.prisma:11]
- `eventoOrigen String`. [apps/servicio-notificaciones/prisma/schema.prisma:12]
- `destinatario String`. [apps/servicio-notificaciones/prisma/schema.prisma:13]
- `canal       String   // SMS, WHATSAPP, UI`. [apps/servicio-notificaciones/prisma/schema.prisma:14]
- `contenido   String`. [apps/servicio-notificaciones/prisma/schema.prisma:15]
- `estado      String   @default("PENDIENTE") // PENDIENTE, ENVIADO, FALLIDO`. [apps/servicio-notificaciones/prisma/schema.prisma:16]
- `intentos    Int      @default(0)`. [apps/servicio-notificaciones/prisma/schema.prisma:17]
- `timestamp   DateTime @default(now())`. [apps/servicio-notificaciones/prisma/schema.prisma:18]

**Indices.**

- `id          String   @id @default(uuid())`. [apps/servicio-notificaciones/prisma/schema.prisma:11]

**Migraciones.** [apps/servicio-notificaciones/prisma/migrations/20260525022555_init/migration.sql:1]

**Escritores / lectores.** Buscar usos de `Notificacion` en el servicio `servicio-notificaciones`; este atomo fija la estructura declarada por Prisma. [apps/servicio-notificaciones/prisma/schema.prisma:10]

**Invariantes garantizadas por la BD.** Las restricciones declaradas arriba son las invariantes verificables a nivel de schema y migracion. [apps/servicio-notificaciones/prisma/schema.prisma:10]

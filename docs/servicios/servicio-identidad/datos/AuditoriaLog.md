---
tipo: modelo-datos
servicio: servicio-identidad
modelo: AuditoriaLog
fuente: [apps/servicio-identidad/prisma/schema.prisma:22]
revisado: 2026-06-02
commit: 53877c8
---

# AuditoriaLog

**Fuente.** Modelo Prisma `AuditoriaLog` definido en [apps/servicio-identidad/prisma/schema.prisma:22].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-identidad/prisma/schema.prisma:23 | `id        String   @id @default(uuid())` |
| apps/servicio-identidad/prisma/schema.prisma:24 | `accion    String` |
| apps/servicio-identidad/prisma/schema.prisma:25 | `usuarioId String` |
| apps/servicio-identidad/prisma/schema.prisma:26 | `servicio  String` |
| apps/servicio-identidad/prisma/schema.prisma:27 | `ip        String?` |
| apps/servicio-identidad/prisma/schema.prisma:28 | `createdAt DateTime @default(now())` |
| apps/servicio-identidad/prisma/schema.prisma:30 | `@@index([usuarioId])` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

---
tipo: modelo-datos
servicio: servicio-notificaciones
modelo: Notificacion
fuente: [apps/servicio-notificaciones/prisma/schema.prisma:10]
revisado: 2026-06-02
commit: 53877c8
---

# Notificacion

**Fuente.** Modelo Prisma `Notificacion` definido en [apps/servicio-notificaciones/prisma/schema.prisma:10].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-notificaciones/prisma/schema.prisma:11 | `id          String   @id @default(uuid())` |
| apps/servicio-notificaciones/prisma/schema.prisma:12 | `eventoOrigen String` |
| apps/servicio-notificaciones/prisma/schema.prisma:13 | `destinatario String` |
| apps/servicio-notificaciones/prisma/schema.prisma:14 | `canal       String   // SMS, WHATSAPP, UI` |
| apps/servicio-notificaciones/prisma/schema.prisma:15 | `contenido   String` |
| apps/servicio-notificaciones/prisma/schema.prisma:16 | `estado      String   @default("PENDIENTE") // PENDIENTE, ENVIADO, FALLIDO` |
| apps/servicio-notificaciones/prisma/schema.prisma:17 | `intentos    Int      @default(0)` |
| apps/servicio-notificaciones/prisma/schema.prisma:18 | `timestamp   DateTime @default(now())` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

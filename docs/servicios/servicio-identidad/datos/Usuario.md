---
tipo: modelo-datos
servicio: servicio-identidad
modelo: Usuario
fuente: [apps/servicio-identidad/prisma/schema.prisma:11]
revisado: 2026-06-02
commit: 53877c8
---

# Usuario

**Fuente.** Modelo Prisma `Usuario` definido en [apps/servicio-identidad/prisma/schema.prisma:11].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-identidad/prisma/schema.prisma:12 | `id        String   @id @default(uuid())` |
| apps/servicio-identidad/prisma/schema.prisma:13 | `nombre    String` |
| apps/servicio-identidad/prisma/schema.prisma:14 | `email     String   @unique` |
| apps/servicio-identidad/prisma/schema.prisma:15 | `password  String` |
| apps/servicio-identidad/prisma/schema.prisma:16 | `rol       String   @default("MESERO")` |
| apps/servicio-identidad/prisma/schema.prisma:17 | `activo    Boolean  @default(true)` |
| apps/servicio-identidad/prisma/schema.prisma:18 | `createdAt DateTime @default(now())` |
| apps/servicio-identidad/prisma/schema.prisma:19 | `updatedAt DateTime @updatedAt` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

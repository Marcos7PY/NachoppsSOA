---
tipo: modelo-datos
servicio: servicio-reportes
modelo: VentaDiaria
fuente: [apps/servicio-reportes/prisma/schema.prisma:11]
revisado: 2026-06-02
commit: 53877c8
---

# VentaDiaria

**Fuente.** Modelo Prisma `VentaDiaria` definido en [apps/servicio-reportes/prisma/schema.prisma:11].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-reportes/prisma/schema.prisma:12 | `id          String   @id @default(uuid())` |
| apps/servicio-reportes/prisma/schema.prisma:13 | `cuentaId    String   @unique` |
| apps/servicio-reportes/prisma/schema.prisma:14 | `mesaId      String` |
| apps/servicio-reportes/prisma/schema.prisma:15 | `total       Decimal  @db.Decimal(10, 2)` |
| apps/servicio-reportes/prisma/schema.prisma:16 | `items       Json?` |
| apps/servicio-reportes/prisma/schema.prisma:17 | `fecha       DateTime @default(now())` |
| apps/servicio-reportes/prisma/schema.prisma:19 | `@@index([fecha])` |
| apps/servicio-reportes/prisma/schema.prisma:20 | `@@map("ventas_diarias")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

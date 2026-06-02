---
tipo: modelo-datos
servicio: servicio-caja
modelo: CierreCaja
fuente: [apps/servicio-caja/prisma/schema.prisma:37]
revisado: 2026-06-02
commit: 53877c8
---

# CierreCaja

**Fuente.** Modelo Prisma `CierreCaja` definido en [apps/servicio-caja/prisma/schema.prisma:37].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-caja/prisma/schema.prisma:38 | `id           String   @id @default(uuid())` |
| apps/servicio-caja/prisma/schema.prisma:39 | `montoEsperado Decimal  @db.Decimal(10, 2)` |
| apps/servicio-caja/prisma/schema.prisma:40 | `montoReal     Decimal  @db.Decimal(10, 2)` |
| apps/servicio-caja/prisma/schema.prisma:41 | `diferencia    Decimal  @db.Decimal(10, 2)` |
| apps/servicio-caja/prisma/schema.prisma:42 | `usuarioId     String` |
| apps/servicio-caja/prisma/schema.prisma:43 | `createdAt     DateTime @default(now())` |
| apps/servicio-caja/prisma/schema.prisma:45 | `@@map("cierres_caja")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

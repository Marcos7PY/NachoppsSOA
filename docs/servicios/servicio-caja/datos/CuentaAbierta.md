---
tipo: modelo-datos
servicio: servicio-caja
modelo: CuentaAbierta
fuente: [apps/servicio-caja/prisma/schema.prisma:48]
revisado: 2026-06-02
commit: 53877c8
---

# CuentaAbierta

**Fuente.** Modelo Prisma `CuentaAbierta` definido en [apps/servicio-caja/prisma/schema.prisma:48].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-caja/prisma/schema.prisma:49 | `cuentaId String   @id` |
| apps/servicio-caja/prisma/schema.prisma:50 | `mesaId   String` |
| apps/servicio-caja/prisma/schema.prisma:51 | `total    Decimal  @db.Decimal(10, 2)` |
| apps/servicio-caja/prisma/schema.prisma:52 | `estado   String` |
| apps/servicio-caja/prisma/schema.prisma:54 | `@@map("cuentas_abiertas")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

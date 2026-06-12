---
tipo: modelo-datos
servicio: servicio-caja
modelo: Transaccion
fuente: [apps/servicio-caja/prisma/schema.prisma:11]
revisado: 2026-06-02
commit: 53877c8
---

# Transaccion

**Fuente.** Modelo Prisma `Transaccion` definido en [apps/servicio-caja/prisma/schema.prisma:11].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-caja/prisma/schema.prisma:12 | `id          String   @id @default(uuid())` |
| apps/servicio-caja/prisma/schema.prisma:13 | `cuentaId    String` |
| apps/servicio-caja/prisma/schema.prisma:14 | `monto       Decimal  @db.Decimal(10, 2)` |
| apps/servicio-caja/prisma/schema.prisma:15 | `metodo      String   // EFECTIVO, TARJETA, etc.` |
| apps/servicio-caja/prisma/schema.prisma:16 | `referencia  String?` |
| apps/servicio-caja/prisma/schema.prisma:17 | `notas       String?` |
| apps/servicio-caja/prisma/schema.prisma:18 | `createdAt   DateTime @default(now())` |
| apps/servicio-caja/prisma/schema.prisma:20 | `@@index([cuentaId])` |
| apps/servicio-caja/prisma/schema.prisma:21 | `@@map("transacciones")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

---
tipo: modelo-datos
servicio: servicio-cuentas
modelo: Cuenta
fuente: [apps/servicio-cuentas/prisma/schema.prisma:16]
revisado: 2026-06-02
commit: 53877c8
---

# Cuenta

**Fuente.** Modelo Prisma `Cuenta` definido en [apps/servicio-cuentas/prisma/schema.prisma:16].

**Campos e indices declarados.**

| Linea | Declaracion |
|---|---|
| apps/servicio-cuentas/prisma/schema.prisma:17 | `id        String       @id @default(uuid())` |
| apps/servicio-cuentas/prisma/schema.prisma:18 | `mesaId    String` |
| apps/servicio-cuentas/prisma/schema.prisma:19 | `pedidos   Json` |
| apps/servicio-cuentas/prisma/schema.prisma:20 | `total     Decimal      @default(0) @db.Decimal(10, 2)` |
| apps/servicio-cuentas/prisma/schema.prisma:21 | `estado    CuentaEstado @default(ABIERTA)` |
| apps/servicio-cuentas/prisma/schema.prisma:22 | `ticket    String?` |
| apps/servicio-cuentas/prisma/schema.prisma:23 | `createdAt DateTime     @default(now())` |
| apps/servicio-cuentas/prisma/schema.prisma:24 | `updatedAt DateTime     @updatedAt` |
| apps/servicio-cuentas/prisma/schema.prisma:26 | `@@index([mesaId, estado])` |
| apps/servicio-cuentas/prisma/schema.prisma:27 | `@@map("cuentas")` |

**Notas de sincronizacion.** Esta ficha se genera desde el schema Prisma actual; restricciones, defaults, relaciones e indices se listan tal como aparecen en el modelo.

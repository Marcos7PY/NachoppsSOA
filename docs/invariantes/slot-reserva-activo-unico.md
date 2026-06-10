---
tipo: invariante
slug: slot-reserva-activo-unico
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:23, apps/servicio-reservas/src/app/reservas.service.ts:93, apps/servicio-reservas/src/app/reservas.service.ts:166, stress-tests/reports/BASELINE.md]
revisado: 2026-06-09
commit: dev
---

# slot-reserva-activo-unico

**Enunciado.** Solo existe una reserva activa por par `(fecha, hora)`. [apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:23]

**Por que importa.** Si falla, dos clientes pueden ocupar el mismo slot activo y el sistema aceptaria una sobre-reserva visible para sala. [apps/servicio-reservas/src/app/reservas.service.ts:93]

**Mecanismo que la garantiza.** La migracion versionada (T-26) primero cancela duplicados activos preexistentes y luego crea `Reserva_fecha_hora_active_unique` como indice unico parcial para `fecha` y `hora` con `estado IN ('PENDIENTE','CONFIRMADA')`; el servicio detecta errores `P2002` y lanza `ConflictException`, que Nest expone como 409. Antes el indice se creaba en runtime con `$executeRawUnsafe` (invisible para el drift check); T-26 lo movio al esquema versionado. [apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:23, apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:2, apps/servicio-reservas/src/app/reservas.service.ts:93, apps/servicio-reservas/src/app/reservas.service.ts:166]

**Prueba que la verifica.** C7 documenta la carrera sobre el mismo slot con un solo exito y rechazos 409. [stress-tests/reports/BASELINE.md]


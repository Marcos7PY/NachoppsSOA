---
tipo: invariante
slug: slot-reserva-activo-unico
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-reservas/src/app/reservas.service.ts:142, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:15]
revisado: 2026-05-31
commit: c5c7891
---

# slot-reserva-activo-unico

**Enunciado.** Solo existe una reserva activa por par `(fecha, hora)`. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20]

**Por que importa.** Si falla, dos clientes pueden ocupar el mismo slot activo y el sistema aceptaria una sobre-reserva visible para sala. [apps/servicio-reservas/src/app/reservas.service.ts:137]

**Mecanismo que la garantiza.** La migracion crea `Reserva_fecha_hora_active_unique` como indice unico parcial para `fecha` y `hora` excluyendo estados cancelados/expirados; el servicio detecta errores `P2002` y lanza `ConflictException`, que Nest expone como 409. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:9, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-reservas/src/app/reservas.service.ts:142]

**Prueba que la verifica.** C7 documenta la carrera sobre el mismo slot con un solo exito y rechazos 409. [stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:15]

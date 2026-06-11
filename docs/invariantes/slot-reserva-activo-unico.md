---
tipo: invariante
slug: slot-reserva-activo-unico
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14, apps/servicio-reservas/src/app/reservas.service.ts:93, apps/servicio-reservas/src/app/reservas.service.ts:174, stress-tests/reports/BASELINE.md]
revisado: 2026-06-11
commit: dev
---

# slot-reserva-activo-unico

**Enunciado.** Solo existe una reserva activa por triple `(fecha, hora, mesaPreferida)`. La misma franja puede tener varias reservas si son mesas distintas. [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14]

**Por que importa.** Si falla, dos clientes pueden ocupar la misma mesa en la misma franja y el sistema aceptaria una sobre-reserva visible para sala. [apps/servicio-reservas/src/app/reservas.service.ts:93]

**Mecanismo que la garantiza.** La migracion versionada T-39 exige `mesaPreferida`, elimina el indice anterior de franja completa y crea `Reserva_fecha_hora_mesa_active_unique` como indice unico parcial para `fecha`, `hora` y `mesaPreferida` con `estado IN ('PENDIENTE','CONFIRMADA')`; el servicio detecta errores `P2002` y lanza `ConflictException`, que Nest expone como 409. [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14, apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:12, apps/servicio-reservas/src/app/reservas.service.ts:93, apps/servicio-reservas/src/app/reservas.service.ts:174]

**Prueba que la verifica.** P-60 debe cubrir carrera sobre la misma mesa/franja con un solo exito y rechazos 409, y misma franja con mesas distintas con multiples exitos. [stress-tests/reports/BASELINE.md]


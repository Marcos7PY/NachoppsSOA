---
tipo: invariante
slug: exactamente-un-exito-bajo-carrera
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14, apps/servicio-reservas/src/app/reservas.service.ts:144, apps/servicio-reservas/src/app/reservas.service.ts:174, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:184, stress-tests/reports/BASELINE.md]
revisado: 2026-06-11
commit: 53877c8
---

# exactamente-un-exito-bajo-carrera

**Enunciado.** Bajo carrera, solo triunfan las operaciones permitidas por el recurso disponible. [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14]

**Por que importa.** Si falla, una carrera crea reservas duplicadas para la misma mesa/franja o pedidos exitosos por encima del stock disponible. [apps/servicio-reservas/src/app/reservas.service.ts:144]

**Mecanismo que la garantiza.** Reservas confia en un indice unico parcial sobre `(fecha, hora, mesaPreferida)` para reservas activas y traduce `P2002` a `ConflictException`; pedidos usa la reserva atomica con lock por producto y `RETURNING` para dejar pasar solo las unidades disponibles. [apps/servicio-reservas/prisma/migrations/20260611010000_reserva_por_mesa/migration.sql:14, apps/servicio-reservas/src/app/reservas.service.ts:144, apps/servicio-reservas/src/app/reservas.service.ts:174, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:184]

**Prueba que la verifica.** P-60 debe mostrar C7 con un 201 y los demas 409 cuando compiten por la misma mesa/franja; C5 conserva un 201 y rechazos; C6 conserva exitos acotados por stock. [stress-tests/reports/BASELINE.md]


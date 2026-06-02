---
tipo: invariante
slug: exactamente-un-exito-bajo-carrera
estado: verificada
fuente: [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-reservas/src/app/reservas.service.ts:142, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:184, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:15]
revisado: 2026-06-02
commit: 53877c8
---

# exactamente-un-exito-bajo-carrera

**Enunciado.** Bajo carrera, solo triunfan las operaciones permitidas por el recurso disponible. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20]

**Por que importa.** Si falla, una carrera crea reservas duplicadas para el mismo slot o pedidos exitosos por encima del stock disponible. [apps/servicio-reservas/src/app/reservas.service.ts:137]

**Mecanismo que la garantiza.** Reservas confia en un indice unico parcial sobre `(fecha, hora)` para reservas activas y traduce `P2002` a `ConflictException`; pedidos usa la reserva atomica con lock por producto y `RETURNING` para dejar pasar solo las unidades disponibles. [apps/servicio-reservas/prisma/migrations/20260530000000_unique_active_reservation_slot/migration.sql:20, apps/servicio-reservas/src/app/reservas.service.ts:137, apps/servicio-reservas/src/app/reservas.service.ts:142, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:184]

**Prueba que la verifica.** El reporte de concurrencia muestra C7 con un 201 y los demas 409, C5 con un 201 y rechazos, y C6 con exitos acotados por stock; la ejecucion larga lista iteraciones C5/C6/C7 hasta 100/100. [stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:15, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:16, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:17, stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md:2411]


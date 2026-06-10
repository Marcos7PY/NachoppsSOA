---
tipo: invariante
slug: turno-caja-abierto-unico
estado: verificada
fuente: [apps/servicio-caja/prisma/migrations/20260609020000_turno_abierto_unico/migration.sql:23, apps/servicio-caja/src/app/app.service.ts:96, apps/servicio-caja/src/app/app.service.ts:133]
revisado: 2026-06-09
commit: dev
---

# turno-caja-abierto-unico

**Enunciado.** A lo sumo existe un `TurnoCaja` con `estado = 'ABIERTA'` a la vez. [apps/servicio-caja/prisma/migrations/20260609020000_turno_abierto_unico/migration.sql:23]

**Por que importa.** Si falla, dos aperturas concurrentes (doble click sin Idempotency-Key, o dos terminales) crean dos turnos ABIERTA; como `registrarPago` y `obtenerTurnoActivo` toman `findFirst(...orderBy abiertoAt desc)`, los pagos se reparten entre turnos y el arqueo/cierre Z queda inconsistente. [apps/servicio-caja/src/app/app.service.ts:133]

**Mecanismo que la garantiza.** La migracion (T-25) cierra duplicados ABIERTA preexistentes y crea el indice unico parcial `turnos_caja_un_abierto` sobre la expresion `(estado)` con `WHERE estado = 'ABIERTA'`; `abrirTurno` captura el `P2002` del segundo INSERT y devuelve el turno ya abierto (misma semantica que "si ya hay uno, devolverlo"). Decision por defecto: indice GLOBAL (un turno en todo el sistema); pendiente confirmar con el equipo si se requiere uno por `cajaId`. [apps/servicio-caja/prisma/migrations/20260609020000_turno_abierto_unico/migration.sql:23, apps/servicio-caja/src/app/app.service.ts:96]

**Prueba que la verifica.** Spec: dos `abrirTurno` concurrentes → un solo turno ABIERTA y ambas llamadas devuelven el mismo id. [apps/servicio-caja/src/app/app.service.spec.ts]

---
tipo: invariante
slug: idempotencia-inversa
estado: verificada
fuente: [apps/servicio-pedidos/src/app/app.service.ts:386, apps/servicio-pedidos/src/app/app.service.ts:399, apps/servicio-pedidos/src/app/app.service.ts:424, apps/servicio-pedidos/src/app/app.service.ts:427, apps/servicio-pedidos/src/app/app.service.ts:431, apps/servicio-pedidos/prisma/schema.prisma:98, apps/servicio-pedidos/prisma/migrations/20260605000000_init/migration.sql:108, stress-tests/reports/BASELINE.md]
revisado: 2026-06-02
commit: 53877c8
---

# idempotencia-inversa

**Enunciado.** Cada evento de producto actualiza la proyeccion local de pedidos como maximo una vez. [apps/servicio-pedidos/src/app/app.service.ts:386]

**Por que importa.** Si falla, un evento repetido de inventario puede recrear o aumentar dos veces la proyeccion `productos_locales` de pedidos. [apps/servicio-pedidos/src/app/app.service.ts:427]

**Mecanismo que la garantiza.** Pedidos procesa `producto.creado` y `producto.actualizado` pasando ambos por `procesarProductoConIdempotencia`; ese metodo construye una clave por routing key/evento, crea `idempotencyKey` dentro de la transaccion que actualiza la proyeccion y trata `P2002` como evento ya aplicado. La BD de pedidos respalda la clave con `key String @unique` y una migracion de indice unico. [apps/servicio-pedidos/src/app/app.service.ts:386, apps/servicio-pedidos/src/app/app.service.ts:399, apps/servicio-pedidos/src/app/app.service.ts:424, apps/servicio-pedidos/src/app/app.service.ts:427, apps/servicio-pedidos/src/app/app.service.ts:431, apps/servicio-pedidos/prisma/schema.prisma:98, apps/servicio-pedidos/prisma/migrations/20260605000000_init/migration.sql:108]

**Prueba que la verifica.** R1 reporta 12 duplicados, delta 5 y stock final 15 desde stock inicial 10, lo que prueba una sola aplicacion efectiva. [stress-tests/reports/BASELINE.md]


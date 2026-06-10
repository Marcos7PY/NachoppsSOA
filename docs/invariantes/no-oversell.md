---
tipo: invariante
slug: no-oversell
estado: verificada
fuente: [apps/servicio-pedidos/src/app/app.service.ts:170, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:180, apps/servicio-pedidos/src/app/app.service.ts:184, apps/servicio-pedidos/src/app/app.service.ts:188, stress-tests/reports/BASELINE.md]
revisado: 2026-06-02
commit: 53877c8
---

# no-oversell

**Enunciado.** El sistema no acepta pedidos que dejen `productos_locales.stockActual` por debajo de cero. [apps/servicio-pedidos/src/app/app.service.ts:170]

**Por que importa.** Si falla, dos pedidos concurrentes pueden reservar mas unidades que las disponibles en la proyeccion local de pedidos y la cocina aceptaria ventas imposibles. [apps/servicio-pedidos/src/app/app.service.ts:184]

**Mecanismo que la garantiza.** La autoridad de stock para crear pedidos es `productos_locales` en servicio-pedidos: `persistirPedido` corre dentro de `prisma.$transaction`, serializa cada producto con `pg_advisory_xact_lock(hashtext(productoId))` y descuenta con `UPDATE productos_locales ... WHERE "stockActual" >= cantidad RETURNING "stockActual"`; si el `RETURNING` no devuelve filas, lanza `BadRequestException`. [apps/servicio-pedidos/src/app/app.service.ts:170, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:180, apps/servicio-pedidos/src/app/app.service.ts:184, apps/servicio-pedidos/src/app/app.service.ts:188]

**Prueba que la verifica.** El reporte de stock marca OK los escenarios de stock y el runner C6 ejerce stock compartido; el reporte de alta concurrencia registra C6 repetido y colas limpias al cierre. [stress-tests/reports/BASELINE.md]


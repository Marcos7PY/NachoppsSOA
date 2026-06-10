---
tipo: invariante
slug: reposicion-como-delta
estado: verificada
fuente: [apps/servicio-pedidos/src/app/app.service.ts:411, apps/servicio-pedidos/src/app/app.service.ts:457, apps/servicio-pedidos/src/app/app.service.ts:462, apps/servicio-pedidos/src/app/app.service.ts:464, stress-tests/reports/BASELINE.md]
revisado: 2026-06-02
commit: 53877c8
---

# reposicion-como-delta

**Enunciado.** Una reposicion aumenta la proyeccion local de pedidos por delta y no por valor absoluto stale. [apps/servicio-pedidos/src/app/app.service.ts:411]

**Por que importa.** Si falla, una reposicion recibida con una foto de inventario atrasada puede re-inflar el stock local despues de consumos ya reservados. [apps/servicio-pedidos/src/app/app.service.ts:462]

**Mecanismo que la garantiza.** El consumidor de pedidos calcula `allowStockIncrease` solo para `stockSyncMode === 'REPOSICION' && stockDelta > 0`; al actualizar la proyeccion, cuando esa condicion se cumple suma `stockDelta` al `existente.stockActual` en lugar de copiar `stockActual` absoluto del payload. [apps/servicio-pedidos/src/app/app.service.ts:411, apps/servicio-pedidos/src/app/app.service.ts:457, apps/servicio-pedidos/src/app/app.service.ts:462, apps/servicio-pedidos/src/app/app.service.ts:464]

**Prueba que la verifica.** R2 reporta OK para reposicion como delta durante ventana stale; el detalle muestra payload absoluto 99 y stock final 10 cuando el delta malicioso era -4, sin inflar la proyeccion. [stress-tests/reports/BASELINE.md]


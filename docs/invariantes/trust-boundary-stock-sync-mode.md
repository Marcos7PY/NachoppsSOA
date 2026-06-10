---
tipo: invariante
slug: trust-boundary-stock-sync-mode
estado: verificada
fuente: [apps/servicio-pedidos/src/app/app.service.ts:411, apps/servicio-pedidos/src/app/app.service.ts:457, apps/servicio-pedidos/src/app/app.service.ts:459, apps/servicio-pedidos/src/app/app.service.ts:460, stress-tests/reports/BASELINE.md]
revisado: 2026-06-02
commit: 53877c8
---

# trust-boundary-stock-sync-mode

**Enunciado.** Pedidos solo acepta aumentos de stock desde eventos de reposicion con delta positivo. [apps/servicio-pedidos/src/app/app.service.ts:411]

**Por que importa.** Si falla, un consumidor confiaria en una etiqueta de payload para aumentar stock local aunque el evento represente consumo. [apps/servicio-pedidos/src/app/app.service.ts:457]

**Mecanismo que la garantiza.** El limite de confianza esta en pedidos: `allowStockIncrease` exige simultaneamente `REPOSICION` y `stockDelta > 0`, y la actualizacion vuelve a comprobar ambos predicados antes de sumar. Residual documentado: si un productor interno fabrica un consumo como `REPOSICION` con delta positivo, el payload no trae una prueba criptografica que permita distinguirlo; la mitigacion vigente es que los eventos provienen de emisores internos y contratos compartidos. [apps/servicio-pedidos/src/app/app.service.ts:411, apps/servicio-pedidos/src/app/app.service.ts:457, apps/servicio-pedidos/src/app/app.service.ts:459, apps/servicio-pedidos/src/app/app.service.ts:460]

**Prueba que la verifica.** El detalle R2 incluye la regla esperada y un payload malicioso con `REPOSICION`, `stockDelta: -4`, `stockActualPayload: 99` y `stockFinal: 10`. [stress-tests/reports/BASELINE.md]


---
tipo: invariante
slug: retencion-idempotency-keys
estado: verificada
fuente: [libs/resiliencia/src/lib/idempotency-purge.service.ts:48, libs/resiliencia/src/lib/idempotency-purge.service.ts:50, libs/resiliencia/src/lib/idempotency-purge.service.ts:51, stress-tests/reports/BASELINE.md]
revisado: 2026-06-09
commit: 9adf05d
---

# retencion-idempotency-keys

**Enunciado.** Las claves de idempotencia antiguas se purgan cada hora en los 6 servicios que tienen el modelo `IdempotencyKey` (caja, inventario, mesas, notificaciones, pedidos, reportes). [libs/resiliencia/src/lib/idempotency-purge.service.ts:48]

**Por que importa.** Si falla, las tablas de idempotencia crecen sin limite y pueden degradar escrituras o mantenimiento de indices. Antes de T-06 la purga solo existia en pedidos e inventario, asi que en los otros 4 servicios la tabla crecia sin tope. [libs/resiliencia/src/lib/idempotency-purge.service.ts:50]

**Mecanismo que la garantiza.** `IdempotencyPurgeService` (en `libs/resiliencia`) expone un `purgarIdempotencyKeys` con su propio `@Cron(CronExpression.EVERY_HOUR)`; calcula `Date.now() - retencionDias * 24 * 3600_000` (retencion 7 dias por defecto) y borra claves con `createdAt < cutoff`. Cada servicio lo registra con `IdempotencyPurgeModule.forService(PrismaService)` mas `ScheduleModule.forRoot()`, de modo que corre aunque no haya eventos PENDING que publicar mientras el proceso este levantado. [libs/resiliencia/src/lib/idempotency-purge.service.ts:48, libs/resiliencia/src/lib/idempotency-purge.service.ts:50, libs/resiliencia/src/lib/idempotency-purge.service.ts:51]

**Prueba que la verifica.** El spec `idempotency-purge.service.spec.ts` cubre el cutoff de 7 dias, la retencion configurable y el metadato de cron horario; el reporte T9 deja constancia operacional de la retencion de 7 dias. [libs/resiliencia/src/lib/idempotency-purge.service.spec.ts, stress-tests/reports/BASELINE.md]

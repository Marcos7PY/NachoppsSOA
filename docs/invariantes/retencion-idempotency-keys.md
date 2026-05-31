---
tipo: invariante
slug: retencion-idempotency-keys
estado: verificada
fuente: [apps/servicio-pedidos/src/app/outbox.processor.ts:67, apps/servicio-pedidos/src/app/outbox.processor.ts:83, apps/servicio-pedidos/src/app/outbox.processor.ts:84, apps/servicio-inventario/src/app/outbox.processor.ts:86, apps/servicio-inventario/src/app/outbox.processor.ts:87, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:75]
revisado: 2026-05-31
commit: c5c7891
---

# retencion-idempotency-keys

**Enunciado.** Las claves de idempotencia antiguas se purgan cada hora en pedidos e inventario. [apps/servicio-pedidos/src/app/outbox.processor.ts:67]

**Por que importa.** Si falla, las tablas de idempotencia crecen sin limite y pueden degradar escrituras o mantenimiento de indices. [apps/servicio-pedidos/src/app/outbox.processor.ts:83]

**Mecanismo que la garantiza.** Pedidos e inventario tienen un metodo `purgarIdempotencyKeys` con su propio `@Cron(CronExpression.EVERY_HOUR)`; cada uno calcula `Date.now() - 7 * 24 * 3600_000` y borra claves con `createdAt < cutoff`. Al ser un metodo cron separado de `processOutboxEvents`, corre aunque no haya eventos PENDING que publicar mientras el proceso este levantado. [apps/servicio-pedidos/src/app/outbox.processor.ts:67, apps/servicio-pedidos/src/app/outbox.processor.ts:83, apps/servicio-pedidos/src/app/outbox.processor.ts:84, apps/servicio-inventario/src/app/outbox.processor.ts:86, apps/servicio-inventario/src/app/outbox.processor.ts:87]

**Prueba que la verifica.** El reporte T9 deja constancia operacional de la retencion de 7 dias en inventario y pedidos. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:75, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:78]

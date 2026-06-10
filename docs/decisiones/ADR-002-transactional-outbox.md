---
tipo: adr
id: ADR-002
estado: aceptada
fecha: 2026-05-30
fuente: [apps/servicio-inventario/prisma/schema.prisma:38, libs/resiliencia/src/lib/outbox.processor.ts:60]
---

# ADR-002 - Transactional Outbox

**Contexto.** La decision se materializa en las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38, libs/resiliencia/src/lib/outbox.processor.ts:60]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [apps/servicio-inventario/prisma/schema.prisma:38]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38]

**Adenda T-23 (2026-06-09) — mensajes persistentes.** El publisher
(`libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts`) ahora publica con
`persistent: true` (`deliveryMode: 2`). Sin esto, aunque colas y exchanges sean
durables, los mensajes viajaban transient: un reinicio del broker perdia los eventos
encolados aun no consumidos, pese a que el outbox ya los marco `PROCESSED` — rompiendo
la garantia at-least-once del patron. El canal es `ConfirmChannel`, asi que el `await`
del publish sigue resolviendo en el confirm del broker. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:68]

**Adenda T-07 (2026-06-09) — processor unificado.** Las 7 copias byte-a-byte del
`OutboxProcessor` (una por servicio productor) se consolidaron en
`libs/resiliencia/src/lib/outbox.processor.ts`, registradas con
`OutboxModule.forService(PrismaService, { producer })`. Misma semantica; solo
desaparece la duplicacion. [libs/resiliencia/src/lib/outbox.processor.ts:60]

**Adenda T-08 (2026-06-09) — claim con SKIP LOCKED y escalado horizontal.** El
processor reclama cada lote con `UPDATE outbox_events SET status='PUBLISHING',
"claimedAt"=now() WHERE id IN (SELECT id … WHERE status='PENDING' ORDER BY
"createdAt" LIMIT N FOR UPDATE SKIP LOCKED) RETURNING *`. Esto habilita **varias
replicas por servicio**: cada una salta las filas bloqueadas por las demas, sin
publicar duplicados en el happy path. Se anade la columna `claimedAt` (migracion
`20260609040000_outbox_claimed_at` en los 7 servicios) y un cron de rescate (cada
minuto) que devuelve a `PENDING` los `PUBLISHING` huerfanos > 60s (replica caida a
mitad de lote), preservando at-least-once; el duplicado lo absorbe la idempotencia
del consumidor. Deroga la antigua "Restriccion de escalado: 1 replica" del README.
[libs/resiliencia/src/lib/outbox.processor.ts:60]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

---
tipo: adr
id: ADR-002
estado: aceptada
fecha: 2026-05-30
fuente: [apps/servicio-inventario/prisma/schema.prisma:38, apps/servicio-inventario/src/app/outbox.processor.ts:21]
---

# ADR-002 - Transactional Outbox

**Contexto.** La decision se materializa en las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38, apps/servicio-inventario/src/app/outbox.processor.ts:21]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [apps/servicio-inventario/prisma/schema.prisma:38]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [apps/servicio-inventario/prisma/schema.prisma:38]

**Adenda T-23 (2026-06-09) — mensajes persistentes.** El publisher
(`libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts`) ahora publica con
`persistent: true` (`deliveryMode: 2`). Sin esto, aunque colas y exchanges sean
durables, los mensajes viajaban transient: un reinicio del broker perdia los eventos
encolados aun no consumidos, pese a que el outbox ya los marco `PROCESSED` — rompiendo
la garantia at-least-once del patron. El canal es `ConfirmChannel`, asi que el `await`
del publish sigue resolviendo en el confirm del broker. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:68]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

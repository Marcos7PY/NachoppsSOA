---
tipo: adr
id: ADR-008
estado: aceptada
fecha: 2026-05-30
fuente: [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35, stress-tests/run-stock-idempotency-dlq.js:22]
---

# ADR-008 - DLQ, parking y reinyeccion

**Contexto.** La decision se materializa en las fuentes citadas. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35, stress-tests/run-stock-idempotency-dlq.js:22]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:35]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

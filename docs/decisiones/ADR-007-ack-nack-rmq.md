---
tipo: adr
id: ADR-007
estado: aceptada
fecha: 2026-05-30
fuente: [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]
---

# ADR-007 - ACK/NACK manual RMQ

**Contexto.** La decision se materializa en las fuentes citadas. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:36]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

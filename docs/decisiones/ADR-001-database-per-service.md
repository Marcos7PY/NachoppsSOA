---
tipo: adr
id: ADR-001
estado: aceptada
fecha: 2026-05-30
fuente: [infra/docker-compose.yml:21, package.json:63]
---

# ADR-001 - Database-per-Service

**Contexto.** La decision se materializa en las fuentes citadas. [infra/docker-compose.yml:21]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [infra/docker-compose.yml:21, package.json:63]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [infra/docker-compose.yml:21]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [infra/docker-compose.yml:21]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

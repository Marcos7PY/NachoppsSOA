---
tipo: adr
id: ADR-003
estado: aceptada
fecha: 2026-05-30
fuente: [libs/contracts/src/events/routing-keys.ts:5, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1]
---

# ADR-003 - Eventos y proyecciones locales

**Contexto.** La decision se materializa en las fuentes citadas. [libs/contracts/src/events/routing-keys.ts:5]

**Decision.** Mantener el mecanismo descrito por las fuentes citadas. [libs/contracts/src/events/routing-keys.ts:5, apps/servicio-pedidos/prisma/migrations/20260528000000_add_productos_locales/migration.sql:1]

**Consecuencias.** Los atomos afectados enlazan los endpoints, eventos, modelos e invariantes que dependen de esta decision. [libs/contracts/src/events/routing-keys.ts:5]

**Alternativas descartadas.** No hay alternativa codificada en las fuentes citadas. [libs/contracts/src/events/routing-keys.ts:5]

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

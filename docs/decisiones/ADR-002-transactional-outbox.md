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

**Atomos afectados.** Ver indices de [servicios](../README.md), [eventos](../eventos/_catalogo.md) e [invariantes](../invariantes/_indice.md).

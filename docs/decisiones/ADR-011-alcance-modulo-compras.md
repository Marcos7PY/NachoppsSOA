---
tipo: adr
id: ADR-011
estado: aceptada
fecha: 2026-06-11
fuente: [apps/pwa-cliente/src/data/compras.mock.ts:1, docs/plan-remediacion-auditoria-externa.md]
---

# ADR-011 - Alcance del módulo Compras (mock) (T-42)

**Contexto.** El módulo Compras de la PWA opera hoy contra `compras.mock.ts`: no
existe `servicio-compras` en el backend. La auditoría externa (2026-06-11, hallazgo
T-42) pide registrar la decisión de alcance para que el mock no se confunda con
funcionalidad productiva.

**Decisión.** El módulo Compras queda **fuera del alcance productivo actual**. Se
registran las dos salidas posibles, a elegir cuando Compras entre en roadmap:

1. **Feature-flag en producción**: ocultar el módulo tras un flag (p. ej.
   `VITE_FEATURE_COMPRAS=false` por defecto en builds de producción), manteniendo el
   mock solo para demo/desarrollo.
2. **`servicio-compras` real**: planificarlo como T-43+ en un plan propio
   (microservicio con DB propia, eventos de inventario para reposición, patrón
   outbox como el resto de la flota).

**Consecuencias.** Mientras no se ejecute ninguna de las dos salidas, el módulo
Compras no debe ofrecerse como funcionalidad a usuarios finales; cualquier demo debe
explicitar que los datos son simulados.

**Alternativas descartadas.** Eliminar el módulo: se descarta porque el mock sirve
como especificación viva de la UI para el futuro `servicio-compras`.

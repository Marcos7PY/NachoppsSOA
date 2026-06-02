---
tipo: indice-servicio
servicio: servicio-reportes
fuente: [apps/servicio-reportes/src/app/app.controller.ts:14]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-reportes

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-reportes/src/app/app.controller.ts:14]
- [GET /resumen](endpoints/GET--resumen.md) [apps/servicio-reportes/src/app/app.controller.ts:19]

**Modelos de datos.**

- [VentaDiaria](datos/VentaDiaria.md) [apps/servicio-reportes/prisma/schema.prisma:11]
- [IdempotencyKey](datos/IdempotencyKey.md) [apps/servicio-reportes/prisma/schema.prisma:23]

**Eventos consumidos.**

- `RoutingKeys.CuentaCerrada` -> `handleCuentaCerrada` [apps/servicio-reportes/src/app/app.controller.ts:24]

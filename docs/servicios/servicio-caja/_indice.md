---
tipo: indice-servicio
servicio: servicio-caja
fuente: [apps/servicio-caja/src/app/app.controller.ts:9]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-caja

**Endpoints.**

- [GET /health](endpoints/GET--health.md) [apps/servicio-caja/src/app/app.controller.ts:9]
- [POST /pagos](endpoints/POST--pagos.md) [apps/servicio-caja/src/app/app.controller.ts:14]
- [GET /](endpoints/GET--raiz.md) [apps/servicio-caja/src/app/app.controller.ts:19]

**Modelos de datos.**

- [Transaccion](datos/Transaccion.md) [apps/servicio-caja/prisma/schema.prisma:11]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-caja/prisma/schema.prisma:24]
- [CierreCaja](datos/CierreCaja.md) [apps/servicio-caja/prisma/schema.prisma:37]
- [CuentaAbierta](datos/CuentaAbierta.md) [apps/servicio-caja/prisma/schema.prisma:48]

**Eventos consumidos.**

- `RoutingKeys.CuentaAbierta` -> `handleCuentaAbierta` [apps/servicio-caja/src/app/events.controller.ts:16]
- `RoutingKeys.CuentaCerrada` -> `handleCuentaCerrada` [apps/servicio-caja/src/app/events.controller.ts:29]

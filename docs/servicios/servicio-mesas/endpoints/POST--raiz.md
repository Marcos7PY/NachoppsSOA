---
tipo: endpoint
servicio: servicio-mesas
metodo: POST
ruta: /
handler: apps/servicio-mesas/src/app/app.controller.ts:19
fuente: [apps/servicio-mesas/src/app/app.controller.ts:19, apps/servicio-mesas/src/app/app.service.ts:19]
revisado: 2026-06-02
commit: 53877c8
---

# POST /

**Proposito.** crearMesa atiende POST / en servicio-mesas. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Entrada.** body `CrearMesaCommand` (numero: number, capacidad: number, ubicacion?: string). [apps/servicio-mesas/src/app/app.controller.ts:20]

> Nota (T-30): el campo se llama `ubicacion` en todo el stack (schema, DTO y eventos). En la UI de la PWA este valor se muestra como "Zona", pero el identificador homologado —en el frontend y en los fixtures de stress— es `ubicacion`.

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-mesas/src/app/app.controller.ts:19]

**Efectos.** llama `crearMesa`; Prisma: `mesa.findUnique`, `mesa.create`, `outboxEvent.create`; eventos: `RoutingKeys.MesaCreada`. [apps/servicio-mesas/src/app/app.service.ts:19]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- Conflict por `ConflictException` declarado en el camino de servicio.

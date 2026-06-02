---
tipo: endpoint
servicio: servicio-reservas
metodo: GET
ruta: /
handler: apps/servicio-reservas/src/app/app.controller.ts:9
fuente: [apps/servicio-reservas/src/app/app.controller.ts:9, apps/servicio-reservas/src/app/reservas.service.ts:30]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** listar atiende GET / en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:9]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reservas/src/app/app.controller.ts:9]

**Entrada.** query `ListarReservasQuery` (limit?: number, cursor?: string, estado?: ReservaEstado, fecha?: string, updatedSince?: string). [apps/servicio-reservas/src/app/app.controller.ts:10]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reservas/src/app/app.controller.ts:9]

**Efectos.** llama `listar`; Prisma: `reserva.findMany`. [apps/servicio-reservas/src/app/reservas.service.ts:30]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

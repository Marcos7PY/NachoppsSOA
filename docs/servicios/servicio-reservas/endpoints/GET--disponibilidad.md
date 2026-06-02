---
tipo: endpoint
servicio: servicio-reservas
metodo: GET
ruta: /disponibilidad
handler: apps/servicio-reservas/src/app/app.controller.ts:14
fuente: [apps/servicio-reservas/src/app/app.controller.ts:14, apps/servicio-reservas/src/app/reservas.service.ts:142]
revisado: 2026-06-02
commit: 53877c8
---

# GET /disponibilidad

**Proposito.** disponibilidad atiende GET /disponibilidad en servicio-reservas. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Entrada.** query params fecha: string, hora: string. [apps/servicio-reservas/src/app/app.controller.ts:15]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-reservas/src/app/app.controller.ts:14]

**Efectos.** llama `consultarDisponibilidad`; Prisma: `reserva.count`. [apps/servicio-reservas/src/app/reservas.service.ts:142]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

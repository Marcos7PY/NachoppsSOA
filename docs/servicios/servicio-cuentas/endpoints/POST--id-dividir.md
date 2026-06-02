---
tipo: endpoint
servicio: servicio-cuentas
metodo: POST
ruta: /:id/dividir
handler: apps/servicio-cuentas/src/app/app.controller.ts:34
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:34, apps/servicio-cuentas/src/app/app.service.ts:318]
revisado: 2026-06-02
commit: 53877c8
---

# POST /:id/dividir

**Proposito.** dividirCuenta atiende POST /:id/dividir en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:34]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-cuentas/src/app/app.controller.ts:34]

**Entrada.** body `DividirCuentaCommand` (metodo: 'IGUALES' | 'POR_ITEMS', numPartes?: number). [apps/servicio-cuentas/src/app/app.controller.ts:35]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-cuentas/src/app/app.controller.ts:33]

**Efectos.** llama `dividirCuenta`. [apps/servicio-cuentas/src/app/app.service.ts:318]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- BadRequest por `BadRequestException` declarado en el camino de servicio.

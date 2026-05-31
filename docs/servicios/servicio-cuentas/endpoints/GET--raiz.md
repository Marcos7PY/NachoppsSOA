---
tipo: endpoint
servicio: servicio-cuentas
metodo: GET
ruta: /
handler: apps/servicio-cuentas/src/app/app.controller.ts:13
fuente: [apps/servicio-cuentas/src/app/app.controller.ts:13]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-cuentas. [apps/servicio-cuentas/src/app/app.controller.ts:13]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-cuentas/src/app/app.module.ts:2, apps/servicio-cuentas/src/app/app.controller.ts:13]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-cuentas/src/app/app.controller.ts:14]

**Salida.** Devuelve `{ status: 'OK', service: 'Cuentas' }`; codigos esperados: 200 si el handler completa y 401 si falta o falla JWT por `JwtAuthGuard`. [apps/servicio-cuentas/src/app/app.controller.ts:14, apps/servicio-cuentas/src/app/app.controller.ts:15]

**Efectos.** No escribe en BD ni emite eventos: el handler retorna un literal de healthcheck y no llama a `AppService`. [apps/servicio-cuentas/src/app/app.controller.ts:14, apps/servicio-cuentas/src/app/app.controller.ts:15]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No declara ramas de error propias; el handler solo retorna el literal de healthcheck. [apps/servicio-cuentas/src/app/app.controller.ts:14, apps/servicio-cuentas/src/app/app.controller.ts:15]

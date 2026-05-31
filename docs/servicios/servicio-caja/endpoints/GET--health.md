---
tipo: endpoint
servicio: servicio-caja
metodo: GET
ruta: /health
handler: apps/servicio-caja/src/app/app.controller.ts:9
fuente: [apps/servicio-caja/src/app/app.controller.ts:9]
revisado: 2026-05-31
commit: c5c7891
---

# GET /health

**Proposito.** healthCheck atiende GET /health en servicio-caja. [apps/servicio-caja/src/app/app.controller.ts:9]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-caja/src/app/app.module.ts:2, apps/servicio-caja/src/app/app.controller.ts:9]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-caja/src/app/app.controller.ts:10]

**Salida.** Devuelve `{ status: 'OK', service: 'Caja' }`; codigos esperados: 200 si el handler completa y 401 si falta o falla JWT por `JwtAuthGuard`. [apps/servicio-caja/src/app/app.controller.ts:10, apps/servicio-caja/src/app/app.controller.ts:11]

**Efectos.** No escribe en BD ni emite eventos: el handler retorna un literal de healthcheck y no llama a `AppService`. [apps/servicio-caja/src/app/app.controller.ts:10, apps/servicio-caja/src/app/app.controller.ts:11]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No declara ramas de error propias; el handler solo retorna el literal de healthcheck. [apps/servicio-caja/src/app/app.controller.ts:10, apps/servicio-caja/src/app/app.controller.ts:11]

---
tipo: endpoint
servicio: servicio-reportes
metodo: GET
ruta: /
handler: apps/servicio-reportes/src/app/app.controller.ts:14
fuente: [apps/servicio-reportes/src/app/app.controller.ts:14]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-reportes. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-reportes/src/app/app.controller.ts:14]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-reportes/src/app/app.controller.ts:15]

**Salida.** Devuelve `{ status: 'OK', service: 'Reportes' }`; codigos esperados: 200 si el handler completa. [apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.controller.ts:16]

**Efectos.** No escribe en BD ni emite eventos: el handler retorna un literal de healthcheck y no llama a `AppService`. [apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.controller.ts:16]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No declara ramas de error propias; el handler solo retorna el literal de healthcheck. [apps/servicio-reportes/src/app/app.controller.ts:15, apps/servicio-reportes/src/app/app.controller.ts:16]

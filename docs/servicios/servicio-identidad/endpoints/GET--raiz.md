---
tipo: endpoint
servicio: servicio-identidad
metodo: GET
ruta: /
handler: apps/servicio-identidad/src/auth/auth.controller.ts:28
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:28]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** healthCheck atiende GET / en servicio-identidad. [apps/servicio-identidad/src/auth/auth.controller.ts:28]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-identidad/src/auth/auth.controller.ts:28]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-identidad/src/auth/auth.controller.ts:29]

**Salida.** Devuelve `{ status: 'OK', service: 'Identidad' }`; codigos esperados: 200 si el handler completa. [apps/servicio-identidad/src/auth/auth.controller.ts:29, apps/servicio-identidad/src/auth/auth.controller.ts:30]

**Efectos.** No escribe en BD ni emite eventos: el handler retorna un literal de healthcheck y no llama a `AuthService`. [apps/servicio-identidad/src/auth/auth.controller.ts:29, apps/servicio-identidad/src/auth/auth.controller.ts:30]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- No declara ramas de error propias; el handler solo retorna el literal de healthcheck. [apps/servicio-identidad/src/auth/auth.controller.ts:29, apps/servicio-identidad/src/auth/auth.controller.ts:30]

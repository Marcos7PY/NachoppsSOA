---
tipo: endpoint
servicio: servicio-reportes
metodo: GET
ruta: /resumen
handler: apps/servicio-reportes/src/app/app.controller.ts:19
fuente: [apps/servicio-reportes/src/app/app.controller.ts:19, apps/servicio-reportes/src/app/app.controller.ts:20, apps/servicio-reportes/src/app/app.service.ts:27]
revisado: 2026-05-31
commit: c5c7891
---

# GET /resumen

**Proposito.** getResumen atiende GET /resumen en servicio-reportes usando `obtenerResumenDiario`. [apps/servicio-reportes/src/app/app.controller.ts:19]

**Autorizacion.** No hay `@UseGuards` en el handler ni `APP_GUARD` con `JwtAuthGuard` detectado en el modulo de este servicio. [apps/servicio-reportes/src/app/app.controller.ts:19]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-reportes/src/app/app.controller.ts:20]

**Salida.** Respuesta derivada del handler `getResumen` y del servicio `obtenerResumenDiario`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-reportes/src/app/app.controller.ts:20]

**Efectos.** Usa `ventaDiaria.findMany`. [apps/servicio-reportes/src/app/app.service.ts:27]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-reportes/src/app/app.service.ts:27]

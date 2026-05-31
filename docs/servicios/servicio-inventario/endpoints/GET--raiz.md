---
tipo: endpoint
servicio: servicio-inventario
metodo: GET
ruta: /
handler: apps/servicio-inventario/src/app/app.controller.ts:9
fuente: [apps/servicio-inventario/src/app/app.controller.ts:9, apps/servicio-inventario/src/app/app.controller.ts:10, apps/servicio-inventario/src/app/app.service.ts:19]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** getData atiende GET / en servicio-inventario usando `getHello`. [apps/servicio-inventario/src/app/app.controller.ts:9]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-inventario/src/app/app.module.ts:2, apps/servicio-inventario/src/app/app.controller.ts:9]

**Entrada.** Sin cuerpo DTO declarado en la firma; la entrada sale de parametros o query del handler. [apps/servicio-inventario/src/app/app.controller.ts:10]

**Salida.** Respuesta derivada del handler `getData` y del servicio `getHello`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-inventario/src/app/app.controller.ts:10]

**Efectos.** No se observan escrituras Prisma en el camino del servicio; el efecto es de lectura o respuesta directa. [apps/servicio-inventario/src/app/app.service.ts:19]

**Invariantes que toca.** [idempotencia-directa](../../../invariantes/idempotencia-directa.md), [reposicion-como-delta](../../../invariantes/reposicion-como-delta.md)

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-inventario/src/app/app.service.ts:19]

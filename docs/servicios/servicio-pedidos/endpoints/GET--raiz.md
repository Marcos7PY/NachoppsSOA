---
tipo: endpoint
servicio: servicio-pedidos
metodo: GET
ruta: /
handler: apps/servicio-pedidos/src/app/app.controller.ts:17
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:17, apps/servicio-pedidos/src/app/app.controller.ts:18, apps/servicio-pedidos/src/app/app.service.ts:247]
revisado: 2026-05-31
commit: c5c7891
---

# GET /

**Proposito.** Lista pedidos, opcionalmente filtrados por mesa. [apps/servicio-pedidos/src/app/app.controller.ts:17]

**Autorizacion.** `JwtAuthGuard` se registra como `APP_GUARD` del servicio; no hay `@Roles` local en el handler. [apps/servicio-pedidos/src/app/app.module.ts:2, apps/servicio-pedidos/src/app/app.controller.ts:17]

**Entrada.** `mesaId: string` via Query. [apps/servicio-pedidos/src/app/app.controller.ts:18]

**Salida.** Respuesta derivada del handler `listarPedidos` y del servicio `listarPedidos`; codigos esperados: 200 si el handler completa; 401 si falta o falla JWT por `JwtAuthGuard`; 400 para errores de validacion o `BadRequestException`; 404 para `NotFoundException`; 409 para `ConflictException`; 503 para `ServiceUnavailableException`. [apps/servicio-pedidos/src/app/app.controller.ts:18]

**Efectos.** Usa `pedido.findMany`. [apps/servicio-pedidos/src/app/app.service.ts:247]

**Invariantes que toca.** <!-- sin evidencia: no hay invariante atomica especifica enlazada a este endpoint -->

**Errores.**

- El camino del servicio no declara excepciones Nest explicitas; los errores restantes salen de validacion global o infraestructura. [apps/servicio-pedidos/src/app/app.service.ts:247]

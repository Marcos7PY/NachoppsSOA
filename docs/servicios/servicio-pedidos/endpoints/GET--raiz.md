---
tipo: endpoint
servicio: servicio-pedidos
metodo: GET
ruta: /
handler: apps/servicio-pedidos/src/app/app.controller.ts:17
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:17, apps/servicio-pedidos/src/app/app.service.ts:275]
revisado: 2026-06-02
commit: 53877c8
---

# GET /

**Proposito.** listarPedidos atiende GET / en servicio-pedidos. [apps/servicio-pedidos/src/app/app.controller.ts:17]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-pedidos/src/app/app.controller.ts:17]

**Entrada.** query `ListarPedidosQuery` (mesaId?: string, limit?: number, cursor?: string, estado?: PedidoEstado, updatedSince?: string). [apps/servicio-pedidos/src/app/app.controller.ts:18]

**Salida.** Codigo esperado: 200 si el handler completa. [apps/servicio-pedidos/src/app/app.controller.ts:17]

**Efectos.** llama `listarPedidos`; Prisma: `pedido.findMany`. [apps/servicio-pedidos/src/app/app.service.ts:275]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

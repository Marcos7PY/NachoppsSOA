---
tipo: endpoint
servicio: servicio-pedidos
metodo: POST
ruta: /
handler: apps/servicio-pedidos/src/app/app.controller.ts:12
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:12, apps/servicio-pedidos/src/app/app.service.ts:47]
revisado: 2026-06-02
commit: 53877c8
---

# POST /

**Proposito.** crearPedido atiende POST / en servicio-pedidos. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Autorizacion.** Publico: no hay `@UseGuards` aplicado al handler. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Entrada.** body `CrearPedidoCommand` (mesaId: string, items: PedidoItemInput[], cliente?: string, telefono?: string, direccion?: string, proveedor?: string, modalidad?: string). [apps/servicio-pedidos/src/app/app.controller.ts:13]

**Salida.** Codigo esperado: 201 por defecto de Nest para POST si el handler completa. [apps/servicio-pedidos/src/app/app.controller.ts:12]

**Efectos.** llama `crearPedido`. [apps/servicio-pedidos/src/app/app.service.ts:47]

**Invariantes que toca.** <!-- sin evidencia automatica: revisar invariantes de negocio asociadas si aplica -->

**Errores.**

- No se detectan excepciones Nest explicitas en el camino principal; errores restantes salen de validacion global o infraestructura.

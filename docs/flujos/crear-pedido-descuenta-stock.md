---
tipo: flujo
nombre: crear-pedido-descuenta-stock
disparador: apps/servicio-pedidos/src/app/app.controller.ts:12
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:12, apps/servicio-pedidos/src/app/app.service.ts:45, apps/servicio-pedidos/src/app/app.service.ts:170, apps/servicio-pedidos/src/app/app.service.ts:227, apps/servicio-cuentas/src/app/events.controller.ts:15, apps/servicio-inventario/src/app/events.controller.ts:12]
revisado: 2026-06-02
commit: 53877c8
---

# Crear pedido descuenta stock

**Disparador.** `POST /` de pedidos llama `crearPedido`, valida mesa/items y entra a `persistirPedido`. [apps/servicio-pedidos/src/app/app.controller.ts:12, apps/servicio-pedidos/src/app/app.service.ts:45]

**Secuencia.**

- servicio-pedidos valida la mesa local y los productos locales antes de calcular total. [apps/servicio-pedidos/src/app/app.service.ts:46, apps/servicio-pedidos/src/app/app.service.ts:130]
- servicio-pedidos abre una transaccion, toma lock por producto y descuenta `productos_locales` con `stockActual >= cantidad`; si no hay fila retornada, rechaza el pedido. [apps/servicio-pedidos/src/app/app.service.ts:170, apps/servicio-pedidos/src/app/app.service.ts:178, apps/servicio-pedidos/src/app/app.service.ts:180, apps/servicio-pedidos/src/app/app.service.ts:188]
- En la misma transaccion crea `Pedido`, `PedidoItem` y modificadores. [apps/servicio-pedidos/src/app/app.service.ts:194, apps/servicio-pedidos/src/app/app.service.ts:200, apps/servicio-pedidos/src/app/app.service.ts:209]
- La transaccion inserta eventos Outbox `pedido.creado` y `pedido.actualizado`. [apps/servicio-pedidos/src/app/app.service.ts:227, apps/servicio-pedidos/src/app/app.service.ts:230, apps/servicio-pedidos/src/app/app.service.ts:235]
- Outbox publica esos eventos; cuentas consume `pedido.creado` para abrir o anexar cuenta, inventario descuenta su proyeccion y notificaciones lo envia a la UI/KDS. [apps/servicio-cuentas/src/app/events.controller.ts:15, apps/servicio-inventario/src/app/events.controller.ts:12, apps/servicio-notificaciones/src/app/app.controller.ts:29]

**Estados y transiciones.** El pedido nace en `PENDIENTE`; cada item conserva area/estado y la proyeccion `ProductoLocal.stockActual` queda reducida antes de emitir eventos. [apps/servicio-pedidos/src/app/app.service.ts:198, apps/servicio-pedidos/src/app/app.service.ts:204, apps/servicio-pedidos/src/app/app.service.ts:180]

**Fallo y reconvergencia.** Si falla un consumidor de `pedido.creado`, el interceptor reintenta con backoff y termina en NACK hacia DLQ; la idempotencia de inventario evita doble descuento cuando el mensaje vuelve. [libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:25, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:49, apps/servicio-inventario/src/app/app.service.ts:222, apps/servicio-inventario/src/app/app.service.ts:231]

**Invariantes de extremo a extremo.** [no-oversell](../invariantes/no-oversell.md), [idempotencia-directa](../invariantes/idempotencia-directa.md), [colas-limpias-happy-path](../invariantes/colas-limpias-happy-path.md)


---
tipo: nota-cierre
fuente: [docs/README.md:1, docs/invariantes/no-oversell.md:1, docs/servicios/servicio-pedidos/endpoints/POST--raiz.md:1, docs/flujos/crear-pedido-descuenta-stock.md:1]
revisado: 2026-05-31
commit: c5c7891
---

# Nota de cierre

Atomos retocados por tipo en esta pasada de contenido: endpoints 40, eventos 20, flujos 6 e invariantes 9. [docs/README.md:1]

Citas de capa corregidas: `no-oversell` apunta a la reserva transaccional de `servicio-pedidos` sobre `productos_locales` y no al `updateMany` de inventario; `reposicion-como-delta` y `trust-boundary-stock-sync-mode` apuntan al gate del consumidor de pedidos. [docs/invariantes/no-oversell.md:1, docs/invariantes/reposicion-como-delta.md:1, docs/invariantes/trust-boundary-stock-sync-mode.md:1]

Spot-check de citas clave aplicado: `no-oversell`, idempotencia directa, idempotencia inversa, reposicion como delta, trust-boundary, slot unico de reserva, retencion de idempotency keys y `POST /` de pedidos cuadran con las lineas citadas del repo vivo. [docs/invariantes/no-oversell.md:1, docs/invariantes/idempotencia-directa.md:1, docs/invariantes/idempotencia-inversa.md:1, docs/servicios/servicio-pedidos/endpoints/POST--raiz.md:1]

Marcas `<!-- sin evidencia -->`: 41. Quedan en endpoints o eventos sin invariante atomica especifica enlazada; los marcadores accionables de "Efectos" en healthchecks se reemplazaron por respuestas directas verificadas en controlador. [docs/servicios/servicio-caja/endpoints/GET--health.md:1, docs/servicios/servicio-cuentas/endpoints/GET--raiz.md:1, docs/servicios/servicio-identidad/endpoints/GET--raiz.md:1, docs/servicios/servicio-reportes/endpoints/GET--raiz.md:1]

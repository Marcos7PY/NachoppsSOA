# Backfill de cuentas abiertas con total inflado

Este procedimiento corrige cuentas `ABIERTA` cuyo `total` todavia incluye pedidos
`CANCELADO` o `RECHAZADO_SIN_STOCK` en el snapshot JSON.

Ejecutar solo despues de desplegar la remediacion que recalcula `pedido.total` y
excluye estados no cobrables en `servicio-cuentas`.

```sh
DATABASE_URL='postgresql://...' npm run backfill:cuentas-abiertas
```

El script conserva completo el JSON `pedidos` para auditoria y solo actualiza el
campo `total` cuando detecta discrepancia. Cada ajuste queda logueado con cuenta,
mesa, total anterior y total nuevo.

Rollback: restaurar el backup de la base de `servicio-cuentas` o volver a fijar
manualmente el total desde el snapshot si se ejecutó contra el entorno equivocado.

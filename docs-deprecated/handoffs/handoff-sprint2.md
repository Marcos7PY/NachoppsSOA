# Handoff Sprint 2 — Módulo Operaciones: Mesas y Pedidos

## ✅ Tareas completadas

| # | Tarea | Estado | Archivos |
|---|-------|--------|----------|
| 2.1 | Tipos (mesa + pedido) | ✅ | [mesa.types.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/types/mesa.types.ts), [pedido.types.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/types/pedido.types.ts) |
| 2.2 | Mappers | ✅ | [mesa.mapper.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/mappers/mesa.mapper.ts), [pedido.mapper.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/mappers/pedido.mapper.ts) |
| 2.3 | APIs | ✅ | [mesas.api.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/api/mesas.api.ts), [pedidos.api.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/api/pedidos.api.ts) |
| 2.4 | Stores (Zustand) | ✅ | [mesas.store.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/store/mesas.store.ts), [pedidos.store.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/store/pedidos.store.ts) |
| 2.5 | Domain components | ✅ | [MesaCard.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/domain/MesaCard.tsx), [PedidoRow.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/domain/PedidoRow.tsx), [ItemKDS.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/domain/ItemKDS.tsx) |
| 2.6 | Pantallas (3) | ✅ | [MesasScreen.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/screens/ops/MesasScreen.tsx), [PedidosScreen.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/screens/ops/PedidosScreen.tsx), [CocinaScreen.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/screens/ops/CocinaScreen.tsx) |
| 2.7 | Router actualizado | ✅ | [router/index.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/router/index.tsx) |

## 🏗️ Build

```
✓ npx nx run pwa-cliente:build — 43 modules, 0 errors
  dist/assets/index-BnYtf2DL.js   270.31 kB (gzip: 82.45 kB)
  Built in 226ms
```

## 📋 Detalle de implementación

### Endpoints mapeados (de los controllers reales)

| Endpoint | Uso en la UI |
|----------|-------------|
| `GET /mesas` | MesasScreen: carga grid completo |
| `PATCH /mesas/:id/estado` | MesasScreen: modal de cambio de estado (optimistic) |
| `GET /pedidos?mesaId=` | PedidosScreen: lista filtrada |
| `POST /pedidos` | Store ready (pantalla de creación en Sprint futuro) |
| `PATCH /pedidos/:id/estado` | PedidosScreen: avanzar estado del pedido |
| `PATCH /pedidos/items/:itemId/estado` | CocinaScreen: avanzar ítems individuales |

> [!NOTE]
> El endpoint de ítems es `/pedidos/items/:itemId/estado` (NO anidado bajo pedidoId). Esto coincide con el controller real del backend.

### Comportamientos clave

- **MesasScreen**: Grid con filtros por estado, modal de cambio de estado con optimistic update, skeletons de carga
- **PedidosScreen**: Tabla con filtros por estado, botón avanzar con loading individual por fila
- **CocinaScreen (KDS)**: 3 columnas Kanban (Pendiente → En preparación → Listo), urgencia por color (>15min = rojo, 10-15 = amarillo, <10 = verde), filtro por área (Cocina/Bar/Todas)

### Tipos verificados contra el backend

Los DTOs fueron tomados directamente de `libs/contracts/src/domains/mesas.ts` y `pedidos.ts`:
- `MesaEstado`: `LIBRE | OCUPADA | RESERVADA`
- `PedidoEstado`: `PENDIENTE | EN_PREPARACION | LISTO | ENTREGADO | PAGADO | CANCELADO`
- `ItemArea`: `COCINA | BAR`

## Checklist de validación

- [x] Build sin errores
- [ ] Pantalla Mesas carga datos reales, muestra estado correcto por mesa
- [ ] Cambiar estado de mesa persiste en backend y se refleja en UI al refrescar
- [ ] Pantalla Pedidos muestra pedidos activos reales
- [ ] Vista Cocina (KDS) muestra ítems y permite avanzar estado
- [ ] Crear un pedido desde la UI aparece en la lista sin recargar la página
- [ ] Estados de loading y error funcionan correctamente en las tres pantallas

## Notas para Sprint 3

> [!IMPORTANT]
> - La pantalla de **creación de pedido** (seleccionar productos, cantidades, etc.) NO está implementada aún. El store tiene `crear()` listo, pero falta la UI de catálogo+carrito.
> - El backend no tiene filtrado por `?estado=` ni `?limit=` en pedidos (solo `?mesaId=`). El filtrado se hace client-side.
> - Los tiempos en el KDS se calculan desde `createdAt` del pedido, no del ítem. Si el backend agrega `createdAt` por ítem, se puede refinar.

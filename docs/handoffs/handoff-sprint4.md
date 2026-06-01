# Handoff Sprint 4 — Reservas, Inventario y Reportes

## Tareas completadas

| # | Tarea | Estado | Archivos |
|---|-------|--------|----------|
| 4.1 | Reservas: tipos, API, mapper, store y pantalla | ✅ | `apps/pwa-cliente/src/types/reserva.types.ts`, `api/reservas.api.ts`, `mappers/reserva.mapper.ts`, `store/reservas.store.ts`, `screens/reservas/ReservasScreen.tsx` |
| 4.2 | Inventario: tipos, API, mapper, store y pantalla | ✅ | `apps/pwa-cliente/src/types/inventario.types.ts`, `api/inventario.api.ts`, `mappers/inventario.mapper.ts`, `store/inventario.store.ts`, `screens/inventario/InventarioScreen.tsx` |
| 4.3 | Reportes: tipos, API, mapper, store y pantalla | ✅ | `apps/pwa-cliente/src/types/reporte.types.ts`, `api/reportes.api.ts`, `mappers/reporte.mapper.ts`, `store/reportes.store.ts`, `screens/reportes/ReportesScreen.tsx` |
| — | Router y estilos de soporte | ✅ | `apps/pwa-cliente/src/router/index.tsx`, `apps/pwa-cliente/src/styles.css` |

## Build

```text
✓ npm exec nx run pwa-cliente:typecheck
✓ npm exec nx run pwa-cliente:build
  89 modules transformed.
  dist/index.html                 0.92 kB
  dist/assets/index-6SmAVn9L.css  25.17 kB
  dist/assets/index-BWPksQix.js   349.78 kB
```

## Implementación

### Reservas

- La ruta `/app/reservas` carga `ReservasScreen`.
- Lista reservas reales desde `GET /reservas`.
- Permite filtrar agenda por fecha en UI.
- Permite crear reserva con `POST /reservas`.
- Permite confirmar reserva con `PATCH /reservas/:id/confirmar`.
- Permite cancelar reserva con `DELETE /reservas/:id`.
- Consulta disponibilidad con `GET /reservas/disponibilidad?fecha=&hora=`.
- Estados implementados: loading, error, empty y feedback de éxito.

### Inventario

- La ruta `/app/inventario` carga `InventarioScreen`.
- Carga categorías y productos en paralelo con `Promise.all()`.
- Lista productos agrupados por categoría.
- Permite filtrar por categoría usando `GET /inventario/productos?categoriaId=`.
- Permite crear producto con `POST /inventario/productos`.
- Permite reponer stock con `PATCH /inventario/productos/:id/stock`.
- Estados implementados: loading, error, empty y feedback de éxito.

### Reportes

- La ruta `/app/reportes` carga `ReportesScreen`.
- Carga resumen real desde `GET /reportes/resumen`.
- Muestra ingresos del día, ventas cerradas y ticket promedio calculado desde datos reales.
- Secciones sin datos del backend (`ventasPorHora`, `topProductos`) muestran empty state sin inventar métricas.

## Divergencias detectadas contra el plan

- Reservas cancela con `DELETE /reservas/:id`, no con `PATCH /reservas/:id/cancelar`.
- Inventario repone stock con `PATCH /inventario/productos/:id/stock` y body `{ stock: cantidad }`, no con `POST /inventario/productos/:id/reponer`.
- Reportes solo devuelve `{ fecha, totalVentas, ingresosTotales }`; no hay desglose real de ventas por hora ni top productos todavía.
- El contrato compartido no incluye `reportes.ts`; el frontend define un tipo local mínimo basado en `servicio-reportes`.

## Checklist de validación

- [x] Build sin errores.
- [ ] Reservas: crear, confirmar y cancelar persisten en backend.
- [ ] Inventario: lista carga real, reponer stock actualiza el registro.
- [ ] Reportes: métricas reales del backend visibles.
- [x] Secciones sin datos muestran empty state, no números falsos.

## Pendiente para validar manualmente

- Probar con Kong/backend levantado y sesión real.
- Confirmar si `DELETE /reservas/:id` vía Kong acepta body con `{ motivo }`.
- Confirmar si reposición de inventario debería llamarse "stock delta" en UI porque el backend suma la cantidad enviada al stock actual.

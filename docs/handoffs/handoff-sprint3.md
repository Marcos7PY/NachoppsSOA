# Handoff Sprint 3 — Tiempo Real + Caja

## Tareas completadas

| # | Tarea | Estado | Archivos |
|---|--------|--------|----------|
| 3.1 | Socket service singleton Socket.IO | ✅ | `apps/pwa-cliente/src/services/socket.service.ts` |
| 3.2 | Integración socket con stores | ✅ | `mesas.store.ts`, `pedidos.store.ts`, `cuentas.store.ts` |
| 3.3 | Tipos y API de cuentas/caja | ✅ | `types/cuenta.types.ts`, `api/cuentas.api.ts` |
| 3.4 | Store de cuentas | ✅ | `store/cuentas.store.ts` |
| 3.5 | Pantalla Caja | ✅ | `screens/caja/CajaScreen.tsx`, `router/index.tsx`, `styles.css` |

## Build

```text
✓ npm exec nx run pwa-cliente:build
  77 modules transformed.
  dist/index.html                 0.92 kB
  dist/assets/index-CjQ1XH_v.css  24.10 kB
  dist/assets/index-CFVePzc_.js   325.14 kB
```

## Implementación

### Tiempo real

- `socketService.connect()` se ejecuta después de `login()` y `restore()` exitosos.
- `socketService.disconnect()` se ejecuta en `logout()` y cuando `restore()` falla.
- Se escucha `pedidoUpdate` desde Socket.IO.
- El evento se invalida por `pattern`:
  - `pedido.*` refresca pedidos, mesas y cuenta activa.
  - `cuenta.*` y `pago.*` refrescan mesas, pedidos y cuenta activa.
- Configuración:
  - URL: `VITE_API_BASE_URL` con fallback `http://localhost:8000`
  - Path: `VITE_WS_PATH` con fallback `/notificaciones/socket.io`
  - `withCredentials: true`
  - reconexión automática con backoff de `500ms` a `5000ms`

### Caja

- La ruta `/app/caja` ya renderiza `CajaScreen`.
- Desde Mesas se agregó acción “Ir a caja” con `?mesaId=<id>`.
- Caja permite:
  - seleccionar mesa;
  - cargar cuenta activa por mesa;
  - abrir cuenta si no existe;
  - ver pedidos e ítems consolidados;
  - registrar pago sin optimistic update;
  - dividir cuenta en partes iguales;
  - cerrar cuenta con descuento opcional;
  - ver ticket devuelto por backend.
- Al registrar pago o cerrar cuenta se invalidan mesas y pedidos.

## Divergencias detectadas contra el plan

- El backend real usa `POST /cuentas/:id/cerrar`, no `PATCH /cuentas/:id/cerrar`.
- El pago real se registra en `POST /caja/pagos`, no en `POST /cuentas/:id/pagos`.
- `abrirCuenta` responde `{ message, cuenta }`, por lo que la API del frontend normaliza y devuelve solo `CuentaDto`.
- El socket backend define `path: '/api/socket.io'`; vía Kong se consume como `/notificaciones/socket.io` por `strip_path: true` y service URL `/api`.

## Checklist de validación

- [x] Build sin errores.
- [x] Socket conecta tras login/restore y desconecta en logout a nivel código.
- [ ] Crear un pedido desde otra sesión/terminal se refleja en la UI en <3 segundos.
- [ ] Avanzar estado de pedido en Cocina se refleja en Mesas sin recargar.
- [ ] Pantalla Caja carga cuenta de una mesa real.
- [ ] Registrar pago persiste en backend.
- [ ] Cerrar cuenta libera la mesa (estado LIBRE visible en Mesas).

## Pendiente para validar manualmente

- Probar con backend/Kong levantado y credenciales reales.
- Confirmar si `pedidoUpdate.pattern` llega siempre como string de routing key (`pedido.creado`, `pedido.actualizado`, etc.).
- Confirmar si `POST /caja/pagos` cierra automáticamente la cuenta vía evento `pago.registrado`; el frontend refresca después del pago, pero la consistencia final depende del procesamiento async del backend.

# Handoff Sprint 5 — Admin, Pulido y Producción

## Tareas completadas

| # | Tarea | Estado | Archivos |
|---|-------|--------|----------|
| 5.1 | Admin/Usuarios: tipos, API, mapper, store y pantalla | ✅ | `apps/pwa-cliente/src/types/usuario.types.ts`, `api/usuarios.api.ts`, `mappers/usuario.mapper.ts`, `store/usuarios.store.ts`, `screens/admin/UsuariosScreen.tsx` |
| 5.2 | Notificaciones: API, store, badge y push desde socket | ✅ | `api/notificaciones.api.ts`, `types/notificacion.types.ts`, `store/notificaciones.store.ts`, `components/layout/Header.tsx`, `services/socket.service.ts` |
| 5.3 | Error boundaries por módulo | ✅ | `components/ui/ErrorBoundary.tsx`, `router/index.tsx` |
| 5.4 | Detección offline y deshabilitado de mutaciones | ✅ | `hooks/useOnlineStatus.ts`, `components/layout/Shell.tsx`, pantallas con mutaciones |
| 5.5 | Funciones sin backend no mockeadas | ✅ | UI conserva empty states y no inventa datos |
| 5.6 | Variables por ambiente | ✅ | `.env.development`, `.env.production`, `.env.example` |
| 5.7 | Smoke test de build y preview | ✅ | `npm exec nx run pwa-cliente:typecheck`, `npm exec nx run pwa-cliente:build`, preview local |

## Build y verificación

```text
✓ npm exec nx run pwa-cliente:typecheck
✓ npm exec nx run pwa-cliente:build
  98 modules transformed.
  dist/index.html                 0.92 kB
  dist/assets/index-Ckvws-bq.css  25.54 kB
  dist/assets/index-D7AeE8Dj.js   361.93 kB
```

Smoke test visual:

```text
✓ Preview local en http://127.0.0.1:4200
✓ Renderiza pantalla de login
✓ Sin errores de consola capturados en el navegador integrado
```

Verificación `window.DATA`:

```text
rg "window\.DATA" apps/pwa-cliente/src → 0 resultados
```

## Implementación

### Admin/Usuarios

- La ruta `/app/usuarios` renderiza `UsuariosScreen`.
- Lista usuarios reales desde `GET /identidad/usuarios`.
- Permite crear usuario con `POST /identidad/usuarios`.
- Permite cambiar rol con `PATCH /identidad/usuarios/:id/rol`.
- Las mutaciones quedan deshabilitadas cuando `navigator.onLine === false`.

### Notificaciones

- Header muestra badge de notificaciones no leídas.
- `GET /notificaciones` se consume si el backend lo expone.
- Los eventos `pedidoUpdate` del socket agregan una notificación UI local y siguen invalidando stores.
- No se inventan notificaciones persistidas si el endpoint no existe: el store queda en empty state.

### Pulido transversal

- Cada screen protegida quedó envuelta en `ErrorBoundary` propio.
- Se agregó banner global offline en el shell.
- Se deshabilitaron mutaciones en Mesas, Pedidos, Cocina, Caja, Reservas, Inventario y Usuarios cuando la app está offline.
- `auth.api.login()` ahora normaliza la respuesta real del backend (`{ access_token, usuario }`) y conserva compatibilidad si el backend devuelve el usuario directo.

## Divergencias detectadas contra el plan

- El servicio `servicio-notificaciones` actual no expone todavía `GET /notificaciones`; solo tiene healthcheck y gateway Socket.IO. El frontend está preparado para consumirlo cuando exista.
- `.env.production` queda apuntando a `http://localhost:8000` como placeholder de Kong local; debe ajustarse al Kong de producción durante despliegue.
- No se pudo validar el flujo completo con backend/Kong real levantado en esta ejecución.

## Checklist final

- [x] Build de producción sin warnings críticos.
- [ ] Login → Mesas → Pedido → Cocina → Caja → Pago → Mesa libre: pendiente de validar con backend real.
- [ ] Crear reserva y verificar en agenda: pendiente de validar con backend real.
- [ ] Reponer stock y verificar actualización: pendiente de validar con backend real.
- [x] Error boundary captura errores de módulo sin tumbar la app entera a nivel código.
- [x] Banner offline aparece al desconectar red a nivel código.
- [x] Ninguna pantalla nueva muestra datos mock o inventados.
- [x] No existe referencia a `window.DATA` en `apps/pwa-cliente/src`.

## Pendiente recomendado

- Implementar `GET /notificaciones` en `servicio-notificaciones` si se requiere historial persistido.
- Validar manualmente con Kong/backend y credenciales reales.
- Reemplazar `VITE_API_BASE_URL` en `.env.production` con la URL definitiva de despliegue.

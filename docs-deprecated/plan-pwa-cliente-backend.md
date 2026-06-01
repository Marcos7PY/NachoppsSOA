# Plan: Convertir `pwa-cliente` de maqueta a PWA funcional contra el backend actual

## Summary

Conectar la app React/Vite `pwa-cliente` al backend existente detrás de Kong (`http://localhost:8000`) usando las APIs reales disponibles. Mantener el diseño hi-fi actual, reemplazar el store mock por datos remotos, y ocultar/deshabilitar las funciones del prototipo que todavía no existen en backend.

## Implementation Changes

- Crear una capa API en el PWA con `axios` y `withCredentials: true`, base URL configurable por `VITE_API_BASE_URL`, default `http://localhost:8000`.
- Autenticación real:
  - `POST /identidad/auth/login` con `{ email, password }`.
  - Restaurar sesión con `GET /identidad/auth/me`.
  - Usar cookie httpOnly `access_token`; no guardar JWT en `localStorage`.
  - Logout será local-only porque no existe endpoint backend para limpiar cookie.
- Sustituir `window.DATA` como fuente de verdad por un `remoteStore` central:
  - `GET /mesas`
  - `GET /pedidos`
  - `GET /cuentas/:id`, `GET /cuentas/mesa/:mesaId`
  - `GET /inventario/categorias`, `GET /inventario/productos`
  - `GET /reservas`
  - `GET /caja`
  - `GET /identidad/usuarios`
  - `GET /reportes/resumen`
  - `GET /notificaciones`
- Implementar mutaciones reales:
  - Mesas: crear mesa, cambiar estado.
  - Pedidos: crear pedido de salón con `mesaId`, listar, avanzar estado de pedido o ítem.
  - Cuentas/Caja: abrir cuenta, cerrar cuenta, dividir cuenta, registrar pago.
  - Reservas: crear, confirmar, cancelar, consultar disponibilidad.
  - Inventario: crear categoría/producto, reponer stock.
  - Usuarios: crear usuario, cambiar rol.
- Integrar Socket.IO para eventos:
  - Conectar a Kong en `/notificaciones/socket.io`.
  - Escuchar `pedidoUpdate`.
  - Al recibir evento, refrescar pedidos, cuentas, mesas, reservas e inventario según el `pattern`.
- Adaptar la UI del prototipo al soporte real:
  - Mantener Mesas, Pedidos, Cocina, Caja, Reservas, Inventario, Reportes, Usuarios y Notificaciones.
  - Ocultar o marcar como "pendiente de backend" delivery, para llevar, comprobante SUNAT real, descuentos/cortesías con PIN, anulación de ítems, permisos granulares, Estado/DLQ y métricas profundas.
  - Mantener apariencia, tema, command palette y navegación.

## Data Mapping

- Normalizar DTOs backend al shape visual actual:
  - `MesaDto.numero` -> tarjeta `M##`; `ubicacion` -> zona.
  - `PedidoDto.items` -> líneas KDS/carrito; `estado` controla columnas de Cocina.
  - `CuentaDto.pedidos` + `total` -> cuenta activa de mesa y Caja.
  - `ProductoDto.categoriaId`, `precio`, `stockActual`, `disponible` -> catálogo e inventario.
  - `ReservaDto` -> agenda diaria.
  - `TransaccionDto` -> tabla de transacciones.
- Donde el backend devuelva menos datos que la maqueta, renderizar campos secundarios como ausentes, no inventados.

## Test Plan

- Build: `npm exec nx run pwa-cliente:build`.
- Smoke manual con backend/Kong arriba:
  - Login real.
  - Cargar Mesas/Pedidos/Cuentas/Inventario/Reservas/Usuarios/Reportes.
  - Crear pedido para una mesa existente y verificar que aparece en Pedidos/Cocina.
  - Registrar pago y verificar liberación/cierre eventual tras refresco.
  - Crear reserva, confirmar y cancelar.
  - Reponer stock y verificar actualización.
- Error states:
  - 401 redirige a Login.
  - 409 muestra conflicto accionable.
  - 429 muestra rate limit.
  - Backend caído muestra estado offline/reintentar sin romper la UI.
- WebSocket:
  - Crear/actualizar pedido desde backend o UI.
  - Confirmar recepción de `pedidoUpdate` y refresh visual.

## Assumptions

- Esta etapa consume solo el backend existente; no agrega nuevas APIs backend.
- Kong será la única entrada HTTP del PWA: `http://localhost:8000`.
- El PWA corre en `http://localhost:4200`, permitido por CORS actual.
- Se conserva la arquitectura visual actual basada en módulos JSX globales, pero se puede introducir una capa API limpia en `src/app/api` sin rediseñar toda la app.
- Las funciones sin API quedan ocultas o deshabilitadas, no mockeadas.

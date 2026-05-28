# Frontend: PWA Cliente (`apps/pwa-cliente`)

Aplicación frontend construida como una Single Page Application (SPA) / Progressive Web App (PWA).

## 1. Tecnologías y Configuración Base

- **Framework:** React 19 (`react`, `react-dom`).
- **Bundler:** Vite (`@nx/vite`, `@vitejs/plugin-react`).
- **Enrutamiento:** `react-router-dom` (v6+).
- **Estilado:** Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`) y UI de Radix (`@radix-ui/react-*`) junto con utilidades de clases como `clsx` y `tailwind-merge`.
- **Gestión de Estado:** Zustand (`zustand`).

## 2. Gestión de Estado Global (Zustand)

El estado global de autenticación se maneja explícitamente en el archivo:
**Ruta:** `apps/pwa-cliente/src/store/auth.store.ts`

- **Hook:** `useAuthStore`
- **Estado almacenado:**
  - `token` (string | null): El JWT de autenticación.
  - `usuario` (UsuarioDto sin 'activo' ni 'createdAt'): Perfil del usuario (id, email, rol).
  - `isAuthenticated` (boolean): Flag derivado.
- **Acciones:**
  - `setSession(token, usuario)`: Guarda la sesión.
  - `clearSession()`: Limpia el estado.
- **Middleware:** `persist` para guardar la sesión en `localStorage` bajo la clave `nachopps-auth-storage`.

## 3. Cliente HTTP e Interceptores

El cliente HTTP está centralizado y configurado mediante Axios.
**Ruta:** `apps/pwa-cliente/src/api/client.ts`

- **Base URL:** `http://localhost:8000` (Apunta estáticamente al API Gateway Kong).
- **Interceptor de Request:** Extrae el `token` de `useAuthStore.getState().token` y lo adjunta en los headers (`Authorization: Bearer <token>`).
- **Interceptor de Response:** Escucha errores globales. Si el código de estado es `401 Unauthorized`, invoca `clearSession()` de Zustand y redirige forzosamente a `/login` si no está ya en esa ruta.

### Inventario de Servicios (Llamadas a la API)

En el directorio `src/api/` existe un servicio para cada microservicio del backend. (Ejemplo validado: `mesas.service.ts` L1-L22).
- `auditoria.service.ts`
- `caja.service.ts`
- `cuentas.service.ts`
- `inventario.service.ts`
- `mesas.service.ts` (Rutas: `GET /mesas`, `POST /mesas`, `PATCH /mesas/:id/estado`)
- `pedidos.service.ts`
- `reportes.service.ts`
- `reservas.service.ts`
- `usuarios.service.ts`

Cada servicio expone un objeto exportado (ej. `MesasApi`) que implementa las promesas de Axios llamando a las rutas correspondientes del API Gateway.

## 4. Enrutamiento y Estructura de Vistas

El enrutador principal reside en **`src/app/app.tsx`** (L15-40). Define la siguiente estructura de vistas:

### Vistas Públicas
- **Ruta `/login`**: Renderiza `<Login />` (`src/views/Login/Login`).

### Vistas Protegidas
Todas las rutas internas están envueltas por `<ProtectedRoute />` (`src/components/ProtectedRoute.tsx`) y estructuradas visualmente por `<AppLayout />` (`src/components/layout/AppLayout`).

- **`/`**: `<Dashboard />` (`src/views/Dashboard/Dashboard`)
- **`/reservas`**: `<Reservas />` (`src/views/Reservas/Reservas`)
- **`/inventario`**: `<Inventario />` (`src/views/Inventario/Inventario`)
- **`/mesas`**: `<Mesas />` (`src/views/Mesas/Mesas`)
- **`/pedidos`**: `<Pedidos />` (`src/views/Pedidos/Pedidos`)
- **`/caja`**: `<Caja />` (`src/views/Caja/Caja`)
- **`/cocina`**: `<Cocina />` (`src/views/Cocina/Cocina`) - *Funciona como KDS*
- **`/auditoria`**: `<Auditoria />` (`src/views/Auditoria/Auditoria`)
- **`/control-caja`**: `<ControlCaja />` (`src/views/ControlCaja/ControlCaja`)

## 5. Componentes Reusables

Los componentes de UI residen en `src/components/`:
- **Modales Genéricos:** `src/components/Modal/`
- **UI Primitives:** `src/components/ui/` (Donde se agrupan los componentes base como Botones, Inputs, integrados probablemente con Radix/Tailwind).
- **Componentes Específicos:** `ReservaCard`, `ReservaFormModal`, entre otros.

## 6. Observaciones y Deuda Técnica (Específica del Frontend)

1. **Hardcoding del API Gateway:** En `src/api/client.ts` la URL base es explícitamente `http://localhost:8000`. Esto debe extraerse a variables de entorno (`import.meta.env.VITE_API_URL`) para soportar despliegues fuera del entorno de desarrollo.
2. **WebSocket (Notificaciones):** No se detectaron referencias directas a WebSockets (Socket.io) en el estado principal. Si la vista de `/cocina` (KDS) requiere actualizaciones en tiempo real, se debe validar que el cliente establezca la conexión `ws://localhost:8000/api/socket.io` gestionada por Kong/Notificaciones.

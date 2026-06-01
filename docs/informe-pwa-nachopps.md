# Informe Técnico — PWA NachoPps POS
> **Versión analizada:** `@org/pwa-cliente v0.0.1` · **Stack:** React 18 + TypeScript + Vite + Zustand · **Fecha de análisis:** 2026-06-01

---

## Tabla de contenidos

1. [Visión general](#1-visión-general)
2. [Arquitectura de la aplicación](#2-arquitectura-de-la-aplicación)
3. [Arranque y Bootstrap (`main.tsx`)](#3-arranque-y-bootstrap-maintsx)
4. [Router y guardias de ruta](#4-router-y-guardias-de-ruta)
5. [Capa API](#5-capa-api)
   - 5.1 [Cliente HTTP (`client.ts`)](#51-cliente-http-clientts)
   - 5.2 [Módulos de API por dominio](#52-módulos-de-api-por-dominio)
   - 5.3 [Utilidades de desempaquetado (`response.ts`)](#53-utilidades-de-desempaquetado-responsests)
6. [Stores Zustand (estado global)](#6-stores-zustand-estado-global)
7. [Mappers (DTO → ViewModel)](#7-mappers-dto--viewmodel)
8. [Tipos TypeScript](#8-tipos-typescript)
9. [Servicio WebSocket (`socket.service.ts`)](#9-servicio-websocket-socketservicets)
10. [Screens (pantallas)](#10-screens-pantallas)
    - 10.1 [LoginScreen](#101-loginscreen)
    - 10.2 [MesasScreen](#102-mesasscreen)
    - 10.3 [PedidosScreen](#103-pedidosscreen)
    - 10.4 [CocinaScreen (KDS)](#104-cocinascreen-kds)
    - 10.5 [DeliveryScreen](#105-deliveryscreen)
    - 10.6 [CrearPedidoScreen](#106-crearpedidoscreen)
    - 10.7 [CajaScreen](#107-cajascreen)
    - 10.8 [ReservasScreen](#108-reservasscreen)
    - 10.9 [InventarioScreen](#109-inventarioscreen)
    - 10.10 [ReportesScreen](#1010-reportesscreen)
    - 10.11 [UsuariosScreen](#1011-usuariosscreen)
11. [Componentes de Layout](#11-componentes-de-layout)
    - 11.1 [Shell](#111-shell)
    - 11.2 [Sidebar](#112-sidebar)
    - 11.3 [Header](#113-header)
12. [Componentes de Dominio](#12-componentes-de-dominio)
13. [Componentes de UI](#13-componentes-de-ui)
14. [Hooks personalizados](#14-hooks-personalizados)
15. [PWA — Service Worker y Manifest](#15-pwa--service-worker-y-manifest)
16. [Variables de entorno](#16-variables-de-entorno)
17. [Flujos de datos completos](#17-flujos-de-datos-completos)
18. [Diagrama de dependencias entre módulos](#18-diagrama-de-dependencias-entre-módulos)

---

## 1. Visión general

**NachoPps POS** es una Progressive Web App (PWA) orientada a la operación completa de un restobar. Permite gestionar:

- Mesas del salón con estados en tiempo real
- Pedidos de salón, delivery y para llevar
- KDS (Kitchen Display System) para cocina y bar
- Caja: cobros, división y cierre de cuentas
- Reservas con verificación de disponibilidad
- Inventario de productos y stock
- Reportes de ventas diarias
- Administración de usuarios y roles

La aplicación funciona **offline** para navegación y lectura de datos cacheados, y vuelve a sincronizarse automáticamente cuando recupera conexión. Las mutaciones (escritura) están deshabilitadas mientras no hay red.

---

## 2. Arquitectura de la aplicación

```
src/
├── main.tsx                 ← Bootstrap: tema, auth restore, SW, React root
├── styles.css               ← Design tokens + utilidades CSS globales
├── router/
│   └── index.tsx            ← React Router v7, rutas protegidas y públicas
├── api/                     ← Capa de acceso HTTP (sin axios, fetch nativo)
│   ├── client.ts            ← Wrapper fetch con JWT y manejo de errores
│   ├── auth.api.ts
│   ├── cuentas.api.ts
│   ├── inventario.api.ts
│   ├── mesas.api.ts
│   ├── notificaciones.api.ts
│   ├── pedidos.api.ts
│   ├── reportes.api.ts
│   ├── reservas.api.ts
│   ├── response.ts          ← Helpers unwrapArray / unwrapEntity
│   └── usuarios.api.ts
├── store/                   ← Estado global con Zustand
│   ├── auth.store.ts
│   ├── cuentas.store.ts
│   ├── inventario.store.ts
│   ├── mesas.store.ts
│   ├── notificaciones.store.ts
│   ├── pedidos.store.ts
│   ├── reportes.store.ts
│   ├── reservas.store.ts
│   └── usuarios.store.ts
├── mappers/                 ← Transformación DTO → ViewModel
│   ├── cuenta.mapper.ts
│   ├── inventario.mapper.ts
│   ├── mesa.mapper.ts
│   ├── notificacion.mapper.ts
│   ├── pedido.mapper.ts
│   ├── reporte.mapper.ts
│   ├── reserva.mapper.ts
│   └── usuario.mapper.ts
├── types/                   ← Interfaces y enums TypeScript
│   ├── auth.types.ts
│   ├── cuenta.types.ts
│   ├── inventario.types.ts
│   ├── mesa.types.ts
│   ├── notificacion.types.ts
│   ├── pedido.types.ts
│   ├── reporte.types.ts
│   ├── reserva.types.ts
│   └── usuario.types.ts
├── services/
│   └── socket.service.ts    ← Singleton Socket.IO para actualizaciones RT
├── hooks/
│   └── useOnlineStatus.ts   ← Hook que detecta online/offline
├── screens/                 ← Pantallas (una por módulo de negocio)
│   ├── login/
│   ├── ops/                 ← Mesas, Pedidos, Cocina, Delivery, CrearPedido
│   ├── caja/
│   ├── reservas/
│   ├── inventario/
│   ├── reportes/
│   └── admin/
└── components/
    ├── layout/              ← Shell, Sidebar, Header
    ├── ui/                  ← ErrorBoundary
    └── domain/              ← MesaCard, ItemKDS, PedidoRow
```

**Patrón arquitectónico:** `Screen → Store → API → Backend`. Cada pantalla consume uno o más stores Zustand que orquestan las llamadas a la capa API. Los datos que llegan del backend (DTOs) son transformados por mappers antes de guardarse en el store como ViewModels listos para renderizar.

---

## 3. Arranque y Bootstrap (`main.tsx`)

### Qué hace
Es el punto de entrada de la aplicación. Ejecuta cuatro pasos en secuencia antes de montar React:

1. **Restaurar tema persistido** — lee `nachopps-theme` de `localStorage` y aplica `data-theme` al `<html>` para que el CSS de variables aplique antes del primer render y evitar el parpadeo de tema.

2. **Escuchar `auth:expired`** — registra un listener global que llama a `useAuthStore.logout()` cuando el cliente HTTP detecta un 401. Esto fuerza el cierre de sesión desde cualquier parte de la app.

3. **Restaurar sesión (`authStore.restore()`)** — llama a `GET /identidad/auth/me` con la cookie de sesión o el JWT guardado en `localStorage`. Si el servidor responde con éxito, el usuario queda autenticado sin pasar por el formulario de login. Si falla, limpia el token.

4. **Registrar Service Worker** — solo en producción (`process.env.NODE_ENV === 'production'`), registra `/sw.js` en el evento `load` del `window`.

5. **Montar React** — crea el root con `createRoot` y renderiza `<AppRouter />` dentro de `<StrictMode>`.

### Consume
- `useAuthStore` (para `restore()` y `logout()`)
- `AppRouter`
- `styles.css`

---

## 4. Router y guardias de ruta

**Archivo:** `src/router/index.tsx`

### Estructura de rutas

```
/login              → LoginScreen          (pública, redirige a /app si autenticado)
/app                → ProtectedRoute
  /app              → redirige a /app/mesas
  /app/mesas        → MesasScreen
  /app/pedidos      → PedidosScreen
  /app/crear-pedido → CrearPedidoScreen
  /app/cocina       → CocinaScreen
  /app/delivery     → DeliveryScreen
  /app/caja         → CajaScreen
  /app/reservas     → ReservasScreen
  /app/inventario   → InventarioScreen
  /app/reportes     → ReportesScreen
  /app/usuarios     → UsuariosScreen
/*                  → redirige a /app
```

### Guardias

**`ProtectedRoute`** — lee `authenticated` del store de auth. Si es `false`, redirige a `/login`. Si es `true`, renderiza el `<Shell>` con un `<Outlet>`.

**`PublicRoute`** — si `authenticated` es `true`, redirige a `/app` (el usuario ya inició sesión). Si es `false`, renderiza el `<Outlet>` (muestra el login).

**`ScreenBoundary`** — envuelve cada screen en un `<ErrorBoundary>` con el nombre del módulo para capturar errores de render sin romper toda la app.

---

## 5. Capa API

### 5.1 Cliente HTTP (`client.ts`)

**Propósito:** wrapper delgado sobre `fetch` nativo que centraliza autenticación, cabeceras y manejo de errores HTTP. No usa axios.

**Gestión de token JWT:**
- El token se guarda en `localStorage` bajo la clave `nachopps.access_token`.
- `setAuthToken(token)` — guarda en memoria y en `localStorage`.
- `getAuthToken()` — devuelve el token en memoria.
- `clearAuthToken()` — elimina de memoria y `localStorage`.

**Flujo de una petición:**
1. Construye la URL concatenando `VITE_API_BASE_URL` (de variables de entorno) con el `path`.
2. Agrega `Content-Type: application/json` si no está presente.
3. Agrega `Authorization: Bearer <token>` si hay token activo.
4. Llama a `fetch` con `credentials: 'include'` para enviar cookies de sesión también.
5. Si la respuesta no es `ok`:
   - **401** → llama a `clearAuthToken()` y dispara el evento `auth:expired` para que el bootstrap lo capture.
   - **429** → lanza error con mensaje amigable de rate limit.
   - Cualquier otro error → lanza `ApiError` con el status y body parseado.
6. Si la respuesta es `204 No Content` → devuelve `undefined`.
7. En caso contrario → parsea y devuelve el JSON.

**Helpers tipados exportados:**
```typescript
client.get<T>(path, init?)
client.post<T>(path, body?, init?)
client.patch<T>(path, body?, init?)
client.delete<T>(path, init?)
```

---

### 5.2 Módulos de API por dominio

Cada módulo importa `client` y los helpers de `response.ts`, y exporta funciones que mapean directamente a endpoints del backend.

#### `auth.api.ts`
| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `login(req)` | POST | `/identidad/auth/login` | Login con email + password. Si la respuesta contiene `access_token`, llama a `setAuthToken` automáticamente. |
| `me()` | GET | `/identidad/auth/me` | Restaurar sesión con cookie/token existente. |
| `logout()` | POST | `/identidad/auth/logout` | Notifica al backend y limpia sesión. |

#### `mesas.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getAll()` | GET | `/mesas` |
| `getById(id)` | GET | `/mesas/:id` |
| `cambiarEstado(id, payload)` | PATCH | `/mesas/:id/estado` |

#### `pedidos.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getAll(mesaId?)` | GET | `/pedidos?mesaId=...` |
| `crear(payload)` | POST | `/pedidos` |
| `avanzarEstado(id, payload)` | PATCH | `/pedidos/:id/estado` |
| `avanzarItem(itemId, payload)` | PATCH | `/pedidos/items/:itemId/estado` |

#### `cuentas.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getById(id)` | GET | `/cuentas/:id` |
| `getByMesa(mesaId)` | GET | `/cuentas/mesa/:mesaId` |
| `abrir(mesaId)` | POST | `/cuentas` |
| `cerrar(id, payload)` | POST | `/cuentas/:id/cerrar` |
| `dividir(id, payload)` | POST | `/cuentas/:id/dividir` |
| `registrarPago(payload)` | POST | `/caja/pagos` |

#### `inventario.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getCategorias()` | GET | `/inventario/categorias` |
| `getProductos(categoriaId?)` | GET | `/inventario/productos?categoriaId=...` |
| `crearProducto(payload)` | POST | `/inventario/productos` |
| `reponerStock(id, cantidad)` | PATCH | `/inventario/productos/:id/stock` |

#### `reservas.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getAll()` | GET | `/reservas` |
| `crear(payload)` | POST | `/reservas` |
| `confirmar(id)` | PATCH | `/reservas/:id/confirmar` |
| `cancelar(id, motivo?)` | DELETE | `/reservas/:id` |
| `disponibilidad(fecha, hora)` | GET | `/reservas/disponibilidad?fecha=&hora=` |

#### `notificaciones.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getAll()` | GET | `/notificaciones` |

#### `reportes.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getResumen()` | GET | `/reportes/resumen` |

#### `usuarios.api.ts`
| Función | Método | Endpoint |
|---------|--------|----------|
| `getAll()` | GET | `/identidad/usuarios` |
| `crear(payload)` | POST | `/identidad/usuarios` |
| `cambiarRol(id, payload)` | PATCH | `/identidad/usuarios/:id/rol` |

---

### 5.3 Utilidades de desempaquetado (`response.ts`)

El backend puede responder de dos formas distintas para el mismo endpoint (array plano o envuelto en un objeto). Estas dos funciones normalizan ambos casos:

**`unwrapArray<T>(response, key)`** — si `response` es un array, lo devuelve directamente. Si es un objeto con la propiedad `key` que contiene un array, devuelve ese array. Si ninguno, devuelve `[]`.

**`unwrapEntity<T>(response, key)`** — si `response` es un objeto con la propiedad `key`, devuelve `response[key]`. Si no, devuelve `response` tal cual.

Ejemplo: `GET /mesas` puede responder `[{...}, {...}]` o `{ mesas: [{...}, {...}] }`. `unwrapArray(response, 'mesas')` maneja ambos.

---

## 6. Stores Zustand (estado global)

Cada store sigue el mismo patrón: interfaz de estado + interfaz de acciones + función `create<Store>`. Todos los stores son **singletons** accesibles desde cualquier componente mediante el hook `use___Store()`.

### `auth.store.ts`

**Estado:** `user: UserDto | null`, `authenticated: boolean`, `loading: boolean`

**Acciones:**
- `login(req)` — llama a `authApi.login()`, guarda el usuario y conecta el WebSocket.
- `logout()` — llama a `authApi.logout()` de forma asíncrona sin esperar (el backend puede rechazarla), limpia el token local y desconecta el socket.
- `restore()` — intenta `authApi.me()`. Si tiene éxito, autentica al usuario y conecta el socket. Si falla, limpia el estado.

**Nota:** Al hacer login o restore exitoso, conecta el `socketService`. Al logout, lo desconecta.

---

### `mesas.store.ts`

**Estado:** `mesas: MesaVM[]`, `loading`, `error`

**Acciones:**
- `fetch()` — carga todas las mesas con spinner de loading. Llama a `mesasApi.getAll()` y mapea los DTOs a ViewModels.
- `invalidate()` — igual que `fetch()` pero sin mostrar el estado `loading` (actualización silenciosa para refrescos reactivos).
- `optimisticCambiarEstado(id, estado)` — actualiza el estado de la mesa **localmente de inmediato** (optimistic update) y luego confirma con el backend. Si el backend falla, revierte el estado anterior.

---

### `pedidos.store.ts`

**Estado:** `pedidos: PedidoVM[]`, `loading`, `error`

**Acciones:**
- `fetch(mesaId?)` — carga pedidos opcionalmente filtrados por mesa.
- `invalidate()` — refetch silencioso sin loading.
- `crear(payload)` — POST al backend sin optimistic update (espera confirmación). Prepende el nuevo pedido al array.
- `avanzarEstado(id, estado)` — PATCH del estado del pedido completo. Actualiza el pedido en el array local.
- `avanzarItem(itemId, estado)` — PATCH del estado de un ítem individual. Luego llama a `invalidate()` para obtener el estado completo actualizado.

---

### `cuentas.store.ts`

**Estado:** `cuentaActiva: CuentaVM | null`, `loading`, `error`, `success`, `ticket: TicketDto | null`, `division: DividirCuentaResponse | null`

**Acciones:**
- `cargar(mesaId)` — obtiene la cuenta abierta de una mesa por `GET /cuentas/mesa/:mesaId`.
- `abrir(mesaId)` — crea una nueva cuenta. Después invalida el store de mesas.
- `registrarPago(payload)` — registra el pago en caja. Después invalida cuentas, mesas y pedidos en paralelo con `Promise.all`.
- `cerrar(descuento?)` — cierra la cuenta con un descuento opcional. Limpia `cuentaActiva` y guarda el ticket. Invalida mesas y pedidos.
- `dividir(payload)` — calcula la división (iguales o por ítems) y guarda el resultado en `division`.
- `invalidate()` — refetch silencioso de la cuenta activa por su ID.
- `clearFeedback()` — limpia los campos `error` y `success`.

---

### `inventario.store.ts`

**Estado:** `categorias: CategoriaDto[]`, `productos: ProductoVM[]`, `loading`, `saving`, `error`, `success`

**Acciones:**
- `fetch(categoriaId?)` — carga categorías y productos en paralelo con `Promise.all`. Mapea productos con sus categorías.
- `crearProducto(payload)` — POST al backend, mapea el DTO devuelto y lo agrega al inicio del array de productos.
- `reponerStock(id, cantidad)` — PATCH con la nueva cantidad de stock. Actualiza el producto en el array local.
- `clearFeedback()` — limpia `error` y `success`.

---

### `reservas.store.ts`

**Estado:** `reservas: ReservaVM[]`, `loading`, `saving`, `error`, `success`, `disponibilidad: DisponibilidadResponse | null`

**Acciones:**
- `fetch()` — carga todas las reservas.
- `crear(payload)` — POST nueva reserva, agrega al inicio del array.
- `confirmar(id)` — PATCH a `/reservas/:id/confirmar`, actualiza la reserva en el array.
- `cancelar(id, motivo?)` — DELETE con body opcional de motivo, actualiza la reserva.
- `consultarDisponibilidad(fecha, hora)` — GET de disponibilidad para el horario dado. Guarda el resultado en `disponibilidad`.
- `clearFeedback()` — limpia `error` y `success`.

---

### `notificaciones.store.ts`

**Estado:** `notificaciones: NotificacionVM[]` (máx. 20), `loading`, `error`

**Acciones:**
- `fetch()` — carga notificaciones desde `GET /notificaciones`.
- `pushFromSocket(evento)` — llamada por el servicio WebSocket cuando llega un evento. Convierte el payload del socket en un `NotificacionVM` y lo agrega al inicio del array, limitando a 20 ítems.
- `markAllRead()` — marca todas las notificaciones como `unread: false`.

---

### `reportes.store.ts`

**Estado:** `resumen: ResumenVM | null`, `loading`, `error`

**Acciones:**
- `fetch()` — carga el resumen diario desde `GET /reportes/resumen` y lo mapea a ViewModel.

---

### `usuarios.store.ts`

**Estado:** `usuarios: UsuarioVM[]`, `loading`, `saving`, `error`, `success`

**Acciones:**
- `fetch()` — carga todos los usuarios.
- `crear(payload)` — POST nuevo usuario.
- `cambiarRol(id, rol)` — PATCH del rol del usuario, actualiza en array local.
- `clearFeedback()` — limpia `error` y `success`.

---

## 7. Mappers (DTO → ViewModel)

Los mappers transforman los datos crudos del backend (DTOs) en ViewModels con campos calculados y listos para la UI.

### `mesa.mapper.ts`
- `numero`: string formateado con `padStart(2, '0')` → `"01"`, `"02"`.
- `numeroRaw`: el número entero original para ordenamiento.
- `zona`: alias de `ubicacion`.
- `estadoClass`: clase CSS según estado → `'libre'`, `'ocup'`, `'resv'`.
- `estadoLabel`: etiqueta legible → `'Libre'`, `'Ocupada'`, `'Reservada'`.
- `mapMesas()` también ordena por `numeroRaw`.

### `pedido.mapper.ts`
- `mesaNumero`: `padStart(2, '0')` o `'??'` si no viene `numeroMesa`.
- `tiempoTranscurrido`: calcula diferencia desde `createdAt` → `'Ahora'`, `'X min'`, `'Xh Ym'`.
- `estadoClass` y `estadoLabel`: mapeados desde constantes (`badge-warn`, `badge-info`, etc.).
- `cantidadItems`: suma de las cantidades de todos los ítems.
- Para cada `PedidoItemVM`: calcula `subtotal = cantidad × precioUnitario`, asigna `id` con `crypto.randomUUID()` si no viene del backend.

### `cuenta.mapper.ts`
- Llama a `mapPedidos()` sobre los pedidos anidados.
- Calcula `cantidadPedidos` y `cantidadItems`.
- `estadoLabel`: `'Abierta'`, `'Cerrada'`, `'Pagada'`.

### `inventario.mapper.ts`
- `precioLabel`: formateado con `Intl.NumberFormat('es-PE', { currency: 'PEN' })` → `"S/ 15.00"`.
- `stockLabel`: el número o `'Sin control'` si es `null`.
- `stockClass`: `'badge-danger'` (≤0), `'badge-warn'` (≤5), `'badge-ok'` (>5), `'badge-muted'` (null).
- `categoriaNombre`: busca en el array de categorías si no viene embebido en el DTO.

### `reserva.mapper.ts`
- `estadoLabel` y `estadoClass`: mapeados para los 4 estados (`PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `EXPIRADA`).
- `fechaHoraLabel`: formateado con `Intl` localizado para `es-PE`.

### `notificacion.mapper.ts`
- `mapNotificacion(dto)`: para notificaciones cargadas desde REST.
- `mapSocketNotification(evento)`: para eventos en tiempo real. Extrae el `pattern` del evento como título y genera un ID temporal con `Date.now()` si no viene del servidor.
- `timestampLabel`: hora formateada `HH:MM`.

### `reporte.mapper.ts`
- `fechaLabel`: fecha en formato largo en español.
- `ingresosLabel`: moneda peruana.
- `ticketPromedio`: `ingresosTotales / totalVentas`, o `null` si no hay ventas.

### `usuario.mapper.ts`
- `rolLabel`: etiqueta legible del rol.
- `estadoLabel`: `'Activo'` / `'Inactivo'`.
- `estadoClass`: `'badge-ok'` / `'badge-muted'`.
- `createdAtLabel`: fecha formateada.

---

## 8. Tipos TypeScript

Los tipos están organizados en archivos por dominio dentro de `src/types/`. Cada archivo define:

- **DTOs** (`XxxDto`): forma exacta de los datos que devuelve el backend.
- **ViewModels** (`XxxVM`): datos enriquecidos listos para la UI.
- **Payloads** (`XxxPayload`): datos que se envían al backend.
- **Enums** como objetos `const` para tener tanto el tipo como el valor en runtime (patrón TypeScript idiomático).

### Enums principales

**`EstadoMesa`:** `LIBRE | OCUPADA | RESERVADA`

**`EstadoPedido`:** `PENDIENTE | EN_PREPARACION | LISTO | ENTREGADO | PAGADO | CANCELADO`

**`ItemArea`:** `COCINA | BAR` — Indica en qué área de preparación se debe atender el ítem.

**`CuentaEstado`:** `ABIERTA | CERRADA | PAGADA`

**`MetodoPago`:** `EFECTIVO | TARJETA | TRANSFERENCIA | YAPE | PLIN`

**`ReservaEstado`:** `PENDIENTE | CONFIRMADA | CANCELADA | EXPIRADA`

**`RolUsuario`:** `ADMIN | CAJERO | COCINA | MESERO | RECEPCION | GERENCIA | SISTEMA`

---

## 9. Servicio WebSocket (`socket.service.ts`)

**Patrón:** Singleton. Crea una única instancia de `socket.io-client` que se reutiliza en toda la app.

### Configuración de conexión
- **URL:** `VITE_API_BASE_URL`
- **Path:** `VITE_WS_PATH` (por defecto `/notificaciones/socket.io`)
- **Transports:** `['websocket', 'polling']` — primero intenta WebSocket, cae a polling si falla.
- **Autenticación:** envía el JWT en el campo `auth.token` y también en `query.jwt` para compatibilidad con middlewares que leen cualquiera de los dos.
- **Reconexión:** automática, infinita, con backoff de 500ms a 5000ms.

### Eventos escuchados
- **`pedidoUpdate`**: cualquier actualización del backend relacionada a pedidos. Al recibirlo:
  1. Llama a `notificacionesStore.pushFromSocket(evento)` para mostrar la notificación en el Header.
  2. Llama a `invalidateForPattern(evento.pattern)` para refrescar los stores afectados.

### Lógica de invalidación por patrón
La función `invalidateForPattern` decide qué stores refrescar según el prefijo del evento:

| Patrón del evento | Stores invalidados |
|-------------------|--------------------|
| `pedido.*` (o sin patrón) | `pedidos`, `mesas`, `cuentas` |
| `cuenta.*` o `pago.*` | `mesas`, `pedidos`, `cuentas` |
| `mesa.*` | `mesas`, `pedidos` |

Los refrescos se ejecutan con `Promise.allSettled` para que un fallo no bloquee los demás.

### API pública del servicio
```typescript
socketService.connect()      // Conecta o reconecta con el JWT actual
socketService.disconnect()   // Desconecta
socketService.isConnected()  // boolean
```

---

## 10. Screens (pantallas)

### 10.1 LoginScreen

**Ruta:** `/login`
**Store:** `useAuthStore`

**Qué hace:** Muestra un formulario de login con dos paneles: izquierdo (branding) y derecho (formulario). Al enviar, llama a `authStore.login()` y redirige a `/app` en caso de éxito.

**Flujo detallado:**
1. El usuario escribe email y contraseña.
2. `submit()` previene el default del formulario y llama a `authStore.login({ email, password })`.
3. Si tiene éxito, el store guarda el usuario, conecta el socket y el componente navega a `/app`.
4. Si falla con `ApiError`:
   - 401 → "Credenciales inválidas."
   - 429 → "Demasiadas solicitudes."
   - Otro → mensaje del servidor.
   - Sin conexión → "No se pudo conectar al servidor."

**Características UI:**
- Botón para mostrar/ocultar contraseña.
- Banner de error con dos variantes: `err` (rojo) y `warn` (amarillo).
- Inputs con clase `invalid` cuando hay error de credenciales.
- Estado de loading con spinner inline en el botón.
- Todos los íconos son SVG inline (sin dependencia de librería de íconos).

---

### 10.2 MesasScreen

**Ruta:** `/app/mesas`
**Stores:** `useMesasStore`, `useCuentasStore`, `usePedidosStore`

**Qué hace:** Muestra el grid del salón con todas las mesas físicas (número < 90). Cada tarjeta refleja el estado en tiempo real.

**Filtros disponibles:** Todas / Libres / Ocupadas / Reservadas / Con cuenta

**Flujo al cargar:**
1. `useEffect` dispara `mesasStore.fetch()` y `pedidosStore.fetch()`.
2. Un segundo `useEffect` añade un listener `window.focus` para refrescar al volver a la pestaña.

**Lógica de las tarjetas:**
- Muestra número de mesa, capacidad, zona y badge de estado.
- Para mesas **ocupadas con consumo**: muestra total acumulado, tiempo desde el primer pedido y cantidad de ítems pendientes en cocina.
- Click en la tarjeta → navega a `/app/crear-pedido?mesaId=...&canal=SALON`.
- Click en el badge → abre el drawer lateral con detalle de la mesa y la cuenta activa.

**Drawer lateral:**
- Carga la cuenta activa de la mesa con `cuentasStore.cargar(mesaId)`.
- Lista todos los ítems consumidos con subtotales y el total.
- Permite cambiar el estado de la mesa (optimistic update).
- Botones: "Ver cuenta / Caja" (navega a `/app/caja?mesaId=...`) y "Agregar pedido / Abrir cuenta".

**Estados de pantalla:** loading con skeleton, error con retry, vacío, y data.

---

### 10.3 PedidosScreen

**Ruta:** `/app/pedidos`
**Store:** `usePedidosStore`

**Qué hace:** Tabla con todos los pedidos activos del salón (mesa < 90), ordenables por estado. Permite avanzar el estado del pedido completo con un botón de acción.

**Filtros:** Todos / Pendientes / En preparación / Listos / Entregados

**Flujo de avance de estado:**
```
PENDIENTE → EN_PREPARACION → LISTO → ENTREGADO
```
Cada botón llama a `pedidosStore.avanzarEstado(id, nextEstado)`. El botón se deshabilita mientras hay una operación en curso (`actionLoading === pedido.id`) o sin conexión.

**Columnas de la tabla:** Mesa | Estado | Ítems | Total | Tiempo | Acción

---

### 10.4 CocinaScreen (KDS)

**Ruta:** `/app/cocina`
**Store:** `usePedidosStore`

**Qué hace:** Kitchen Display System en formato Kanban con 3 columnas: Pendiente, En preparación y Listo. Opera a nivel de **ítem individual**, no de pedido completo.

**Filtro de área:** Todo / Cocina / Bar

**Columnas Kanban:**

| Columna | Color | Items mostrados |
|---------|-------|-----------------|
| Pendiente | Amarillo | Items con `estado === 'PENDIENTE'` |
| En preparación | Azul | Items con `estado === 'EN_PREPARACION'` |
| Listo | Verde | Items con `estado === 'LISTO'` |

**Lógica de urgencia:** Cada tarjeta de pedido tiene una clase de urgencia calculada desde `createdAt`:
- `fresh` (< 10 min)
- `warn` (10-14 min) — fondo amarillo
- `late` (≥ 15 min) — fondo rojo + badge "DEMORA"

**Acciones por ítem:**
- `PENDIENTE` → botón Play (▶) → cambia a `EN_PREPARACION`.
- `EN_PREPARACION` → botón Check (✓) → cambia a `LISTO`.
- `avanzarItem(itemId, estado)` llama al API y luego hace un `invalidate()` completo del store de pedidos.

**Información por tarjeta:** número de mesa, tiempo transcurrido, lista de ítems con nombre, cantidad, notas y modificadores.

---

### 10.5 DeliveryScreen

**Ruta:** `/app/delivery`
**Stores:** `usePedidosStore`, `useMesasStore`, `useInventarioStore`

**Qué hace:** Pantalla dual. Panel izquierdo: lista de despachos activos (pedidos de mesas virtuales 98 y 99). Panel derecho: formulario de creación de pedidos.

**Mesas virtuales:**
- Mesa 99 → DELIVERY
- Mesa 98 → PARA LLEVAR
- Mesas < 90 → Salón (también disponible desde aquí)

**Formulario de creación:**
- Selector de tipo: `SALON | DELIVERY | LLEVAR`
- Para salón: selector de mesa física.
- Para delivery/llevar: campos de nombre, teléfono y dirección (delivery).
- Catálogo de productos con búsqueda por texto y filtro por categoría.
- Carrito con control de cantidad (+/-) y campo de notas por ítem.

**Estrategia de serialización de datos del cliente:**
Para delivery y llevar, los datos del cliente (nombre, teléfono, dirección) se serializan en el campo `notas` del **primer ítem** del pedido con el formato:
```
[DELIVERY] Cliente: Juan | Tel: 987654321 | Dir: Av. Larco 123
```
Esto permite que cocina y caja visualicen la información sin necesidad de campos extra en el modelo de pedido.

**Panel de despachos activos:**
- Extrae el nombre del cliente parseando el campo `notas` del primer ítem.
- Muestra tipo (DELIVERY/LLEVAR), total, estado y botón de avance.

---

### 10.6 CrearPedidoScreen

**Ruta:** `/app/crear-pedido?mesaId=...&canal=...`
**Stores:** `usePedidosStore`, `useMesasStore`, `useCuentasStore`, `useInventarioStore`

**Qué hace:** Pantalla de creación de pedidos unificada y más completa que `DeliveryScreen`. Diseñada principalmente para el flujo desde `MesasScreen`.

**Diferencias con DeliveryScreen:**
- Muestra el **consumo previo de la sesión** de la mesa en el panel del carrito (ítems ya pedidos en esta sesión).
- Incluye selector de proveedor de delivery (Rappi / Mostrador / App).
- Implementa **re-validación con reintentos** (`SYNC_RETRY_DELAYS_MS = [0, 500, 1000, 2000]`): después de crear el pedido, reintenta hasta 4 veces con delays crecientes para verificar que la mesa quedó marcada como ocupada y la cuenta fue creada.
- Navega automáticamente a `/app/mesas` (salón) o `/app/pedidos` (delivery/llevar) 1 segundo después del éxito.

**Grid de productos:**
- Cards clickeables para agregar al carrito.
- Badge con cantidad en la card si el producto ya está en el carrito.
- Cards deshabilitadas si `stockActual <= 0` con badge "Agotado".

**Panel del carrito:**
- Stepper de cantidad (+/-) por ítem.
- Campo de notas por ítem.
- Total calculado en tiempo real.
- Botón de envío deshabilitado si carrito vacío, sin conexión, o en proceso.

---

### 10.7 CajaScreen

**Ruta:** `/app/caja?mesaId=...`
**Stores:** `useCuentasStore`, `useMesasStore`

**Qué hace:** Módulo de caja para consultar la cuenta activa de una mesa, registrar pagos, dividir la cuenta y cerrarla.

**Flujo de inicialización:**
1. Carga todas las mesas.
2. Selecciona la mesa del query param `?mesaId=`. Si no hay, elige la primera ocupada; si no hay ocupadas, la primera mesa.
3. Al tener una `mesaId`, llama a `cuentasStore.cargar(mesaId)`.
4. Cuando hay cuenta activa, prelllena el campo `monto` con el total de la cuenta.

**Layout:** 2 columnas.
- **Izquierda (panel principal):** Selector de mesa, tabla de pedidos de la cuenta y detalle de ítems con notas.
- **Derecha (aside):** Stat con total, panel de pago, panel de dividir/cerrar, panel de ticket (aparece después de cerrar).

**Panel de pago:**
- Selector de método: Efectivo / Tarjeta / Transferencia / Yape / Plin.
- Campo de monto recibido.
- Botón "Registrar pago" → `cuentasStore.registrarPago(...)`.

**Panel de dividir y cerrar:**
- Campo de número de partes para dividir equitativamente.
- Botón "Dividir cuenta" → `cuentasStore.dividir({ metodo: 'IGUALES', numPartes: N })`. Muestra las partes calculadas.
- Campo de descuento (en soles) con cálculo en tiempo real de `totalConDescuento`.
- Botón "Cerrar cuenta" → `cuentasStore.cerrar(descuento)`. Guarda el ticket.

**Panel de ticket:** Se muestra después de cerrar la cuenta con el ID del ticket, total y fecha.

---

### 10.8 ReservasScreen

**Ruta:** `/app/reservas`
**Store:** `useReservasStore`

**Qué hace:** Agenda de reservas filtrable por fecha. Panel izquierdo: tabla del día. Panel derecho: formulario de nueva reserva.

**Filtrado:** El selector de fecha filtra localmente con `useMemo` sobre el array de reservas cargadas.

**Tabla de reservas:**
- Columnas: Hora | Cliente | Mesa | Personas | Estado | Acciones.
- Botón "Confirmar" (solo para `PENDIENTE`).
- Botón "Cancelar" (para cualquier estado que no sea `CANCELADA`).

**Formulario de nueva reserva:**
- Campos: Cliente (requerido), Teléfono, Fecha (requerido), Hora (requerido), Mesa preferida (opcional), Número de comensales.
- Botón "Ver disponibilidad" → llama a `reservasStore.consultarDisponibilidad(fecha, hora)` y muestra un banner `ok`/`warn` con el resultado.
- Submit → `reservasStore.crear(payload)`.

---

### 10.9 InventarioScreen

**Ruta:** `/app/inventario`
**Store:** `useInventarioStore`

**Qué hace:** Lista de productos agrupados por categoría. Panel izquierdo: tabla de productos. Panel derecho: formulario para crear producto.

**Filtro:** Selector de categoría en el header (recarga con `fetch(categoriaId)` al cambiar).

**Tabla de productos por categoría:**
- Columnas: Producto (nombre + descripción) | Precio | Stock (badge con color) | Estado (Disponible/No disponible) | Reponer.
- Columna "Reponer": input numérico + botón → llama a `inventarioStore.reponerStock(id, cantidad)`.
- Stock inputs son locales al componente (`stockInputs: Record<string, string>`).

**Formulario de nuevo producto:**
- Campos: Categoría (select, requerido), Nombre, Descripción (textarea), Precio, Stock inicial, Checkbox "Disponible para pedidos".
- Submit → `inventarioStore.crearProducto(payload)`.
- Deshabilitado si no hay categorías cargadas.

---

### 10.10 ReportesScreen

**Ruta:** `/app/reportes`
**Store:** `useReportesStore`

**Qué hace:** Muestra el resumen diario de ventas del turno en curso.

**Secciones:**
1. **Stats cards (3):** Ingresos del día, Ventas cerradas, Ticket promedio.
2. **Ventas por hora:** Gráfico de barras CSS (altura proporcional al total de cada hora). Muestra mensaje vacío si el backend no devuelve datos.
3. **Top productos:** Tabla con nombre, cantidad vendida e ingresos. Muestra mensaje vacío si el backend no devuelve datos.

**Nota:** La pantalla acepta que el backend puede no devolver el desglose por hora ni el ranking de productos, y muestra estados vacíos específicos en esos casos.

---

### 10.11 UsuariosScreen

**Ruta:** `/app/usuarios`
**Store:** `useUsuariosStore`

**Qué hace:** Gestión del equipo de trabajo. Tabla de usuarios y formulario de creación.

**Tabla de usuarios:**
- Columnas: Usuario (nombre + email) | Rol (badge) | Estado | Creado | Cambiar rol.
- Columna "Cambiar rol": select inline que dispara `usuariosStore.cambiarRol(id, rol)` al cambiar. Deshabilitado offline.

**Formulario de nuevo usuario:**
- Campos: Nombre, Email, Contraseña (mínimo 8 caracteres), Rol.
- Roles disponibles: Admin, Gerencia, Cajero, Mesero, Cocina, Recepción.

**Aviso offline:** Muestra banner amarillo si `useOnlineStatus()` devuelve `false`.

---

## 11. Componentes de Layout

### 11.1 Shell

**Archivo:** `src/components/layout/Shell.tsx`

El "chrome" de la aplicación autenticada. Compone el layout principal con tres elementos:
1. **Banner offline** (condicional) — franja roja en la parte superior si `useOnlineStatus()` es `false`.
2. **`<Sidebar />`** — navegación lateral izquierda.
3. **`<main>`** — contiene `<Header />` y el área de contenido donde se renderizan los screens hijos.

Estructura CSS: `div.app` → `Sidebar` + `div.main` → `Header` + `div.content`.

---

### 11.2 Sidebar

**Archivo:** `src/components/layout/Sidebar.tsx`

Navegación lateral fija con dos grupos:

**Operación:** Mesas, Pedidos, Cocina, Delivery & Llevar, Caja, Reservas

**Administración:** Inventario, Reportes, Usuarios

Cada ítem es un botón con ícono SVG inline y etiqueta. La clase `on` se aplica cuando `activeKey` coincide con la ruta actual (extraída de `location.pathname.split('/')[2]`).

Al pie hay un botón "Buscar" con atajo de teclado `⌘K` (sin funcionalidad implementada aún).

---

### 11.3 Header

**Archivo:** `src/components/layout/Header.tsx`

Topbar fijo con los siguientes elementos de izquierda a derecha:

1. **Nombre del local** — "Resto Barranco" (hardcoded).
2. **Turno y hora** — actualizado cada 30 segundos. Turno Día (06:00-17:00) / Turno Noche (17:00-06:00).
3. **Indicador de conexión** — "En línea" (verde) / "Sin conexión" (rojo) usando `useOnlineStatus()`.
4. **Toggle de tema** — alterna entre modo claro y oscuro. Persiste en `localStorage` bajo `nachopps-theme`.
5. **Campana de notificaciones** — badge rojo con contador (máximo 9). Al hacer click:
   - Abre/cierra el popover.
   - Al abrir, llama a `markAllRead()` para limpiar el badge.
   - Muestra las últimas 8 notificaciones con título, contenido, hora y canal.
6. **Chip de usuario** — avatar con iniciales (máx. 2 letras del nombre), nombre y rol.
7. **Botón logout** — llama a `authStore.logout()` y navega a `/login`.

**Iniciales del avatar:** las primeras letras de cada palabra del nombre del usuario, hasta 2 caracteres, en mayúsculas.

---

## 12. Componentes de Dominio

### `MesaCard.tsx`
Card reutilizable para representar una mesa. Muestra número, capacidad, zona, estado y cuenta asociada. Acepta props `selected` y `onClick`. **Nota:** en la pantalla `MesasScreen` no se usa este componente sino JSX inline para mayor control.

### `ItemKDS.tsx`
Tarjeta KDS reutilizable para un pedido en la vista de cocina. Muestra mesa, tiempo transcurrido con clase de urgencia, y lista de ítems con botones de avance. **Nota:** `CocinaScreen` tampoco usa este componente sino JSX inline.

### `PedidoRow.tsx`
Fila reutilizable para mostrar un pedido en una lista. Muestra mesa, estado, cantidad de ítems, total, tiempo y botón de avance. **Nota:** `PedidosScreen` tampoco usa este componente sino JSX inline.

> **Observación:** Los tres componentes de dominio existen como artefactos reutilizables pero las screens actuales los reimplementan inline. Representan una capa de abstracción disponible para futuros refactors.

---

## 13. Componentes de UI

### `ErrorBoundary.tsx`

Componente de clase React que captura errores de render en cualquier subárbol. Recibe `moduleName` como prop para mostrar qué módulo falló. Muestra un mensaje de error genérico con botón "Reintentar" que resetea el estado `hasError`. Registra el error en `console.error` para debugging.

Cada screen está envuelta en `<ErrorBoundary moduleName="...">` desde el router, por lo que si una pantalla crashea no afecta el resto de la aplicación.

---

## 14. Hooks personalizados

### `useOnlineStatus.ts`

Hook que devuelve `true` si el navegador tiene conexión de red, `false` si no.

**Implementación:** Usa `navigator.onLine` para el estado inicial y escucha los eventos `online` y `offline` del `window` para actualizaciones reactivas. Limpia los listeners al desmontar.

**Uso:** Prácticamente todas las screens y el Shell lo consumen para deshabilitar mutaciones y mostrar alertas cuando no hay red.

---

## 15. PWA — Service Worker y Manifest

### Service Worker (`public/sw.js`)

**Cache name:** `nachopps-pos-v1`

**Estrategia: Cache First para assets estáticos, Network First implícito para el resto.**

**Evento `install`:**
- Abre el cache con nombre `nachopps-pos-v1`.
- Pre-cachea los assets críticos: `/`, `/index.html`, `/favicon.ico`, `/manifest.json`.
- Llama a `self.skipWaiting()` para activarse inmediatamente sin esperar a que cierren las pestañas previas.

**Evento `activate`:**
- Elimina todos los caches cuyo nombre no sea `nachopps-pos-v1` (limpieza de versiones anteriores).
- Llama a `self.clients.claim()` para tomar control de las pestañas abiertas inmediatamente.

**Evento `fetch`:**
- Ignora peticiones a `/api` o `socket.io` — estas nunca se cachean.
- Para el resto: intenta servir desde cache. Si no está, hace el fetch de red y cachea la respuesta (solo si `status === 200` y `type === 'basic'`).
- Si falla la red y la petición es de navegación (`mode === 'navigate'`), devuelve `/index.html` para soportar el routing SPA offline.

**Registro:** Solo se registra en producción (`NODE_ENV === 'production'`) desde `main.tsx`.

### Web App Manifest (`public/manifest.json`)

```json
{
  "short_name": "NachoPps",
  "name": "NachoPps Restobar — POS",
  "start_url": "/app",
  "background_color": "#0d0f13",
  "theme_color": "#2950a6",
  "display": "standalone",
  "orientation": "portrait"
}
```

- **`display: standalone`** — la app se instala sin barra del navegador.
- **`start_url: /app`** — al abrir como PWA instalada va directamente a la app (el router redirigirá al login si no hay sesión).

---

## 16. Variables de entorno

| Variable | Valor por defecto | Uso |
|----------|------------------|-----|
| `VITE_API_BASE_URL` | `http://localhost:8000` | URL base del backend (Kong Gateway). Usada en `client.ts` y `socket.service.ts`. |
| `VITE_WS_PATH` | `/notificaciones/socket.io` | Path del namespace Socket.IO. Usado en `socket.service.ts`. |

Hay cuatro archivos de entorno:
- `.env` — valores base.
- `.env.development` — sobreescribe en desarrollo (también apunta a `localhost:8000`).
- `.env.production` — sobreescribe en producción.
- `.env.example` — plantilla para documentación.

---

## 17. Flujos de datos completos

### Flujo: Usuario abre la app

```
main.tsx
  └─ authStore.restore()
        └─ authApi.me() → GET /identidad/auth/me
              ├─ éxito → set({ user, authenticated: true })
              │          socketService.connect()
              │          React monta → AppRouter → ProtectedRoute
              │          → Shell + MesasScreen
              │
              └─ falla  → clearAuthToken()
                          set({ authenticated: false })
                          React monta → AppRouter → PublicRoute
                          → LoginScreen
```

### Flujo: Crear pedido desde MesasScreen

```
MesasScreen (click en mesa)
  └─ navigate('/app/crear-pedido?mesaId=XXX&canal=SALON')

CrearPedidoScreen monta
  ├─ fetchMesas()     → GET /mesas
  ├─ fetchInventario() → GET /inventario/categorias + /inventario/productos
  ├─ cargarCuenta(mesaId) → GET /cuentas/mesa/:mesaId
  └─ fetchPedidos(mesaId) → GET /pedidos?mesaId=...

Usuario selecciona productos → carrito local
Usuario hace click "Enviar pedido"
  └─ pedidosStore.crear(payload) → POST /pedidos
        └─ éxito → revalidarMesaConCuenta(mesaId) [hasta 4 reintentos]
                    ├─ fetchMesas()
                    ├─ cargarCuenta(mesaId)
                    └─ fetchPedidos(mesaId)
              └─ navigate('/app/mesas')

[Backend emite evento Socket.IO 'pedidoUpdate']
  └─ socketService.socket.on('pedidoUpdate', evento)
        ├─ notificacionesStore.pushFromSocket(evento)
        └─ invalidateForPattern('pedido.creado')
              ├─ pedidosStore.invalidate()
              ├─ mesasStore.invalidate()
              └─ cuentasStore.invalidate()
```

### Flujo: Cobro en Caja

```
CajaScreen monta (con ?mesaId=XXX)
  ├─ fetchMesas()
  └─ cuentasStore.cargar(mesaId) → GET /cuentas/mesa/:mesaId
        └─ mapCuenta(dto) → cuentaActiva en store

Usuario selecciona método + monto → click "Registrar pago"
  └─ cuentasStore.registrarPago({ cuentaId, monto, metodo })
        └─ cuentasApi.registrarPago() → POST /caja/pagos
              └─ éxito → Promise.all([
                           invalidate() → GET /cuentas/:id
                           mesasStore.invalidate()
                           pedidosStore.invalidate()
                         ])

Usuario click "Cerrar cuenta"
  └─ cuentasStore.cerrar(descuento)
        └─ cuentasApi.cerrar(id, payload) → POST /cuentas/:id/cerrar
              └─ éxito → cuentaActiva = null
                          ticket = response.ticket
                          Promise.all([mesasStore.invalidate(), pedidosStore.invalidate()])
```

---

## 18. Diagrama de dependencias entre módulos

```
                          ┌─────────────────┐
                          │    main.tsx      │
                          │  (bootstrap)     │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │   AppRouter     │
                          │  (router/)      │
                          └────────┬────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │          Shell              │
                    │  (Header + Sidebar + Outlet)│
                    └──────────────┬──────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
    ┌──────▼──────┐        ┌───────▼──────┐      ┌────────▼──────┐
    │   Screen    │        │    Screen    │      │    Screen     │
    │  (Mesas,    │        │  (Cocina,    │      │  (Caja,       │
    │  Pedidos..) │        │   Delivery..)│      │  Reportes..)  │
    └──────┬──────┘        └──────┬───────┘      └────────┬──────┘
           │                      │                       │
           └──────────────────────┼───────────────────────┘
                                  │  consumen
           ┌───────────────────────┼───────────────────────┐
    ┌──────▼──────┐       ┌────────▼──────┐      ┌─────────▼─────┐
    │ mesas.store │       │pedidos.store  │      │cuentas.store  │
    └──────┬──────┘       └────────┬──────┘      └─────────┬─────┘
           │                       │                        │
           └───────────────────────┼────────────────────────┘
                                   │  llaman a
                    ┌──────────────▼──────────────┐
                    │         api/*.api.ts         │
                    │  (mesas, pedidos, cuentas..) │
                    └──────────────┬──────────────┘
                                   │ usa
                    ┌──────────────▼──────────────┐
                    │       api/client.ts          │
                    │   (fetch + JWT + errores)    │
                    └──────────────┬──────────────┘
                                   │ HTTP
                    ┌──────────────▼──────────────┐
                    │         Backend              │
                    │   (Kong Gateway :8000)       │
                    └─────────────────────────────┘

    ┌─────────────────────┐          ┌────────────────────────┐
    │  socket.service.ts  │ ◄────────│  Backend (Socket.IO)   │
    │  (eventos RT)       │  WS      │  /notificaciones       │
    └──────────┬──────────┘          └────────────────────────┘
               │ invalida
    ┌──────────▼──────────┐
    │ pedidos/mesas/       │
    │ cuentas/notific.     │
    │ stores               │
    └──────────────────────┘

    ┌─────────────────────┐
    │ mappers/*.mapper.ts │ ◄── llamados por cada store antes de guardar
    │  (DTO → ViewModel)  │
    └─────────────────────┘
```

---

*Informe generado automáticamente a partir del análisis del código fuente de `pwa-cliente_v.zip`.*

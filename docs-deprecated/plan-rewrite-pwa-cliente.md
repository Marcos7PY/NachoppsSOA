# Plan de Rewrite: `pwa-cliente` — Maqueta → Frontend Funcional

**Proyecto:** `apps/pwa-cliente` (Nx workspace)
**Stack:** React 19 + Vite + Zustand + Fetch API nativo + Socket.IO + TailwindCSS
**Backend:** Kong en `http://localhost:8000`
**Metodología:** Sprints semanales con handoff al final de cada uno. Claude ejecuta el siguiente sprint solo después de recibir el handoff aprobado del anterior.

---

## Arquitectura objetivo

```text
src/
├── api/                  # Fetch puro, sin lógica de UI
│   ├── client.ts         # Wrapper fetch nativo + manejo de errores HTTP
│   ├── auth.api.ts
│   ├── mesas.api.ts
│   ├── pedidos.api.ts
│   ├── cuentas.api.ts
│   ├── inventario.api.ts
│   ├── reservas.api.ts
│   ├── reportes.api.ts
│   └── usuarios.api.ts
├── store/                # Zustand, una store por entidad
│   ├── auth.store.ts
│   ├── mesas.store.ts
│   ├── pedidos.store.ts
│   ├── cuentas.store.ts
│   ├── inventario.store.ts
│   ├── reservas.store.ts
│   ├── reportes.store.ts
│   └── usuarios.store.ts
├── services/
│   └── socket.service.ts # Singleton Socket.IO, conecta stores
├── types/                # DTOs del backend + ViewModels de UI
│   ├── auth.types.ts
│   ├── mesa.types.ts
│   ├── pedido.types.ts
│   ├── cuenta.types.ts
│   ├── inventario.types.ts
│   ├── reserva.types.ts
│   ├── reporte.types.ts
│   └── usuario.types.ts
├── mappers/              # DTO → ViewModel, un archivo por entidad
│   ├── mesa.mapper.ts
│   ├── pedido.mapper.ts
│   ├── cuenta.mapper.ts
│   └── ...
├── components/
│   ├── ui/               # Primitivos genéricos (Button, Badge, Modal...)
│   └── domain/           # MesaCard, PedidoRow, ItemKDS...
├── screens/              # Una carpeta por módulo
│   ├── ops/              # Salón, Cocina, Pedidos
│   ├── caja/
│   ├── reservas/
│   ├── inventario/
│   ├── reportes/
│   └── admin/
├── hooks/                # Custom hooks que unen store con UI
├── router/
│   └── index.tsx         # React Router v7, rutas protegidas
└── main.tsx
```

---

## Convenciones globales (aplicar en todos los sprints)

- **Lenguaje:** TypeScript estricto. Archivos `.tsx` para componentes, `.ts` para todo lo demás.
- **Estilos:** TailwindCSS. Sin CSS modules, sin estilos inline salvo casos excepcionales.
- **Estado global:** Zustand exclusivamente. Sin Context API para estado de dominio.
- **Fetch:** Fetch API nativo con wrapper delgado centralizado en `api/client.ts`. Sin axios. El wrapper normaliza errores HTTP, maneja 401 y 429, y adjunta `credentials: 'include'` en todas las requests.
- **Errores:** Cada pantalla maneja sus propios estados `loading | error | data`. Sin spinner global.
- **Optimistic updates:** Solo en operaciones de baja consecuencia (ej: cambiar estado visual de mesa). Nunca en pagos o registros financieros.
- **Variables de entorno:** Toda URL y configuración de entorno via `import.meta.env.VITE_*`.
- **Sin `window.DATA`:** El global mock no existe en el rewrite. Eliminado desde Sprint 1.
- **Sin barrel re-exports en `api/`:** Importar directamente desde el archivo de servicio (`api/mesas.api.ts`), nunca desde un `api/index.ts` re-exportador. Permite tree-shaking correcto.
- **Sin componentes definidos dentro de otros componentes:** Extraer siempre a función o archivo separado. Componentes inline rompen la identidad de React entre renders.
- **Sin `useEffect` para derivar estado:** Si un valor se puede calcular desde otro estado durante el render, calcularlo directamente. `useEffect` + `setState` para derivaciones genera renders dobles innecesarios.
- **Fetches independientes en paralelo:** Usar `Promise.all()` al cargar datos no dependientes entre sí en la inicialización de una pantalla. Nunca en cascada secuencial si no hay dependencia real.

---

## Sprint 1 — Infraestructura base y autenticación

**Duración estimada:** 3-4 días
**Objetivo:** La app arranca, el usuario puede hacer login/logout real, y existe toda la infraestructura sobre la que se construyen los demás sprints.

### Tareas

#### 1.1 Limpieza inicial
- Eliminar `src/app/` completo (maqueta).
- Eliminar referencias a `window.DATA` en `main.jsx`.
- Convertir `main.jsx` → `main.tsx`.
- Crear `.env.example`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000
  VITE_WS_PATH=/notificaciones/socket.io
  ```

#### 1.2 Cliente HTTP (`src/api/client.ts`)
- Wrapper delgado sobre `fetch` nativo con `credentials: 'include'` en todas las requests.
- Función `request<T>(path, init)` interna que:
  - Construye la URL desde `VITE_API_BASE_URL`.
  - Adjunta `Content-Type: application/json` por defecto.
  - Verifica `response.ok`: si es `false`, parsea el body y lanza error normalizado.
  - `401` → emitir `CustomEvent('auth:expired')` y lanzar.
  - `429` → lanzar con mensaje legible de rate limit.
- Exponer `client.get`, `client.post`, `client.patch`, `client.delete` como helpers tipados.
- Sin dependencia de axios. Eliminar axios del `package.json` raíz si no lo usa otro proyecto del workspace.

#### 1.3 Tipos de autenticación (`src/types/auth.types.ts`)
```ts
interface LoginRequest { email: string; password: string; }
interface UserDto { id: string; nombre: string; email: string; rol: string; }
```

#### 1.4 API de auth (`src/api/auth.api.ts`)
- `login(req: LoginRequest): Promise<UserDto>`  → `POST /identidad/auth/login`
- `me(): Promise<UserDto>`                       → `GET /identidad/auth/me`
- `logout(): void`                               → limpieza local únicamente (no existe endpoint)

#### 1.5 Store de auth (`src/store/auth.store.ts`)
```ts
interface AuthStore {
  user: UserDto | null;
  authenticated: boolean;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
  restore: () => Promise<void>; // llama a me()
}
```

#### 1.6 Router (`src/router/index.tsx`)
- React Router v7.
- Ruta `/login` → pública.
- Rutas `/app/*` → protegidas: si `!authenticated` redirige a `/login`.
- Escuchar `CustomEvent('auth:expired')` en el root y navegar a `/login`.

#### 1.7 Bootstrap (`src/main.tsx`)
```ts
// 1. Intentar restaurar sesión (GET /me)
// 2. Montar React
// 3. El router decide si mostrar login o app
```

#### 1.8 Pantalla Login (`src/screens/login/LoginScreen.tsx`)
- Formulario email + password.
- Llamar `authStore.login()`.
- Manejar errores 401 con mensaje visible.
- Redirigir a `/app` on success.

#### 1.9 Shell/Layout (`src/components/layout/`)
- Sidebar con navegación (ítems deshabilitados hasta que existan las pantallas).
- Header con nombre de usuario y botón logout.
- Outlet de React Router para el contenido.

### Archivos que deben existir al final del sprint
```text
src/
├── api/client.ts
├── api/auth.api.ts
├── store/auth.store.ts
├── types/auth.types.ts
├── router/index.tsx
├── screens/login/LoginScreen.tsx
├── components/layout/Shell.tsx
├── components/layout/Sidebar.tsx
├── components/layout/Header.tsx
└── main.tsx
.env.example
```

### Handoff Sprint 1
Antes de continuar al Sprint 2, verificar y documentar:
- [ ] `npm exec nx run pwa-cliente:build` sin errores.
- [ ] Login con credenciales reales devuelve sesión y redirige a `/app`.
- [ ] Recarga de página restaura sesión si la cookie sigue válida.
- [ ] Token expirado (o cookie borrada manualmente) redirige a `/login`.
- [ ] Logout limpia el store y redirige a `/login`.
- [ ] El shell renderiza con sidebar y header vacíos sin errores de consola.
- **Registrar:** cualquier comportamiento inesperado del backend (CORS, formato de cookie, campos del `/me`) para ajustar sprints siguientes.

---

## Sprint 2 — Módulo Operaciones: Mesas y Pedidos

**Duración estimada:** 5-7 días
**Prerequisito:** Handoff Sprint 1 aprobado.
**Objetivo:** Las dos pantallas más críticas del POS funcionan con datos reales.

### Tareas

#### 2.1 Tipos (`src/types/mesa.types.ts`, `src/types/pedido.types.ts`)
- `MesaDto`: shape exacto del `GET /mesas`.
- `MesaVM`: shape visual que consume la UI.
- `PedidoDto`: shape exacto del `GET /pedidos`.
- `PedidoVM`: shape visual con items mapeados.
- Enums: `EstadoMesa`, `EstadoPedido`, `EstadoItem`, `AreaPedido`.

#### 2.2 Mappers
- `src/mappers/mesa.mapper.ts`: `MesaDto → MesaVM`
  - `numero` → `"01"`, `"02"` (padStart 2).
  - `ubicacion` → `zona`.
  - Campos ausentes en el DTO se omiten en el VM, no se inventan.
- `src/mappers/pedido.mapper.ts`: `PedidoDto → PedidoVM`

#### 2.3 APIs
- `src/api/mesas.api.ts`:
  - `getAll(): Promise<MesaDto[]>`          → `GET /mesas`
  - `cambiarEstado(id, estado): Promise<MesaDto>` → `PATCH /mesas/:id`
- `src/api/pedidos.api.ts`:
  - `getAll(filtros?): Promise<PedidoDto[]>` → `GET /pedidos`
  - `crear(payload): Promise<PedidoDto>`    → `POST /pedidos`
  - `avanzarEstado(id, estado): Promise<PedidoDto>` → `PATCH /pedidos/:id`
  - `avanzarItem(pedidoId, itemId, estado): Promise<void>` → `PATCH /pedidos/:id/items/:itemId`

#### 2.4 Stores
- `src/store/mesas.store.ts`:
  - `mesas: MesaVM[]`, `loading`, `error`.
  - `fetch()`: llama API, mapea, setea estado.
  - `optimisticCambiarEstado(id, estado)`: actualiza local, llama API, revierte si falla.
- `src/store/pedidos.store.ts`:
  - `pedidos: PedidoVM[]`, `loading`, `error`.
  - `fetch(filtros?)`.
  - `crear(payload)`: espera confirmación del backend, no optimistic.
  - `avanzarEstado(id, estado)`.

#### 2.5 Componentes de dominio
- `src/components/domain/MesaCard.tsx`: tarjeta visual de mesa, props desde `MesaVM`.
- `src/components/domain/PedidoRow.tsx`: fila de pedido para lista.
- `src/components/domain/ItemKDS.tsx`: ítem individual en vista de cocina.

#### 2.6 Pantallas
- `src/screens/ops/MesasScreen.tsx`:
  - Grid de `MesaCard`.
  - Estados: loading skeleton, error con botón reintentar, empty state.
  - Acción: abrir modal para cambiar estado o ir a cuenta.
- `src/screens/ops/PedidosScreen.tsx`:
  - Lista de pedidos activos con filtro por área (COCINA / BARRA).
  - Acción: avanzar estado de pedido.
- `src/screens/ops/CocinaScreen.tsx` (KDS):
  - Vista columnas por estado: PENDIENTE → EN_PROCESO → LISTO.
  - Avanzar ítems individuales.

#### 2.7 Paginación / filtrado
- `GET /pedidos` debe llamarse con filtros desde el inicio: `?estado=PENDIENTE&limit=100`.
- Si el backend no soporta filtros, documentarlo en el handoff.

### Handoff Sprint 2
- [ ] Build sin errores.
- [ ] Pantalla Mesas carga datos reales, muestra estado correcto por mesa.
- [ ] Cambiar estado de mesa persiste en backend y se refleja en UI al refrescar.
- [ ] Pantalla Pedidos muestra pedidos activos reales.
- [ ] Vista Cocina (KDS) muestra ítems y permite avanzar estado.
- [ ] Crear un pedido desde la UI aparece en la lista sin recargar la página.
- [ ] Estados de loading y error funcionan correctamente en las tres pantallas.
- **Registrar:** endpoints que no existen aún, campos del DTO que difieren de lo esperado, limitaciones de filtrado/paginación del backend.

---

## Sprint 3 — Tiempo Real (WebSockets) + Módulo Caja

**Duración estimada:** 4-5 días
**Prerequisito:** Handoff Sprint 2 aprobado.
**Objetivo:** Los cambios de estado se propagan en tiempo real. El módulo de caja funciona.

### Tareas

#### 3.1 Socket service (`src/services/socket.service.ts`)
- Singleton Socket.IO.
- Conectar a `VITE_API_BASE_URL` con `path: VITE_WS_PATH` y `withCredentials: true`.
- Reconexión automática con backoff exponencial.
- Eventos a escuchar: `pedidoUpdate`.
- Handler de `pedidoUpdate`:
  - Parsear `pattern` del evento.
  - Invalidar y refetch de los stores relevantes (mesas, pedidos, cuentas).
- Exponer `connect()` y `disconnect()`.
- Conectar tras login exitoso, desconectar en logout.

#### 3.2 Integrar socket en stores
- `mesas.store.ts`: exponer método `invalidate()` que llama `fetch()`.
- `pedidos.store.ts`: ídem.
- El socket service importa los stores por su `getState()`, sin hooks.

#### 3.3 Tipos y API de cuentas
- `CuentaDto`, `CuentaVM`.
- `src/api/cuentas.api.ts`:
  - `getById(id): Promise<CuentaDto>`              → `GET /cuentas/:id`
  - `getByMesa(mesaId): Promise<CuentaDto>`        → `GET /cuentas/mesa/:mesaId`
  - `abrir(mesaId): Promise<CuentaDto>`            → `POST /cuentas`
  - `cerrar(id): Promise<CuentaDto>`               → `PATCH /cuentas/:id/cerrar`
  - `dividir(id, payload): Promise<CuentaDto>`     → `POST /cuentas/:id/dividir`
  - `registrarPago(id, payload): Promise<void>`    → `POST /cuentas/:id/pagos`

#### 3.4 Store de cuentas (`src/store/cuentas.store.ts`)
- `cuentaActiva: CuentaVM | null`.
- `cargar(mesaId)`: fetch + map.
- `registrarPago(payload)`: **sin optimistic update** — esperar confirmación.
- `cerrar()`: esperar confirmación, luego invalidar mesa y pedidos.

#### 3.5 Pantalla Caja (`src/screens/caja/CajaScreen.tsx`)
- Ver cuenta activa de una mesa.
- Lista de pedidos e ítems incluidos.
- Total, métodos de pago disponibles.
- Registrar pago: feedback visual claro de éxito/error.
- Dividir cuenta (si el backend lo soporta).
- Cerrar cuenta.

### Handoff Sprint 3
- [ ] Build sin errores.
- [ ] Socket conecta tras login y desconecta en logout.
- [ ] Crear un pedido desde otra sesión/terminal se refleja en la UI en <3 segundos.
- [ ] Avanzar estado de pedido en Cocina se refleja en Mesas sin recargar.
- [ ] Pantalla Caja carga cuenta de una mesa real.
- [ ] Registrar pago persiste en backend.
- [ ] Cerrar cuenta libera la mesa (estado LIBRE visible en Mesas).
- **Registrar:** latencia real del socket, eventos que llegan pero no se manejan, comportamiento en reconexión.

---

## Sprint 4 — Reservas, Inventario y Reportes

**Duración estimada:** 5-6 días
**Prerequisito:** Handoff Sprint 3 aprobado.
**Objetivo:** Los módulos secundarios del negocio funcionan con datos reales.

### Tareas

#### 4.1 Reservas
- Tipos: `ReservaDto`, `ReservaVM`.
- `src/api/reservas.api.ts`: crear, confirmar, cancelar, disponibilidad.
- Store: fetch, crear, confirmar, cancelar.
- `src/screens/reservas/ReservasScreen.tsx`: agenda del día, acciones por reserva.

#### 4.2 Inventario
- Tipos: `CategoriaDto`, `ProductoDto`, `ProductoVM`.
- `src/api/inventario.api.ts`: categorías, productos, reponer stock.
- Store: fetch productos con categorías, crear, reponer.
- `src/screens/inventario/InventarioScreen.tsx`: lista por categoría, stock actual, acción reponer.

#### 4.3 Reportes
- Tipos: `ResumenDto`.
- `src/api/reportes.api.ts`: `GET /reportes/resumen`.
- Store: fetch, sin mutaciones.
- `src/screens/reportes/ReportesScreen.tsx`: métricas del turno, ventas por hora, top productos. Datos que el backend no devuelva se omiten (sin mock).

### Handoff Sprint 4
- [ ] Build sin errores.
- [ ] Reservas: crear, confirmar y cancelar persisten en backend.
- [ ] Inventario: lista carga real, reponer stock actualiza el registro.
- [ ] Reportes: métricas reales del backend visibles; secciones sin datos muestran empty state, no números falsos.
- **Registrar:** endpoints del backend que no existen aún (marcar como "pendiente de backend" en UI).

---

## Sprint 5 — Admin, Pulido y Producción

**Duración estimada:** 4-5 días
**Prerequisito:** Handoff Sprint 4 aprobado.
**Objetivo:** La app está lista para usuarios reales.

### Tareas

#### 5.1 Módulo Admin/Usuarios
- Tipos: `UsuarioDto`, `RolDto`.
- `src/api/usuarios.api.ts`: listar, crear, cambiar rol.
- `src/screens/admin/UsuariosScreen.tsx`.

#### 5.2 Notificaciones
- `src/api/notificaciones.api.ts`: `GET /notificaciones`.
- Store de notificaciones: fetch al iniciar + push desde socket.
- Badge en header con conteo no leídas.

#### 5.3 Error boundaries
- `src/components/ui/ErrorBoundary.tsx`.
- Envolver cada `Screen` en su propio boundary.
- Fallback con mensaje de módulo y botón "Reintentar".

#### 5.4 Detección offline
- Hook `useOnlineStatus()`.
- Banner global cuando `navigator.onLine === false`.
- Deshabilitar mutaciones en estado offline.

#### 5.5 Funciones sin backend → ocultar, no mockear
- Delivery / para llevar.
- Comprobante SUNAT real.
- Descuentos/cortesías con PIN.
- Anulación de ítems.
- Permisos granulares.
- Marcar en UI con tooltip "Próximamente" o simplemente no renderizar.

#### 5.6 Variables de entorno por ambiente
- `.env.development`
- `.env.production`
- Verificar que `VITE_API_BASE_URL` apunta al Kong correcto en cada ambiente.

#### 5.7 Smoke test de build de producción
- `npm exec nx run pwa-cliente:build`.
- Servir el `dist/` con `vite preview` o un servidor estático.
- Verificar que todas las rutas cargan sin consola de errores.

### Handoff Sprint 5 (Final)
- [ ] Build de producción sin warnings críticos.
- [ ] Login → Mesas → Pedido → Cocina → Caja → Pago → Mesa libre: flujo completo funciona.
- [ ] Crear reserva y verificar en agenda.
- [ ] Reponer stock y verificar actualización.
- [ ] Error boundary captura errores de módulo sin tumbar la app entera.
- [ ] Banner offline aparece al desconectar red.
- [ ] Ninguna pantalla muestra datos mock o inventados.
- [ ] No existe ninguna referencia a `window.DATA` en el codebase (`grep -r "window.DATA" src/` → vacío).
- **Entregable:** URL o instrucciones de despliegue del build de producción.

---

## Referencia rápida de endpoints por sprint

| Sprint | Endpoints |
|--------|-----------|
| 1 | `POST /identidad/auth/login`, `GET /identidad/auth/me` |
| 2 | `GET /mesas`, `PATCH /mesas/:id`, `GET /pedidos`, `POST /pedidos`, `PATCH /pedidos/:id`, `PATCH /pedidos/:id/items/:itemId` |
| 3 | `WS /notificaciones/socket.io`, `GET /cuentas/:id`, `GET /cuentas/mesa/:mesaId`, `POST /cuentas`, `PATCH /cuentas/:id/cerrar`, `POST /cuentas/:id/dividir`, `POST /cuentas/:id/pagos` |
| 4 | `GET /reservas`, `POST /reservas`, `PATCH /reservas/:id/confirmar`, `PATCH /reservas/:id/cancelar`, `GET /inventario/categorias`, `GET /inventario/productos`, `POST /inventario/productos`, `POST /inventario/productos/:id/reponer`, `GET /reportes/resumen` |
| 5 | `GET /identidad/usuarios`, `POST /identidad/usuarios`, `PATCH /identidad/usuarios/:id/rol`, `GET /notificaciones` |

---

## Notas para Claude al ejecutar cada sprint

1. **Leer el handoff del sprint anterior antes de escribir código.** Si hay inconsistencias reportadas del backend, ajustar los tipos y mappers en consecuencia.
2. **No inventar datos.** Si un campo del DTO no existe, el VM lo omite y la UI muestra ausencia, no un valor por defecto inventado.
3. **Un archivo por responsabilidad.** No mezclar fetch + store + componente en el mismo archivo.
4. **Cada componente nuevo tiene sus tres estados:** `loading`, `error`, `data`.
5. **El handoff es un artefacto real.** Al terminar cada sprint, generar un documento con: qué funciona, qué no, qué diverge del backend esperado, y qué queda pendiente para el siguiente sprint.

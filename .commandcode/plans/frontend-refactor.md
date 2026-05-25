# Plan: Refactor Frontend — Diseño Sistema Restaurante

> Alcance: Refactor completo del frontend React 19 con shadcn/ui, aplicando tokens y patrones del documento de diseño.

---

## 0. Estado inicial

El frontend actual (`apps/pwa-cliente/`) tiene 10 vistas funcionando con Tailwind CSS v4 y una paleta SCCA verde/dorada. Los componentes son custom (AppLayout, Sidebar, Modal). El sistema está integrado vía Kong :8000 y WebSockets en Pedidos/Cocina.

**Problemas a resolver:**
1. `Configuracion` importado en `app.tsx` — no existe → build roto
2. `cuentas.service.ts` no se usa → dead code
3. Paleta visual SCCA no coincide con el documento de diseño
4. Sidebar rígido, sin logo header ni user footer con dropdown
5. Componentes UI custom que pueden reemplazarse por shadcn/ui

---

## 1. Inicializar shadcn/ui y agregar dependencias

### 1.1 Instalar Radix UI dependencies necesarias
```bash
cd apps/pwa-cliente
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-select @radix-ui/react-avatar @radix-ui/react-label \
  @radix-ui/react-checkbox @radix-ui/react-tooltip @radix-ui/react-scroll-area \
  @radix-ui/react-separator @radix-ui/react-tabs @radix-ui/react-collapsible \
  @radix-ui/react-popover
```

### 1.2 Mover `@radix-ui/react-slot` de devDeps a deps en package.json raíz
`@radix-ui/react-slot` está en `devDependencies` — debe estar en `dependencies`.

### 1.3 Inicializar shadcn/ui
```bash
npx shadcn@latest init
```
Config: TypeScript, Tailwind v4, neutral base color, cssVariables=true, rsc=false, icon library=lucide.

### 1.4 Agregar componentes shadcn/ui necesarios
```
button, card, dialog, badge, table, dropdown-menu, select, 
sheet, avatar, input, label, checkbox, tooltip, tabs, 
separator, scroll-area, popover, collapsible
```

---

## 2. Refactor `styles.css` — Nuevo sistema de diseño

### 2.1 Reemplazar paleta SCCA por la del documento

**Eliminar:** todas las variables `--scca-*` (bg, ink, accent, ok, warn, danger, etc.)

**Agregar tokens del documento (modo claro :root):**
```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(0 0% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 3.9%);
  --primary: hsl(0 0% 9%);
  --primary-foreground: hsl(0 0% 98%);
  --secondary: hsl(0 0% 92.1%);
  --secondary-foreground: hsl(0 0% 9%);
  --muted: hsl(0 0% 96.1%);
  --muted-foreground: hsl(0 0% 45.1%);
  --accent: hsl(0 0% 96.1%);
  --accent-foreground: hsl(0 0% 9%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(0 0% 89.8%);
  --input: hsl(0 0% 89.8%);
  --ring: hsl(0 0% 3.9%);
  --radius: 0.5rem;
  
  /* Sidebar tokens */
  --sidebar-background: hsl(0 0% 98%);
  --sidebar-foreground: hsl(240 5.3% 26.1%);
  --sidebar-primary: hsl(0 0% 10%);
  --sidebar-primary-foreground: hsl(0 0% 98%);
  --sidebar-accent: hsl(0 0% 94%);
  --sidebar-accent-foreground: hsl(0 0% 30%);
  --sidebar-border: hsl(0 0% 91%);
  --sidebar-ring: hsl(217.2 91.2% 59.8%);
}
```

**Agregar modo oscuro (.dark):**
```css
.dark {
  --background: hsl(0 0% 3.9%);
  --foreground: hsl(0 0% 98%);
  /* ... todos los overrides del documento ... */
}
```

### 2.2 Cambiar fuente a Instrument Sans
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
```
En `@layer base`:
```css
body {
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}
```

### 2.3 Mantener `@theme inline` con los mismos tokens
Actualizar valores para que apunten a los nuevos `--*` variables.

### 2.4 Eliminar utilidades obsoletas
- Eliminar `.glass-panel` (ya no se usa en el nuevo diseño)
- Eliminar animaciones `.scca-drawer`, `.scca-fade-in` (se reemplazan por shadcn/ui transitions)

### 2.5 Actualizar `@layer base`
- Mantener `* { @apply border-border; }`
- Mantener `focus-visible` con ring
- Agregar `body { font-family: 'Instrument Sans', ... }`

---

## 3. Refactor AppLayout + Sidebar con shadcn/ui Sidebar

### 3.1 Nuevo `AppLayout.tsx`
Usar el patrón del documento:
```
AppSidebarLayout
├── Sidebar (collapsible="icon", variant="inset")
│   ├── SidebarHeader → AppLogo
│   ├── SidebarContent → NavMain
│   └── SidebarFooter → NavUser
└── <main> (contenido de página)
```

**Estructura:** `<SidebarProvider>` con `defaultOpen={true}`, sidebar colapsable a íconos, variante `inset`.

**Topbar eliminado** — reemplazado por contenido dentro del `<main>` (cada página maneja su propio header).

### 3.2 Sidebar: `NavMain`
Ítems según el documento, filtrados por rol:

| Ícono lucide | Título | Ruta | Roles |
|---|---|---|---|
| `LayoutGrid` | Dashboard | `/` | ADMIN |
| `NotebookPen` | Pedidos | `/pedidos` | ADMIN, MESERO, CAJERO |
| `ChefHat` | Cocina | `/cocina` | ADMIN, COCINA |
| `Banknote` | Caja | `/caja` | ADMIN, CAJERO |
| `Receipt` | Control Caja | `/control-caja` | ADMIN, CAJERO |
| `CalendarDays` | Reservas | `/reservas` | ADMIN |
| `Package` | Inventario | `/inventario` | ADMIN |
| `Shield` | Auditoría | `/auditoria` | ADMIN |

Ítem activo: detectado con `useLocation()` → `pathname.startsWith(item.url)`.

### 3.3 Sidebar: `NavUser` (footer)
- Avatar con iniciales (`getInitials(name)`)
- Nombre + email en texto
- DropdownMenu al hacer clic: opciones de perfil, cerrar sesión
- Usar `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuItem`, `Avatar`, `AvatarFallback`

### 3.4 Sidebar: `AppLogo` (header)
Ícono `Utensils` sobre fondo primary + texto "NachoPps"

---

## 4. Refactor de cada vista

### 4.1 Login (`Login.tsx`)
- Mantener layout centrado con tarjeta
- Aplicar nuevos tokens: `bg-card`, `text-card-foreground`, `border-border`
- **No sidebar** (ruta pública, fuera del AppLayout)

### 4.2 Dashboard (`Dashboard.tsx`)
**Estructura según documento:**
```
h2 "Panel de Control — [ROL]"
div.grid.grid-cols-1.md:grid-cols-3.gap-6
  [vista ADMIN]
    Card: "Gestión de Usuarios" 
    Card: "Reporte de Ventas" — monto grande S/. X.XX
    Card: "Pedidos del Día" — conteo
  [vistas por rol: COCINA, MESERO con mensajes contextuales]
div.grid de navegación: 6 cards linkeando a cada sección
```

**Reemplazar** las métricas actuales con el diseño del documento:
- `Card` de shadcn/ui con `CardHeader`, `CardTitle`, `CardContent`
- Acciones primarias: colores `indigo-600` (según doc)
- Grid de navegación: 3 columnas, iconos lucide, hover:shadow-lg

### 4.3 Pedidos (`Pedidos.tsx`) — El componente más complejo
**Vista MESAS:** Grid de mesas `grid-cols-2 md:grid-cols-4 gap-6`:
- Cada mesa: `bg-green-100 border-green-500` (libre) / `bg-red-100 border-red-500` (ocupada)
- `h-40 rounded-xl flex flex-col items-center justify-center shadow-lg hover:scale-105 cursor-pointer`
- Número en `text-3xl font-bold`, estado en `text-xs font-bold uppercase tracking-wider`
- Si ocupada: badge con nombre del mesero

**Vista POS:** Split-screen `h-[calc(100vh-65px)] flex`:
- **Izquierda (w-2/3):** Catálogo — categorías con bullets de color, grid `grid-cols-3 gap-4` de productos con `bg-card p-4 rounded-lg shadow cursor-pointer hover:ring-2 hover:ring-indigo-500`
- **Derecha (w-1/3):** Comanda — "Pedidos Enviados" (histórico), "Por Comandar" (carrito), contador +/-, "Comandar" button `bg-indigo-600`, "Cobrar" button `bg-emerald-600`

**WebSocket:** mantener conexión actual, sin cambios funcionales.

**ModalCobro:** refactorizar con `Dialog` de shadcn, `DialogContent`, `DialogHeader`, `DialogFooter`.

### 4.4 Caja (`Caja.tsx`)
**Vista lista de tickets:** Grid de cards con `Card`, `CardHeader`, `CardContent`.
**Vista pago:** Split-screen similar a Pedidos POS:
- Izquierda: resumen del ticket
- Derecha: métodos de pago con selección visual (cards), input de monto, lista de pagos parciales
- `Dialog` de shadcn para confirmación

### 4.5 Cocina (`Cocina.tsx`)
**Estructura según documento:**
```
div.min-h-screen.bg-muted.p-6
  Header con ChefHat icon + "Monitor de Pedidos" + "En vivo" badge
  Empty state: CheckCircle2 icon + "Todo limpio"
  Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
  
  Cada card: bg-card rounded-lg shadow-md p-4 min-h-[200px]
    Borde izquierdo por estado:
      Pendiente → border-l-4 border-gray-500
      EnPreparacion → border-l-4 border-orange-500 bg-orange-50
      Listo → border-l-4 border-green-500 bg-green-50
    
    Zona superior: mesa, timestamp, item × qty, notas en bg-amber-50
    Zona inferior: estado badge + botón contextual
```

**Reemplazar** Framer Motion por transiciones CSS/Tailwind (animate-in).

### 4.6 ControlCaja (`ControlCaja.tsx`)
- **Turno cerrado:** Card con form para abrir turno
- **Turno abierto:** 2-columnas (2/3 dashboard + 1/3 caja chica + cierre)
- Usar `Card`, `Tabs`, `Badge` para las secciones
- Dark-themed panel de cierre: `bg-gray-900 text-white`

### 4.7 Mesas (`Mesas.tsx`)
- Header con icono `Square` + "Salón" + botón "+ Nueva Mesa"
- Grid de cards con `border-t-4 border-t-indigo-500`
- DropdownMenu de 3 puntos por mesa (editar/eliminar)
- `Dialog` modal para crear/editar
- Estado vacío con mensaje + botón

### 4.8 Inventario (`Inventario.tsx`)
- Header con icono `Package` + botones "Nueva Categoría" y "Nuevo Producto"
- `Tabs` de shadcn para categorías (en vez de pills actuales)
- Tabla con `Table`, `TableHeader`, `TableBody`, etc.
- `Dialog` para crear/editar categorías y productos
- Color picker para categorías: `Input type="color"`

### 4.9 Reservas (`Reservas.tsx`)
- Grid de `ReservaCard` con `Card`, `CardHeader`, `CardContent`
- Status badges: `variant="outline"`
- `Dialog` para formulario de creación
- Botones confirmar/cancelar en cada card

### 4.10 Auditoría (`Auditoria.tsx`)
- Header con icono `Shield` + título + botón "Actualizar"
- Barra de filtros: `Input` search + `Select` dropdown
- Tabla con `Table` de shadcn
- Badges de color por tipo de acción:
  - LOGIN → green
  - CREATE_USER → blue
  - PEDIDO → orange
  - PAYMENT/CUENTA → purple
  - ERROR → red

---

## 5. Arreglos y limpieza

### 5.1 Eliminar `Configuracion` de `app.tsx`
Remover la línea `import { Configuracion } from '../views/Configuracion/Configuracion'` y su ruta en el router.

### 5.2 Eliminar `cuentas.service.ts`
No se usa en ninguna vista → eliminar el archivo.

### 5.3 Eliminar `Modal.tsx` custom
Reemplazado por shadcn/ui `Dialog` → eliminar `src/components/Modal/`.

### 5.4 Eliminar `ReservaFormModal.tsx` y `ReservaCard.tsx` actuales
Se reconstruyen con shadcn/ui dentro de `Reservas.tsx`.

### 5.5 Actualizar `utils.ts` (cn)
Mantener la función `cn()` existente — ya es compatible con shadcn/ui.

### 5.6 Fix rol COCINA en Sidebar
Cambiar `COCINERO` por `COCINA` en el array de roles del nav item "Monitor de Cocina".

---

## 6. Verificación

### 6.1 Build
```bash
npx nx build pwa-cliente --configuration=production
```
Debe compilar sin errores.

### 6.2 Tests
```bash
npx vitest run
```
Los 45 tests existentes deben seguir pasando (el frontend no tiene specs propias).

### 6.3 Runtime
```bash
docker compose -f infra/docker-compose.yml --env-file .env --profile dev up -d
```
Acceder a `http://localhost:4200`:
- [ ] Login con `admin@nachopps.com` / `admin123`
- [ ] Sidebar muestra items según rol
- [ ] Sidebar colapsa a iconos
- [ ] NavUser con avatar y dropdown logout
- [ ] Dashboard carga métricas
- [ ] Pedidos: vista MESAS y POS funcionan
- [ ] Cocina KDS: WebSocket + cambio de estados
- [ ] Caja: pagos mixtos funcionan
- [ ] ControlCaja: abrir/cerrar turno
- [ ] Mesas: CRUD y liberación
- [ ] Inventario: categorías y productos
- [ ] Reservas: crear, confirmar, cancelar
- [ ] Auditoría: tabla y filtros

---

## Archivos a modificar/crear

| Archivo | Acción |
|---|---|
| `apps/pwa-cliente/src/styles.css` | Reemplazar completamente |
| `apps/pwa-cliente/src/components/layout/AppLayout.tsx` | Reemplazar |
| `apps/pwa-cliente/src/components/layout/Sidebar.tsx` | Reemplazar |
| `apps/pwa-cliente/src/app/app.tsx` | Quitar Configuracion |
| `apps/pwa-cliente/src/views/Login/Login.tsx` | Refactor estilos |
| `apps/pwa-cliente/src/views/Dashboard/Dashboard.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Pedidos/Pedidos.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Pedidos/ModalCobro.tsx` | Refactor con shadcn Dialog |
| `apps/pwa-cliente/src/views/Caja/Caja.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Cocina/Cocina.tsx` | Refactor |
| `apps/pwa-cliente/src/views/ControlCaja/ControlCaja.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Mesas/Mesas.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Inventario/Inventario.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Inventario/InventarioModals.tsx` | Refactor con shadcn Dialog |
| `apps/pwa-cliente/src/views/Reservas/Reservas.tsx` | Refactor |
| `apps/pwa-cliente/src/views/Auditoria/Auditoria.tsx` | Refactor |
| `apps/pwa-cliente/src/components/Modal/Modal.tsx` | Eliminar |
| `apps/pwa-cliente/src/components/ReservaFormModal/ReservaFormModal.tsx` | Eliminar |
| `apps/pwa-cliente/src/components/ReservaCard/ReservaCard.tsx` | Eliminar |
| `apps/pwa-cliente/src/components/layout/NavMain.tsx` | Crear (nav items) |
| `apps/pwa-cliente/src/components/layout/NavUser.tsx` | Crear (footer avatar) |
| `apps/pwa-cliente/src/components/layout/AppLogo.tsx` | Crear (sidebar header) |
| `apps/pwa-cliente/src/components/ui/*` | Crear via shadcn CLI |
| `apps/pwa-cliente/src/api/cuentas.service.ts` | Eliminar |
| `package.json` (raíz) | Mover @radix-ui/react-slot a deps |
| `package.json` (pwa-cliente) | Agregar nuevas deps Radix |
| `docs/ESTADO.md` | Actualizar con el refactor |

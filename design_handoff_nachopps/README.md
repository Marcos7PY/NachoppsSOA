# Handoff: NachoPps — Sistema operativo de restobar (PWA)

## Overview
**NachoPps** es la interfaz de operación diaria de un restobar peruano construida sobre un backend de microservicios (detrás de Kong). No es una landing ni una app decorativa: es una **herramienta de trabajo** rápida, táctil y densa para mesero, cajero, cocina, gerente y administrador. La primera pantalla útil es **Operación / Mesas**, no una bienvenida.

El prototipo incluye 14 pantallas conectadas con estado real (store mutable), estados de carga/vacío/error/conflicto/offline, comprobante electrónico SUNAT con IGV, canales (salón/llevar/delivery), modificadores estructurados, descuentos/cortesías, anulación con autorización y vista de despachados. Moneda **S/ (soles)**, idioma **es-PE**.

## About the Design Files
Los archivos de este bundle son **referencias de diseño hechas en HTML + React (vía Babel en el navegador)** — prototipos que muestran el look y el comportamiento deseados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno del codebase destino** (idealmente **React** como PWA, según se pidió), usando sus patrones, librerías de estado y componentes establecidos. Si no existe entorno aún, elegir el stack más apropiado (recomendado: **React + Vite + TypeScript**, con un router, React Query para datos, y un sistema de tokens CSS como el de abajo) e implementar ahí.

El código está organizado de forma modular y es directamente transcribible: cada `screens-*.jsx` agrupa pantallas, `ui.jsx` los primitivos, `commerce.jsx` la lógica fiscal/comercial, `data.jsx` el modelo de datos mock y `styles.css` el sistema de design tokens completo.

## Fidelity
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado e interacciones son finales. Recrear pixel-perfect usando las librerías del codebase. La estética es **editorial / "Press"**: blanco generoso, hairlines, **azul tinta** de acento, botones primarios casi-negros, Geist + Geist Mono (la mono para valores técnicos: montos, IDs, horas, RUC, MAC). Vibe Linear / Stripe Docs. Incluye modo claro y oscuro y un menú de Apariencia para personalizar el color de acento.

---

## Design Tokens
Definidos como CSS custom properties en `app/styles.css` (`:root` para light, `[data-theme="dark"]` para dark). Reusar estos nombres o mapearlos al sistema del codebase.

### Color — Light (Press · editorial)
| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#ffffff` | Fondo de app |
| `--surface` | `#ffffff` | Tarjetas, paneles, sidebar, topbar |
| `--surface-2` | `#fafafa` | Cabeceras de tabla, fondos sutiles |
| `--surface-3` | `#f4f4f6` | Hover, chips, contadores |
| `--border` | `#ececef` | Hairlines (1px en todo) |
| `--border-strong` | `#dcdce1` | Bordes de énfasis, scrollbar |
| `--text` | `#18181b` | Texto principal |
| `--text-2` | `#51515a` | Texto secundario |
| `--muted` | `#8a8a93` | Texto terciario |
| `--faint` | `#b6b6bd` | Labels, iconos inactivos |
| `--accent` | `#2950a6` | **Azul tinta**: nav activo, enlaces, marca, focus, mesa OCUPADA, barras de gráficos |
| `--accent-hover` | `#1f3f88` | — |
| `--accent-soft` | `#eaeffb` | Fondos de estado/acento |
| `--accent-text` | `#234aa0` | Texto sobre accent-soft |
| `--primary` | `#18181b` | **Botón primario casi-negro** (CTA: Cobrar, Enviar pedido, Ingresar) |
| `--on-primary` | `#ffffff` | Texto sobre primary |
| `--ok` `--ok-soft` `--ok-text` | `#1f9254` `#e7f4ec` `#157a45` | Éxito / LIBRE / PAGADA / EN RANGO |
| `--warn` `--warn-soft` `--warn-text` | `#b5820e` `#f8efd6` `#8a6200` | Pendiente / LIMPIEZA / stock bajo |
| `--danger` `--danger-soft` `--danger-text` | `#c4322f` `#fbeae9` `#a82420` | Alerta / CANCELADO / ANULADA |
| `--info` `--info-soft` `--info-text` | `#2f6df0` `#e8effd` `#1d4ed8` | Información / RESERVADA / ABIERTA |
| `--purple` `--purple-soft` | `#6d4ad8` `#efeafb` | Delivery / rol Gerente |

### Color — Dark (tinta nocturna)
`--bg #0d0f13` · `--surface #15171c` · `--surface-2 #191c22` · `--surface-3 #21252c` · `--border #262a31` · `--text #e9eaee` · `--text-2 #9ba1ac` · `--accent #6f9bff` · `--accent-soft #1a2540` · `--primary #6f9bff` (en dark el primario es el acento). Estados con variantes brillantes (ver `styles.css`).

El menú **Apariencia** (botón gota en topbar) permite cambiar `--accent` en vivo a cualquier hex; los derivados (hover/soft/text) se calculan con `color-mix()`. Persistencia en `localStorage` (`nacho_accent`, `nacho_primaryAccent`). Toggle opcional "usar acento en botones".

### Tipografía
- Familias: **Geist** (sans) y **Geist Mono** (mono), Google Fonts. Fallback `system-ui`.
- Base body 14px / line-height 1.45. `font-variant-numeric: tabular-nums` en `.num`/`.mono`.
- Escala: h1 página 23px/800; títulos de panel 15px/800; labels de sección 10–11px/700 uppercase tracking .08–.09em; badges 11px/700; números grandes (total a cobrar) 42px/800; mesa número 26px/800.

### Radios, sombras, espaciado
- Radios: `--r-sm 5px`, `--r 6px`, `--r-lg 8px`, `--r-xl 12px` (cuadrado, editorial).
- Sombras: `--shadow-sm` casi nula; `--shadow` suave (`0 2px 8px rgba(24,24,27,.07)`); `--shadow-lg` para drawers/modales.
- Layout: sidebar `244px`, topbar `60px`, content padding `26px 30px`. Grid de mesas `repeat(auto-fill, minmax(238px,1fr))`, gap 13px.
- Densidad: `[data-density="compact"]` reduce paddings (variable de Tweaks).

---

## Screens / Views

### 1. Login (`app/login.jsx`)
- **Propósito**: autenticación rápida; redirige a Mesas.
- **Layout**: 2 columnas (50/50). Izquierda: panel oscuro (`--text` de fondo) con marca, claim y features. Derecha: formulario centrado, max-width 380px.
- **Componentes**: campos correo/contraseña (con mostrar/ocultar), checkbox "Recordar sesión", enlace recuperar, botón primario "Ingresar". Selector demo de escenario (Éxito / Credenciales / Servidor caído).
- **Estados**: credenciales inválidas, servidor no disponible, sesión expirada (banner). Spinner durante login (~900ms).
- En móvil el panel oscuro se oculta.

### 2. Shell principal (`app/shell.jsx`)
- **Sidebar** (desktop/tablet): marca, dos grupos de nav — **Operación** (Mesas, Pedidos, Cocina, Caja, Reservas) y **Administración** (Inventario, Reportes, Usuarios, Estado), con contadores. Pie: "Buscar ⌘K".
- **Topbar**: nombre del local, turno, búsqueda, **indicador de conexión** (online/recon/offline con punto), botón sincronizar (spin), **Apariencia** (gota), tema claro/oscuro, **notificaciones** (badge), avatar/rol, logout.
- **Bottom nav** (móvil): Mesas, Pedidos, Cocina, Caja, Más (abre sheet con resto de módulos + tema + logout).
- **Command palette** (⌘K): navega módulos y acciones; teclado ↑/↓/Enter/Esc.
- **Notificaciones** (drawer): agrupadas por severidad (Todas/Sin leer/Críticas); clic navega al módulo; "marcar leídas".
- Banner global de **offline** (fijo arriba) y banner de **reconectando**.

### 3. Mesas / Dashboard operativo (`app/screens-ops.jsx` → `Mesas`)
- **Pantalla principal.** Grid responsive de tarjetas de mesa.
- **Tarjeta**: número (M01…), capacidad + zona, badge de estado (LIBRE/OCUPADA/RESERVADA/LIMPIEZA/BLOQUEADA) con barra lateral de color; si OCUPADA: total de cuenta + tiempo + ítems en cocina; si RESERVADA: hora + cliente; etc.
- **Filtros**: Todas / Libres / Ocupadas / Reservadas / Con cuenta / Con pendientes (con conteos). Búsqueda por número.
- **Switch DEMO ESTADO**: Datos / Cargando (skeletons) / Vacío / Error (con reintentar).
- **Drawer de detalle** (clic en mesa): cuenta activa con ítems y total, lista de pedidos, timeline de actividad, acciones contextuales según estado (Agregar pedido, Cobrar, Sentar reserva, Marcar libre/limpieza). **Anulación de ítem** con motivo + PIN de autorización (tacha el ítem, baja el total, queda registrado).

### 4. Crear pedido (`screens-ops.jsx` → `CrearPedido`)
- **Selector de canal**: Salón (elige mesa) / Para llevar (cliente opcional) / Delivery (proveedor Rappi·PedidosYa·Propio + cliente + dirección obligatorios).
- Catálogo por categoría + búsqueda. Tarjetas muestran área (COCINA/BARRA), stock bajo / sin stock, y badge **OPCIONES** si tiene modificadores.
- **Modal de modificadores** (`commerce.jsx` → `ModifierModal`): grupos single (término, guarnición — obligatorios), multi (quitar ingredientes), extras con precio (+S/), y **mitad y mitad** (elige exactamente 2). Suma extras al precio. Nota a cocina.
- **Carrito**: ítems con modificadores (chips), nota, stepper de cantidad, subtotal "(IGV incl.)". Botón **Enviar pedido** (deshabilitado si delivery sin cliente/dirección). Al enviar: crea pedido(s) por área, actualiza mesa/cuenta (salón) o genera ticket LL-/DEL-, toasts de envío + "actualizando cuenta…" (consistencia eventual).
- Error de negocio: producto no disponible / sin stock (resalta y toast).

### 5. Pedidos (`screens-ops.jsx` → `Pedidos`)
- Tabla densa. Filtros por estado (incluye **Despachados** = ENTREGADO con hora de despacho), por **canal** (Salón/Llevar/Delivery) y por área.
- Columna **Origen**: M## o cliente + badge de canal/proveedor. Indicador de retraso (rojo si demora).
- Acciones por rol: avanzar estado (PENDIENTE→EN_PREPARACION→LISTO→ENTREGADO), cancelar.
- **Drawer de detalle**: info de canal/cliente/dirección (delivery), ítems con modificadores y notas, historial de estado (timeline). Cancelar con confirmación.
- Botones de cabecera para crear pedido **Para llevar** / **Delivery**.

### 6. Cocina / KDS (`screens-ops.jsx` → `Cocina`)
- 3 columnas: Pendiente / En preparación / Listo. Tarjetas grandes con origen (mesa o cliente + canal), tiempo, ítems con cantidades, **modificadores** y notas. Botón grande para avanzar estado. Alertas por demora (>28 min rojo, >18 ámbar).
- **Modo pantalla completa**. Botón **Despachados** (drawer): historial de pedidos entregados con hora.

### 7. Caja / Cobro (`app/screens-money.jsx` → `Caja`)
- Tabs: **Cobrar** / **Transacciones** / **Cierre**.
- **Cobrar**: lista de cuentas abiertas + formulario. Total grande. **Comprobante electrónico**: Boleta (DNI opcional) / Factura (**RUC 11 dígitos + razón social**, validados). **Desglose IGV**: Op. Gravada = total/1.18, IGV 18% = total − base. **Descuento/cortesía** (`DiscountModal`): Happy Hour −15%, 2×1, cupón fijo, **Cortesía 100% con PIN**. Método de pago: EFECTIVO (con monto recibido + vuelto + validaciones), TARJETA, YAPE, TRANSFERENCIA. Confirmación antes de registrar.
- **Éxito**: libera mesa (→ LIMPIEZA), cierra cuenta, registra transacción y **emite comprobante** (serie-correlativo `B001-/F001-`, ticket mono estilo SUNAT, `ReceiptPreview`). Imprimir/enviar.
- **Transacciones**: tabla con filtros por método/estado/búsqueda; anuladas tachadas.
- **Cierre**: KPIs (total cobrado, transacciones, anuladas, ticket promedio) + desglose por método + exportar.

### 8. Reservas (`screens-money.jsx` → `Reservas`)
- Lista tipo agenda del día. Filtros por estado (Pendiente/Confirmada/Cancelada). Tarjeta: hora, cliente, badge, personas/teléfono/mesa, acciones (Confirmar, Asignar mesa, Contactar, Cancelar).
- **Crear reserva** (drawer): cliente, teléfono, hora, comensales (stepper), mesa preferida. **Validación de conflicto de slot** (banner "Ya existe una reserva activa para la Mesa X a las HH:MM").

### 9. Inventario (`app/screens-admin.jsx` → `Inventario`)
- Tabla de productos: categoría, área, precio, stock (con/sin control), disponible (toggle). Filtros: Todos / Bajo stock / Sin stock / No disponibles + por categoría + búsqueda. Banner de stock bajo.
- **Crear/editar producto** (drawer) con validaciones (nombre obligatorio, stock inválido). **Reponer stock** (modal con stepper). Toggle disponible/no disponible.

### 10. Reportes (`screens-admin.jsx` → `Reportes`)
- KPIs (ventas del día, transacciones, ticket promedio, mesas atendidas, reservas) con tendencia. Gráfico de barras ventas/hora, desglose por método de pago (barras de progreso), tabla de productos más vendidos. Filtro de rango (Hoy/Semana/Mes), "datos actualizados hace Ns", exportar CSV.

### 11. Usuarios y permisos (`screens-admin.jsx` → `Usuarios`)
- Solo admin. Tabla: avatar, nombre, correo, **rol editable** (select), estado (activo/inactivo), última actividad. Crear usuario (validación email duplicado/ inválido). Drawer **Permisos por rol** (Administrador, Gerente, Mesero, Cajero, Cocina).

### 12. Estado del sistema / Observabilidad (`screens-admin.jsx` → `Estado`)
- Solo admin. Resumen de salud (OK/degradado/incidente). Tarjetas por microservicio (Identidad, Mesas, Pedidos, Cuentas, Caja, Reservas, Inventario, Reportes, Notificaciones) con estado OK/DEGRADADO/CAÍDO, latencia, uptime, mensaje. Banner si hay servicio caído. Panel de **eventos en cola / DLQ** (pendientes, errores, procesados).

### 13. Notificaciones (`shell.jsx` → `NotifPanel`)
- Drawer agrupado por severidad. Eventos: pedido creado/listo, cuenta cerrada, stock bajo, reserva próxima, error de sync, DLQ (solo admin). Acción: clic navega al módulo; marcar leídas.

### 14. Apariencia (`shell.jsx` → `AppearanceMenu`)
- Popover desde topbar: tema claro/oscuro, swatches de acento + color personalizado (selector nativo + hex), toggle "acento en botones", vista previa, restablecer. Persistencia en localStorage.

---

## Interactions & Behavior
- **Routing**: estado `route` + `params` en `App` (`app/app.jsx`); `go(route, params)`. Reemplazar por React Router en producción.
- **Transiciones**: drawer slide-in (.22s cubic-bezier), modal pop (.16s), toasts slide (.2s), skeleton shimmer (1.3s), spinners. En móvil los drawers son bottom sheets.
- **Estados por pantalla**: cargando (skeletons), vacío (accionable), error (reintentar), conflicto/errores de negocio (banners + toasts), offline/reconectando (banners), "actualizado/ sincronizando" (toasts).
- **Confirmaciones críticas**: cobrar, cancelar reserva/pedido, anular ítem, marcar limpieza — todas vía `ConfirmModal` (tonos danger/warn/accent/ok). Anulación y cortesía requieren **PIN de autorización**.
- **Atajos**: ⌘K / Ctrl+K abre command palette; Esc cierra overlays.
- **Responsive**: ≤920px sidebar→bottom nav, drawers→bottom sheets, oculta columnas desktop-only; ≤560px grids más compactos.

## State Management
Store central mutable en `App` (`useState` + `setStore`). Entidades: `mesas`, `pedidos`, `cuentas`, `productos`, `reservas`, `transacciones`, `usuarios`, `notifs`, `correlativo` (comprobantes). Mutaciones reales: enviar pedido actualiza mesa+cuenta; cobrar libera mesa, registra transacción, incrementa correlativo, emite comprobante; avanzar KDS cambia estado; anular ítem baja total; reponer stock; toggles de disponibilidad/usuario; crear reserva con detección de conflicto.

**En producción**: reemplazar el store mock por llamadas a los microservicios tras Kong (React Query/SWR para fetching, caché e invalidación). Modelar **consistencia eventual** (la UI ya contempla estados "actualizando…"/reintentando). Vocabularios de estado fijos: mesas LIBRE/OCUPADA/RESERVADA/LIMPIEZA/BLOQUEADA; pedidos PENDIENTE/EN_PREPARACION/LISTO/ENTREGADO/CANCELADO; cuentas ABIERTA/CERRADA/PAGADA/ANULADA; reservas PENDIENTE/CONFIRMADA/CANCELADA. IGV = 18%, prices IGV-incluido.

## Assets
- **Iconos**: set funcional propio en `app/icons.jsx` (SVG stroke, feather-style). Reemplazar por la librería del codebase (p. ej. lucide-react) manteniendo los nombres semánticos.
- **Fuentes**: Geist + Geist Mono (Google Fonts). No hay imágenes raster ni logos externos (la marca es un cuadro con "N").

## Files
- `NachoPps.html` — entry point; carga fuentes, React 18 + Babel, y los scripts de `app/`.
- `app/styles.css` — **design tokens + todos los estilos** (light/dark, componentes, responsive).
- `app/icons.jsx` — componente `Icon` + glifos.
- `app/data.jsx` — modelo de datos mock, formatters (`fmt` S/), vocabularios de estado.
- `app/ui.jsx` — primitivos: Badge, StatusBadge, Spinner, Banner, SearchInput, Segmented, FilterChips, Stepper, Drawer, Modal, ConfirmModal, EmptyState, ErrorState, Skeletons, Toasts.
- `app/commerce.jsx` — IGV/`taxBreak`, canales, modificadores, descuentos, anulación, `ReceiptPreview` (comprobante).
- `app/shell.jsx` — Sidebar, Topbar, BottomNav, NotifPanel, CommandPalette, MoreSheet, AppearanceMenu.
- `app/login.jsx` — Login.
- `app/screens-ops.jsx` — Mesas (+drawer), CrearPedido, Pedidos (+drawer), Cocina/KDS (+despachados).
- `app/screens-money.jsx` — Caja (cobro/transacciones/cierre + comprobante), Reservas.
- `app/screens-admin.jsx` — Inventario, Reportes, Usuarios, Estado.
- `app/app.jsx` — store, routing, tema/densidad/acento, toasts, Tweaks.
- `app/tweaks-panel.jsx` — panel de ajustes en vivo (opcional, no esencial para producción).

## Cómo correr el prototipo
Abrir `NachoPps.html` en un navegador (requiere internet para CDNs de React/Babel/fuentes). No necesita build. Login: botón **Ingresar** (o probar escenarios de error).

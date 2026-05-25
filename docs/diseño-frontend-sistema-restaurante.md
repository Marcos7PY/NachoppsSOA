# Diseño Front-End — Sistema Restaurante
> Documento de referencia para replicación exacta. Generado desde análisis del código fuente.

---

## Stack y Dependencias

- **Framework:** Vue 3 + Inertia.js (SPA sobre Laravel)
- **Estilos:** Tailwind CSS v4 con CSS variables (`@theme inline`)
- **UI Components:** shadcn-vue — estilo `default`, baseColor `neutral`, cssVariables `true`
- **Iconos:** `lucide-vue-next`
- **Font:** `Instrument Sans` (Google Fonts) → fallback `ui-sans-serif, system-ui, sans-serif`
- **Router helper:** Ziggy (`route()` + `usePage()` de Inertia)

---

## Tokens de Diseño (CSS Variables)

### Modo Claro (`:root`)
```css
--background: hsl(0 0% 100%)
--foreground: hsl(0 0% 3.9%)
--card: hsl(0 0% 100%)
--card-foreground: hsl(0 0% 3.9%)
--popover: hsl(0 0% 100%)
--popover-foreground: hsl(0 0% 3.9%)
--primary: hsl(0 0% 9%)
--primary-foreground: hsl(0 0% 98%)
--secondary: hsl(0 0% 92.1%)
--secondary-foreground: hsl(0 0% 9%)
--muted: hsl(0 0% 96.1%)
--muted-foreground: hsl(0 0% 45.1%)
--accent: hsl(0 0% 96.1%)
--accent-foreground: hsl(0 0% 9%)
--destructive: hsl(0 84.2% 60.2%)
--destructive-foreground: hsl(0 0% 98%)
--border: hsl(0 0% 92.8%)
--input: hsl(0 0% 89.8%)
--ring: hsl(0 0% 3.9%)
--radius: 0.5rem
--sidebar-background: hsl(0 0% 98%)
--sidebar-foreground: hsl(240 5.3% 26.1%)
--sidebar-primary: hsl(0 0% 10%)
--sidebar-primary-foreground: hsl(0 0% 98%)
--sidebar-accent: hsl(0 0% 94%)
--sidebar-accent-foreground: hsl(0 0% 30%)
--sidebar-border: hsl(0 0% 91%)
--sidebar-ring: hsl(217.2 91.2% 59.8%)
```

### Modo Oscuro (`.dark`)
```css
--background: hsl(0 0% 3.9%)
--foreground: hsl(0 0% 98%)
--card: hsl(0 0% 3.9%)
--card-foreground: hsl(0 0% 98%)
--primary: hsl(0 0% 98%)
--primary-foreground: hsl(0 0% 9%)
--secondary: hsl(0 0% 14.9%)
--secondary-foreground: hsl(0 0% 98%)
--muted: hsl(0 0% 16.08%)
--muted-foreground: hsl(0 0% 63.9%)
--accent: hsl(0 0% 14.9%)
--accent-foreground: hsl(0 0% 98%)
--destructive: hsl(0 84% 60%)
--border: hsl(0 0% 14.9%)
--input: hsl(0 0% 14.9%)
--ring: hsl(0 0% 83.1%)
--sidebar-background: hsl(0 0% 7%)
--sidebar-foreground: hsl(0 0% 95.9%)
--sidebar-accent: hsl(0 0% 15.9%)
--sidebar-accent-foreground: hsl(240 4.8% 95.9%)
--sidebar-border: hsl(0 0% 15.9%)
```

### Base global
```css
/* Todas las etiquetas */
* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
```

---

## Layout Shell

```
AppShell
└── AppSidebarLayout
    ├── Sidebar (collapsible="icon", variant="inset")
    │   ├── SidebarHeader → AppLogo
    │   ├── SidebarContent → NavMain
    │   └── SidebarFooter → NavUser
    └── <slot> (contenido de página)
```

- El sidebar colapsa a solo íconos al hacer clic (colapsable estilo `icon`)
- El contenido ocupa el resto del viewport (`variant="inset"`)

---

## Sidebar

### Ítems de navegación (condicional por rol)

| Ícono lucide | Título | Ruta activa |
|---|---|---|
| `LayoutGrid` | Dashboard | siempre visible |
| `Users` | Personal | `users.*` — solo admin |
| `Tag` | Categorías | `categories.*` — solo admin |
| `Package` | Productos | `product.*` — solo admin |
| `Square` | Mesas | `tables.*` — solo admin |
| `NotebookPen` | Órdenes | `orders.*` — solo admin |
| `ChefHat` | Cocina | `kitchen.*` — solo admin |

- Ítem activo: detectado con `route().current('modulo.*')` → prop `isActive` en shadcn sidebar
- Footer links (íconos `Folder`, `BookOpen`): GitHub Repo + Documentation

### NavUser (footer del sidebar)
- Avatar con iniciales del usuario (`getInitials(name)`)
- Dropdown al hacer clic: opciones de perfil, settings, logout

---

## Página: Login

**Archivo:** `pages/auth/Login.vue`  
**Layout:** `AuthLayout.vue` — centrado vertical/horizontal, tarjeta estrecha

### Estructura del formulario
```
AuthLayout
  title="Inicie sesión en su cuenta"
  description="Inicie su correo y contraseña para ingresar al sistema"

  [status message si existe] → text-center text-sm font-medium text-green-600

  Form (flex flex-col gap-6)
    div.grid.gap-6
      Campo Correo
        Label "Correo"
        Input type="email" name="email" autofocus placeholder="correo@ejemplo.com"
        InputError

      Campo Contraseña
        div.flex.items-center.justify-between
          Label "Contraseña"
          TextLink "¿Olvidó su contraseña?" (solo si canResetPassword) → text-sm
        Input type="password" name="password" placeholder="Password"
        InputError

      div.flex.items-center.justify-between
        Label.flex.items-center.space-x-3
          Checkbox name="remember"
          span "Recuérdame"

      Button type="submit" class="mt-4 w-full" (disabled cuando processing)
        Spinner (visible si processing)
        "Iniciar sesión"
```

---

## Página: Dashboard

**Archivo:** `pages/Dashboard.vue`  
**Layout:** `AppLayout`

### Header
```
h2.font-semibold.text-xl.text-gray-800.dark:text-gray-200.leading-tight
  "Panel de Control - [ROL EN MAYÚSCULAS]"
```

### Contenido (condicional por rol)
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8

    [v-if isAdmin]
      div.grid.grid-cols-1.md:grid-cols-3.gap-6
        Tarjeta: bg-white dark:bg-gray-800 p-6 rounded-lg shadow
          h3.text-lg.font-bold → "Gestión de Usuarios"
          p.text-gray-500 → "Crear y administrar empleados."
        Tarjeta: misma clase
          h3.text-lg.font-bold → "Reporte de Ventas"
          p.text-gray-500.text-3xl.font-bold.mt-2 → "$0.00"

    [v-else-if isCocinero]
      div.bg-white.dark:bg-gray-800.p-6.rounded-lg.shadow
        h3.text-xl.font-bold.text-orange-600 → "Comandas Pendientes"
        p → "Aquí aparecerán los pedidos en tiempo real."

    [v-else-if isMesero]
      div.bg-white.dark:bg-gray-800.p-6.rounded-lg.shadow
        h3.text-xl.font-bold.text-blue-600 → "Mis Mesas"
        p → "Selecciona una mesa para tomar un pedido."
```

---

## Página: Mapa de Mesas (Orders Index)

**Archivo:** `pages/Orders/Index.vue`  
**Layout:** `AppSidebarLayout`  
**Tiempo real:** Pusher channel `'tables'` → evento `TableStatusUpdated` → `router.reload({ only: ['activeOrders'] })`

### Estructura
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8
    div.flex.justify-between.items-center.mb-6
      h2.text-2xl.font-bold.text-gray-800.dark:text-gray-200 → "Estado de Mesas"

    div.grid.grid-cols-2.md:grid-cols-4.gap-6
      [v-for table in tables]
        Link (href → orders.show({ table: table.id }))
          Clases base: h-40 rounded-xl flex flex-col items-center justify-center
                       shadow-lg transition-transform hover:scale-105
                       cursor-pointer border-2 relative overflow-hidden
          [Mesa libre]  → bg-green-100 border-green-500 text-green-700
          [Mesa ocupada] → bg-red-100 border-red-500 text-red-700

          span.text-3xl.font-bold.mb-1 → "{{ table.name }}"
          span.text-xs.font-bold.uppercase.tracking-wider.mb-2 → "LIBRE" / "OCUPADA"

          [v-if ocupada]
            div.flex.items-center.gap-1.bg-white/50.px-2.py-1.rounded-full
               .text-xs.font-semibold.text-red-800.mt-1
              User (w-3 h-3)
              span → nombre del mesero
```

---

## Página: POS / Comanda

**Archivo:** `pages/Orders/Pos.vue`  
**Layout:** `AppSidebarLayout`  
**Tiempo real:** Pusher channel `'kitchen'` → evento `OrderItemUpdated` → `router.reload({ only: ['currentOrder'] })`

### Shell de la página
```
div.h-[calc(100vh-65px)].flex
  [Columna Izquierda — Catálogo]  w-2/3
  [Columna Derecha — Comanda]     w-1/3
```

---

### Columna Izquierda — Catálogo (w-2/3)
```
div.w-2/3.bg-gray-50.dark:bg-gray-900.p-4.overflow-y-auto

  div.flex.items-center.gap-4.mb-6
    Link (href → orders.index)
      Button variant="outline" size="icon"
        ArrowLeft
    h2.text-2xl.font-bold → "{{ table.name }}"

  [v-for cat in categories]
    div.mb-8
      h3.text-xl.font-bold.mb-4.px-2.border-l-4
         :style="{ borderColor: cat.color }"   ← color dinámico de la categoría
        → "{{ cat.name }}"

      div.grid.grid-cols-3.gap-4
        [v-for prod in cat.products]
          div @click="addToOrder(prod)"
            Clases: bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer
                    hover:ring-2 hover:ring-indigo-500 transition-all
                    select-none active:scale-95
            div.font-bold → "{{ prod.name }}"
            div.text-green-600.font-mono → "S/. {{ prod.price }}"
```

---

### Columna Derecha — Comanda (w-1/3)
```
div.w-1/3.bg-white.dark:bg-gray-800.border-l.border-gray-200.p-4.flex.flex-col

  div.flex-1.overflow-y-auto.pr-2

    ── Sección "Pedidos Enviados" (items en BD) ──────────────────
    [v-if currentOrder?.items.length > 0]
      h3.text-xs.font-bold.text-gray-400.uppercase.tracking-wider.mb-2
        → "Pedidos Enviados"

      [v-for item in currentOrder.items]
        div.flex.justify-between.items-start.py-2.border-b.border-gray-100

          [Columna izquierda del ítem]
            div.font-bold.text-gray-800
              span.text-gray-500.mr-2.text-sm → "x{{ item.quantity }}"
              → "{{ item.product.name }}"
            div.flex.items-center.gap-2.mt-1
              span.text-[10px].px-2.py-0.5.rounded-full.font-bold.uppercase
                queued  → bg-gray-200 text-gray-700   → "Enviado"
                cooking → bg-orange-100 text-orange-700 → "Preparando"
                ready   → bg-green-100 text-green-700   → "Listo"
                served  → bg-blue-100 text-blue-700      → "Servido"
              [v-if item.notes]
                span.text-xs.text-orange-600.italic → "{{ item.notes }}"

          [Columna derecha del ítem]
            div.flex.items-center.gap-1
              span.text-sm.font-mono.text-gray-500
                → "S/. {{ (item.quantity * item.price).toFixed(2) }}"
              Button variant="ghost" size="icon" class="h-6 w-6"
                MessageSquareText (w-3 h-3 text-gray-400)
              [v-if isAdmin]
                button.text-red-300.hover:text-red-600 @click="removeDbItem"
                  Trash2 (w-3 h-3)

    ── Sección "Por Comandar" (carrito local) ────────────────────
    [v-if newItems.length > 0]
      div.mt-6
        h3.text-xs.font-bold.text-indigo-500.uppercase.tracking-wider.mb-2
           .flex.items-center.gap-2
          UtensilsCrossed (w-3 h-3)
          → "Por Comandar"

        [v-for (item, index) in newItems]
          div.bg-indigo-50.dark:bg-indigo-900/20.p-2.rounded.mb-2
             .border.border-indigo-100

            div.flex.justify-between.items-start
              [izquierda]
                div.font-bold.text-indigo-900.dark:text-indigo-200 → nombre
                [v-if notes] div.text-xs.text-indigo-600.italic.mt-1 → nota
              [derecha]
                div.text-right
                  div.font-mono.font-bold → "S/.{{ (qty*price).toFixed(2) }}"
                  button.text-red-500.text-xs.hover:underline.mt-1 → "Quitar"

            div.flex.items-center.gap-3.mt-2
              [Contador +/-]
                div.flex.items-center.bg-white.rounded.border.border-gray-300.overflow-hidden
                  button.px-2.py-0.5.hover:bg-gray-100 → "-"
                  span.px-2.text-sm.font-bold → "{{ item.quantity }}"
                  button.px-2.py-0.5.hover:bg-gray-100 → "+"
              Button variant="ghost" size="sm" class="h-6 text-xs text-gray-500"
                → "Nota" / "Editar nota"

    ── Estado Vacío ──────────────────────────────────────────────
    [v-if sin pedidos y sin carrito]
      div.text-center.text-gray-400.mt-10
        Clock (w-12 h-12 mx-auto mb-2 opacity-20)
        p → "Comienza seleccionando productos."

  ── Footer sticky (siempre visible) ──────────────────────────
  div.border-t.pt-4.bg-white.dark:bg-gray-800.mt-2
    div.flex.justify-between.items-center.mb-4
      span.text-gray-500 → "Total Acumulado:"
      span.text-3xl.font-bold → "S/. {{ grandTotal }}"

    div.grid.gap-2
      [grid-cols-2 si canCheckout, grid-cols-1 si no]

      Button class="h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg w-full"
        [disabled si newItems vacío] [opacity-50 cursor-not-allowed si disabled]
        Send (w-5 h-5 mr-2) + "Comandar"

      [v-if canCheckout]
      Button variant="secondary"
        class="h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg w-full"
        [disabled si no hay currentOrder O hay items pendientes]
        Receipt (w-5 h-5 mr-2) + "Cobrar"
```

---

### Modal: Nota para Cocina
```
Dialog v-model:open="isNoteOpen"
  DialogContent class="sm:max-w-[400px]"
    DialogHeader
      DialogTitle → "Nota para Cocina"
    div.py-4
      Label → "Instrucciones especiales"
      Input v-model="noteText"
            placeholder="Ej: Poca sal, Salsa aparte..."
            @keyup.enter="saveNote"
    DialogFooter
      Button @click="saveNote" → "Guardar"
```

---

### Modal: Cobrar (Checkout)
```
Dialog v-model:open="isCheckoutOpen"
  DialogContent class="sm:max-w-2xl"
    DialogHeader
      DialogTitle class="text-xl" → "Cobrar {{ table.name }}"
      DialogDescription
        div.flex.justify-between.items-center.bg-muted/50.p-3.rounded-lg.mt-2
          span.text-base → "Total a Pagar:"
          span.text-2xl.font-black.text-foreground → "S/. {{ grandTotal }}"

    div.grid.gap-6.py-2

      ── Lista de pagos ya agregados ──────────────────────────
      [v-if paymentsList.length > 0]
        Label.text-xs.font-bold.uppercase.text-muted-foreground → "Pagos Agregados"
        div.bg-muted/30.rounded-lg.border.divide-y
          [v-for pay in paymentsList]
            div.flex.justify-between.items-center.p-3.text-sm
              div.flex.items-center.gap-2
                Badge variant="outline" class="capitalize bg-white" → método
                span.font-mono.font-bold → "S/. {{ amount }}"
              button.text-red-500.hover:bg-red-50.p-1.rounded.transition-colors
                X (w-4 h-4)

      ── Formulario nuevo pago (v-if remaining > 0) ───────────
      div.space-y-4.border.rounded-xl.p-4.bg-gray-50.dark:bg-gray-900/50
        div.flex.justify-between.items-center
          Label.text-indigo-600.font-bold → "Falta por cubrir: S/. {{ remaining }}"
          button.text-xs.text-indigo-600.hover:underline → "Usar restante"

        div.grid.grid-cols-3.gap-2
          [v-for method in paymentMethods]  ← Efectivo, Tarjeta, Yape/Plin
          div @click="currentPayment.method = method.id"
            Clases base: cursor-pointer border rounded-lg p-2
                         flex flex-col items-center justify-center gap-1 transition-all
            [Activo]:   border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600
            [Inactivo]: border-gray-200 bg-white hover:bg-gray-50
            component(:is="method.icon") (w-5 h-5)
            span.text-xs.font-bold → nombre del método

        div.flex.gap-2
          div.relative.flex-1
            span.absolute.left-3.top-1/2.-translate-y-1/2.font-bold.text-gray-500 → "S/."
            Input v-model="currentPayment.amount" type="number" step="0.10"
                  class="pl-10 h-10 font-bold text-lg" placeholder="0.00"
                  @keyup.enter="addPayment"
          Button @click="addPayment" class="bg-indigo-600 hover:bg-indigo-700"
            Plus (w-4 h-4 mr-1) + "Agregar"

      ── Estado cubierto (v-else) ─────────────────────────────
      div.bg-green-50.dark:bg-green-900/20.p-4.rounded-xl.border.border-green-200
         .flex.justify-between.items-center.animate-in.fade-in
        div.flex.items-center.gap-2.text-green-700
          CheckCircle2 (w-6 h-6)
          span.font-bold.text-lg → "Cuenta Cubierta"
        [v-if vuelto > 0]
          div.text-right
            span.text-xs.text-green-600.font-bold.uppercase.block → "Vuelto"
            span.text-3xl.font-black.text-green-700 → "S/. {{ globalChange }}"

    DialogFooter class="gap-2 sm:justify-between mt-2"
      Button variant="outline" @click="isCheckoutOpen = false" → "Cancelar"
      Button class="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-lg h-12 shadow-lg"
             [disabled si remaining > 0]
        Receipt (w-5 h-5 mr-2) + "Confirmar Cobro"
```

---

## Página: Cocina (Kitchen Monitor)

**Archivo:** `pages/Kitchen/Index.vue`  
**Layout:** `AppLayout`  
**Tiempo real:** Pusher channel `'kitchen'` → evento `OrderItemUpdated` → `router.reload({ only: ['items'] })`

### Estructura
```
div.min-h-screen.bg-gray-100.p-6.text-gray-800   ← fondo gris, diferente al resto

  div.flex.justify-between.items-center.mb-8
    h1.text-3xl.font-bold.flex.items-center.gap-3
      ChefHat (w-8 h-8 text-indigo-600)
      → "Monitor de Pedidos"
    div.flex.items-center.gap-2.text-sm.text-green-600.bg-green-100.px-3.py-1.rounded-full
      span.relative.flex.h-3.w-3
        span.animate-ping.absolute.inline-flex.h-full.w-full.rounded-full.bg-green-400.opacity-75
        span.relative.inline-flex.rounded-full.h-3.w-3.bg-green-500
      → "En vivo"

  ── Estado vacío ──────────────────────────────────────────────
  [v-if items.length === 0]
    div.flex.flex-col.items-center.justify-center.h-[60vh].text-gray-400
      CheckCircle2 (w-20 h-20 mb-4 opacity-20)
      p.text-xl → "Todo limpio. No hay pedidos pendientes."

  ── Grid de comandas ──────────────────────────────────────────
  [v-else]
    div.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.xl:grid-cols-4.gap-4

      [v-for item in items]
        div.bg-white.rounded-lg.shadow-md.p-4.flex.flex-col.justify-between
           .min-h-[200px].transition-all.duration-300
          Borde izquierdo por estado:
            queued  → border-l-4 border-gray-500
            cooking → border-l-4 border-orange-500 bg-orange-50
            ready   → border-l-4 border-green-500 bg-green-50

          ── Zona superior ───────────────────────────────────
          div
            div.flex.justify-between.items-start.mb-2
              span.font-bold.text-lg.text-indigo-900 → "{{ item.order.table.name }}"
              span.text-xs.font-mono.bg-gray-100.px-2.py-1.rounded.text-gray-500
                 .flex.items-center.gap-1
                Clock (w-3 h-3)
                → hora formateada HH:MM

            div.mt-2
              div.text-xl.font-bold.flex.items-start.gap-2
                span.text-gray-500.text-base.mt-1 → "x{{ item.quantity }}"
                → "{{ item.product.name }}"
              [v-if item.notes]
                div.mt-2.bg-yellow-50.text-yellow-800.p-2.rounded.text-sm.italic
                   .border.border-yellow-200.flex.gap-1
                  → 📝 "{{ item.notes }}"

          ── Zona inferior (separada por línea punteada) ─────
          div.mt-4.pt-4.border-t.border-dashed.border-gray-200
            div.flex.justify-between.items-center.mb-3
              span.text-xs.font-bold.uppercase.tracking-wider.text-gray-500 → "Estado"
              span.font-bold.uppercase.text-sm
                cooking → text-orange-600
                ready   → text-green-600
                queued  → text-gray-600
                → texto del estado

            button @click="advanceStatus(item)"
              Clases base: w-full py-3 rounded-lg font-bold text-white shadow-sm
                           hover:shadow-md transition-all flex items-center
                           justify-center gap-2 active:scale-95
              queued  → bg-blue-600 hover:bg-blue-700   → "Empezar"
              cooking → bg-orange-500 hover:bg-orange-600 → "Terminar"
              ready   → bg-green-600 hover:bg-green-700   → "Despachar"
              ArrowRight (w-4 h-4)
```

---

## Página: Mesas (Tables)

**Archivo:** `pages/Tables/Index.vue`  
**Layout:** `AppLayout`

### Estructura
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8

    ── Header ──────────────────────────────────────────────────
    div.flex.justify-between.items-center.mb-8.px-2
      div.flex.items-center.gap-3
        Square (w-8 h-8 text-indigo-500)
        div
          h2.font-bold.text-2xl.text-gray-800.dark:text-gray-200 → "Salón"
          p.text-sm.text-gray-500 → "Administra la distribución de tus mesas"
      Button size="lg" class="shadow-md" @click="openCreate" → "+ Nueva Mesa"

    ── Grid de mesas ────────────────────────────────────────────
    [v-if tables.length > 0]
      div.grid.grid-cols-2.md:grid-cols-3.lg:grid-cols-4.xl:grid-cols-5.gap-6

        [v-for table in tables]
          Card class="hover:shadow-lg transition-shadow relative border-t-4 border-t-indigo-500"

            [Menú 3 puntos - absolute top-2 right-2]
              DropdownMenu
                DropdownMenuTrigger
                  Button variant="ghost" size="icon" class="h-8 w-8 rounded-full"
                    MoreVertical (h-4 w-4)
                DropdownMenuContent align="end"
                  DropdownMenuItem @click="openEdit(table)"
                    Pencil (mr-2 h-4 w-4) + "Editar"
                  DropdownMenuItem @click="deleteTable" class="text-red-600"
                    Trash2 (mr-2 h-4 w-4) + "Eliminar"

            CardHeader class="pb-2"
              CardTitle class="text-lg font-bold truncate pr-6" → nombre de mesa

            CardContent
              div.flex.items-center.justify-between.mt-2
                Badge variant="outline"
                      class="bg-green-50 text-green-700 border-green-200"
                  → "Disponible"

    ── Estado vacío ─────────────────────────────────────────────
    [v-else]
      div.text-center.py-20.bg-white.dark:bg-gray-800.rounded-lg.shadow-sm
         .border.border-dashed.border-gray-300
        Square (w-12 h-12 text-gray-300 mx-auto mb-4)
        h3.text-lg.font-medium.text-gray-900.dark:text-gray-100
          → "No hay mesas configuradas"
        p.text-gray-500.mb-6 → "Empieza creando la Mesa 1."
        Button variant="outline" @click="openCreate" → "Crear primera mesa"

    ── Modal crear/editar ────────────────────────────────────────
    Dialog v-model:open="isOpen"
      DialogContent class="sm:max-w-[400px]"
        DialogHeader
          DialogTitle → "Nueva Mesa" / "Editar Mesa"
        form @submit.prevent="submit" class="grid gap-4 py-4"
          div.grid.gap-2
            Label → "Nombre de la Mesa"
            Input v-model="form.name" placeholder="Ej: Mesa 1, Barra A"
            [v-if error] span.text-red-500.text-xs → mensaje de error
          DialogFooter
            Button type="submit" :disabled="form.processing"
              → "Guardar" / "Actualizar"
```

---

## Página: Productos

**Archivo:** `pages/Products/Index.vue`  
**Layout:** `AppLayout`

### Estructura
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8
    div.bg-white.dark:bg-gray-800.overflow-hidden.shadow-sm.sm:rounded-lg.p-6

      ── Header ────────────────────────────────────────────────
      div.flex.justify-between.items-center.mb-6
        h2.font-semibold.text-xl.text-gray-800.dark:text-gray-200
          → "Menú de Productos"
        Button @click="openCreate"
          Plus (w-4 h-4 mr-2) + "Nuevo Producto"

      ── Modal crear/editar ─────────────────────────────────────
      Dialog v-model:open="isOpen"
        DialogContent class="sm:max-w-[500px]"
          DialogHeader
            DialogTitle → "Crear Producto" / "Editar Producto"
          form @submit.prevent="submit" class="grid gap-4 py-4"
            div.grid.grid-cols-2.gap-4
              div.grid.gap-2
                Label → "Nombre"
                Input v-model="form.name"
                [error] span.text-red-500.text-xs
              div.grid.gap-2
                Label → "Precio"
                Input type="number" step="0.01" v-model="form.price"
                [error] span.text-red-500.text-xs
            div.grid.gap-2
              Label → "Categoría"
              Select v-model="form.category_id"
                SelectTrigger
                  SelectValue placeholder="Selecciona..."
                SelectContent
                  [v-for cat] SelectItem :value="cat.id.toString()" → cat.name
              [error] span.text-red-500.text-xs
            div.grid.gap-2
              Label → "Imagen"
              Input type="file" @input="form.image = $event.target.files[0]"
              [error] span.text-red-500.text-xs
            DialogFooter
              Button type="submit" :disabled="form.processing"
                → "Guardar" / "Actualizar"

      ── Tabla ─────────────────────────────────────────────────
      Table (shadcn)
        TableHeader
          TableRow
            TableHead class="w-[80px]" → "Imagen"
            TableHead → "Nombre"
            TableHead → "Categoría"
            TableHead → "Precio"
            TableHead class="text-right" → "Acciones"
        TableBody
          [v-for prod in products]
          TableRow
            TableCell
              div.w-10.h-10.rounded.bg-gray-100.flex.items-center.justify-center.overflow-hidden
                [si imagen] img :src="'/storage/' + prod.image" class="w-full h-full object-cover"
                [si no]     ImageIcon (w-5 h-5 text-gray-400)
            TableCell class="font-medium" → prod.name
            TableCell
              span.px-2.py-1.rounded.text-xs
                    :style="{ backgroundColor: prod.category?.color + '40' }"
                → prod.category?.name
            TableCell → "S/. {{ prod.price }}"
            TableCell class="text-right space-x-2"
              Button variant="ghost" size="sm" @click="openEdit(prod)"
                Pencil (w-4 h-4 text-blue-600)
              Button variant="ghost" size="sm" @click="deleteProduct(prod.id)"
                Trash2 (w-4 h-4 text-red-600)
```

---

## Página: Categorías

**Archivo:** `pages/Categories/Index.vue`  
**Layout:** `AppLayout`

### Estructura
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8
    div.bg-white.dark:bg-gray-800.overflow-hidden.shadow-sm.sm:rounded-lg.p-6

      ── Header ────────────────────────────────────────────────
      div.flex.justify-between.items-center.mb-6
        div.flex.items-center.gap-2
          Tag (w-6 h-6 text-orange-500)
          h2.font-semibold.text-xl.text-gray-800.dark:text-gray-200
            → "Categorías del Menú"
        Button @click="openCreate" → "+ Nueva Categoría"

      ── Modal crear/editar ─────────────────────────────────────
      Dialog v-model:open="isOpen"
        DialogContent class="sm:max-w-[400px]"
          DialogHeader
            DialogTitle → "Nueva Categoría" / "Editar Categoría"
            DialogDescription → "Define las secciones de tu menú."
          form @submit.prevent="submit" class="grid gap-4 py-4"
            div.grid.gap-2
              Label → "Nombre"
              Input v-model="form.name" placeholder="Ej: Bebidas, Postres"
              [error] span.text-red-500.text-sm
            div.grid.gap-2
              Label → "Color de Etiqueta"
              div.flex.gap-4.items-center
                Input type="color" v-model="form.color"
                      class="w-12 h-10 p-1 cursor-pointer"
                span.text-sm.text-gray-500 → "{{ form.color }}"  ← muestra el hex
            DialogFooter
              Button type="submit" :disabled="form.processing"
                → "Guardar" / "Actualizar"
          [Color default al crear: #3b82f6]

      ── Tabla ─────────────────────────────────────────────────
      Table (shadcn)
        TableHeader
          TableRow
            TableHead → "Color"
            TableHead → "Nombre"
            TableHead → "Slug (URL)"
            TableHead class="text-right" → "Acciones"
        TableBody
          [v-for cat in categories]
          TableRow
            TableCell
              div.w-6.h-6.rounded-full.border.border-gray-200.shadow-sm
                   :style="{ backgroundColor: cat.color }"
            TableCell class="font-medium" → cat.name
            TableCell class="text-gray-500 font-mono text-sm" → "/{{ cat.slug }}"
            TableCell class="text-right flex justify-end gap-2"
              Button variant="outline" size="sm" @click="openEdit(cat)"
                Pencil (w-4 h-4)
              Button variant="destructive" size="sm" @click="deleteCategory(cat.id)"
                Trash2 (w-4 h-4)

          [v-if categories.length === 0]
          TableRow
            TableCell colspan="4" class="text-center py-8 text-gray-500"
              → "No hay categorías creadas aún."
```

---

## Página: Usuarios / Personal

**Archivo:** `pages/Users/Index.vue`  
**Layout:** `AppLayout`

### Modal crear/editar (`sm:max-w-[425px]`)
```
DialogTitle → "Crear Nuevo Empleado" / "Editar Empleado"
DialogDescription → "Ingresa los datos del nuevo personal." / "Modifica los datos del usuario."

form.grid.gap-4.py-4
  Campo Nombre     → Input placeholder="Juan Pérez"
  Campo Correo     → Input type="email"
  Campo Contraseña → Input type="password" (label dice "(Opcional)" en modo edición)
  Campo Rol        → Select con opciones en .toUpperCase()

  Button type="submit" → "Guardando..." (si processing) / "Guardar"
```

### Tabla
Columnas estándar con acciones `Pencil` (azul) y `Trash2` (rojo), mismo patrón que Productos.

---

## Patrones Reutilizables

### Wrapper de página con tabla
```
div.py-12
  div.max-w-7xl.mx-auto.sm:px-6.lg:px-8
    div.bg-white.dark:bg-gray-800.overflow-hidden.shadow-sm.sm:rounded-lg.p-6
      [header con título + botón crear]
      [Dialog modal]
      [Table shadcn]
```

### Colores de acento por función
| Función | Color Tailwind |
|---|---|
| Acción primaria / activo | `indigo-600` / `hover:indigo-700` |
| Confirmar / éxito / cobro | `emerald-600` / `hover:emerald-700` |
| Peligro / eliminar | `red-600` / `variant="destructive"` |
| Cocina / estado cooking | `orange-500` |
| Listo / disponible | `green-600` |
| Neutral / enviado | `gray-500` |
| Categorías (ícono header) | `orange-500` |
| Mesas (ícono) | `indigo-500` |

### Error de validación
```html
<span v-if="form.errors.campo" class="text-red-500 text-xs">{{ form.errors.campo }}</span>
```

### Precios
Siempre con `font-mono` y prefijo `"S/."`. Ejemplo: `S/. 12.50`

### Tiempo real (Pusher/Echo)
```js
// onMounted
window.Echo.channel('canal').listen('NombreEvento', (e) => {
    router.reload({ only: ['propInertia'], preserveScroll: true });
});
// onUnmounted
window.Echo.leave('canal');
```

### Badge de estado (reutilizable)
```js
const statusMap = {
    queued:  { text: 'Enviado',    classes: 'bg-gray-200 text-gray-700' },
    cooking: { text: 'Preparando', classes: 'bg-orange-100 text-orange-700' },
    ready:   { text: 'Listo',      classes: 'bg-green-100 text-green-700' },
    served:  { text: 'Servido',    classes: 'bg-blue-100 text-blue-700' },
};
// Aplicar: text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
```

### Miniatura de imagen de producto
```html
<div class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
    <img v-if="prod.image" :src="'/storage/' + prod.image" class="w-full h-full object-cover" />
    <ImageIcon v-else class="w-5 h-5 text-gray-400" />
</div>
```

### Badge de categoría con color dinámico (25% opacidad)
```html
<span class="px-2 py-1 rounded text-xs"
      :style="{ backgroundColor: prod.category?.color + '40' }">
    {{ prod.category?.name }}
</span>
```

---

## Referencia de Componentes shadcn-vue Utilizados

```
Button, Input, Label, Checkbox
Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose
Table, TableHeader, TableBody, TableRow, TableHead, TableCell
Card, CardHeader, CardTitle, CardContent, CardFooter
Badge
Select, SelectTrigger, SelectValue, SelectContent, SelectItem
DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
Avatar, AvatarFallback, AvatarImage
Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton
NavigationMenu, NavigationMenuItem, NavigationMenuList
Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
Breadcrumb (+ sub-componentes)
Alert, AlertTitle, AlertDescription
Collapsible, CollapsibleContent, CollapsibleTrigger
```

## Referencia de Iconos lucide-vue-next Utilizados

```
LayoutGrid, Users, Tag, Package, Square, NotebookPen, ChefHat
Folder, BookOpen
ArrowLeft, ArrowRight
Trash2, Pencil, Plus, X
Send, Receipt, Coins
Banknote, CreditCard, Smartphone
MessageSquareText, UtensilsCrossed
Clock, CheckCircle2
ChefHat, User
MoreVertical
Image (alias ImageIcon)
Search, Menu
```

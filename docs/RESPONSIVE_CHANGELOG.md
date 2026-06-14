# NachoPps — Responsive System v2 · Changelog

**Fecha:** 2026-06-13  
**Alcance:** `src/styles.css`, `Shell.tsx`, `Header.tsx`, `BottomNav.tsx`, `Sidebar.tsx`

---

## Resumen ejecutivo

Se reescribió el sistema responsive de NachoPps corrigiendo 6 bugs críticos de
contenido recortado en móvil, añadiendo un breakpoint explícito de tablet con
sidebar icon-only, mejorando la accesibilidad (ARIA, HCM, focus management) y
consolidando los bloques `@media` dispersos en el CSS.

**Principio guía:** Cero scroll horizontal. Toda adaptación es reorganización
de layout, nunca `overflow-x: auto` como solución.

---

## Breakpoint System v2

```
Nombre         Rango           Dispositivos cubiertos
──────────────────────────────────────────────────────────────────
4k             ≥1920px         Monitores 2K/4K (max-width 1600px)
desktop-lg     ≥1280px         Laptop/desktop estándar, sidebar 244px
desktop-sm     1100–1279px     Laptop compacto, sidebar 216px
tablet-land    921–1099px      Tablet landscape — sidebar icon-only 62px  ← NUEVO
tablet-port    769–920px       Tablet portrait — BottomNav + grids tablet  ← NUEVO
phone-lg       ≤920px          Teléfonos + tablet portrait (pivot principal)
phone-md       ≤768px          Settings/notif popovers → posición fija
modal-sheet    ≤640px          Modales → bottom sheets (era ≤720px)        ← CAMBIADO
phone-sm       ≤560px          Android gama media
phone-xs       ≤480px          Header 52px, turno-bar column              ← NUEVO
phone-xxs      ≤380px          Límite inferior estándar
fold-sm        ≤320px          iPhone SE 1ª gen — BottomNav íconos sin etiquetas
fold-xsm       ≤280px          Samsung Galaxy Fold cerrado — layout mínimo
landscape-mob  orientation:landscape + max-height:500px  ← NUEVO
──────────────────────────────────────────────────────────────────
```

---

## Bugs críticos resueltos

### Bug 0 · `overflow-x: clip` → `overflow-x: hidden` (raíz de todos los recortes)

**Causa:** `overflow-x: clip` es más agresivo que `hidden`: corta el contenido
sin crear contexto de scroll, sin posibilidad de rescate. Era la causa raíz que
amplificaba todos los bugs de desbordamiento.

**Fix:** `.content { overflow-x: hidden; }` — sin doble declaración.

---

### Bug 1 · `CajaScreen` — tabla "Movimientos del turno" recortada

**Síntoma:** A ≤430px la columna MONTO quedaba fuera del viewport.  
**Causa:** 5 columnas con `white-space: nowrap` + `overflow-x: clip`.

**Fix:** Representación dual en JSX. En `@media (≤920px)`:
- `.mov-table-wrap { display: none }` — ocultar tabla
- `.mov-list { display: flex }` — mostrar lista de `.mov-card`

Cada `.mov-card` usa un grid de 3 columnas: `[hora] [tipo+detalle] [monto]`.
No se pierde ninguna información; el TX hash se omite en móvil (columna de
baja prioridad operativa para el cajero).

**Clases CSS nuevas:** `.mov-table-wrap`, `.mov-list`, `.mov-card`, `.mc-hora`,
`.mc-tipo`, `.mc-monto`, `.mc-meta`.

**Requiere en JSX (`CajaScreen.tsx`):**
```tsx
{/* Tabla — desktop */}
<div className="mov-table-wrap table-wrap">
  <table className="dt">…</table>
</div>
{/* Lista de tarjetas — móvil */}
<div className="mov-list panel">
  {movimientos.map(m => (
    <div className="mov-card" key={m.id}>
      <span className="mc-hora">{m.hora}</span>
      <span className="mc-tipo">{m.tipo} {m.detalle}</span>
      <span className="mc-monto">{m.monto}</span>
      <div className="mc-meta">
        <span className="badge badge-muted">{m.metodo}</span>
      </div>
    </div>
  ))}
</div>
```

---

### Bug 2 · `InicioScreen` — tabla "Top productos del día" recortada

**Síntoma:** A ~375px la columna INGRESOS quedaba fuera del viewport.  
**Causa:** 3 columnas + nombres de producto largos (hasta ~19 chars).

**Fix:** Representación dual. En `@media (≤920px)`:
- `.top-prod-table { display: none }` — ocultar tabla
- `.top-prod-list { display: flex }` — mostrar lista de `.top-prod-item`

Cada `.top-prod-item` usa un grid de 4 columnas:
`[rank (22px)] [nombre (1fr, con truncado)] [qty (auto)] [monto (auto)]`.

**Clases CSS nuevas:** `.top-prod-table`, `.top-prod-list`, `.top-prod-item`,
`.tp-rank`, `.tp-nombre`, `.tp-qty`, `.tp-amt`.

---

### Bug 3 · `CajaScreen` — panel "Tickets internos" recortado

**Causa A — valores .kv desbordantes:**  
`.kv .v` no tenía `min-width: 0` ni truncado. Nombres de caja largos
desbordaban fuera del panel.

**Fix A — CSS:**
```css
.kv .v {
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  max-width: 58%;
}
.kv .v.no-trunc,
.kv .v:has(.badge) { overflow: visible; white-space: normal; max-width: none; }
```

**Causa B — aside aparecía después de la tabla larga en móvil:**  
En `@media (≤920px)` el `.caja-aside` no tenía `order` definido.

**Fix B — CSS:**
```css
@media (max-width: 920px) {
  .caja-aside { order: -1; }
}
```

**Requiere en JSX (`CajaScreen.tsx`):** Añadir clase `.caja-aside` al elemento
`<aside>` del panel de resumen de turno.

---

### Bug 4 · `MesasScreen` — formulario "Nueva mesa" tapado por BottomNav

**Causa A:** `.mesas-layout { min-height: 0 }` colapsaba el aside en el flujo
flex, impidiendo que `.content` calculara el alto real para hacer scroll hasta
el final del formulario.

**Causa B:** El `padding-bottom` del `.content` en móvil (86px) era insuficiente
cuando el aside con formulario era más alto.

**Fix CSS:**
```css
@media (max-width: 920px) {
  .mesas-layout { display: flex !important; flex-direction: column !important;
                  min-height: auto !important; height: auto !important; }
  .mesas-main, .mesas-side { flex: none !important; overflow: visible !important;
                              position: static !important; }
  .content:has(.mesas-side),
  .content.has-form {
    padding-bottom: calc(114px + env(safe-area-inset-bottom)) !important;
  }
}
```

**Fix Shell.tsx:** Prop `hasSidePanel?: boolean` → añade clase `.has-form` al
`.content` como fallback para navegadores sin soporte de `:has()`.

**Requiere en JSX (`MesasScreen.tsx`):**
```tsx
<Shell hasSidePanel={showForm}>…</Shell>
```

---

### Bug 5 · `CajaScreen` — `.turno-bar` desbordaba en móvil

**Causa:** El colapso a `flex-direction: column` ocurría en ≤280px.
Entre 281–920px, con nombres largos y varios datos, la barra se salía.

**Fix:** `flex-wrap: wrap` a partir de ≤920px; columna completa a ≤480px.

---

### Bug 6 · Tablas admin — columnas prescindibles en móvil

**Principio:** Ninguna tabla usa `overflow-x: auto` en ≤920px.

**Fix:** Clase utilitaria `.col-mobile-hidden` que se aplica a `<th>` y `<td>`:
```css
@media (max-width: 920px) {
  .col-mobile-hidden { display: none !important; }
}
```

**Aplicar en:** columna TX hash (Movimientos), columna ID interno (Inventario),
columna "última actualización" cuando ya hay columna de fecha visible.

---

## Nuevas funcionalidades responsive

### Sidebar icon-only (921–1099px) — Tablet landscape

En el rango 921–1099px (tablets landscape de 10–11") el sidebar colapsa a 62px
mostrando solo íconos centrados. El texto se oculta con CSS (`span { display: none }`).

- Accesible: cada `nav-item` tiene `title={it.label}` → tooltip nativo en
  hover/foco, anunciado por lectores de pantalla.
- `aria-current="page"` añadido (faltaba en la versión original).
- Criterio de éxito: iPad 11" landscape a 1194px → sidebar **completo** (≥1100px).

### Tablet portrait (769–920px)

- Grids de contenido: 2 columnas en KDS, tablero kanban, caja, módulos.
- `.content` padding lateral 20px (vs 14px móvil / 30px desktop).
- Drawers: lateral 55% del ancho (no bottom sheet).
- Modales: centrados 520px max-width (no bottom sheet — ese comportamiento
  queda reservado para ≤640px).
- Comandero: modal 90% (no full-screen).

### Landscape móvil (orientation: landscape + max-height: 500px)

BottomNav se convierte en barra lateral izquierda de 52px con solo íconos.
Gana ~56px de espacio vertical — crítico en pantallas de 375×667px horizontal.

### Modal bottom-sheet breakpoint: 720px → 640px

Los tablets en portrait (768px+) ahora reciben modales centrados en lugar de
bottom sheets. El bottom sheet queda reservado para ≤640px (teléfonos).

### Header: 52px en ≤480px

Gana 8px de espacio vertical en teléfonos pequeños.

---

## Accesibilidad — mejoras adicionales

| Mejora | Detalle |
|---|---|
| Offline banner `role="alert"` → `role="status" aria-live="polite"` | No interrumpe lectura en curso |
| `aria-current="page"` en Sidebar | Faltaba completamente en v1 |
| Focus management en panel "Más" | Foco va al 1er ítem al abrir; vuelve al botón "Más" al cerrar con Escape |
| Windows High Contrast Mode | `@media (forced-colors: active)` con overrides de bordes, estados, skip-link |
| `touch-action: manipulation` en botones | Elimina delay 300ms en iOS sin deshabilitar pinch-zoom |
| `overscroll-behavior: contain` | `.modal-scroll`, `.drawer-body`, `.bn-more-panel`, `.kds-list`, `.ped-col-body` |
| Patrones de borde en estados de mesa (HCM) | `.libre` sólido, `.ocupada` dashed, `.reservada` dotted, `.limpieza` double |
| Scrollbars ocultos en touch | `@media (pointer: coarse)` — menos ruido visual en tablet/móvil |

---

## Consolidación y limpieza

- Eliminado bloque `settings-pop / notif-popover` duplicado en `@media (max-width: 920px)`.
- `.kv .v` truncation unificada (antes sin truncado, causaba Bug 3).
- `overflow-x: clip` completamente removido (Bug 0).
- `@media (max-width: 720px)` de modales renombrado a 640px con comentario
  explicando la decisión de tablet vs teléfono.

---

## Archivos modificados

| Archivo | Estado |
|---|---|
| `src/styles.css` | **Modificado** — +380 líneas de reglas nuevas, 6 bugs corregidos |
| `src/components/layout/Shell.tsx` | **Modificado** — prop `hasSidePanel`, offline banner `aria-live` |
| `src/components/layout/Sidebar.tsx` | **Modificado** — `aria-current`, `title`, `aria-label` en nav |
| `src/components/layout/BottomNav.tsx` | **Modificado** — focus management en panel "Más" |
| `src/components/layout/Header.tsx` | **Modificado** — `aria-label` en conn indicator, `aria-hidden` en decorativos |

---

## Pendiente de implementación en pantallas (fuera del scope de layout)

Los siguientes bugs requieren cambios en los componentes de pantalla
(`CajaScreen.tsx`, `InicioScreen.tsx`, `MesasScreen.tsx`) que están fuera
del alcance de este entregable de layout:

- [ ] `CajaScreen`: Renderizar `.mov-table-wrap` + `.mov-list` (Bug 1)
- [ ] `InicioScreen`: Renderizar `.top-prod-table` + `.top-prod-list` (Bug 2)
- [ ] `CajaScreen`: Añadir clase `.caja-aside` al panel lateral (Bug 3B)
- [ ] `MesasScreen`: Pasar `hasSidePanel={showForm}` a `<Shell>` (Bug 4)
- [ ] Todas las tablas admin: Añadir `.col-mobile-hidden` a columnas TX/ID (Bug 6)

---

*NachoPps Responsive System v2 · Diseño: Claude · 2026-06-13*

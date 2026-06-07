# Mejoras de UI/UX y catálogo de funcionalidades — NachoPps POS

Complemento de `informe-pwa-nachopps.md` y de `plan-implementacion-front-back.md`.
Lente de diseño: **es un POS de restobar en tablets**. Las prioridades no son las de una web normal — manda la velocidad operativa, el uso táctil a una mano, las alertas que no dependen de mirar la pantalla, y la resiliencia. Por eso varias "mejoras de UX" valen más que cualquier rediseño visual.

## Cómo leer este documento

Cada ítem lleva una etiqueta de esfuerzo/dependencia:
- `[front]` — se resuelve solo en la PWA.
- `[+backend]` — necesita un endpoint, un campo de contrato o un evento nuevo.
- `[mayor]` — es una funcionalidad-proyecto, no un ajuste.

Y un cruce con el plan técnico cuando aplica (ej. `→ F4-T10`).

---

## 1. Principio rector: diseñar para el servicio, no para la oficina

Antes de features, cinco verdades operativas que deberían guiar cada decisión de UI:

1. **Se usa con una mano, de pie, con prisa.** Targets grandes (≥44px), nada de hovers (no hay mouse), gestos de swipe, mínimo tecleo.
2. **El que cocina no tiene las manos libres.** El KDS necesita sonido y atajos, no clics finos.
3. **La pantalla no puede dormirse.** Cocina y Caja deben mantener la pantalla encendida (Wake Lock).
4. **Cada acción de dinero necesita rastro.** Descuentos, anulaciones y cierres deben pedir permiso y registrar quién y por qué.
5. **La red del local se cae.** La resiliencia offline no es un lujo (ya es la Fase 6 del plan técnico).

---

## 2. Quick wins (alto impacto, casi todo front)

Lo que rinde más por unidad de esfuerzo:

- **Activar el `⌘K`** `[front]` — hoy el botón existe y no hace nada. Una paleta de comandos para saltar a una mesa, pedido, producto o pantalla es oro para meseros y cajeros que se mueven rápido.
- **Home y navegación por rol** `[front]` — el sidebar muestra todo a todos. Que un cocinero entre directo al KDS, un cajero a Caja, recepción a Reservas; ocultar lo que su rol no usa. Más claro y más seguro.
- **Wake Lock en KDS y Caja** `[front]` — Screen Wake Lock API para que la tablet de cocina nunca se apague a media comanda.
- **Alertas sonoras en el KDS** `[front]` — un sonido al entrar un pedido y otro cuando uno se demora. La cocina no está mirando la pantalla todo el tiempo.
- **All-day counts en cocina** `[front]` — total agregado por producto pendiente ("12 lomo saltado"). Es de lo más pedido en cualquier KDS real y se calcula con datos que ya tienes.
- **Cálculo de vuelto en Caja** `[front]` — `recibido − total = cambio`, visible y grande. Hoy solo se prellena el monto.
- **Confirmaciones + "deshacer"** `[front]` — cerrar cuenta, cancelar reserva o avanzar de más son irreversibles; un diálogo de confirmación y una ventana de undo de 5s evitan errores costosos en pleno servicio.
- **Sistema de toasts unificado** `[front]` — hoy cada pantalla tiene su banner. Un componente único de feedback (éxito/error/info) hace la experiencia coherente.
- **Swipe para avanzar estado** `[front]` — en Pedidos y KDS, deslizar la tarjeta para avanzar de estado es más rápido y táctil que apuntar a un botón.
- **Usar los componentes de dominio** `[front]` `→ F4-T12` — `MesaCard`, `ItemKDS`, `PedidoRow` ya existen pero las pantallas los reimplementan. Unificarlos da consistencia visual gratis.

---

## 3. UX transversal (aplica a toda la app)

- **Paleta de comandos (`⌘K`)** con búsqueda global de mesas/pedidos/productos/clientes y acciones rápidas. `[front]` (la búsqueda global puede pedir `[+backend]` si quieres buscar por servidor).
- **Estados consistentes**: loading skeleton / error+retry / vacío, ya existen por pantalla; estandarizarlos en componentes compartidos. `[front]`
- **Ergonomía táctil**: targets grandes, gestos (swipe, long-press para menú contextual en una mesa), cero dependencia de hover. `[front]`
- **Modo de densidad** (compacto vs cómodo): cocina con muchas comandas necesita ver más; el salón, menos. `[front]`
- **Indicadores de "actualizando en vivo"**: un pulso sutil cuando llega un evento de socket, para que el usuario sepa que el dato es fresco. `[front]`
- **Reconexión visible**: además del banner offline, mostrar "reconectando…" del socket y reconciliar al volver. `[front]`
- **Internacionalización ligera**: ya está en `es-PE`; dejar los textos listos para i18n por si entra personal que no habla español. `[front]` (bajo, opcional).

---

## 4. Mejoras y funcionalidades por pantalla

### Login
Hoy: email + password, mostrar/ocultar, banners de error.
- **Quick-switch entre empleados por PIN** `[+backend]` — las tablets se comparten entre turnos; re-loguear con email+password es lento. Un PIN corto por empleado acelera el cambio.
- **Recuperación de contraseña** `[+backend]` — no existe hoy.
- **Selector de local/turno** si hubiera más de un local. `[+backend]`

### Mesas
Hoy: grid con filtros, drawer con la cuenta, optimistic update de estado, refresh en `window.focus`.
- **Plano del salón (floor plan) visual** `[+backend]` `[mayor]` — un mapa espacial con zonas en vez de un grid refleja el salón real y se lee de un vistazo. Idealmente editable (arrastrar mesas).
- **Color/temporizador de envejecimiento por mesa** `[front]` — cuánto lleva ocupada o sin atención; ayuda a priorizar.
- **Unir / separar mesas** `[+backend]` — juntar dos mesas para un grupo grande es estándar en POS.
- **Transferir mesa/cuenta** a otro mesero o a otra mesa. `[+backend]`
- **Asignación de mesero** visible en la tarjeta. `[+backend]`
- **Overlay de reservas**: marcar mesas con reserva próxima (vincula con Reservas). `[+backend]`

### Pedidos
Hoy: tabla con filtros, avanzar estado completo, botón deshabilitado offline.
- **Acciones en lote** (avanzar/marcar varios). `[front]`
- **Coursing / firing** `[+backend]` `[mayor]` — agrupar por curso (entradas, fondos) y "disparar" a cocina cuando toca; clave en un restobar con servicio por tiempos.
- **Búsqueda y timeline del pedido** (historial de estados). `[front]` / `[+backend]`
- **Reimpresión de comanda** `[+backend]` (ligado a impresión, §5).

### Cocina / KDS
Hoy: kanban de 3 columnas, filtro por área, urgencia por color/badge, avance por ítem, `invalidate()` completo tras avanzar.
> Esta es la pantalla donde más se nota una buena UX de POS.
- **Wake Lock** `[front]` — que no se apague nunca.
- **Sonido + atajos de teclado** `[front]` — alerta al entrar/demorarse un pedido; teclas para avanzar sin clics finos (manos ocupadas / posible bump bar).
- **Recall de ítems** `[front]` — deshacer un "listo" marcado por error.
- **All-day counts** `[front]` — agregados por producto.
- **Notificar al mesero cuando un ítem/pedido pasa a LISTO** `[+backend]` — cierra el loop cocina→salón (sonido/push en el dispositivo del mesero).
- **Toggle agrupar por mesa vs por ítem** `[front]`.
- **Patch local en vez de `invalidate()` completo** `[front]` `→ F4-T1/F4-T2`.

### Delivery & Llevar
Hoy: panel dual, mesas virtuales 98/99, **datos de cliente serializados en `notas`**, selector de proveedor (Rappi/Mostrador/App).
- **Campos reales de cliente** `[+backend]` `→ F4-T10` — sacar nombre/teléfono/dirección del string de `notas`.
- **Libreta de clientes con autocompletar por teléfono** `[+backend]`.
- **Flujo de estado del despacho** (en cocina → listo → en camino → entregado) propio del delivery. `[+backend]`
- **Asignación de repartidor** + contacto. `[+backend]`
- **Link a mapa de la dirección** y tiempos estimados. `[front]`/`[+backend]`
- **Etiquetas imprimibles** para empaques. `[+backend]` (§5)
- **Integración con proveedores** (si Rappi expone API). `[mayor]`

### CrearPedido
Hoy: grid de productos con búsqueda, carrito con stepper y notas, badge "Agotado", **retry-polling** tras crear.
- **Modificadores y combos estructurados** `[+backend]` `[mayor]` — "sin sal", término de cocción, extras con precio. Hoy todo eso va a `notas` libre.
- **Favoritos / productos frecuentes** y accesos rápidos por categoría, para tipear menos. `[front]`
- **Dividir por comensal/asiento desde el inicio** (números de asiento). `[+backend]`
- **Banderas de alérgenos/dietas** por producto. `[+backend]`
- **Eliminar el retry-polling** `[front]`+`[+backend]` `→ F4-T11` — feedback inmediato en vez de hasta 12 GET.

### Caja
Hoy: cargar cuenta, registrar pago, dividir en partes iguales, descuento en soles, cerrar, panel de ticket.
> Es el módulo con más vacíos para un restobar real.
- **Propinas** `[+backend]` `[mayor]` — línea de propina con % sugeridos y propina por mesero. Es enorme en un restobar y hoy no existe.
- **Pagos parciales / múltiples métodos en una cuenta** `[+backend]` — mitad efectivo, mitad tarjeta.
- **Dividir por ítem / por asiento** `[+backend]` — hoy solo divide en partes iguales.
- **Anulación / reembolso con motivo y autorización por rol** `[+backend]`.
- **Descuentos con motivo y autorización** `[+backend]` — hoy el descuento es libre; debería requerir permiso y dejar rastro.
- **Recibo: imprimir / enviar por email / QR** + reimpresión. `[+backend]` (§5)
- **Cierre de caja (Z-report) y arqueo** `[+backend]` `[mayor]` — apertura/cierre de turno, conteo de efectivo, diferencias. Crítico y ausente.
- **QR para Yape/Plin** en el panel de pago. `[front]`/`[+backend]`
- **Cálculo de vuelto** `[front]` (ya listado como quick win).

### Reservas
Hoy: agenda filtrable por fecha (filtro local), confirmar/cancelar, consulta de disponibilidad, formulario.
- **Vista calendario** (día/semana) y timeline por mesa, no solo tabla por fecha. `[front]`
- **Asignación de mesa a la reserva** (vincula con Mesas). `[+backend]`
- **Lista de espera (waitlist)** con aviso cuando se libera mesa. `[+backend]` `[mayor]`
- **Confirmaciones y recordatorios automáticos** por WhatsApp/SMS/email. `[+backend]` `[mayor]`
- **Marcado de no-show + métricas** y depósitos/garantía. `[+backend]`
- **Mapa de ocupación (heatmap) por franja**. `[front]`/`[+backend]`
- **Reserva → llegada en un clic**: al llegar el cliente, abrir mesa/cuenta. `[+backend]`

### Inventario
Hoy: lista por categoría, crear producto, reponer stock, badges de stock por color.
- **Alertas de stock bajo accionables** `[front]`/`[+backend]` — hoy hay badges; falta un listado/umbral configurable y aviso.
- **Historial de movimientos** de stock (quién, cuándo, cuánto). `[+backend]`
- **Recetas / ingredientes con descuento automático al vender** `[+backend]` `[mayor]` — la pieza que conecta ventas con inventario real.
- **Editar / activar / desactivar / eliminar producto** `[+backend]` — hoy parece solo crear + reponer.
- **Proveedores y órdenes de compra** `[+backend]` `[mayor]`.
- **Costo y margen** por producto (hoy solo precio). `[+backend]`
- **Foto de producto** e **importar/exportar catálogo (CSV)**. `[+backend]`

### Reportes
Hoy: 3 stat cards, ventas por hora (barras CSS), top productos, con estados vacíos. (El front ya tolera datos faltantes `→ F4-T6`.)
- **Rango de fechas + comparación con período anterior** `[+backend]` — hoy es solo "del día".
- **Exportar a CSV/PDF** `[front]`/`[+backend]`.
- **Desgloses**: por categoría, por mesero, por método de pago, por canal (salón/delivery/llevar). `[+backend]`
- **Reporte de anulaciones y descuentos** `[+backend]`.
- **Z-report / cierre del día** `[+backend]` (ligado a Caja).
- **Dashboard en vivo** del turno. `[+backend]`
- Gráficos más ricos (hay `recharts` disponible en el entorno). `[front]`

### Usuarios
Hoy: tabla, crear, cambiar rol inline, deshabilitado offline.
- **Permisos granulares por rol (RBAC)** `[+backend]` `[mayor]` — el rol existe pero la UI no limita acciones sensibles (descuentos, anulaciones, cierre de caja). Aplicarlo en front **y** validarlo en backend.
- **Log de auditoría** `[+backend]` — quién anuló, descontó, cambió precio.
- **Fichaje (clock-in/out)** del personal. `[+backend]`
- **Gestión de PIN** para el quick-switch del Login. `[+backend]`
- **Activar/desactivar (no eliminar) + reset de contraseña** `[+backend]`.

---

## 5. Funcionalidades transversales mayores

Las que son proyecto en sí y casi siempre necesitan backend o integración:

- **Impresión** `[+backend]` `[mayor]` — comandas a cocina con ruteo por área (cocina/bar), recibos térmicos y etiquetas de delivery. Casi imprescindible en un restobar real; por navegador es limitado (diálogo de impresión / WebUSB / servicio local de impresión).
- **Pagos completos** `[+backend]` — propinas, parciales, múltiples métodos, vuelto, anulaciones, QR Yape/Plin (detallado en Caja).
- **Caja / turno** `[+backend]` `[mayor]` — apertura, cierre, arqueo y Z-report.
- **Clientes y fidelidad** `[+backend]` `[mayor]` — base de clientes, historial de consumo, puntos/descuentos.
- **Notificaciones push reales** `[+backend]` — hoy las notificaciones son in-app vía socket; push del SO permite avisar "pedido listo" aunque la app no esté en primer plano.
- **Pantalla orientada al cliente** (customer-facing display) con el total. `[+backend]` (opcional).

---

## 6. PWA / plataforma

- **Prompt de instalación** (`beforeinstallprompt`) propio, en vez de depender del navegador. `[front]`
- **Atajos de app** en el manifest (abrir directo en Caja o KDS). `[front]`
- **Screen Wake Lock** en KDS/Caja. `[front]`
- **Offline real** `→ Fase 6` `[mayor]` — lectura cacheada (stale-while-revalidate) y cola de mutaciones idempotentes; hoy el SW ignora `/api`, así que sin red solo se ve el cascarón.
- **Background Sync** para reenviar mutaciones al reconectar. `[+backend]`
- **Push notifications** (requiere SW + permisos + backend). `[+backend]`

---

## 7. Accesibilidad (a11y)

- **Navegación completa por teclado** y foco visible en todo flujo. `[front]`
- **ARIA** en el kanban del KDS (drag/drop accesible) y en controles interactivos. `[front]`
- **`aria-live`** para cambios en vivo (llegada de pedidos, notificaciones), así un lector de pantalla los anuncia. `[front]`
- **Contraste AA** y no depender solo del color (bien encaminado: los estados de mesa y stock ya usan color **+** etiqueta). `[front]`
- **Errores asociados a inputs** (`aria-describedby`) y tamaños de texto escalables. `[front]`
- **`prefers-reduced-motion`** para quien marea con animaciones. `[front]`

---

## 8. Priorización sugerida

| Tier | Qué incluye | Por qué primero |
|---|---|---|
| 🟢 **Quick wins (front)** | `⌘K`, home/nav por rol, Wake Lock, sonido + all-day counts en KDS, vuelto en Caja, confirmaciones+undo, toasts unificados, swipe, usar componentes de dominio | Máximo impacto operativo con poco esfuerzo y sin tocar backend |
| 🟡 **Alto impacto (con backend)** | Propinas, pagos parciales/múltiples, anulación+autorización, RBAC real, campos de cliente en delivery (`F4-T10`), modificadores/combos, notificar "listo" al mesero, alertas de stock | Cierran vacíos serios de un POS de restobar |
| 🔴 **Funcionalidades mayores** | Impresión (comandas/recibos), cierre de caja/Z-report, plano del salón, reservas con calendario+waitlist+WhatsApp, recetas/depleción de inventario, clientes/fidelidad, push real + offline (`Fase 6`) | Son proyectos; planificarlos uno a uno |

---

## 9. Relación con el plan técnico

Varias mejoras de UX dependen de arreglos que ya están en `plan-implementacion-front-back.md`:

- Datos de cliente de delivery estructurados → **F4-T10**.
- Quitar el retry-polling al crear pedido → **F4-T11**.
- Reusar `MesaCard`/`ItemKDS`/`PedidoRow` → **F4-T12**.
- Patch local en vivo en vez de refetch (KDS fluido) → **F4-T1 / F4-T2**.
- Rango de fechas y búsquedas (reportes, pedidos) se apoyan en la paginación/filtros de **F4-T4**.
- Offline real (lectura + cola de escritura) → **Fase 6**.
- RBAC en la UI necesita su contraparte de autorización en backend (relacionado con la Fase 2 de seguridad).

> Sugerencia de orden: primero el tier 🟢 (rinde de inmediato y no choca con nada), en paralelo a la Fase 1–2 del plan técnico; el tier 🟡 a medida que toques los contratos de la Fase 3–4; el tier 🔴 como features planificadas aparte.

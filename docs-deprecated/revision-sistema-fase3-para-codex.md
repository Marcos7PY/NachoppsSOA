# Revisión del sistema — Fase 3: flujo inverso, semántica de reposición y validación bajo carga

> **Continuación de la Fase 2.** Las cinco tareas (T0–T4) quedaron **bien cerradas**, con tests reales: idempotencia concurrente con UNIQUE confirmado en Postgres (`idempotency_keys_key_key`, P2002 → "ya procesado"), D1c con 12 entregas concurrentes descontando una sola vez, ciclo D2 end-to-end de reconciliación, detección de profundidad de DLQ y parking con tope de reinyección. Buen trabajo.
>
> **Lo importante de esta fase:** el arreglo de T0 confirmó que la preocupación era real (`pedidos` **sí** consume `producto.actualizado`/`producto.creado` desde inventario) y lo resolvió con `stockSyncMode`. Pero ese arreglo **introduce un flujo inverso `inventario → pedidos` que ahora hay que endurecer con el mismo rigor que el directo.** Esa es la mayor parte de lo que sigue.
>
> Igual que siempre: **hipótesis a confirmar leyendo el código**, no bugs confirmados. Si una es falsa, se anota con evidencia y se sigue.

## Estado confirmado (no romper)

- Autoridad de stock: `pedidos.productos_locales` previene oversell (reserva transaccional); `inventario.productos` es reporte/reposición, sync asíncrono por `pedido.creado`.
- `pedidos` solo acepta aumentos de stock si `stockSyncMode === 'REPOSICION'`; `CONSUMO_PEDIDO` no puede subir stock local.
- Idempotencia directa: `idempotency_keys.key @unique` (índice real en Postgres); P2002 se ackea como "ya procesado".
- D1 secuencial y D1c concurrente (12 entregas) → un solo descuento.
- D2: fallo → DLQ → reinyección → reconvergencia, DLQ a `0`.
- Detección: check de `dlq.* messages_ready > 0`. Parking: `x-reinjection-count`, `MAX_REINJECTIONS=2` → `parking.inventario_queue`.
- `npm run probar`: 49/49. `npm run probar:stock`: 8/8. **Mantener o sumar, nunca restar.**

## Reglas de trabajo (heredadas)

- [ ] `npm run probar` y `npm run probar:stock` deben seguir verdes; recompilar el servicio tocado con `npm exec nx build <servicio>`.
- [ ] El happy path deja todas las colas (incl. `dlq.*` y `parking.*`) en `0 ready / 0 unacked`.
- [ ] Tests de fallo limpian tras de sí.
- [ ] No reportar p95/p99 con muestras pequeñas; distinguir corrección de carga.

---

# T5 — Idempotencia del **flujo inverso** (`producto.actualizado` / `producto.creado` en pedidos)  *(el hueco más importante)*

Se construyó idempotencia robusta para el flujo directo (`pedido.creado` en inventario), pero el arreglo de T0 hizo que `pedidos` ahora **consuma eventos de inventario** para ajustar `productos_locales`. Si ese consumidor **no** es idempotente, una **reentrega duplicada de un evento `REPOSICION`** sube el stock local dos veces → y como `productos_locales` es justo el guardián que previene el oversell, eso es un **vector directo de overselling**. Es la cara simétrica de T1, en el sentido peligroso.

### Qué investigar

- [ ] Localizar el consumidor en `servicio-pedidos` que procesa `producto.actualizado` y `producto.creado`. ¿Tiene clave de idempotencia + UNIQUE en BD, como el de inventario? ¿O confía en que RabbitMQ no re-entrega?
- [ ] Confirmar el tratamiento de la violación de unicidad (ack como "ya procesado", igual que P2002 en inventario).
- [ ] ¿Comparte la misma tabla `idempotency_keys` (con claves namespaced por tipo de evento) o necesita la suya? Evitar colisión de claves entre dominios.

### Test a añadir (R1 — reverse idempotency)

- [ ] **R1 secuencial y concurrente:** entregar el **mismo** evento `REPOSICION` varias veces (incluida una tanda concurrente, como D1c) y verificar que el stock local sube **exactamente una vez**.

### Criterio de aceptación

- [ ] El consumidor inverso es idempotente con garantía a nivel de BD (no solo `SELECT` en app).
- [ ] R1 en verde: REPOSICION duplicada/concurrente aplicada una sola vez.

---

# T6 — Semántica de la reposición: **delta vs absoluto**

El gate `stockSyncMode === 'REPOSICION'` evita que un `CONSUMO_PEDIDO` suba stock, pero **no** dice cómo se aplica el aumento. Esto importa porque durante una ventana stale (mensaje de consumo atascado en DLQ), `inventario` queda **stale-alto**, y si una reposición ocurre en esa ventana:

- **Aplicada como delta (`+N`):** el resultado es correcto aunque el absoluto de inventario esté mal. Robusto.
- **Aplicada como valor absoluto tomado de inventario:** **re-infla** `productos_locales` con el número stale-alto → oversell. El gate REPOSICION no protege contra esto.

Ejemplo: stock real 8; pedido consume 4 → `pedidos`=4, inventario=8 (stale, en DLQ). Llega reposición +10. Delta → `pedidos`=14 (correcto). Absoluto-desde-inventario → `pedidos`=18 (mal, inflado en 4).

### Qué investigar

- [ ] Determinar si `pedidos` aplica la reposición como **incremento relativo** sobre `productos_locales` o como **set absoluto** derivado del payload de inventario.
- [ ] Si es absoluto, evaluar pasarlo a delta, o reconciliar contra la proyección local en vez de sobrescribirla.

### Test a añadir (R2 — reposición en ventana stale)

- [ ] **R2:** forzar una ventana stale-alto en inventario (mensaje de consumo en DLQ), disparar una REPOSICION durante esa ventana, y verificar que `productos_locales` **no** queda inflado por encima del valor correcto.

### Criterio de aceptación

- [ ] Documentado cómo se aplica la reposición; una REPOSICION durante ventana stale no re-infla la proyección local.

---

# T7 — Confianza en `stockSyncMode` (trust boundary)

`stockSyncMode` es un campo del **payload del evento**: el gate de T0 es tan fiable como quien lo produce. Si un evento de consumo se etiqueta por error como `REPOSICION` (bug aguas arriba), el gate **falla abierto** y deja subir stock indebidamente.

### Qué investigar

- [ ] Identificar quién **emite** `producto.actualizado` y dónde se fija `stockSyncMode`. ¿Es deducible del propio cambio (consumo vs reposición) en el lado emisor, o se confía en la etiqueta tal cual llega?
- [ ] Evaluar **derivar o validar** el modo en el consumidor (p. ej. un aumento solo se acepta si el evento proviene de un flujo de reposición legítimo), en lugar de confiar ciegamente en el campo.

### Criterio de aceptación

- [ ] Documentado el límite de confianza de `stockSyncMode`; un evento de consumo mal etiquetado no puede inflar el stock local (el gate no falla abierto).

---

# T8 — Validación bajo **alta contención** (P2 diferido del primer brief)

El UNIQUE de T1 garantiza idempotencia a cualquier N, pero las afirmaciones de concurrencia siguen apoyadas en corridas únicas con n bajo (8–12). Las race conditions son probabilísticas; conviene cerrar esto ahora que el diseño está endurecido.

### Qué investigar / cambiar

- [ ] Re-ejecutar **D1c, R1, C5, C6, C7** con concurrencia **50, 100 y, si aguanta, 200+**, y cada escenario **en bucle (p. ej. 100 iteraciones)** antes de declararlo OK.
- [ ] Confirmar que el runner dispara realmente en paralelo (no escalonado).
- [ ] Higiene de métricas (P4): eliminar p95/p99 donde n es pequeño y dejar min/máx/promedio; corregir cualquier `RPS=0` por artefacto de cálculo.

### Criterio de aceptación

- [ ] Las invariantes de C5/C7 (exactamente 1 éxito) y C6 (nunca exceder stock) se mantienen con concurrencia ≥ 100 a lo largo de N iteraciones.
- [ ] D1c y R1 mantienen "un solo efecto" bajo alta contención repetida.
- [ ] Ningún reporte muestra percentiles sin sentido ni `RPS=0` por bug.

---

# T9 — (Menor) Operativa de parking y crecimiento de la tabla de idempotencia

- [ ] **Monitoreo de parking.** El check de T3 cubre `dlq.*`; ¿cubre también `parking.*`? Un mensaje en parking es un fallo **permanente** que necesita ojos humanos sí o sí — debería alertar igual o con más prioridad que la DLQ.
- [ ] **Parking por dominio.** ¿Existe parking solo para inventario o para todas las DLQ relevantes? Decidir si el patrón debe generalizarse.
- [ ] **Retención de `idempotency_keys`.** Esa tabla crece con cada evento procesado. Definir política de limpieza/retención (p. ej. purga por antigüedad) para que no crezca sin límite.

### Criterio de aceptación

- [ ] `parking.*` está monitoreado; política de retención de `idempotency_keys` decidida y documentada.

*(No urgente: después de T5–T8.)*

---

## Orden sugerido de ataque

1. **T5** — idempotencia del flujo inverso (mayor riesgo: vector de oversell).
2. **T6** — semántica delta vs absoluto de la reposición.
3. **T7** — confianza en `stockSyncMode`.
4. **T8** — validación bajo alta contención + higiene de métricas.
5. **T9** — operativa de parking y retención (menor).

## Fase siguiente (dominio aparte, no en este brief)

Sigue pendiente toda la **tanda de seguridad de profundidad** del primer brief, que no toca el dominio de stock y conviene atacar por separado: IDOR / autorización a nivel de objeto, JWT expirado / payload manipulado / `alg:none`, alcance real del rate limit (por IP vs usuario vs global, bypass por header, registro y reset), y la verificación de la cookie `Secure` sobre HTTP. Se deja anotado para no perderlo.

## Entregable esperado de Claude Code

Por cada T: (a) si la hipótesis se confirma o no, con evidencia en código (rutas, migraciones, handlers); (b) el cambio aplicado o el test añadido (`R1`, `R2`, ajustes de carga); (c) salida de `npm run probar` y `npm run probar:stock` en verde. Si algún punto se decide no abordar, dejar la razón escrita.

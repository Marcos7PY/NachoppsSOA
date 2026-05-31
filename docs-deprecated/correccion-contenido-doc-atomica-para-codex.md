# Corrección de contenido — documentación atómica Nachopps

> **Para el agente de código.** La estructura, el inventario de átomos, las citas `archivo:línea` y los enlaces internos están bien y **se conservan**. El problema es de **contenido**: muchos átomos son citas envolviendo relleno genérico. Esta pasada corrige **solo el contenido**. No se crean ni se borran átomos, no se cambia el árbol ni el formato del front-matter.

- Rama: la misma (`docs/documentacion-atomica`).
- Al re-tocar un átomo, actualizar `revisado` y mantener `commit` correcto.

---

## 1. Qué NO se toca

- El árbol de carpetas y los nombres de archivo.
- El front-matter (`tipo`, `fuente`, `revisado`, `commit`, etc.) salvo `revisado`.
- El formato de citas `[archivo:línea]`.
- Los enlaces cruzados existentes (sí se pueden **afinar** para que apunten al átomo específico en vez de a un índice, ver §4).

---

## 2. La regla de contenido

**Cada sección enuncia el hecho con palabras propias; la cita lo respalda. Una cita por sí sola no es contenido.** "Ver X citado" / "Consultar Y enlazado" no describe nada: es un puntero, no una afirmación.

**Frases prohibidas** (eliminar todas las ocurrencias, no solo las literales):

- `Ver mecanismo citado.`
- `Protege consistencia de negocio en las rutas y consumidores enlazados.` (boilerplate idéntico en las 9 invariantes)
- `revisar guards globales … junto con este controlador` (esquivar la autorización)
- `el tipo exacto no se declara … cuando TypeScript no lo explicita` (esquivar la salida)
- `delega en el código del controlador y, cuando corresponde, en el servicio` (efectos vacíos)
- `Consultar los modelos Prisma y contratos enlazados` (esquivar el estado del flujo)

Si una sección no se puede llenar con un hecho verificable leyendo el código, **dejar marcado `<!-- sin evidencia: <qué falta> -->`** en vez de rellenar con genéricos. Un hueco honesto es mejor que relleno.

---

## 3. Invariantes (las nueve) — el bloque más urgente

Para **cada** invariante: reescribir **"Mecanismo que la garantiza"** describiendo la **lógica real del consumidor/handler/índice** que la hace cierta (no el schema, no el contrato, no "que existe un test"); hacer **"Por qué importa"** específico (qué se rompe si falla); y en **"Prueba que la verifica"** indicar el **escenario y el resultado observado**, no "reporte enlazado". Corregir la cita para que apunte al **código que impone** la invariante.

1. **no-oversell** — *(corrección de capa)*. El mecanismo NO es el `updateMany` de inventario. Es la **reserva transaccional en servicio-pedidos**: `crearPedido`/`persistirPedido` reserva con `UPDATE ... WHERE "stockActual" >= cantidad RETURNING` dentro de la transacción, serializada por `pg_advisory_xact_lock` por producto; si el pedido dejaría el stock bajo cero, se rechaza. La autoridad es `pedidos.productos_locales`. El `updateMany` de inventario protege la *proyección* de inventario — es otra garantía, no esta. **Citar** el método de reserva en pedidos. **Resultado:** C6 nunca excede stock en 50/100/200; 12/12 invariantes de stock.

2. **idempotencia-directa** — Mecanismo: el consumidor de `pedido.creado` en inventario **reclama la clave de idempotencia en la misma transacción** que descuenta stock; `idempotency_keys.key @unique` la respalda en BD; un duplicado dispara `P2002` que se trata como "ya procesado" y se **ackea** (no va a DLQ). **Citar** el handler de inventario que reclama la clave + la migración del índice único. **Resultado:** D1c/R1 un solo efecto bajo concurrencia.

3. **idempotencia-inversa** — Mecanismo: los consumidores `procesarProductoCreado`/`procesarProductoActualizado` en pedidos **reclaman su propia clave en la misma transacción** que actualiza `productos_locales`; `idempotency_keys.key @unique` en pedidos la respalda; duplicado → `P2002` → ack. **Citar** ambos handlers de pedidos + la migración. **Resultado:** R1 secuencial y concurrente aplicada una sola vez.

4. **reposicion-como-delta** — Mecanismo: el consumidor en pedidos solo aumenta stock con `stockSyncMode === 'REPOSICION'` **y** `stockDelta > 0`, y aplica el aumento **como delta** sobre la proyección local (no como absoluto tomado del payload de inventario); por eso una reposición durante ventana stale-alto no re-infla. **Citar** la lógica del consumidor en pedidos que aplica el delta (no el contrato). **Resultado:** R2 en ventana stale no infla.

5. **trust-boundary-stock-sync-mode** — Mecanismo: el gate vive en el **consumidor (pedidos)** y exige `REPOSICION` **y** `stockDelta > 0`; un `CONSUMO_PEDIDO` mal etiquetado llega con delta no-positivo y no infla. Documentar el **residual**: un productor que fabrique `REPOSICION` con delta positivo para algo que es consumo no es distinguible desde el payload; mitigación = emisor interno confiable. **Citar** el gate del consumidor en pedidos, no solo el enum del contrato.

6. **exactamente-un-exito-bajo-carrera** — Mecanismo (no "existe un test"): para reservas, el **índice único parcial** sobre slot activo `(fecha, hora)` hace que solo gane una inserción concurrente y la perdedora se traduce a **409** en el servicio de reservas; para stock, la **reserva atómica** en pedidos deja pasar exactamente las unidades disponibles. **Citar** el código que impone (servicio de reservas + migración del índice; reserva en pedidos), no el runner. **Resultado:** C5/C7 = 1 éxito + N−1 rechazos; C6 = éxitos igual a stock; 300/300 en 50/100/200.

7. **slot-reserva-activo-unico** — Mecanismo: el índice único parcial garantiza un solo slot activo por `(fecha, hora)`; el servicio de reservas **captura la violación de unicidad y devuelve 409**. **Citar** la migración del índice **y** el código del servicio que traduce a 409 (no solo "existe una migración"). **Resultado:** carrera de reserva → un solo slot.

8. **colas-limpias-happy-path** — Mecanismo: ACK/NACK manual alineado (`noAck: false` en reportes) + `RabbitMQRetryInterceptor` que hace ack/nack, sumado al **Transactional Outbox** que evita publicaciones a medias; el happy path drena todas las colas incl. `dlq.*`/`parking.*` a cero. **Citar** el interceptor + la config de reportes + cómo se comprueba. **Resultado:** todas las colas `0 ready / 0 unacked` al cierre.

9. **retencion-idempotency-keys** — Mecanismo: un barrido de retención corre **por su propio tic de cron** en `outbox.processor.ts` de **pedidos e inventario**, purgando `idempotency_keys` procesadas con más de 7 días (`7 * 24 * 3600_000` ms). **Citar** ambos processors. **Verificar y dejar dicho** si el barrido corre aunque no haya outbox pendiente; si hoy está dentro del camino que solo se ejecuta cuando hay eventos por publicar, anotarlo como limitación (un servicio inactivo no purgaría).

---

## 4. Endpoints

Cada átomo de endpoint debe afirmar, no esquivar:

- **Propósito.** Qué hace en términos de dominio (p. ej. "crea un pedido para una mesa con sus ítems"), no "expone el handler X".
- **Autorización.** El/los guard(s) realmente aplicados y los **roles RBAC** exigidos. Si el guard es global, decir cuál y dónde se declara — no "revisar guards globales".
- **Entrada.** El DTO/Command con sus **campos y validaciones**, no solo la firma.
- **Salida.** Shape de la respuesta **y los códigos de estado con su significado** (201/400/404/409/503 según corresponda). Si TypeScript no tipa el retorno, derivar la forma del cuerpo del handler — no declararse incapaz.
- **Efectos.** Qué **modelos** escribe, si es **transaccional**, y qué **eventos** emite vía Outbox (nombrarlos: `pedido.creado`, `pedido.actualizado`, …).
- **Invariantes que toca.** Enlazar al **átomo de invariante específico** (p. ej. `→ invariantes/no-oversell.md`), no al índice genérico.
- **Errores.** Cada error y la condición que lo dispara.

---

## 5. Flujos

Cada átomo de flujo debe **narrar la secuencia**, no listar enlaces:

- **Secuencia.** Paso a paso real: servicio → acción → evento emitido → consumidor → efecto, enlazando cada paso a su átomo A/B.
- **Estados y transiciones.** Los estados concretos de las entidades a lo largo del flujo, no "consultar los modelos enlazados".
- **Fallo y reconvergencia.** Qué pasa si un paso cae: a qué DLQ va, cómo reinyecta, cómo reconverge — concreto para *este* flujo.

---

## 6. Re-verificación de citas (obligatoria)

El contenido estaba hueco, así que las líneas citadas también son sospechosas. Por cada átomo re-tocado:

- [ ] Abrir el `archivo:línea` citado y confirmar que la afirmación **está ahí** y vigente.
- [ ] Corregir las citas que apunten a la **capa equivocada** (empezando por `no-oversell`).
- [ ] No fabricar líneas ni nombres de método. Si la afirmación no se puede anclar, marcar `<!-- sin evidencia -->`.

---

## 7. Criterios de aceptación de esta pasada

- [ ] `grep "Ver mecanismo citado"` → 0 resultados.
- [ ] El boilerplate de "Por qué importa" → 0 ocurrencias; cada invariante tiene su propio "por qué".
- [ ] Cada invariante: "Mecanismo" nombra y cita el **código que la impone** (consumidor/handler/índice+traducción), no el schema/contrato/test.
- [ ] `no-oversell` cita la **reserva en pedidos**; `trust-boundary` cita el **gate del consumidor** (`REPOSICION && stockDelta>0`).
- [ ] Cada endpoint da **guard+roles**, **códigos de estado** y **eventos emitidos**; ninguna de las frases-esquive de §2 sobrevive.
- [ ] Cada flujo **narra la secuencia** con pasos enlazados.
- [ ] Estructura, nombres de archivo y formato de citas **sin cambios**; mismos átomos (ni uno más ni uno menos).
- [ ] Toda cita re-tocada fue verificada contra su línea.

---

## 8. Entregable

Commit en la misma rama con los átomos reescritos en contenido. Nota de cierre corta: cuántos átomos se re-tocaron por tipo, qué citas de capa equivocada se corrigieron, y qué quedó marcado `<!-- sin evidencia -->` (para resolverlo después).

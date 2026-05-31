# Revisión del sistema — Fase 2: idempotencia concurrente, reconciliación DLQ y detección

> **Continuación del brief anterior.** El **P1** (idempotencia + caminos de fallo de DLQ + reconciliación del stock) quedó **casi cerrado**: la rama `codex/stock-idempotency-dlq` corrigió un bug real (la clave de idempotencia se grababa *antes* de descontar; ahora clave + descuento + outbox van en una sola transacción), probó redelivery sin doble descuento (12 → 8), y documentó topología de DLQ (`NACHOPPS_DLX`, `dlq.inventario_queue`) y reintentos (`RabbitMQRetryInterceptor`, 3 intentos + `nack(false)`).
>
> Quedan **cinco huecos**. Igual que antes: están escritos como **hipótesis a confirmar leyendo el código**, no como bugs confirmados. Si una hipótesis es falsa, anótalo con evidencia y sigue.

## Estado confirmado (no romper)

- Idempotencia por clave `pedido.creado:<pedidoId>`, registrada en la misma transacción que el descuento y el outbox.
- Redelivery **manual/secuencial** no produce doble descuento (probado en `npm run probar:stock`).
- `dlq.inventario_queue` enrutada vía `NACHOPPS_DLX` con routing key `dlq.inventario_queue`.
- Reintentos: 3, luego `nack(false)` → DLQ por política de cola.
- `npm run probar` en verde (49/49). **Mantener o sumar, nunca restar.**

## Reglas de trabajo (heredadas)

- [ ] `npm run probar` debe seguir verde tras cada cambio; recompilar el servicio tocado con `npm exec nx build <servicio>`.
- [ ] El happy path deja todas las colas (incl. `dlq.*`) en `0 ready / 0 unacked`.
- [ ] Los tests de fallo limpian tras de sí (sin mensajes colgados ni datos sucios).
- [ ] Distinguir tests de *corrección* (smoke) de tests de *carga*. No mezclar percentiles con muestras pequeñas.

---

# T0 — Marco: ¿qué store es autoritativo para *prevenir* oversell vs para *reportar*?

**Esta pregunta decide la gravedad de todo lo demás, así que va primero.** Hay dos fuentes de verdad de stock: la proyección local transaccional en `servicio-pedidos` (la que previene el oversell al crear el pedido) y la verdad en `servicio-inventario` (sincronizada por evento asíncrono). Cuando un mensaje queda atascado en DLQ, `inventario` queda **stale-alto**: muestra más stock del real porque no procesó el descuento.

- **Si el flujo es estrictamente `pedidos → inventario`** y `pedidos` es el único guardián del oversell (la verdad de `inventario` solo sirve para reportar y recibir reposiciones), un mensaje en DLQ es "lag de reporte": molesto pero benigno.
- **Si `inventario` alguna vez empuja correcciones de vuelta hacia la proyección de `pedidos`**, ese valor stale-alto puede **re-inflar la proyección local y reintroducir overselling más tarde**. Ese sería un bug grave latente.

### Qué investigar

- [ ] Mapear la dirección real del sync de stock entre `servicio-pedidos` y `servicio-inventario`. ¿Existe algún evento o flujo `inventario → pedidos` que ajuste la proyección local? Buscar consumidores en `pedidos` que escuchen eventos de stock de `inventario`.
- [ ] Confirmar explícitamente cuál store es autoritativo para **prevenir oversell** y cuál para **reportar / reposición**.

### Criterio de aceptación

- [ ] Documentado (en código o doc de arquitectura) qué store previene el oversell y qué store reporta, y que un valor stale-alto en `inventario` **no** puede re-inflar la proyección de `pedidos`. Si sí puede, queda registrado como riesgo grave y se trata en su propia tarea.

---

# T1 — Idempotencia bajo **concurrencia** + verificación del UNIQUE  *(el hueco más peligroso)*

Estar "en la misma transacción" garantiza **atomicidad** (todo o nada), pero **no** garantiza exclusión mutua entre dos transacciones concurrentes. Bajo aislamiento típico (READ COMMITTED), un `SELECT` de comprobación "¿existe la clave?" **no ve** el `INSERT` aún no confirmado de otra transacción: dos redeliveries simultáneas pueden **ambas** pasar el check antes de que cualquiera haga commit, y descontar dos veces.

Lo único que cierra esa carrera es una **restricción UNIQUE (o PK) en la BD** sobre la columna de la clave de idempotencia: la segunda transacción choca con la violación de unicidad, hace rollback, y su descuento se deshace. El informe **no menciona** esa restricción, y el test existente fue redelivery **manual/secuencial** (la primera entrega ya hizo commit cuando llega la segunda, por eso el `SELECT` la encuentra) → **la carrera real está sin probar.**

### Qué investigar

- [ ] Localizar la tabla donde se persiste `pedido.creado:<pedidoId>` (inbox / tabla de mensajes procesados). Confirmar si la columna de la clave tiene **UNIQUE o PRIMARY KEY** a nivel de esquema/migración.
- [ ] Revisar cómo se maneja la violación de unicidad: ante el error de duplicado, el consumidor debe tratarlo como "ya procesado" → `ack` y descartar, **no** propagarlo como fallo (que lo mandaría a reintentos/DLQ).
- [ ] Confirmar el nivel de aislamiento de esa transacción y razonar si la garantía descansa en el UNIQUE (recomendado) o en SERIALIZABLE (válido pero genera fallos de serialización a manejar).

### Test a añadir (D1-concurrente)

- [ ] **D1c — Redelivery concurrente:** entregar/procesar el **mismo** `pedido.creado` desde **N workers/conexiones a la vez** (no secuencial), bajo la alta contención del P2. Aserción: el stock se descuenta **exactamente una vez** y no hay error 5xx no manejado.

### Criterio de aceptación

- [ ] Existe UNIQUE/PK sobre la clave de idempotencia (o queda demostrado por qué otra garantía es equivalente).
- [ ] D1c en verde: redelivery concurrente → un solo descuento.
- [ ] La violación de unicidad se traduce en "ya procesado", no en un mensaje rebotado a DLQ.

---

# T2 — Reconciliación **demostrada**, no solo documentada (D2 end-to-end)

El "2/2 invariantes OK" cubre redelivery idempotente y existencia/routing de la DLQ. **No** veo un test que recorra el ciclo completo de recuperación. El runbook describe cómo reinyectar, pero "el sistema se recupera" está escrito en prosa, no probado por código. *(Confirmar primero qué afirman exactamente esas 2 invariantes antes de duplicar trabajo.)*

### Test a añadir (D2)

- [ ] **Forzar el fallo** del consumidor de inventario para un `pedido.creado` (parar el consumer, o inyectar una excepción/condición venenosa controlada).
- [ ] **Confirmar el aterrizaje en DLQ:** tras agotar los 3 reintentos, `dlq.inventario_queue` tiene `messages_ready ≥ 1`.
- [ ] **Confirmar la divergencia:** la proyección de `pedidos` ya descontó, pero la verdad de `inventario` quedó **sin descontar** (stale-alto). Aserción explícita de que los dos números difieren en este punto.
- [ ] **Reinyectar** desde DLQ hacia `nachopps_exchange` con routing key `pedido.creado` (corrigiendo antes la causa si aplica).
- [ ] **Confirmar reconvergencia:** la verdad de `inventario` vuelve a igualar lo que `pedidos` ya reflejaba, la DLQ vuelve a `0`, y la reinyección **no** produce doble descuento (la idempotencia de T1 aguanta el reproceso).

### Criterio de aceptación

- [ ] D2 demuestra el ciclo fallo → DLQ → divergencia → reinyección → reconvergencia, con aserciones en cada etapa.
- [ ] Tras D2, todas las colas vuelven a `0 ready / 0 unacked`.

---

# T3 — Detección: alerta de profundidad de DLQ  *(el runbook dice cómo arreglar, no cómo enterarse)*

Los 4 pasos de recuperación empiezan con "revisar `dlq.inventario_queue`", pero nada dispara que un humano la revise. Sin una señal sobre `messages_ready > 0` en las DLQ, **la divergencia es silenciosa** hasta que alguien tropiece con ella. El P1 pedía "cómo se *detecta*", y se respondió "cómo se *corrige*". Falta la mitad.

### Qué añadir

- [ ] Un **check/invariante de profundidad de DLQ**: que falle (o alerte) si cualquier `dlq.*` tiene `messages_ready > 0` cuando no debería. Los reportes ya recogen el estado de colas antes/después vía la API de management de RabbitMQ; formalizar eso en una verificación.
- [ ] Definir el destino real de la alerta para producción (endpoint de health que exponga la profundidad de DLQ, o un job que consulte la management API y notifique). Para prácticas basta con el check automatizado + dejar documentado dónde iría la alerta real.

### Criterio de aceptación

- [ ] Existe una verificación que detecta `messages_ready > 0` en `dlq.*` y lo señala como fallo/alerta.
- [ ] Documentado el mecanismo de alerta previsto para producción.

---

# T4 — (Menor) Tope de reinyección / mensaje veneno

Reinyectar desde DLQ un mensaje que falla por causa **no corregible** (producto inexistente, payload corrupto) lo devuelve a DLQ tras otros 3 reintentos, **en bucle**. No hay tope de reinyección ni "dead-letter del dead-letter".

### Qué investigar / añadir

- [ ] Llevar la cuenta de reentregas (vía cabecera `x-death` / un contador `x-reinjection-count`) y, superado un umbral, enviar el mensaje a un **parking permanente** para inspección manual en lugar de reciclarlo indefinidamente.

### Criterio de aceptación

- [ ] Un mensaje veneno deja de circular tras N reinyecciones y queda aparcado para revisión, sin bucle infinito.

*(No urgente: abordar después de T0–T3.)*

---

## Orden sugerido de ataque

1. **T0** — establece el marco (rápido: leer y documentar la dirección del sync).
2. **T1** — la carrera de idempotencia concurrente + UNIQUE (mayor riesgo de corrección).
3. **T2** — D2 end-to-end que demuestra la reconciliación.
4. **T3** — detección por alerta de DLQ.
5. **T4** — tope de reinyección (menor).

## Entregable esperado de Claude Code

Por cada T: (a) si la hipótesis se confirma o no, con evidencia en código (rutas, migraciones, handlers); (b) el cambio aplicado o el test añadido (`D1c`, `D2`, check de DLQ); (c) salida de `npm run probar` y `npm run probar:stock` en verde. Si algún punto se decide no abordar, dejar la razón escrita.

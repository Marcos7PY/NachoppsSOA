# Verificación de cierre — Fase 3

> **Qué es esto.** Lista de verificación para confirmar, con evidencia propia, los cuatro puntos que separan "verde en local" de "defendible en revisión". **Ninguno es un bug confirmado**: son comprobaciones que un revisor con ojo probablemente pedirá antes de aceptar el cierre. Cada bloque trae: por qué importa, qué verificar, cómo verificarlo, criterio de cierre y un espacio para pegar el resultado.

- Fecha de verificación: 2026-05-30
- Rama: `codex/stock-idempotency-dlq`
- Base URL: `http://localhost:8000`
- Punto de partida: informe `docs/informe-stock-idempotency-dlq.md` (12/12 stock, 49/49 integración, colas 0/0)

---

## V1 — T8: evidencia de paralelismo real *(la más importante)*

**Por qué importa.** La invariante "exactamente 1 éxito" pasa de forma trivial aunque el runner dispare escalonado: el segundo request simplemente ve el slot tomado y devuelve `409` sin que la carrera real se haya ejercido nunca. El `300/300` solo tiene peso si se demuestra que (a) los N requests se lanzan simultáneos y (b) hubo contención real (perdedores de la carrera, esperas del advisory lock).

**Qué verificar**

- [x] El runner dispara en paralelo de verdad: las N tareas se arman y se lanzan con `Promise.all` (o equivalente), **sin** `await` por iteración dentro del bucle de disparo.
- [x] En los reportes de C5/C7 (exactamente 1 éxito), por cada recurso disputado se ven **N−1 respuestas `409`/conflicto**: ese es el signo positivo de que los demás sí corrieron y perdieron, no que nunca se enviaron.
- [x] En C6 (nunca exceder stock), el total de reservas exitosas ≤ stock disponible aun con N ≫ stock.
- [x] (Opcional, refuerza) Evidencia de serialización por producto: dispersión de latencias coherente con espera en `pg_advisory_xact_lock`, o muestra de `pg_stat_activity` durante una corrida.

**Cómo verificarlo**

```powershell
# Patrón de disparo en el runner (buscar Promise.all y descartar awaits escalonados)
Select-String -Path stress-tests/run-concurrency-limits.js -Pattern "Promise\.all|await "

# Conteo de 409 / conflictos en el reporte más reciente (perdedores de la carrera)
Select-String -Path stress-tests/reports/concurrency-limits-2026-05-30T23-44-10-713Z.md -Pattern "409|conflict|conflicto"
```

**Criterio de cierre.** PASA si el disparo es simultáneo **y** los reportes muestran contención real (N−1 rechazos por recurso disputado). Si solo se ve "1 éxito" sin rechazos visibles, la carrera no quedó demostrada.

**Resultado / evidencia:**
> OK. `stress-tests/run-concurrency-limits.js:121` y `:159` lanzan workers con `Promise.all(Array.from(..., loop))`. Los escenarios disputados llaman `runPool(..., count, count, ...)` en C5/C7 y `runPool(..., attempts, Math.min(CONCURRENCY, attempts), ...)` en C6.
>
> Evidencia de contención en reportes:
> - 50x100: C5 `{"201":1,"400":49}`, C6 `{"201":50,"400":10}` con stock inicial 50 e intentos 60, C7 `{"201":1,"409":49}`.
> - 100x100: C5 `{"201":1,"400":99}`, C6 `{"201":100,"400":20}` con stock inicial 100 e intentos 120, C7 `{"201":1,"409":99}`.
> - 200x100: C5 `{"201":1,"400":199}`, C6 `{"201":200,"400":40}` con stock inicial 200 e intentos 240, C7 `{"201":1,"409":199}`.
>
> Nota C5: el rechazo de pago duplicado hoy se expresa como HTTP 400 por contrato de caja/cuentas (`La cuenta ya está cerrada`), pero la invariante de carrera queda demostrada con 1 pago exitoso, N-1 rechazos y una sola transaccion para la cuenta. C7 sí devuelve 409.

---

## V2 — P4: higiene de métricas

**Por qué importa.** El brief pide explícitamente eliminar p95/p99 cuando `n` es pequeño (los percentiles no significan nada con muestras chicas) y corregir cualquier `RPS=0` que sea artefacto de cálculo. Un reporte regenerado con percentiles sin sentido o RPS en cero es una bandera roja fácil de detectar.

**Qué verificar**

- [x] `docs/informe-pruebas.md` regenerado **no** reporta p95/p99 donde `n` es pequeño; deja min / máx / promedio.
- [x] No aparece ningún `RPS=0` causado por bug de cálculo (división por ventana mal medida, etc.).
- [x] Se distingue claramente corrección (invariantes) de carga (latencias/throughput); no se mezclan como si fueran lo mismo.

**Cómo verificarlo**

```powershell
Select-String -Path docs/informe-pruebas.md -Pattern "p95|p99|RPS"
```

**Criterio de cierre.** PASA si no quedan percentiles sobre muestras pequeñas ni `RPS=0` por artefacto. Cada `p95/p99` que sobreviva debe tener un `n` que lo justifique.

**Resultado / evidencia:**
> OK. `Select-String -Path docs/informe-pruebas.md -Pattern "p95|p99|RPS"` no devolvio resultados. Ademas, `stress-tests/run-concurrency-limits.js` usa `percentile(...)=null` para p95/p99 con menos de 20 muestras y calcula RPS con duracion minima de 1 ms para evitar `RPS=0` por medicion instantanea.

---

## V3 — T7: documentar el residual del trust boundary

**Por qué importa.** El criterio de aceptación de T7 es literalmente "documentado el límite de confianza de `stockSyncMode`". La defensa implementada (exigir `REPOSICION` **y** `stockDelta > 0`) cubre el escenario del brief —un consumo mal etiquetado llega con delta no-positivo y no infla— pero deja un residual que conviene nombrar por escrito en vez de dejarlo implícito.

**Qué verificar**

- [x] El informe deja escrito **qué cubre** la defensa: un `CONSUMO_PEDIDO` mal etiquetado como `REPOSICION` no puede subir stock porque su delta no es positivo.
- [x] El informe deja escrito **qué queda fuera** (residual asumido): un productor que fabrique `stockSyncMode = REPOSICION` **con delta positivo** para algo que en realidad es consumo. El gate no lo distingue; la mitigación es que el emisor es interno y confiable, más validación aguas arriba.

**Texto listo para pegar en el informe (sección T7):**

```markdown
### T7 — Límite de confianza de `stockSyncMode` (residual)

`stockSyncMode` es un campo del payload del evento; el gate es tan fiable como el
emisor. La defensa efectiva no se apoya solo en la etiqueta: para aumentar
`productos_locales` se exige `stockSyncMode === 'REPOSICION'` **y** `stockDelta > 0`.

- **Cubierto:** un `CONSUMO_PEDIDO` mal etiquetado como `REPOSICION` llega con delta
  ausente o no-positivo y NO infla el stock local. El gate no falla abierto en este caso.
- **Residual asumido:** un productor que emita `REPOSICION` con `stockDelta` positivo
  para un evento que en realidad es consumo. El consumidor no puede distinguirlo del
  payload. Mitigación: el emisor de `producto.actualizado` es un servicio interno
  confiable que deriva el modo del propio cambio; el endurecimiento adicional (validar
  el modo en origen / firmar el evento) queda fuera del alcance de esta fase.
```

**Criterio de cierre.** PASA cuando ese límite —cubierto vs residual— está escrito en el informe.

**Resultado / evidencia:**
> OK. Se agrego `T7 - Limite de confianza de stockSyncMode (residual)` en `docs/informe-stock-idempotency-dlq.md`, con separacion explicita de Cubierto vs Residual asumido.

---

## V4 — T9: simetría de retención y parking

**Por qué importa.** La tabla `idempotency_keys` crece con cada evento procesado, y eso pasa **en los dos lados** del flujo (pedidos e inventario). Si la purga de 7 días solo existe en pedidos, la de inventario sigue creciendo sin límite. Igual con el parking: si solo existe para inventario, conviene decidir explícitamente si se generaliza.

**Qué verificar**

- [x] La política de retención de 7 días existe **tanto** en `servicio-pedidos` **como** en `servicio-inventario` (o está documentado por qué solo en uno).
- [x] El parking: ¿es solo `parking.inventario_queue` por diseño, o debería generalizarse a todas las DLQ relevantes? Decisión escrita.
- [x] La detección/alerta cubre `parking.*` con prioridad igual o mayor que `dlq.*` (un mensaje en parking es fallo permanente que necesita intervención humana).

**Cómo verificarlo**

```powershell
# Buscar la purga/retención en ambos servicios
Select-String -Path apps/servicio-pedidos/**/*.ts -Pattern "retencion|retention|purga|7"
Select-String -Path apps/servicio-inventario/**/*.ts -Pattern "retencion|retention|purga|7"

# Topología de parking y colas
rabbitmqctl list_queues name messages_ready messages_unacknowledged | Select-String "parking|dlq"
```

**Criterio de cierre.** PASA cuando la retención está confirmada en ambos lados (o justificada en uno) y la decisión sobre generalizar el parking está documentada.

**Resultado / evidencia:**
> OK. Retencion confirmada en `apps/servicio-pedidos/src/app/outbox.processor.ts:83-86` y `apps/servicio-inventario/src/app/outbox.processor.ts:86-89`, ambas con `7 * 24 * 3600_000`. En los dos servicios `purgarIdempotencyKeys()` tiene su propio `@Cron(CronExpression.EVERY_HOUR)` y esta fuera de `processOutboxEvents()`, por lo que el barrido corre aunque no haya outbox pendiente. Esto quedo cubierto con pruebas focalizadas en `apps/servicio-pedidos/src/app/outbox.processor.spec.ts` y `apps/servicio-inventario/src/app/outbox.processor.spec.ts` (`npx.cmd vitest run ...`: 2 archivos, 4 tests OK).
>
> Topologia final: `parking.inventario_queue`, `dlq.pedidos_queue`, `dlq.reportes_queue`, `dlq.inventario_queue`, `dlq.cuentas_queue`, `dlq.mesas_queue`, `dlq.caja_queue` quedaron en `0 ready / 0 unacked`.
>
> Decision escrita en `docs/informe-stock-idempotency-dlq.md`: parking automatizado solo para `parking.inventario_queue` en esta fase, porque el flujo poison/reinyeccion cubierto es `pedido.creado -> inventario`; `parking.*` se monitorea junto con `dlq.*` y cualquier mensaje ready en parking requiere intervencion humana prioritaria.

---

## Resumen de estado

| Verificación | Punto | Criterio de cierre | Estado |
|---|---|---|---|
| V1 | T8 — paralelismo real | Disparo simultáneo + N−1 rechazos por recurso | OK |
| V2 | P4 — higiene de métricas | Sin p95/p99 con n chico, sin RPS=0 por bug | OK |
| V3 | T7 — residual documentado | Cubierto vs residual escrito en informe | OK |
| V4 | T9 — simetría retención/parking | Retención en ambos lados + parking decidido | OK |

**Cierre defendible** cuando las cuatro estén en OK con evidencia pegada arriba.

---

## Relación con el entregable del brief

El brief pide, por cada T: (a) hipótesis confirmada/no con evidencia en código, (b) cambio o test añadido, (c) `npm run probar` y `npm run probar:stock` en verde. Eso ya está en `docs/informe-stock-idempotency-dlq.md`. Este documento **no lo reemplaza**: cubre el último tramo —demostrar que las afirmaciones de concurrencia y métricas resisten una lectura crítica, y cerrar los residuales de T7/T9 por escrito— para que el informe pase de "completo" a "auditable".

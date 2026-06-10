# BASELINE de stress e invariantes — NachoPps

> **Fuente única y estable** de las cifras que respaldan las invariantes de
> mensajería/idempotencia/carrera. Reemplaza las referencias a reportes con
> _timestamp_ en `stress-tests/reports/*Z.md` (volátiles, no versionados). Las
> invariantes en `docs/invariantes/*.md` apuntan a este archivo.
>
> - **Baseline canónico:** corridas `2026-05-30` (`stock-idempotency-dlq` nivel 50/100/200 y
>   `concurrency-limits` 100 iteraciones), 300/300 por nivel.
> - **Re-confirmado:** `2026-06-10` tras el saneamiento de fixtures (T-28), stack 9/9 healthy.

## Stock, idempotencia y DLQ (`npm run probar:stock`)

| Escenario | Invariante | Cifras canónicas |
|---|---|---|
| **T0** autoridad de stock y dirección de sync | OK | el pedido es la única autoridad que decrementa stock |
| **D1** redelivery secuencial idempotente (`pedido.creado`) | OK | reentrega repetida no vuelve a descontar |
| **D1c** redelivery concurrente idempotente | OK | `duplicateCount 12`, stock inicial **20**, cantidad **5**, stock final **15**, sin residuo en DLQ |
| **R1** reposición inversa idempotente (secuencial y concurrente) | OK | `duplicateCount 12`, stock inicial **10**, `stockDelta 5`, stock final **15**, sin residuo |
| **R2** reposición como **delta** en ventana stale | OK | payload absoluto malicioso **99** con `stockDelta -4` → stock final **10** (no infla la proyección) |
| **T7** consumo mal etiquetado no infla stock local | OK | etiqueta errónea no incrementa stock |
| **T9** retención y profundidad de parking/DLQ | OK | retención de `IdempotencyKey` a **7 días**; `parking.*`/`dlq.*` con `messages_ready 0` al cierre |

> **Trust boundary (modo sync de stock).** El detalle de R2 incluye la regla esperada y un
> payload malicioso con `REPOSICION`, `stockDelta: -4`, `stockActualPayload: 99` y
> `stockFinal: 10`: la reposición se aplica como delta, no como valor absoluto del payload.

## Concurrencia, límites y carreras (`npm run probar:concurrencia`)

| Escenario | Invariante | Cifras canónicas |
|---|---|---|
| **C3** misma mesa, muchos pedidos | OK | todos los pedidos consolidan en una cuenta abierta |
| **C5** pago duplicado concurrente | OK | con turno de caja abierto: **1×201** y el resto **409/400** (un solo pago efectivo, cuenta CERRADA) |
| **C6** stock compartido | OK | sobre stock 200: **201×200 / 400×40**, sin oversell (`stockFinal ≥ 0`) |
| **C7** reservas mismo slot | OK | **1×201 / 409×(N-1)** sobre el mismo slot; exactamente una reserva activa |
| **S3/S4** seguridad y límites básicos | OK | sin token / token inválido / cantidad cero → 4xx |

> **Colas limpias (happy path).** Al cierre de cada corrida, todas las `*_queue` quedan con
> `consumers ≥ 1` y `messages_ready 0`; `dlq.*` y `parking.*` en 0.

## Caos de RabbitMQ (`npm run probar:caos`)

| Verificación | Resultado |
|---|---|
| Servicios sobreviven a `docker kill rabbitmq` | **9/9** sin reinicio |
| Plano HTTP responde con el broker caído | OK (`GET /pedidos 200`) |
| Colas recuperan consumidores tras `docker start` | OK (`*_queue = 1`, bindings reasentados) |
| Mutación HTTP tras la reconexión | OK |

## Re-corrida de confirmación (2026-06-10, post T-28)

Tras sanear los fixtures (T-28: `ubicacion` en vez de `zona`, turno de caja como precondición de
C5, presupuesto de login como assert), la batería vuelve a dar señal limpia:

- **`probar:concurrencia`:** 5/5 invariantes OK (C3, C5, C6, C7, S3).
- **`probar:caos`:** 8/8 verificaciones OK (incl. mutación de mesa con `ubicacion`).
- **`run-all-stress-tests.js`:** presupuesto de login `{401:5, 429:3}` (429 desde el 6.º), sin el
  endpoint eliminado `/auth/validate`.

> Para refrescar el baseline: correr `probar:stock`, `probar:concurrencia` y `probar:caos` con el
> stack 9/9 y actualizar las cifras de arriba (no las referencias de las invariantes, que apuntan
> a este archivo de forma estable).

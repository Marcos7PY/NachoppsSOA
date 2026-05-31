# Cierre de revisión — documentación atómica + siguiente paso

- Revisado: 2026-05-31
- Lote: `docs.zip` (commit `c5c7891`)
- Veredicto: **aprobada**, con una sola salvedad — el spot-check de citas contra el repo, que es lo único que no puedo correr yo (no tengo el código). Todo lo verificable sobre los `.md` pasa.

---

## 1. Criterios de aceptación del re-prompt

| Criterio | Estado | Evidencia |
|---|---|---|
| `Ver mecanismo citado` = 0 | ✅ | grep global: 0 |
| Boilerplate "Por qué importa" = 0; cada invariante con el suyo | ✅ | grep 0; los nueve "por qué" son específicos (p. ej. no-oversell: "dos pedidos concurrentes reservan más unidades que las disponibles y la cocina aceptaría ventas imposibles") |
| Invariante "Mecanismo" nombra y cita el código que la impone | ✅ | las 9 describen consumidor/handler/índice+traducción, no schema/contrato/test |
| `no-oversell` cita la reserva en pedidos | ✅ | `app.service.ts:170-188`: `$transaction` + `pg_advisory_xact_lock(hashtext(productoId))` + `UPDATE productos_locales ... WHERE "stockActual" >= cantidad RETURNING` → `BadRequestException` |
| `trust-boundary` cita el gate del consumidor | ✅ | `allowStockIncrease` exige `REPOSICION && stockDelta > 0`, re-chequea antes de sumar, **y documenta el residual** |
| Endpoints: guard+roles, códigos de estado, eventos emitidos | ✅ | `POST /pedidos`: `JwtAuthGuard` como `APP_GUARD`; 201/401/400/404/409/503 con su excepción; emite `PedidoCreado`/`PedidoActualizado`; errores con throw+línea |
| Flujos narran la secuencia paso a paso | ✅ | `pago-cierra-cuenta`: caja → `pago.registrado` → cuentas cierra → `cuenta.cerrada`/`ticket.generado` → mesas libera + reportes registra → pedidos marca pagado |
| Frases-esquive de §2 eliminadas | ✅ | grep global de las 6: 0 |
| Mismos átomos (ni uno más ni uno menos) | ✅ | 136 = 136; diff de listas: 0 añadidos, 0 eliminados |
| Estructura, nombres y formato de citas sin cambios | ✅ | árbol y front-matter intactos; `revisado` actualizado, `commit` correcto |
| Toda cita re-tocada verificada contra su línea | ⚠️ | **no verificable sin el repo — ver §3** |

Bonus: resolvió la duda que quedó abierta de Fase 3 — la purga de retención corre en `@Cron(EVERY_HOUR)` **separado** de `processOutboxEvents`, así que un servicio levantado purga aunque no tenga outbox pendiente.

---

## 2. Sobre los 42 marcadores `<!-- sin evidencia -->`

No son deuda ni relleno: son el agente **declinando honestamente** en vez de inventar, que es justo lo que se le pidió. La gran mayoría son secciones "Invariantes" de eventos que de verdad **no** mapean a ninguna de las 9 invariantes (`mesa.actualizada`, `stock.descontado`, `ticket.generado`, etc.) y "Invariantes que toca" de endpoints sin invariante dedicada (`cuentas`, `notificaciones`). Eso es correcto: no todo evento o endpoint tiene una invariante propia.

El subconjunto **realmente accionable** es chico: los pocos marcadores en "Efectos" como `cuentas/GET--raiz` ("no se detectó llamada de servicio desde el controlador") — endpoints triviales donde conviene confirmar a mano si efectivamente no hacen nada o si el agente no rastreó la llamada.

---

## 3. Lo único pendiente de mi lado: el spot-check de citas

Es el gate final y solo lo podés hacer vos con el repo abierto. El contenido ya no es genérico, así que una cita falsa requeriría que el agente haya fabricado código coherente — poco probable, pero las invariantes son las piezas que sostienen todo, así que conviene confirmarlas. Abrí estas y verificá que la línea dice lo que el átomo afirma:

- [ ] **no-oversell** → `apps/servicio-pedidos/src/app/app.service.ts:170-188` (lock + `UPDATE ... RETURNING` + `BadRequestException`).
- [ ] **idempotencia-directa** → `apps/servicio-inventario/src/app/app.service.ts:216-231` + `schema.prisma:53` + migración `:14`.
- [ ] **idempotencia-inversa** → `apps/servicio-pedidos/src/app/app.service.ts:386-431` + `schema.prisma:98` + migración `:9`.
- [ ] **trust-boundary / reposicion-como-delta** → `apps/servicio-pedidos/src/app/app.service.ts:411, 457-464` (`allowStockIncrease`, suma de `stockDelta`).
- [ ] **slot-reserva / exactamente-un-exito** → `reservas` migración `:20` + `reservas.service.ts:137-142` (`P2002` → `ConflictException`).
- [ ] **retencion** → `outbox.processor.ts` de pedidos e inventario (`purgarIdempotencyKeys`, `@Cron`).
- [ ] **POST /pedidos** → `app.controller.ts:12-13` y los códigos/errores citados en `app.service.ts`.

Si las 7 cuadran, la doc queda cerrada. Si una no cuadra, pedile al agente que revise **todas** las de ese tipo, no solo la señalada.

---

## 4. Siguiente a realizar

En orden:

1. **Spot-check de citas** (§3). Es el último candado de esta doc.
2. **Triage de los marcadores accionables** — solo los pocos de "Efectos" con "no se detectó llamada"; el resto son N/A legítimos y se quedan como están.
3. **Merge** de `docs/documentacion-atomica`. La documentación queda cerrada.
4. **Arrancar la tanda de seguridad** — es el dominio que quedó pendiente desde el primer brief y no toca stock: IDOR / autorización a nivel de objeto, JWT (`alg:none`, expirado, payload manipulado), alcance real del rate limit (por IP vs usuario vs global, bypass por header, reset), y la cookie `Secure` sobre HTTP. Es un brief aparte, con el mismo formato de hipótesis-a-confirmar-leyendo-código que venís usando.

Cuando llegues al punto 4, te armo ese brief de seguridad listo para el agente.

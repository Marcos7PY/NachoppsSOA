# Handoff S-D — T-39: decisión de granularidad de reservas y su ejecución

> **Decisión tomada:** opción (b), reserva por mesa. No depende de S-A/S-B/S-C.
> Esfuerzo: 0.5 día (opción a) o 1–2 días (opción b).

## Contexto mínimo

El anti-doble-booking de `servicio-reservas` se implementa con un índice único **parcial**
creado por migración SQL cruda (Prisma no expresa índices parciales; el drift está cubierto
por `scripts/check-migration-drift.sh`):

```sql
CREATE UNIQUE INDEX ... "Reserva_fecha_hora_active_unique"
-- sobre (fecha, hora) WHERE estado activo
```

Consecuencia histórica de negocio: **una sola reserva activa por franja horaria para todo
el restaurante**. La decisión de esta sesión cambia la granularidad a **una reserva activa
por mesa y franja**.

## Paso 0 — La decisión (conversación con stakeholder, no código)

Pregunta única a responder: **¿el restobar real toma más de una reserva para la misma
fecha+hora?** (p. ej. dos familias a las 21:00 en mesas distintas).

- **No / es un turno único** → Opción (a). Recomendada para el alcance actual: el modelo
  ya es correcto, solo falta ratificarlo y que la UI no sugiera lo contrario.
- **Sí** → Opción (b), reserva por mesa. (La opción (c) — capacidad agregada por franja —
  se descartó en el ADR por complejidad/beneficio; reabrirla solo si (b) tampoco encaja.)

Respuesta registrada: **Sí, el restobar toma más de una reserva para la misma fecha+hora
si son mesas distintas**. ADR-010 pasa de propuesta a **aceptada** con opción (b).

## Opción (a) — Ratificar franja única (0.5 día)

1. ADR-010 → aceptada, redactando la regla de negocio: "una franja = un turno de servicio
   único; la mesa se asigna en sala".
2. **PWA:** revisar `apps/pwa-cliente/src/screens/reservas/` y el copy asociado para que no
   prometa selección de capacidad/mesa por franja; `mesaPreferida` queda como nota
   informativa, no como garantía. Ajustar mensajes de error 409 ("franja ya reservada").
3. **API:** valorar renombrar/documentar `capacidadRestante` en el contrato
   (`libs/contracts`) como `disponible: boolean` en `/v2` o documentar el rango {0,1} en
   Swagger — sin breaking change ahora.
4. Aceptación: ADR aceptada commiteada, PWA sin promesas falsas, suite en verde.

## Opción (b) — Reserva por mesa (elegida)

1. **Contrato:** `mesaPreferida` pasa a obligatoria en `CrearReservaCommand` (o nuevo campo
   `mesaId` validado contra servicio-mesas — decidir si la validación es síncrona con
   breaker o eventual).
2. **Migración cruda nueva:** reemplazar el índice por
   `(fecha, hora, "mesaPreferida") WHERE estado IN ('PENDIENTE','CONFIRMADA')`.
   ⚠️ Plan de despliegue: crear el índice nuevo `CONCURRENTLY`, backfillear
   `mesaPreferida` en reservas activas que la tengan NULL (decidir valor o cancelarlas),
   luego dropear el índice viejo. Actualizar el conteo esperado del drift-check.
3. **Servicio:** `consultarDisponibilidad(fecha, hora)` pasa a devolver mesas libres
   (requiere catálogo de mesas: consumir eventos `Mesa*` que ya llegan a pedidos, o llamada
   síncrona a servicio-mesas con breaker — preferir la réplica por eventos, patrón ya usado).
4. **PWA:** selector de mesa en el flujo de reserva.
5. **Pruebas (P-60):** adaptar la prueba de concurrencia: N requests concurrentes a la misma
   (fecha, hora, mesa) → exactamente 1 gana (P2002→409); misma franja con mesas distintas →
   todas ganan.
6. Aceptación: drift N/N verde, P-60 verde, suite completa verde, ADR-010 aceptada con (b).

## Riesgos

- (b) introduce acoplamiento reservas→mesas que hoy no existe (reservas no consume ningún
  evento). La réplica por eventos es el camino consistente con la arquitectura, pero añade
  consumidor + idempotencia a un servicio que era el más simple del sistema. Eso es parte
  del costo real de (b) y debe pesar en la decisión del Paso 0.
- En ambas opciones: no tocar el manejo P2002 existente — es correcto y está probado.

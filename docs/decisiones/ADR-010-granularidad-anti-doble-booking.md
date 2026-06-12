---
tipo: adr
id: ADR-010
estado: aceptada
fecha: 2026-06-11
fuente: [apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:1, docs/plan-remediacion-auditoria-externa.md]
---

# ADR-010 - Granularidad del anti-doble-booking de reservas (T-39)

**Estado: ACEPTADA — decisión del dueño de alcance el 2026-06-11.**

**Contexto.** El índice único parcial `Reserva_fecha_hora_active_unique` (ver ADR-005)
permite **una sola reserva activa por franja horaria para todo el restaurante**, y
`consultarDisponibilidad` exponía `capacidadRestante ∈ {0,1}` para la franja completa.
La auditoría externa (2026-06-11, hallazgo T-39) señala que esta granularidad puede
no corresponder a la intención de producto: un restaurante con N mesas normalmente
acepta N reservas por franja.

**Opciones.**

| Opción | Descripción | Esfuerzo | Impacto |
|--------|-------------|----------|---------|
| **(a) Ratificar como alcance** *(recomendada)* | "Una franja = un turno de servicio único". Se ratifica el índice actual y se ajusta el copy de la PWA para que el cliente entienda que reserva el turno completo. | 0.5 d | Solo docs + copy PWA |
| (b) Reserva por mesa | `mesaPreferida` pasa a ser obligatoria y entra al índice único parcial (nueva migración cruda + actualización del drift-check 9/9→10/10); `consultarDisponibilidad` pasa a listar mesas libres. | 1–2 d | Migración + API + PWA |
| (c) Capacidad por franja | Contador con lock (`SELECT … FOR UPDATE` sobre una fila de capacidad) o constraint de exclusión. | 2 d+ | Modelo nuevo |

**Decisión.** Se elige **(b) Reserva por mesa**. El negocio acepta más de una
reserva activa en la misma fecha+hora siempre que sean mesas distintas.

**Consecuencias.** `mesaPreferida` pasa a ser obligatoria y representa el identificador
de la mesa seleccionada. El anti-doble-booking queda definido por `(fecha, hora,
mesaPreferida)` para reservas activas (`PENDIENTE`, `CONFIRMADA`). La PWA debe
seleccionar mesa desde el catálogo existente y `consultarDisponibilidad` debe exponer
las mesas ya reservadas en la franja.

**Pruebas esperadas.** P-60 se adapta a "una reserva activa por mesa y franja":
N requests concurrentes a la misma `(fecha, hora, mesaPreferida)` producen un único
éxito; requests a la misma franja con mesas distintas pueden coexistir.

**Alternativas descartadas.** Ninguna aún; este ADR registra el abanico para decidir.

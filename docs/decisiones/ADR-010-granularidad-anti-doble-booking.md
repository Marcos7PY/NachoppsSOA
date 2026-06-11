---
tipo: adr
id: ADR-010
estado: propuesta
fecha: 2026-06-11
fuente: [apps/servicio-reservas/prisma/migrations/20260609010000_slot_unico_index/migration.sql:1, docs/plan-remediacion-auditoria-externa.md]
---

# ADR-010 - Granularidad del anti-doble-booking de reservas (T-39)

**Estado: PROPUESTA — requiere decisión de producto con el stakeholder antes de tocar código.**

**Contexto.** El índice único parcial `Reserva_fecha_hora_active_unique` (ver ADR-005)
permite **una sola reserva activa por franja horaria para todo el restaurante**, y
`consultarDisponibilidad` expone `capacidadRestante ∈ {0,1}`. La auditoría externa
(2026-06-11, hallazgo T-39) señala que esta granularidad puede no corresponder a la
intención de producto: un restaurante con N mesas normalmente acepta N reservas por franja.

**Opciones.**

| Opción | Descripción | Esfuerzo | Impacto |
|--------|-------------|----------|---------|
| **(a) Ratificar como alcance** *(recomendada)* | "Una franja = un turno de servicio único". Se ratifica el índice actual y se ajusta el copy de la PWA para que el cliente entienda que reserva el turno completo. | 0.5 d | Solo docs + copy PWA |
| (b) Reserva por mesa | `mesaPreferida` pasa a ser obligatoria y entra al índice único parcial (nueva migración cruda + actualización del drift-check 9/9→10/10); `consultarDisponibilidad` pasa a listar mesas libres. | 1–2 d | Migración + API + PWA |
| (c) Capacidad por franja | Contador con lock (`SELECT … FOR UPDATE` sobre una fila de capacidad) o constraint de exclusión. | 2 d+ | Modelo nuevo |

**Decisión.** Pendiente de ratificación. Recomendación del equipo técnico: **(a)**,
por ser coherente con el comportamiento ya probado en producción de pruebas
(P-XX de concurrencia de reservas existente) y de mínimo riesgo; si el negocio
necesita más de una reserva por franja, elegir (b).

**Consecuencias (al ratificar a).** El copy de la PWA debe dejar claro que la franja
se reserva en exclusiva. La prueba de concurrencia de reservas existente queda válida
sin cambios (P-60).

**Consecuencias (si se elige b).** Nueva migración cruda sobre el índice parcial,
actualización del drift-check, cambios en `consultarDisponibilidad` y en la PWA;
P-60 se adapta a "una reserva activa por mesa y franja".

**Alternativas descartadas.** Ninguna aún; este ADR registra el abanico para decidir.

-- T-26: índice anti-doble-booking versionado (antes se creaba en runtime con
-- $executeRawUnsafe en ReservasService.onModuleInit, invisible para el drift check).
-- Paso 1: limpiar duplicados activos preexistentes (conserva el más antiguo por slot).
WITH ranked_active_reservations AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY fecha, hora
      ORDER BY "createdAt", id
    ) AS rn
  FROM "Reserva"
  WHERE estado IN ('PENDIENTE', 'CONFIRMADA')
)
UPDATE "Reserva"
SET estado = 'CANCELADA',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT id
  FROM ranked_active_reservations
  WHERE rn > 1
);

-- Paso 2: índice único parcial que garantiza un único slot activo por (fecha, hora).
CREATE UNIQUE INDEX IF NOT EXISTS "Reserva_fecha_hora_active_unique"
ON "Reserva"("fecha", "hora")
WHERE estado IN ('PENDIENTE', 'CONFIRMADA');

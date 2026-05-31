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

CREATE UNIQUE INDEX "Reserva_fecha_hora_active_unique"
ON "Reserva"("fecha", "hora")
WHERE estado IN ('PENDIENTE', 'CONFIRMADA');

-- T-39: reserva por mesa. Permite varias reservas activas en la misma franja,
-- pero no dos reservas activas para la misma mesa en fecha+hora.

-- Las reservas históricas sin mesa se conservan con un valor legado para poder
-- exigir NOT NULL y sostener el índice nuevo.
UPDATE "Reserva"
SET "mesaPreferida" = 'LEGACY-SIN-MESA',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "mesaPreferida" IS NULL OR btrim("mesaPreferida") = '';

ALTER TABLE "Reserva"
ALTER COLUMN "mesaPreferida" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Reserva_fecha_hora_mesa_active_unique"
ON "Reserva"("fecha", "hora", "mesaPreferida")
WHERE estado IN ('PENDIENTE', 'CONFIRMADA');

DROP INDEX IF EXISTS "Reserva_fecha_hora_active_unique";

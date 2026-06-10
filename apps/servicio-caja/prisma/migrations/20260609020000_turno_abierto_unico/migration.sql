-- T-25: garantizar un único turno de caja ABIERTA a la vez.
-- Decisión por defecto: índice GLOBAL (un solo turno abierto en todo el sistema),
-- consistente con la lógica actual `findFirst({ where: { estado: 'ABIERTA' } })` sin
-- filtro por cajaId. Si el negocio adopta varias cajas físicas simultáneas, cambiar
-- a un índice por (("cajaId")) WHERE estado = 'ABIERTA' (ver nota del plan T-25).
--
-- Paso 1: cerrar duplicados ABIERTA preexistentes (conserva el más reciente).
WITH ranked_abiertos AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "abiertoAt" DESC, id) AS rn
  FROM "turnos_caja"
  WHERE estado = 'ABIERTA'
)
UPDATE "turnos_caja"
SET estado = 'CERRADA',
    "cerradoAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id IN (SELECT id FROM ranked_abiertos WHERE rn > 1);

-- Paso 2: índice único parcial sobre una expresión constante: a lo sumo una fila
-- con estado = 'ABIERTA'.
CREATE UNIQUE INDEX IF NOT EXISTS "turnos_caja_un_abierto"
ON "turnos_caja"((estado))
WHERE estado = 'ABIERTA';

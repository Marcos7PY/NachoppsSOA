-- Reportes por mesero (plan 6.3): captura del mesero en el read-model de ventas.
-- AlterTable
ALTER TABLE "ventas_diarias" ADD COLUMN     "meseroId" TEXT,
ADD COLUMN     "meseroNombre" TEXT;

-- CreateIndex
CREATE INDEX "ventas_diarias_meseroId_idx" ON "ventas_diarias"("meseroId");

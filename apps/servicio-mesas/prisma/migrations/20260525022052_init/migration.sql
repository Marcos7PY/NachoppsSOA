-- CreateTable
CREATE TABLE "mesas" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "ubicacion" TEXT NOT NULL DEFAULT 'Salon Principal',
    "estado" TEXT NOT NULL DEFAULT 'LIBRE',
    "cuentaAsociada" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mesas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mesas_numero_key" ON "mesas"("numero");

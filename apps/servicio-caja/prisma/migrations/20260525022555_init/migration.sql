-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" TEXT NOT NULL,
    "referencia" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cierres_caja" (
    "id" TEXT NOT NULL,
    "montoEsperado" DECIMAL(10,2) NOT NULL,
    "montoReal" DECIMAL(10,2) NOT NULL,
    "diferencia" DECIMAL(10,2) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cierres_caja_pkey" PRIMARY KEY ("id")
);

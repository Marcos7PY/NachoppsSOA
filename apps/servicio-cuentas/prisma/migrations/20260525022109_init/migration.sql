-- CreateTable
CREATE TABLE "Cuenta" (
    "id" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "pedidos" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "ticket" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id")
);

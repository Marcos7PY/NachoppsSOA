-- CreateTable
CREATE TABLE "cuentas_abiertas" (
    "cuentaId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "cuentas_abiertas_pkey" PRIMARY KEY ("cuentaId")
);

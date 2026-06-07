-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ventas_diarias" (
    "id" TEXT NOT NULL,
    "cuentaId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "items" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "ventas_diarias_cuentaId_key" ON "ventas_diarias"("cuentaId");

-- CreateIndex
CREATE INDEX "ventas_diarias_fecha_idx" ON "ventas_diarias"("fecha");


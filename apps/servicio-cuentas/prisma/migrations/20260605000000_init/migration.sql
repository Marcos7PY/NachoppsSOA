-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CuentaEstado" AS ENUM ('ABIERTA', 'CERRADA', 'PAGADA');

-- CreateTable
CREATE TABLE "cuentas" (
    "id" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "pedidos" JSONB NOT NULL,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" "CuentaEstado" NOT NULL DEFAULT 'ABIERTA',
    "ticket" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "routingKey" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cuentas_mesaId_estado_idx" ON "cuentas"("mesaId", "estado");

-- CreateIndex
CREATE INDEX "outbox_events_status_createdAt_idx" ON "outbox_events"("status", "createdAt");


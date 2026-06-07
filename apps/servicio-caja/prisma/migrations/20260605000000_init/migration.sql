-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "cuentaId" TEXT NOT NULL,
    "turnoId" TEXT,
    "mesaId" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "metodo" TEXT NOT NULL,
    "referencia" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "cierres_caja" (
    "id" TEXT NOT NULL,
    "turnoId" TEXT,
    "montoEsperado" DECIMAL(10,2) NOT NULL,
    "montoReal" DECIMAL(10,2) NOT NULL,
    "diferencia" DECIMAL(10,2) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "resumen" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cierres_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_abiertas" (
    "cuentaId" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "cuentas_abiertas_pkey" PRIMARY KEY ("cuentaId")
);

-- CreateTable
CREATE TABLE "turnos_caja" (
    "id" TEXT NOT NULL,
    "cajaId" TEXT NOT NULL,
    "cajaNombre" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cajeroNombre" TEXT,
    "fondoInicial" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL,
    "abiertoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cerradoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turnos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_caja" (
    "id" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cuentaId" TEXT,
    "transaccionId" TEXT,
    "mesaId" TEXT,
    "donde" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "propina" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arqueos_caja" (
    "id" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "denominaciones" JSONB NOT NULL,
    "efectivoEsperado" DECIMAL(10,2) NOT NULL,
    "efectivoContado" DECIMAL(10,2) NOT NULL,
    "diferencia" DECIMAL(10,2) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arqueos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transacciones_cuentaId_idx" ON "transacciones"("cuentaId");

-- CreateIndex
CREATE INDEX "transacciones_turnoId_idx" ON "transacciones"("turnoId");

-- CreateIndex
CREATE INDEX "outbox_events_status_createdAt_idx" ON "outbox_events"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cierres_caja_turnoId_key" ON "cierres_caja"("turnoId");

-- CreateIndex
CREATE INDEX "turnos_caja_estado_abiertoAt_idx" ON "turnos_caja"("estado", "abiertoAt");

-- CreateIndex
CREATE INDEX "turnos_caja_usuarioId_estado_idx" ON "turnos_caja"("usuarioId", "estado");

-- CreateIndex
CREATE INDEX "movimientos_caja_turnoId_createdAt_idx" ON "movimientos_caja"("turnoId", "createdAt");

-- CreateIndex
CREATE INDEX "movimientos_caja_cuentaId_idx" ON "movimientos_caja"("cuentaId");

-- CreateIndex
CREATE UNIQUE INDEX "movimientos_caja_transaccionId_key" ON "movimientos_caja"("transaccionId");

-- CreateIndex
CREATE INDEX "arqueos_caja_turnoId_createdAt_idx" ON "arqueos_caja"("turnoId", "createdAt");

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turnos_caja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_caja" ADD CONSTRAINT "cierres_caja_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turnos_caja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turnos_caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arqueos_caja" ADD CONSTRAINT "arqueos_caja_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turnos_caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


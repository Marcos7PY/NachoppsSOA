-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL,
    "eventoOrigen" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

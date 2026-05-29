-- CreateTable
CREATE TABLE "productos_locales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "stockActual" INTEGER,
    "categoriaNombre" TEXT NOT NULL DEFAULT 'COCINA',
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "productos_locales_pkey" PRIMARY KEY ("id")
);

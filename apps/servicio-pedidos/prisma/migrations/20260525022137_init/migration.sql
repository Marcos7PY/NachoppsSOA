-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "numeroMesa" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "montoPagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "comensales" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_items" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "area" TEXT DEFAULT 'COCINA',
    "notas" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "comensal" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "pedido_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modificadores" (
    "id" TEXT NOT NULL,
    "pedidoItemId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precioExtra" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "modificadores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modificadores" ADD CONSTRAINT "modificadores_pedidoItemId_fkey" FOREIGN KEY ("pedidoItemId") REFERENCES "pedido_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

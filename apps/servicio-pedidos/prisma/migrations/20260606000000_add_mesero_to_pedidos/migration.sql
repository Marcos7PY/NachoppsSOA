-- Reportes por mesero end-to-end: pedidos conserva el usuario que tomó el pedido.

ALTER TABLE "pedidos" ADD COLUMN     "meseroId" TEXT,
ADD COLUMN     "meseroNombre" TEXT;

ALTER TABLE "pedido_items" ADD COLUMN     "meseroId" TEXT,
ADD COLUMN     "meseroNombre" TEXT;

CREATE INDEX "pedidos_meseroId_idx" ON "pedidos"("meseroId");
CREATE INDEX "pedido_items_meseroId_idx" ON "pedido_items"("meseroId");

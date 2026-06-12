-- Compensación de la saga de stock (plan 1.1): nuevo estado terminal para
-- pedidos/ítems cuyo descuento de stock real falló en Inventario.
ALTER TYPE "PedidoEstado" ADD VALUE IF NOT EXISTS 'RECHAZADO_SIN_STOCK';

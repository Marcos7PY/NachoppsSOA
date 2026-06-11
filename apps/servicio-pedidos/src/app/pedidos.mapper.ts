import { PedidoDto } from '@org/contracts';
import { Pedido } from '../generated/prisma';

export function toPedidoDto(pedido: Pedido): PedidoDto {
  return {
    total: 0 as any,
    comensales: 1,
    id: pedido.id,
    mesaId: pedido.mesaId,
    items: (pedido as any).items?.map((item: any) => ({
      id: item.id,
      productoId: item.productoId,
      cantidad: item.cantidad,
      estado: item.estado
    })) || [],
    estado: pedido.estado,
    createdAt: pedido.createdAt.toISOString(),
  } as any;
}

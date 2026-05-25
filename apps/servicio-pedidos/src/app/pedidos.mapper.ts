import { PedidoDto, PedidoEstado } from '@org/contracts';
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
      estado: item.estado as any
    })) || [],
    estado: pedido.estado as PedidoEstado,
    createdAt: pedido.createdAt.toISOString(),
  } as any;
}

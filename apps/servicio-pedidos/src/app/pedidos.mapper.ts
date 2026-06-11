import { PedidoDto } from '@org/contracts';
import { Pedido } from '../generated/prisma';

type PedidoWithItems = Pedido & {
  items?: { id: string; productoId: string; cantidad: number; estado: string }[];
};

export function toPedidoDto(pedido: PedidoWithItems): PedidoDto {
  return {
    total: 0,
    comensales: 1,
    id: pedido.id,
    mesaId: pedido.mesaId,
    items: pedido.items?.map((item) => ({
      id: item.id,
      productoId: item.productoId,
      cantidad: item.cantidad,
      estado: item.estado,
    })) ?? [],
    estado: pedido.estado,
    createdAt: pedido.createdAt.toISOString(),
  } as PedidoDto;
}

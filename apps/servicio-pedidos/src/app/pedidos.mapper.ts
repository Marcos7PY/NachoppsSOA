import { PedidoDto, PedidoEstado, PedidoItemDto } from '@org/contracts';
import { Pedido } from '../generated/prisma';

export function toPedidoDto(pedido: Pedido): PedidoDto {
  return {
    id: pedido.id,
    mesaId: pedido.mesaId,
    items: pedido.items as PedidoItemDto[],
    estado: pedido.estado as PedidoEstado,
    createdAt: pedido.createdAt.toISOString(),
  };
}

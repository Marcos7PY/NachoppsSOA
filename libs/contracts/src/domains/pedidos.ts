export const PedidoEstado = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
} as const;

export type PedidoEstado = (typeof PedidoEstado)[keyof typeof PedidoEstado];

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const;

export type ItemArea = (typeof ItemArea)[keyof typeof ItemArea];

export interface PedidoItemDto {
  producto: string;
  cantidad: number;
  area?: ItemArea;
  notas?: string;
}

export interface PedidoDto {
  id: string;
  mesaId: string;
  items: PedidoItemDto[];
  estado: PedidoEstado;
  createdAt: string;
}

export interface CrearPedidoCommand {
  mesaId: string;
  items: PedidoItemDto[];
}

export interface PedidoCreadoPayload {
  pedido: PedidoDto;
}

export interface PedidoListoPayload {
  pedidoId: string;
  mesaId: string;
}

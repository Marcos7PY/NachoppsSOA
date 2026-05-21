export const PedidoEstado = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
  Pagado: 'PAGADO',
} as const;

export type PedidoEstado = (typeof PedidoEstado)[keyof typeof PedidoEstado];

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const;

export type ItemArea = (typeof ItemArea)[keyof typeof ItemArea];

export interface ModificadorItem {
  nombre: string;
  precioExtra?: number;
}

export interface PedidoItemDto {
  id?: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  modificadores?: ModificadorItem[];
  area?: ItemArea;
  notas?: string;
  estado?: PedidoEstado;
}

export interface PedidoDto {
  id: string;
  mesaId: string;
  numeroMesa?: number;
  items: PedidoItemDto[];
  total: number;
  estado: PedidoEstado;
  createdAt: string;
}

export interface CrearPedidoCommand {
  mesaId: string;
  items: (Omit<PedidoItemDto, 'nombre' | 'precioUnitario'> & { identificadorComensal?: number })[];
}



export interface ActualizarEstadoPedidoCommand {
  estado: PedidoEstado;
}

export interface PedidoCreadoPayload {
  pedido: PedidoDto;
}

export interface PedidoListoPayload {
  pedidoId: string;
  mesaId: string;
}

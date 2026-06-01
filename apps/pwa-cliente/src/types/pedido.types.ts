// types/pedido.types.ts — DTOs y ViewModels de pedidos
// Basado en libs/contracts/src/domains/pedidos.ts

// ─── Enums ──────────────────────────────────────────────────────
export const EstadoPedido = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
  Pagado: 'PAGADO',
  Cancelado: 'CANCELADO',
} as const;

export type EstadoPedido = (typeof EstadoPedido)[keyof typeof EstadoPedido];

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const;

export type ItemArea = (typeof ItemArea)[keyof typeof ItemArea];

// ─── DTO del backend ────────────────────────────────────────────
export interface ModificadorDto {
  nombre: string;
  precioExtra?: number;
}

export interface PedidoItemDto {
  id?: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  modificadores?: ModificadorDto[];
  area?: ItemArea;
  notas?: string;
  estado?: EstadoPedido;
}

export interface PedidoDto {
  id: string;
  mesaId: string;
  numeroMesa?: number;
  items: PedidoItemDto[];
  total: number;
  estado: EstadoPedido;
  createdAt: string;
}

// ─── ViewModels para la UI ──────────────────────────────────────
export interface PedidoItemVM {
  id: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  modificadores: ModificadorDto[];
  area: ItemArea;
  notas: string;
  estado: EstadoPedido;
  /** Clase CSS del badge de estado */
  estadoClass: string;
  /** Label legible */
  estadoLabel: string;
}

export interface PedidoVM {
  id: string;
  mesaId: string;
  mesaNumero: string;        // "01", "02"
  items: PedidoItemVM[];
  total: number;
  estado: EstadoPedido;
  estadoClass: string;
  estadoLabel: string;
  createdAt: string;
  /** Tiempo transcurrido legible */
  tiempoTranscurrido: string;
  cantidadItems: number;
}

// ─── Payloads de creación ───────────────────────────────────────
export interface CrearPedidoItemPayload {
  productoId: string;
  cantidad: number;
  modificadores?: ModificadorDto[];
  area?: ItemArea;
  notas?: string;
  estado?: EstadoPedido;
  identificadorComensal?: number;
}

export interface CrearPedidoPayload {
  mesaId: string;
  items: CrearPedidoItemPayload[];
}

export interface ActualizarEstadoPedidoPayload {
  estado: EstadoPedido;
}

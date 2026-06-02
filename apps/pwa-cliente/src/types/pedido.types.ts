// types/pedido.types.ts — DTOs y ViewModels de pedidos
// DTOs derivados de @org/contracts; ViewModels propios de la UI.

import type {
  ActualizarEstadoPedidoCommand,
  CrearPedidoCommand,
  ItemArea as ContractItemArea,
  ListarPedidosQuery,
  ModificadorItem as ContractModificadorDto,
  PedidoDto as ContractPedidoDto,
  PedidoEstado as ContractEstadoPedido,
  PedidoItemDto as ContractPedidoItemDto,
  PedidoListResponse as ContractPedidoListResponse,
  PedidoItemInput,
} from '@org/contracts';

// ─── Enums ──────────────────────────────────────────────────────
export const EstadoPedido = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
  Pagado: 'PAGADO',
  Cancelado: 'CANCELADO',
} as const satisfies Record<string, ContractEstadoPedido>;

export type EstadoPedido = ContractEstadoPedido;

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const satisfies Record<string, ContractItemArea>;

export type ItemArea = ContractItemArea;

// ─── DTO del backend ────────────────────────────────────────────
export type ModificadorDto = ContractModificadorDto;
export type PedidoItemDto = ContractPedidoItemDto;
export type PedidoDto = ContractPedidoDto;
export type PedidoListQuery = ListarPedidosQuery;
export type PedidoListResponse = ContractPedidoListResponse;

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
  cliente?: string;
  telefono?: string;
  direccion?: string;
  proveedor?: string;
  modalidad?: string;
  /** Tiempo transcurrido legible */
  tiempoTranscurrido: string;
  cantidadItems: number;
}

// ─── Payloads de creación ───────────────────────────────────────
export type CrearPedidoItemPayload = PedidoItemInput;
export type CrearPedidoPayload = CrearPedidoCommand;
export type ActualizarEstadoPedidoPayload = ActualizarEstadoPedidoCommand;

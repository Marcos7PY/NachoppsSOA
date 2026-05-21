export const CuentaEstado = {
  Abierta: 'ABIERTA',
  Cerrada: 'CERRADA',
  Pagada: 'PAGADA',
} as const;

export type CuentaEstado = (typeof CuentaEstado)[keyof typeof CuentaEstado];

export interface CuentaCerradaPayload {
  cuentaId: string;
  mesaId: string;
  total: number;
}

export interface TicketGeneradoPayload {
  ticketId: string;
  cuentaId: string;
}

export interface CuentaDto {
  id: string;
  mesaId: string;
  pedidos: any[]; // Se poblará con detalles de pedidos
  total: number;
  estado: CuentaEstado;
  ticket?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDto {
  id: string;
  cuentaId: string;
  mesaId: string;
  items: any[];
  subtotal: number;
  descuento: number;
  total: number;
  fecha: string;
}

export interface AbrirCuentaCommand {
  mesaId: string;
}

export interface CerrarCuentaCommand {
  descuento?: number;
}

export interface DividirCuentaCommand {
  metodo: 'IGUALES' | 'POR_ITEMS';
  numPartes?: number;
}

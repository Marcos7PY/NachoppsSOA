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

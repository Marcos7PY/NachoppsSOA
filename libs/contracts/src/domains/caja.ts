export const MetodoPago = {
  Efectivo: 'EFECTIVO',
  Tarjeta: 'TARJETA',
  Transferencia: 'TRANSFERENCIA',
  Yape: 'YAPE',
  Plin: 'PLIN',
} as const;

export type MetodoPago = (typeof MetodoPago)[keyof typeof MetodoPago];

export interface TransaccionDto {
  id: string;
  pedidoId: string;
  monto: number;
  metodo: MetodoPago;
  referencia?: string;
  notas?: string;
  createdAt: string;
}

export interface PagarPedidoCommand {
  pedidoId: string;
  monto: number;
  metodo: MetodoPago;
  referencia?: string;
  notas?: string;
}

export interface PagoRegistradoPayload {
  transaccionId: string;
  pedidoId: string;
  monto: number;
  metodo: MetodoPago;
}

export interface ArqueoRealizadoPayload {
  turnoId: string;
  diferencia: number;
}

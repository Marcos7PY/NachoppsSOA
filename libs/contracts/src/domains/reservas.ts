export const ReservaEstado = {
  Pendiente: 'PENDIENTE',
  Confirmada: 'CONFIRMADA',
  Cancelada: 'CANCELADA',
  Expirada: 'EXPIRADA',
} as const;

export type ReservaEstado = (typeof ReservaEstado)[keyof typeof ReservaEstado];

export interface ReservaDto {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  mesaPreferida?: string | null;
  numComensales: number;
  estado: ReservaEstado;
  createdAt: string;
}

export interface CrearReservaCommand {
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  mesaPreferida?: string;
  numComensales?: number;
}

export interface ReservaCreadaPayload {
  reserva: ReservaDto;
}

export interface ReservaCanceladaPayload {
  reservaId: string;
  motivo?: string;
}

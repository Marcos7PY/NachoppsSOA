// types/reserva.types.ts - DTOs y ViewModels de reservas

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

export interface ReservaVM {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  mesaPreferida: string | null;
  numComensales: number;
  estado: ReservaEstado;
  estadoLabel: string;
  estadoClass: string;
  fechaHoraLabel: string;
  createdAt: string;
}

export interface CrearReservaPayload {
  clienteNombre: string;
  clienteTelefono?: string;
  fecha: string;
  hora: string;
  mesaPreferida?: string;
  numComensales?: number;
}

export interface ReservaResponse {
  message: string;
  reserva: ReservaDto;
}

export interface DisponibilidadResponse {
  fecha: string;
  hora: string;
  disponible: boolean;
  capacidadRestante: number;
}

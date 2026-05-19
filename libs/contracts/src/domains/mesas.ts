export const MesaEstado = {
  Libre: 'LIBRE',
  Ocupada: 'OCUPADA',
  Reservada: 'RESERVADA',
} as const;

export type MesaEstado = (typeof MesaEstado)[keyof typeof MesaEstado];

export interface MesaDto {
  id: string;
  numero: number;
  capacidad: number;
  ubicacion: string;
  estado: MesaEstado;
  cuentaAsociada?: string | null;
}

export interface MesaAsignadaPayload {
  mesaId: string;
  cuentaId: string;
}

export interface MesaLiberadaPayload {
  mesaId: string;
}

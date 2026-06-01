// types/mesa.types.ts — DTOs y ViewModels de mesas
// Basado en libs/contracts/src/domains/mesas.ts

// ─── Enums ──────────────────────────────────────────────────────
export const EstadoMesa = {
  Libre: 'LIBRE',
  Ocupada: 'OCUPADA',
  Reservada: 'RESERVADA',
} as const;

export type EstadoMesa = (typeof EstadoMesa)[keyof typeof EstadoMesa];

// ─── DTO del backend (GET /mesas) ───────────────────────────────
export interface MesaDto {
  id: string;
  numero: number;
  capacidad: number;
  ubicacion: string;
  estado: EstadoMesa;
  cuentaAsociada?: string | null;
}

// ─── ViewModel para la UI ───────────────────────────────────────
export interface MesaVM {
  id: string;
  numero: string;       // "01", "02" (padStart 2)
  numeroRaw: number;    // número original para ordenamiento
  capacidad: number;
  zona: string;         // ubicacion → zona
  estado: EstadoMesa;
  cuentaAsociada: string | null;
  /** Clase CSS para el color del estado */
  estadoClass: string;
  /** Label legible del estado */
  estadoLabel: string;
}

// ─── Comando para actualizar estado ─────────────────────────────
export interface ActualizarEstadoMesaPayload {
  estado: EstadoMesa;
  cuentaAsociada?: string | null;
}

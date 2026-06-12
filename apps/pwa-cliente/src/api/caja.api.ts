import { client } from './client';
import type {
  AbrirTurnoPayload,
  CajaResumenDto,
  CerrarTurnoPayload,
  CrearMovimientoCajaPayload,
  MovimientoCajaDto,
  TurnoCajaDto,
} from '../types/caja.types';

export function getResumenActivo(): Promise<CajaResumenDto> {
  return client.get<CajaResumenDto>('/caja/turnos/activo/resumen');
}

export function abrirTurno(payload: AbrirTurnoPayload): Promise<TurnoCajaDto> {
  return client.post<TurnoCajaDto>('/caja/turnos/abrir', payload);
}

export function crearMovimiento(turnoId: string, payload: CrearMovimientoCajaPayload): Promise<MovimientoCajaDto> {
  return client.post<MovimientoCajaDto>(`/caja/turnos/${turnoId}/movimientos`, payload);
}

export function cerrarTurno(turnoId: string, payload: CerrarTurnoPayload) {
  return client.post(`/caja/turnos/${turnoId}/cerrar`, payload);
}

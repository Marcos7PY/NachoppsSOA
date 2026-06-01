// api/reservas.api.ts - Llamadas al servicio de reservas

import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type {
  CrearReservaPayload,
  DisponibilidadResponse,
  ReservaDto,
  ReservaResponse,
} from '../types/reserva.types';

interface ReservasListResponse {
  reservas: ReservaDto[];
}

export async function getAll(): Promise<ReservaDto[]> {
  const response = await client.get<ReservasListResponse | ReservaDto[]>('/reservas');
  return unwrapArray<ReservaDto>(response, 'reservas');
}

export async function crear(payload: CrearReservaPayload): Promise<ReservaDto> {
  const response = await client.post<ReservaResponse | ReservaDto>('/reservas', payload);
  return unwrapEntity<ReservaDto>(response, 'reserva');
}

export async function confirmar(id: string): Promise<ReservaDto> {
  const response = await client.patch<ReservaResponse | ReservaDto>(`/reservas/${id}/confirmar`);
  return unwrapEntity<ReservaDto>(response, 'reserva');
}

export async function cancelar(id: string, motivo?: string): Promise<ReservaDto> {
  const response = await client.delete<ReservaResponse | ReservaDto>(`/reservas/${id}`, {
    body: motivo ? JSON.stringify({ motivo }) : undefined,
  });
  return unwrapEntity<ReservaDto>(response, 'reserva');
}

export function disponibilidad(fecha: string, hora: string): Promise<DisponibilidadResponse> {
  const query = new URLSearchParams({ fecha, hora }).toString();
  return client.get<DisponibilidadResponse>(`/reservas/disponibilidad?${query}`);
}

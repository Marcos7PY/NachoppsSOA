// api/mesas.api.ts — Llamadas al servicio de mesas

import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type { MesaDto, ActualizarEstadoMesaPayload } from '../types/mesa.types';

/** GET /mesas — Listar todas las mesas */
export async function getAll(): Promise<MesaDto[]> {
  const response = await client.get<MesaDto[] | { mesas: MesaDto[] }>('/mesas');
  return unwrapArray<MesaDto>(response, 'mesas');
}

/** GET /mesas/:id — Obtener mesa por ID */
export async function getById(id: string): Promise<MesaDto> {
  const response = await client.get<MesaDto | { mesa: MesaDto }>(`/mesas/${id}`);
  return unwrapEntity<MesaDto>(response, 'mesa');
}

/** PATCH /mesas/:id/estado — Cambiar estado de la mesa */
export async function cambiarEstado(
  id: string,
  payload: ActualizarEstadoMesaPayload,
): Promise<MesaDto> {
  const response = await client.patch<MesaDto | { mesa: MesaDto }>(`/mesas/${id}/estado`, payload);
  return unwrapEntity<MesaDto>(response, 'mesa');
}

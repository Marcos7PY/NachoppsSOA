import { client } from './client';
import { unwrapArray } from './response';
import type { NotificacionDto, NotificacionesResponse } from '../types/notificacion.types';

export async function getAll(): Promise<NotificacionDto[]> {
  const response = await client.get<NotificacionesResponse | NotificacionDto[]>('/notificaciones');
  return unwrapArray<NotificacionDto>(response, 'notificaciones');
}

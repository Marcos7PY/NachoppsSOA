// api/pedidos.api.ts — Llamadas al servicio de pedidos

import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type {
  PedidoDto,
  CrearPedidoPayload,
  ActualizarEstadoPedidoPayload,
} from '../types/pedido.types';

/** GET /pedidos — Listar pedidos (opcionalmente filtrados por mesaId) */
export async function getAll(mesaId?: string): Promise<PedidoDto[]> {
  const query = mesaId ? `?mesaId=${encodeURIComponent(mesaId)}` : '';
  const response = await client.get<PedidoDto[] | { pedidos: PedidoDto[] }>(`/pedidos${query}`);
  return unwrapArray<PedidoDto>(response, 'pedidos');
}

/** POST /pedidos — Crear un nuevo pedido */
export async function crear(payload: CrearPedidoPayload): Promise<PedidoDto> {
  const response = await client.post<PedidoDto | { pedido: PedidoDto }>('/pedidos', payload);
  return unwrapEntity<PedidoDto>(response, 'pedido');
}

/** PATCH /pedidos/:id/estado — Avanzar estado del pedido */
export async function avanzarEstado(
  id: string,
  payload: ActualizarEstadoPedidoPayload,
): Promise<PedidoDto> {
  const response = await client.patch<PedidoDto | { pedido: PedidoDto }>(
    `/pedidos/${id}/estado`,
    payload,
  );
  return unwrapEntity<PedidoDto>(response, 'pedido');
}

/** PATCH /pedidos/items/:itemId/estado — Avanzar estado de un ítem individual */
export function avanzarItem(itemId: string, payload: ActualizarEstadoPedidoPayload): Promise<void> {
  return client.patch<void>(`/pedidos/items/${itemId}/estado`, payload);
}

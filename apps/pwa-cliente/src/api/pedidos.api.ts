// api/pedidos.api.ts — Llamadas al servicio de pedidos

import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type {
  PedidoDto,
  PedidoListQuery,
  PedidoListResponse,
  CrearPedidoPayload,
  ActualizarEstadoPedidoPayload,
  ActualizarEstadoItemPayload,
} from '../types/pedido.types';

function buildListQuery(query: PedidoListQuery = {}): string {
  const params = new URLSearchParams();
  if (query.mesaId) params.set('mesaId', query.mesaId);
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.estado) params.set('estado', query.estado);
  if (query.updatedSince) params.set('updatedSince', query.updatedSince);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

/** GET /pedidos — Listar pedidos (opcionalmente filtrados por mesaId) */
export async function getPage(
  query: PedidoListQuery = {},
): Promise<PedidoListResponse> {
  const response = await client.get<
    PedidoListResponse | PedidoDto[] | { pedidos: PedidoDto[] }
  >(`/pedidos${buildListQuery(query)}`);

  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    Array.isArray(response.data)
  ) {
    return response;
  }

  return {
    data: unwrapArray<PedidoDto>(response, 'pedidos'),
    nextCursor: null,
  };
}

/** GET /pedidos — Compatibilidad para pantallas que aun consumen array plano */
export async function getAll(mesaId?: string): Promise<PedidoDto[]> {
  const response = await getPage({ mesaId, limit: 50 });
  return response.data;
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
export function avanzarItem(itemId: string, payload: ActualizarEstadoItemPayload): Promise<void> {
  return client.patch<void>(`/pedidos/items/${itemId}/estado`, payload);
}

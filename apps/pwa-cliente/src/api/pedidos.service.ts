import { apiClient } from './client';
import { 
  PedidoDto, 
  CrearPedidoCommand, 
  ActualizarEstadoPedidoCommand
} from '@org/contracts';

const BASE_URL = '/pedidos';

export const PedidosApi = {
  crearPedido: async (command: CrearPedidoCommand): Promise<PedidoDto> => {
    const response = await apiClient.post<{ message: string; pedido: PedidoDto }>(`${BASE_URL}`, command);
    return response.data.pedido;
  },

  obtenerPedidos: async (mesaId?: string): Promise<PedidoDto[]> => {
    const url = mesaId ? `${BASE_URL}?mesaId=${mesaId}` : `${BASE_URL}`;
    const response = await apiClient.get<{ pedidos: PedidoDto[] }>(url);
    return response.data.pedidos;
  },

  actualizarEstado: async (id: string, command: ActualizarEstadoPedidoCommand): Promise<PedidoDto> => {
    const response = await apiClient.patch<{ pedido: PedidoDto }>(`${BASE_URL}/${id}/estado`, command);
    return response.data.pedido;
  },

  actualizarEstadoItem: async (itemId: string, command: ActualizarEstadoPedidoCommand): Promise<PedidoDto> => {
    const response = await apiClient.patch<{ pedido: PedidoDto }>(`${BASE_URL}/items/${itemId}/estado`, command);
    return response.data.pedido;
  }
};

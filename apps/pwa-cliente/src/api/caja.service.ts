import { apiClient } from './client';
import { TransaccionDto, PagarPedidoCommand } from '@org/contracts';

const BASE_URL = '/caja';

export const CajaApi = {
  registrarPago: async (command: PagarPedidoCommand): Promise<{ message: string; transaccion: TransaccionDto }> => {
    const response = await apiClient.post(`${BASE_URL}/pagos`, command);
    return response.data;
  },

  obtenerTransacciones: async (): Promise<TransaccionDto[]> => {
    const response = await apiClient.get(`${BASE_URL}/transacciones`);
    return response.data;
  },
};

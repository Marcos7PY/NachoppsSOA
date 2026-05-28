import { apiClient } from './client';
import { ReservaDto, CrearReservaCommand } from '@org/contracts';

const BASE_URL = '/reservas';

export const ReservasApi = {
  obtenerReservas: async (): Promise<ReservaDto[]> => {
    const response = await apiClient.get<{ reservas: ReservaDto[] }>(BASE_URL);
    return response.data.reservas;
  },

  crearReserva: async (data: CrearReservaCommand): Promise<ReservaDto> => {
    const response = await apiClient.post<{ message: string; reserva: ReservaDto }>(BASE_URL, data);
    return response.data.reserva;
  },

  confirmarReserva: async (id: string): Promise<ReservaDto> => {
    const response = await apiClient.patch<{ message: string; reserva: ReservaDto }>(`${BASE_URL}/${id}/confirmar`);
    return response.data.reserva;
  },

  cancelarReserva: async (id: string, motivo?: string): Promise<ReservaDto> => {
    const response = await apiClient.delete<{ message: string; reserva: ReservaDto }>(`${BASE_URL}/${id}`, {
      data: { motivo },
    });
    return response.data.reserva;
  },
};

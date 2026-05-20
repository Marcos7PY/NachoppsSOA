import { apiClient } from './client';
import { MesaDto, CrearMesaCommand, ActualizarEstadoMesaCommand } from '@org/contracts';

const BASE_URL = '/mesas/mesas';

export const MesasApi = {
  obtenerMesas: async (): Promise<MesaDto[]> => {
    const response = await apiClient.get<{ mesas: MesaDto[] }>(`${BASE_URL}`);
    return response.data.mesas;
  },

  crearMesa: async (command: CrearMesaCommand): Promise<MesaDto> => {
    const response = await apiClient.post<{ message: string; mesa: MesaDto }>(`${BASE_URL}`, command);
    return response.data.mesa;
  },

  actualizarEstado: async (id: string, command: ActualizarEstadoMesaCommand): Promise<MesaDto> => {
    const response = await apiClient.patch<{ message: string; mesa: MesaDto }>(`${BASE_URL}/${id}/estado`, command);
    return response.data.mesa;
  },
};

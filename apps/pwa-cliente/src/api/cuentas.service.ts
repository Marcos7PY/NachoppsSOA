import { apiClient } from './client';
import { 
  CuentaDto, 
  TicketDto,
  AbrirCuentaCommand, 
  CerrarCuentaCommand, 
  DividirCuentaCommand 
} from '@org/contracts';

const BASE_URL = '/cuentas/cuentas'; // Kong enruta /cuentas/* a servicio-cuentas

export const CuentasApi = {
  abrirCuenta: async (command: AbrirCuentaCommand): Promise<{ message: string; cuenta: CuentaDto }> => {
    const response = await apiClient.post(BASE_URL, command);
    return response.data;
  },

  obtenerCuenta: async (id: string): Promise<CuentaDto> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  obtenerCuentaPorMesa: async (mesaId: string): Promise<CuentaDto> => {
    const response = await apiClient.get(`${BASE_URL}/mesa/${mesaId}`);
    return response.data;
  },

  cerrarCuenta: async (id: string, command: CerrarCuentaCommand): Promise<{ message: string; ticket: TicketDto }> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/cerrar`, command);
    return response.data;
  },

  dividirCuenta: async (id: string, command: DividirCuentaCommand): Promise<any> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/dividir`, command);
    return response.data;
  },
};

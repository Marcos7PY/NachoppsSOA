import { apiClient } from './client';

export interface DashboardMetricsDto {
  hoy: {
    total: number;
    pedidos: number;
    metodos: Record<string, number>;
  };
}

export const ReportesApi = {
  obtenerMetricas: async (): Promise<DashboardMetricsDto> => {
    const response = await apiClient.get('/reportes/dashboard');
    return response.data;
  },
};

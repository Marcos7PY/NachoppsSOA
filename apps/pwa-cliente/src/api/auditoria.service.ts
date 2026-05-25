import { apiClient } from './client';

export interface AuditoriaLogDto {
  id: string;
  accion: string;
  usuarioId: string;
  usuarioNombre: string;
  rol: string;
  servicio: string;
  ip?: string;
  createdAt: string;
}

export const auditoriaService = {
  listar: async (): Promise<AuditoriaLogDto[]> => {
    const { data } = await apiClient.get('/identidad/auditoria');
    return data;
  }
};

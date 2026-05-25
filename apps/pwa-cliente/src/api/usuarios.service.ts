import { apiClient } from './client';

export interface UsuarioDto {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export const usuariosService = {
  listar: async (): Promise<UsuarioDto[]> => {
    const { data } = await apiClient.get('/identidad/usuarios');
    return data;
  }
};

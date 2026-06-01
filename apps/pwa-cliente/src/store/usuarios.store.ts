import { create } from 'zustand';
import * as usuariosApi from '../api/usuarios.api';
import { mapUsuario, mapUsuarios } from '../mappers/usuario.mapper';
import type { CrearUsuarioPayload, RolUsuario, UsuarioVM } from '../types/usuario.types';

interface UsuariosState {
  usuarios: UsuarioVM[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
}

interface UsuariosActions {
  fetch: () => Promise<void>;
  crear: (payload: CrearUsuarioPayload) => Promise<void>;
  cambiarRol: (id: string, rol: RolUsuario) => Promise<void>;
  clearFeedback: () => void;
}

type UsuariosStore = UsuariosState & UsuariosActions;

export const useUsuariosStore = create<UsuariosStore>((set, get) => ({
  usuarios: [],
  loading: false,
  saving: false,
  error: null,
  success: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await usuariosApi.getAll();
      set({ usuarios: mapUsuarios(dtos), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar usuarios',
        loading: false,
      });
    }
  },

  crear: async (payload) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await usuariosApi.crear(payload);
      set({
        usuarios: [mapUsuario(dto), ...get().usuarios],
        saving: false,
        success: 'Usuario creado.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al crear usuario',
        saving: false,
      });
    }
  },

  cambiarRol: async (id, rol) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await usuariosApi.cambiarRol(id, { rol });
      const usuario = mapUsuario(dto);
      set({
        usuarios: get().usuarios.map((item) => (item.id === id ? usuario : item)),
        saving: false,
        success: 'Rol actualizado.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cambiar rol',
        saving: false,
      });
    }
  },

  clearFeedback: () => set({ error: null, success: null }),
}));

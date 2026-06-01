import { create } from 'zustand';
import * as usuariosApi from '../api/usuarios.api';
import { mapUsuario, mapUsuarios } from '../mappers/usuario.mapper';
import type { CrearUsuarioPayload, RolUsuario, UsuarioVM } from '../types/usuario.types';

interface UsuariosState {
  usuarios: UsuarioVM[];
  nextCursor: string | null;
  loading: boolean;
  loadingMore: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  lastQuery: { rol?: RolUsuario; search?: string } | null;
}

interface UsuariosActions {
  fetch: (query?: { rol?: RolUsuario; search?: string }) => Promise<void>;
  fetchMore: () => Promise<void>;
  crear: (payload: CrearUsuarioPayload) => Promise<void>;
  cambiarRol: (id: string, rol: RolUsuario) => Promise<void>;
  clearFeedback: () => void;
}

type UsuariosStore = UsuariosState & UsuariosActions;

export const useUsuariosStore = create<UsuariosStore>((set, get) => ({
  usuarios: [],
  nextCursor: null,
  loading: false,
  loadingMore: false,
  saving: false,
  error: null,
  success: null,
  lastQuery: null,

  fetch: async (query) => {
    set({ loading: true, error: null, lastQuery: query || null });
    try {
      const response = await usuariosApi.getPage({
        limit: 20,
        rol: query?.rol,
        search: query?.search,
      });
      set({
        usuarios: mapUsuarios(response.data),
        nextCursor: response.nextCursor,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar usuarios',
        loading: false,
      });
    }
  },

  fetchMore: async () => {
    const cursor = get().nextCursor;
    if (!cursor) return;

    set({ loadingMore: true, error: null });
    try {
      const lastQuery = get().lastQuery;
      const response = await usuariosApi.getPage({
        cursor,
        limit: 20,
        rol: lastQuery?.rol,
        search: lastQuery?.search,
      });
      set({
        usuarios: [...get().usuarios, ...mapUsuarios(response.data)],
        nextCursor: response.nextCursor,
        loadingMore: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar más usuarios',
        loadingMore: false,
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

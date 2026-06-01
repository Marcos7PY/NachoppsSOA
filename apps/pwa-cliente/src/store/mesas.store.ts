// store/mesas.store.ts — Zustand store de mesas

import { create } from 'zustand';
import type { MesaVM, EstadoMesa } from '../types/mesa.types';
import * as mesasApi from '../api/mesas.api';
import { mapMesa, mapMesas } from '../mappers/mesa.mapper';

interface MesasState {
  mesas: MesaVM[];
  loading: boolean;
  error: string | null;
}

interface MesasActions {
  fetch: () => Promise<void>;
  invalidate: () => Promise<void>;
  optimisticCambiarEstado: (id: string, estado: EstadoMesa) => Promise<void>;
}

type MesasStore = MesasState & MesasActions;

export const useMesasStore = create<MesasStore>((set, get) => ({
  mesas: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await mesasApi.getAll();
      set({ mesas: mapMesas(dtos), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar mesas',
        loading: false,
      });
    }
  },

  invalidate: async () => {
    // Refetch sin mostrar loading (actualización silenciosa)
    try {
      const dtos = await mesasApi.getAll();
      set({ mesas: mapMesas(dtos) });
    } catch {
      // Si falla el refetch silencioso, no mostrar error
    }
  },

  optimisticCambiarEstado: async (id: string, estado: EstadoMesa) => {
    const prevMesas = get().mesas;

    // Actualizar localmente de inmediato (optimistic)
    set({
      mesas: prevMesas.map((m) =>
        m.id === id ? { ...m, estado, estadoClass: estado.toLowerCase(), estadoLabel: estado } : m,
      ),
    });

    try {
      const dto = await mesasApi.cambiarEstado(id, { estado });
      // Reemplazar con el dato real del backend
      set({
        mesas: get().mesas.map((m) => (m.id === id ? mapMesa(dto) : m)),
      });
    } catch {
      // Revertir en caso de error
      set({ mesas: prevMesas });
    }
  },
}));

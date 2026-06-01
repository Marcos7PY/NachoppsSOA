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
  fetch: (force?: boolean) => Promise<void>;
  invalidate: () => Promise<void>;
  optimisticCambiarEstado: (id: string, estado: EstadoMesa) => Promise<void>;
}

type MesasStore = MesasState & MesasActions;

let lastFetchedAt = 0;
let inFlightFetch: Promise<void> | null = null;
const TTL = 5000;

export const useMesasStore = create<MesasStore>((set, get) => ({
  mesas: [],
  loading: false,
  error: null,

  fetch: async (force = false) => {
    if (!force && Date.now() - lastFetchedAt < TTL && get().mesas.length > 0) {
      return;
    }
    if (inFlightFetch) {
      return inFlightFetch;
    }

    set({ loading: true, error: null });
    inFlightFetch = (async () => {
      try {
        const dtos = await mesasApi.getAll();
        set({ mesas: mapMesas(dtos), loading: false });
        lastFetchedAt = Date.now();
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Error al cargar mesas',
          loading: false,
        });
      } finally {
        inFlightFetch = null;
      }
    })();

    return inFlightFetch;
  },

  invalidate: async () => {
    // Refetch silencioso forzando la cache
    lastFetchedAt = 0; // Invalidar tiempo de cache
    try {
      const dtos = await mesasApi.getAll();
      set({ mesas: mapMesas(dtos) });
      lastFetchedAt = Date.now();
    } catch {
      // Ignorar fallas silenciosas
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

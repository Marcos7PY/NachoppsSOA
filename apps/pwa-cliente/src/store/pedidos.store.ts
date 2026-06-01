// store/pedidos.store.ts — Zustand store de pedidos

import { create } from 'zustand';
import type { PedidoVM, EstadoPedido, CrearPedidoPayload } from '../types/pedido.types';
import * as pedidosApi from '../api/pedidos.api';
import { mapPedido, mapPedidos } from '../mappers/pedido.mapper';

interface PedidosState {
  pedidos: PedidoVM[];
  loading: boolean;
  error: string | null;
}

interface PedidosActions {
  fetch: (mesaId?: string) => Promise<void>;
  invalidate: () => Promise<void>;
  crear: (payload: CrearPedidoPayload) => Promise<void>;
  avanzarEstado: (id: string, estado: EstadoPedido) => Promise<void>;
  avanzarItem: (itemId: string, estado: EstadoPedido) => Promise<void>;
}

type PedidosStore = PedidosState & PedidosActions;

export const usePedidosStore = create<PedidosStore>((set, get) => ({
  pedidos: [],
  loading: false,
  error: null,

  fetch: async (mesaId?: string) => {
    set({ loading: true, error: null });
    try {
      const dtos = await pedidosApi.getAll(mesaId);
      set({ pedidos: mapPedidos(dtos), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar pedidos',
        loading: false,
      });
    }
  },

  invalidate: async () => {
    try {
      const dtos = await pedidosApi.getAll();
      set({ pedidos: mapPedidos(dtos) });
    } catch {
      // Fallo silencioso en invalidación
    }
  },

  crear: async (payload: CrearPedidoPayload) => {
    // Sin optimistic update — esperar confirmación del backend
    const dto = await pedidosApi.crear(payload);
    const nuevo = mapPedido(dto);
    set({ pedidos: [nuevo, ...get().pedidos] });
  },

  avanzarEstado: async (id: string, estado: EstadoPedido) => {
    const dto = await pedidosApi.avanzarEstado(id, { estado });
    const actualizado = mapPedido(dto);
    set({
      pedidos: get().pedidos.map((p) => (p.id === id ? actualizado : p)),
    });
  },

  avanzarItem: async (itemId: string, estado: EstadoPedido) => {
    await pedidosApi.avanzarItem(itemId, { estado });
    // Refetch para obtener el estado actualizado completo
    await get().invalidate();
  },
}));

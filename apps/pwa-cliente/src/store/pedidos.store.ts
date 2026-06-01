// store/pedidos.store.ts — Zustand store de pedidos

import { create } from 'zustand';
import type { PedidoVM, EstadoPedido, CrearPedidoPayload } from '../types/pedido.types';
import * as pedidosApi from '../api/pedidos.api';
import { mapPedido, mapPedidos } from '../mappers/pedido.mapper';

interface PedidosState {
  pedidos: PedidoVM[];
  nextCursor: string | null;
  currentMesaId?: string;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

interface PedidosActions {
  fetch: (mesaId?: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  invalidate: () => Promise<void>;
  crear: (payload: CrearPedidoPayload) => Promise<void>;
  avanzarEstado: (id: string, estado: EstadoPedido) => Promise<void>;
  avanzarItem: (itemId: string, estado: EstadoPedido) => Promise<void>;
}

type PedidosStore = PedidosState & PedidosActions;

export const usePedidosStore = create<PedidosStore>((set, get) => ({
  pedidos: [],
  nextCursor: null,
  currentMesaId: undefined,
  loading: false,
  loadingMore: false,
  error: null,

  fetch: async (mesaId?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pedidosApi.getPage({ mesaId, limit: 50 });
      set({
        pedidos: mapPedidos(response.data),
        nextCursor: response.nextCursor,
        currentMesaId: mesaId,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar pedidos',
        loading: false,
      });
    }
  },

  fetchMore: async () => {
    const cursor = get().nextCursor;
    if (!cursor) return;

    set({ loadingMore: true, error: null });
    try {
      const response = await pedidosApi.getPage({
        mesaId: get().currentMesaId,
        cursor,
        limit: 50,
      });
      set({
        pedidos: [...get().pedidos, ...mapPedidos(response.data)],
        nextCursor: response.nextCursor,
        loadingMore: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar más pedidos',
        loadingMore: false,
      });
    }
  },

  invalidate: async () => {
    try {
      const response = await pedidosApi.getPage({ limit: 50 });
      set({
        pedidos: mapPedidos(response.data),
        nextCursor: response.nextCursor,
      });
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

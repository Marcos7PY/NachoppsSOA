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
  fetch: (mesaId?: string, force?: boolean) => Promise<void>;
  fetchMore: () => Promise<void>;
  invalidate: () => Promise<void>;
  crear: (payload: CrearPedidoPayload) => Promise<void>;
  avanzarEstado: (id: string, estado: EstadoPedido) => Promise<void>;
  avanzarItem: (itemId: string, estado: EstadoPedido) => Promise<void>;
}

type PedidosStore = PedidosState & PedidosActions;

let lastFetchedAt = 0;
let lastMesaId: string | undefined = undefined;
let inFlightFetch: Promise<void> | null = null;
const TTL = 5000;

export const usePedidosStore = create<PedidosStore>((set, get) => ({
  pedidos: [],
  nextCursor: null,
  currentMesaId: undefined,
  loading: false,
  loadingMore: false,
  error: null,

  fetch: async (mesaId?: string, force = false) => {
    if (!force && Date.now() - lastFetchedAt < TTL && lastMesaId === mesaId && get().pedidos.length > 0) {
      return;
    }
    if (inFlightFetch) {
      return inFlightFetch;
    }

    set({ loading: true, error: null });
    inFlightFetch = (async () => {
      try {
        const response = await pedidosApi.getPage({ mesaId, limit: 50 });
        set({
          pedidos: mapPedidos(response.data),
          nextCursor: response.nextCursor,
          currentMesaId: mesaId,
          loading: false,
        });
        lastFetchedAt = Date.now();
        lastMesaId = mesaId;
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Error al cargar pedidos',
          loading: false,
        });
      } finally {
        inFlightFetch = null;
      }
    })();

    return inFlightFetch;
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
    lastFetchedAt = 0;
    const mesaId = get().currentMesaId;
    try {
      const response = await pedidosApi.getPage({ mesaId, limit: 50 });
      set({
        pedidos: mapPedidos(response.data),
        nextCursor: response.nextCursor,
      });
      lastFetchedAt = Date.now();
      lastMesaId = mesaId;
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

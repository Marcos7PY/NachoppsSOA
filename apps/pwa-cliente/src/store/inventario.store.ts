// store/inventario.store.ts - Zustand store de inventario

import { create } from 'zustand';
import * as inventarioApi from '../api/inventario.api';
import { mapProducto, mapProductos } from '../mappers/inventario.mapper';
import type { CategoriaDto, CrearProductoPayload, ProductoVM } from '../types/inventario.types';

interface InventarioState {
  categorias: CategoriaDto[];
  productos: ProductoVM[];
  nextCursor: string | null;
  currentCategoriaId?: string;
  loading: boolean;
  loadingMore: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
}

interface InventarioActions {
  fetch: (categoriaId?: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  crearProducto: (payload: CrearProductoPayload) => Promise<void>;
  reponerStock: (id: string, cantidad: number) => Promise<void>;
  clearFeedback: () => void;
}

type InventarioStore = InventarioState & InventarioActions;

export const useInventarioStore = create<InventarioStore>((set, get) => ({
  categorias: [],
  productos: [],
  nextCursor: null,
  currentCategoriaId: undefined,
  loading: false,
  loadingMore: false,
  saving: false,
  error: null,
  success: null,

  fetch: async (categoriaId) => {
    set({ loading: true, error: null });
    try {
      const [categorias, productos] = await Promise.all([
        inventarioApi.getCategorias(),
        inventarioApi.getProductosPage({ categoriaId, limit: 50 }),
      ]);
      set({
        categorias,
        productos: mapProductos(productos.data, categorias),
        nextCursor: productos.nextCursor,
        currentCategoriaId: categoriaId,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar inventario',
        loading: false,
      });
    }
  },

  fetchMore: async () => {
    const cursor = get().nextCursor;
    if (!cursor) return;

    set({ loadingMore: true, error: null });
    try {
      const response = await inventarioApi.getProductosPage({
        categoriaId: get().currentCategoriaId,
        cursor,
        limit: 50,
      });
      set({
        productos: [
          ...get().productos,
          ...mapProductos(response.data, get().categorias),
        ],
        nextCursor: response.nextCursor,
        loadingMore: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar más productos',
        loadingMore: false,
      });
    }
  },

  crearProducto: async (payload) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await inventarioApi.crearProducto(payload);
      set({
        productos: [mapProducto(dto, get().categorias), ...get().productos],
        saving: false,
        success: 'Producto creado.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al crear producto',
        saving: false,
      });
    }
  },

  reponerStock: async (id, cantidad) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await inventarioApi.reponerStock(id, cantidad);
      const producto = mapProducto(dto, get().categorias);
      set({
        productos: get().productos.map((item) => (item.id === id ? producto : item)),
        saving: false,
        success: 'Stock actualizado.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al reponer stock',
        saving: false,
      });
    }
  },

  clearFeedback: () => set({ error: null, success: null }),
}));

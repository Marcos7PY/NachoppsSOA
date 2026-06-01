// store/inventario.store.ts - Zustand store de inventario

import { create } from 'zustand';
import * as inventarioApi from '../api/inventario.api';
import { mapProducto, mapProductos } from '../mappers/inventario.mapper';
import type { CategoriaDto, CrearProductoPayload, ProductoVM } from '../types/inventario.types';

interface InventarioState {
  categorias: CategoriaDto[];
  productos: ProductoVM[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
}

interface InventarioActions {
  fetch: (categoriaId?: string) => Promise<void>;
  crearProducto: (payload: CrearProductoPayload) => Promise<void>;
  reponerStock: (id: string, cantidad: number) => Promise<void>;
  clearFeedback: () => void;
}

type InventarioStore = InventarioState & InventarioActions;

export const useInventarioStore = create<InventarioStore>((set, get) => ({
  categorias: [],
  productos: [],
  loading: false,
  saving: false,
  error: null,
  success: null,

  fetch: async (categoriaId) => {
    set({ loading: true, error: null });
    try {
      const [categorias, productos] = await Promise.all([
        inventarioApi.getCategorias(),
        inventarioApi.getProductos(categoriaId),
      ]);
      set({ categorias, productos: mapProductos(productos, categorias), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar inventario',
        loading: false,
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

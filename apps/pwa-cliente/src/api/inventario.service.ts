import { apiClient } from './client';
import { 
  CategoriaDto, 
  ProductoDto, 
  CrearCategoriaCommand, 
  CrearProductoCommand 
} from '@org/contracts';

const BASE_URL = '/inventario';

export const InventarioApi = {
  // --- CATEGORÍAS ---

  obtenerCategorias: async (): Promise<CategoriaDto[]> => {
    const response = await apiClient.get<{ categorias: CategoriaDto[] }>(`${BASE_URL}/categorias`);
    return response.data.categorias;
  },

  crearCategoria: async (data: CrearCategoriaCommand): Promise<CategoriaDto> => {
    const response = await apiClient.post<{ message: string; categoria: CategoriaDto }>(`${BASE_URL}/categorias`, data);
    return response.data.categoria;
  },

  // --- PRODUCTOS ---

  obtenerProductos: async (categoriaId?: string): Promise<ProductoDto[]> => {
    const url = categoriaId ? `${BASE_URL}/productos?categoriaId=${categoriaId}` : `${BASE_URL}/productos`;
    const response = await apiClient.get<{ productos: ProductoDto[] }>(url);
    return response.data.productos;
  },

  crearProducto: async (data: CrearProductoCommand): Promise<ProductoDto> => {
    const response = await apiClient.post<{ message: string; producto: ProductoDto }>(`${BASE_URL}/productos`, data);
    return response.data.producto;
  },

  actualizarStock: async (id: string, stock: number): Promise<ProductoDto> => {
    const response = await apiClient.patch<{ message: string; producto: ProductoDto }>(`${BASE_URL}/productos/${id}/stock`, { stock });
    return response.data.producto;
  },
};

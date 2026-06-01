import { useQuery, useMutation } from '@tanstack/react-query';
import * as inventarioApi from '../../api/inventario.api';
import { mapProductos } from '../../mappers/inventario.mapper';
import { queryClient } from '../../api/queryClient';
import type { CrearProductoPayload } from '../../types/inventario.types';

export const INVENTARIO_CATEGORIAS_KEY = ['inventario-categorias'];
export const INVENTARIO_PRODUCTOS_KEY = ['inventario-productos'];

export function useInventarioQuery(categoriaId?: string) {
  const categoriasQuery = useQuery({
    queryKey: INVENTARIO_CATEGORIAS_KEY,
    queryFn: async () => {
      return inventarioApi.getCategorias();
    },
    staleTime: 1000 * 60 * 60, // 1 hora para las categorías (casi nunca cambian)
  });

  const productosQuery = useQuery({
    queryKey: [...INVENTARIO_PRODUCTOS_KEY, categoriaId].filter(Boolean),
    queryFn: async () => {
      const response = await inventarioApi.getProductosPage({ categoriaId, limit: 50 });
      return {
        productos: response.data,
        nextCursor: response.nextCursor,
      };
    },
    enabled: !!categoriasQuery.data, // Esperar a que carguen las categorías para mapear
  });

  const mutationCrear = useMutation({
    mutationFn: async (payload: CrearProductoPayload) => {
      return inventarioApi.crearProducto(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTOS_KEY });
    },
  });

  const mutationReponer = useMutation({
    mutationFn: async ({ id, cantidad }: { id: string; cantidad: number }) => {
      return inventarioApi.reponerStock(id, cantidad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTARIO_PRODUCTOS_KEY });
    },
  });

  const loading = categoriasQuery.isLoading || productosQuery.isLoading;
  const saving = mutationCrear.isPending || mutationReponer.isPending;
  const error = categoriasQuery.error || productosQuery.error || mutationCrear.error || mutationReponer.error;

  return {
    categorias: categoriasQuery.data ?? [],
    productos: productosQuery.data && categoriasQuery.data
      ? mapProductos(productosQuery.data.productos, categoriasQuery.data)
      : [],
    nextCursor: productosQuery.data?.nextCursor ?? null,
    loading,
    loadingMore: productosQuery.isFetching && !productosQuery.isLoading,
    saving,
    error: error ? (error as Error).message : null,
    success: mutationCrear.isSuccess ? 'Producto creado.' : mutationReponer.isSuccess ? 'Stock actualizado.' : null,
    
    // Métodos de compatibilidad
    fetch: async () => {
      await categoriasQuery.refetch();
      await productosQuery.refetch();
    },
    fetchMore: async () => {
      // Stub para paginación si es necesario en el futuro (InfiniteQuery)
      await productosQuery.refetch();
    },
    crearProducto: async (payload: CrearProductoPayload) => {
      return mutationCrear.mutateAsync(payload);
    },
    reponerStock: async (id: string, cantidad: number) => {
      return mutationReponer.mutateAsync({ id, cantidad });
    },
    clearFeedback: () => {
      mutationCrear.reset();
      mutationReponer.reset();
    },
  };
}

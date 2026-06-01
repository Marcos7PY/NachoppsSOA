import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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

  const productosQuery = useInfiniteQuery({
    queryKey: [...INVENTARIO_PRODUCTOS_KEY, categoriaId].filter(Boolean),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await inventarioApi.getProductosPage({
        categoriaId,
        cursor: pageParam,
        limit: 50,
      });
      return {
        productos: response.data,
        nextCursor: response.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!categoriasQuery.data, // Esperar a que carguen las categorías para mapear
  });

  const mutationCrear = useMutation({
    mutationFn: async (payload: CrearProductoPayload) => {
      return inventarioApi.crearProducto(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVENTARIO_PRODUCTOS_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  const mutationReponer = useMutation({
    mutationFn: async ({ id, cantidad }: { id: string; cantidad: number }) => {
      return inventarioApi.reponerStock(id, cantidad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVENTARIO_PRODUCTOS_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  const loading = categoriasQuery.isLoading || productosQuery.isLoading;
  const saving = mutationCrear.isPending || mutationReponer.isPending;
  const error = categoriasQuery.error || productosQuery.error || mutationCrear.error || mutationReponer.error;

  return {
    categorias: categoriasQuery.data ?? [],
    productos: productosQuery.data && categoriasQuery.data
      ? mapProductos(
          productosQuery.data.pages.flatMap((page) => page.productos),
          categoriasQuery.data,
        )
      : [],
    nextCursor: productosQuery.hasNextPage
      ? productosQuery.data?.pages.at(-1)?.nextCursor ?? null
      : null,
    loading,
    loadingMore: productosQuery.isFetchingNextPage,
    saving,
    error: error ? (error as Error).message : null,
    success: mutationCrear.isSuccess ? 'Producto creado.' : mutationReponer.isSuccess ? 'Stock actualizado.' : null,
    
    fetch: async () => {
      await categoriasQuery.refetch();
      await productosQuery.refetch();
    },
    fetchMore: async () => {
      if (productosQuery.hasNextPage) await productosQuery.fetchNextPage();
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

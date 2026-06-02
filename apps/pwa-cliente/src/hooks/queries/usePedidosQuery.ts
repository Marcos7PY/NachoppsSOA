import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import * as pedidosApi from '../../api/pedidos.api';
import { mapPedido, mapPedidos } from '../../mappers/pedido.mapper';
import { queryClient } from '../../api/queryClient';
import type { CrearPedidoPayload, EstadoPedido } from '../../types/pedido.types';

export const PEDIDOS_QUERY_KEY = ['pedidos'];

export function usePedidosQuery(mesaId?: string) {
  const query = useInfiniteQuery({
    queryKey: [...PEDIDOS_QUERY_KEY, mesaId].filter(Boolean),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await pedidosApi.getPage({
        cursor: pageParam,
        mesaId,
        limit: 50,
      });
      return {
        pedidos: mapPedidos(response.data),
        nextCursor: response.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const mutationCrear = useMutation({
    mutationFn: async (payload: CrearPedidoPayload) => {
      const dto = await pedidosApi.crear(payload);
      return mapPedido(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEDIDOS_QUERY_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  const mutationAvanzarEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoPedido }) => {
      const dto = await pedidosApi.avanzarEstado(id, { estado });
      return mapPedido(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEDIDOS_QUERY_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  const mutationAvanzarItem = useMutation({
    mutationFn: async ({ itemId, estado }: { itemId: string; estado: EstadoPedido }) => {
      await pedidosApi.avanzarItem(itemId, { estado });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEDIDOS_QUERY_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  return {
    pedidos: query.data?.pages.flatMap((page) => page.pedidos) ?? [],
    nextCursor: query.hasNextPage
      ? query.data?.pages.at(-1)?.nextCursor ?? null
      : null,
    currentMesaId: mesaId,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    error: query.isError ? (query.error as Error).message : null,
    fetch: query.refetch,
    fetchMore: async () => {
      if (query.hasNextPage) await query.fetchNextPage();
    },
    crear: async (payload: CrearPedidoPayload) => {
      return mutationCrear.mutateAsync(payload);
    },
    avanzarEstado: async (id: string, estado: EstadoPedido) => {
      return mutationAvanzarEstado.mutateAsync({ id, estado });
    },
    avanzarItem: async (itemId: string, estado: EstadoPedido) => {
      return mutationAvanzarItem.mutateAsync({ itemId, estado });
    },
  };
}

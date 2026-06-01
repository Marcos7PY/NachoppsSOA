import { useQuery, useMutation } from '@tanstack/react-query';
import * as pedidosApi from '../../api/pedidos.api';
import { mapPedido, mapPedidos } from '../../mappers/pedido.mapper';
import { queryClient } from '../../api/queryClient';
import type { CrearPedidoPayload, EstadoPedido } from '../../types/pedido.types';

export const PEDIDOS_QUERY_KEY = ['pedidos'];

export function usePedidosQuery(mesaId?: string) {
  const query = useQuery({
    queryKey: [...PEDIDOS_QUERY_KEY, mesaId].filter(Boolean),
    queryFn: async () => {
      const response = await pedidosApi.getPage({ mesaId, limit: 50 });
      return {
        pedidos: mapPedidos(response.data),
        nextCursor: response.nextCursor,
      };
    },
  });

  const mutationCrear = useMutation({
    mutationFn: async (payload: CrearPedidoPayload) => {
      const dto = await pedidosApi.crear(payload);
      return mapPedido(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
    },
  });

  const mutationAvanzarEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoPedido }) => {
      const dto = await pedidosApi.avanzarEstado(id, { estado });
      return mapPedido(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
    },
  });

  const mutationAvanzarItem = useMutation({
    mutationFn: async ({ itemId, estado }: { itemId: string; estado: EstadoPedido }) => {
      await pedidosApi.avanzarItem(itemId, { estado });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
    },
  });

  return {
    pedidos: query.data?.pedidos ?? [],
    nextCursor: query.data?.nextCursor ?? null,
    currentMesaId: mesaId,
    loading: query.isLoading,
    loadingMore: false,
    error: query.isError ? (query.error as Error).message : null,
    fetch: query.refetch,
    fetchMore: async () => {
      // TODO: Implementar InfiniteQuery de React Query si se requiere paginación real.
      // Por ahora mantenemos la compatibilidad de firma.
      await query.refetch();
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

import { useEffect } from 'react';
import { useInfiniteQuery, useMutation, type InfiniteData } from '@tanstack/react-query';
import * as pedidosApi from '../../api/pedidos.api';
import { mapPedido, mapPedidos, estadoClassOf, estadoLabelOf } from '../../mappers/pedido.mapper';
import { queryClient } from '../../api/queryClient';
import { ESTADOS_PRODUCCION, derivarEstadoProduccion } from '../../domain/pedido.flow';
import type {
  CrearPedidoPayload,
  EstadoPedido,
  EstadoItem,
  PedidoVM,
} from '../../types/pedido.types';

export const PEDIDOS_QUERY_KEY = ['pedidos'];

interface PedidosPage {
  pedidos: PedidoVM[];
  nextCursor: string | null;
}
type PedidosData = InfiniteData<PedidosPage>;

interface UsePedidosOptions {
  /** Carga progresivamente todas las páginas (KDS necesita todos los tickets activos). */
  autoLoadAll?: boolean;
}

/** Aplica `fn` al pedido `id` en toda la caché infinita. */
function mapPedidoEnCache(
  old: PedidosData | undefined,
  predicate: (p: PedidoVM) => boolean,
  fn: (p: PedidoVM) => PedidoVM,
): PedidosData | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      pedidos: page.pedidos.map((p) => (predicate(p) ? fn(p) : p)),
    })),
  };
}

export function usePedidosQuery(mesaId?: string, options: UsePedidosOptions = {}) {
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

  // KDS: agota la paginación para tener todos los tickets activos en pantalla.
  const { autoLoadAll } = options;
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  useEffect(() => {
    if (autoLoadAll && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [autoLoadAll, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const mutationCrear = useMutation({
    mutationFn: async (payload: CrearPedidoPayload) => {
      const dto = await pedidosApi.crear(payload);
      return mapPedido(dto);
    },
    // El id del nuevo pedido es desconocido: invalidamos para traerlo.
    // (El socket también emitirá pedido.creado.)
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEDIDOS_QUERY_KEY,
        exact: false,
        refetchType: 'active',
      });
    },
  });

  // Avance comercial del pedido (LISTO → ENTREGADO, etc.). Optimista; el socket
  // confirma. No invalidamos en onSuccess para evitar refetch redundante.
  const mutationAvanzarEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoPedido }) => {
      const dto = await pedidosApi.avanzarEstado(id, { estado });
      return mapPedido(dto);
    },
    onMutate: async ({ id, estado }) => {
      await queryClient.cancelQueries({ queryKey: PEDIDOS_QUERY_KEY });
      const prev = queryClient.getQueriesData<PedidosData>({ queryKey: PEDIDOS_QUERY_KEY });
      queryClient.setQueriesData<PedidosData>({ queryKey: PEDIDOS_QUERY_KEY }, (old) =>
        mapPedidoEnCache(old, (p) => p.id === id, (p) => ({
          ...p,
          estado,
          estadoClass: estadoClassOf(estado),
          estadoLabel: estadoLabelOf(estado),
        })),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
  });

  // Avance/retroceso de un ítem (cocina). Optimista: parchea el ítem y deriva el
  // estado de producción del pedido igual que el backend.
  const mutationAvanzarItem = useMutation({
    mutationFn: async ({ itemId, estado }: { itemId: string; estado: EstadoItem }) => {
      await pedidosApi.avanzarItem(itemId, { estado });
    },
    onMutate: async ({ itemId, estado }) => {
      await queryClient.cancelQueries({ queryKey: PEDIDOS_QUERY_KEY });
      const prev = queryClient.getQueriesData<PedidosData>({ queryKey: PEDIDOS_QUERY_KEY });
      queryClient.setQueriesData<PedidosData>({ queryKey: PEDIDOS_QUERY_KEY }, (old) =>
        mapPedidoEnCache(
          old,
          (p) => p.items.some((it) => it.id === itemId),
          (p) => {
            const items = p.items.map((it) =>
              it.id === itemId
                ? { ...it, estado, estadoClass: estadoClassOf(estado), estadoLabel: estadoLabelOf(estado) }
                : it,
            );
            // Solo derivamos si el pedido sigue en fase de producción.
            const derivado = ESTADOS_PRODUCCION.has(p.estado)
              ? derivarEstadoProduccion(items.map((it) => it.estado))
              : null;
            const estadoPedido = derivado ?? p.estado;
            return {
              ...p,
              items,
              estado: estadoPedido,
              estadoClass: estadoClassOf(estadoPedido),
              estadoLabel: estadoLabelOf(estadoPedido),
            };
          },
        ),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]) => queryClient.setQueryData(key, data));
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
    avanzarItem: async (itemId: string, estado: EstadoItem) => {
      return mutationAvanzarItem.mutateAsync({ itemId, estado });
    },
  };
}

import { useQuery, useMutation } from '@tanstack/react-query';
import * as mesasApi from '../../api/mesas.api';
import { mapMesas, mapMesa } from '../../mappers/mesa.mapper';
import { queryClient } from '../../api/queryClient';
import type { EstadoMesa, MesaVM } from '../../types/mesa.types';

export const MESAS_QUERY_KEY = ['mesas'];

export function useMesasQuery() {
  const query = useQuery({
    queryKey: MESAS_QUERY_KEY,
    queryFn: async () => {
      const dtos = await mesasApi.getAll();
      return mapMesas(dtos);
    },
  });

  const mutationEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoMesa }) => {
      const dto = await mesasApi.cambiarEstado(id, { estado });
      return mapMesa(dto);
    },
    onMutate: async ({ id, estado }) => {
      await queryClient.cancelQueries({ queryKey: MESAS_QUERY_KEY });
      const previousMesas = queryClient.getQueryData<MesaVM[]>(MESAS_QUERY_KEY);

      if (previousMesas) {
        queryClient.setQueryData<MesaVM[]>(MESAS_QUERY_KEY, (old) =>
          old?.map((m) =>
            m.id === id ? { ...m, estado, estadoClass: estado.toLowerCase(), estadoLabel: estado } : m
          )
        );
      }

      return { previousMesas };
    },
    onError: (err, newMesa, context) => {
      if (context?.previousMesas) {
        queryClient.setQueryData(MESAS_QUERY_KEY, context.previousMesas);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MESAS_QUERY_KEY });
    },
  });

  return {
    mesas: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    fetch: query.refetch,
    optimisticCambiarEstado: async (id: string, estado: EstadoMesa) => {
      return mutationEstado.mutateAsync({ id, estado });
    },
  };
}

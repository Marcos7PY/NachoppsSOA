// services/socket.service.ts - Singleton Socket.IO para actualizaciones en tiempo real

import { io, type Socket } from 'socket.io-client';
import { queryClient } from '../api/queryClient';
import { MESAS_QUERY_KEY } from '../hooks/queries/useMesasQuery';
import { PEDIDOS_QUERY_KEY } from '../hooks/queries/usePedidosQuery';
import { CUENTAS_QUERY_KEY } from '../hooks/queries/useCuentasQuery';
import { CAJA_QUERY_KEY } from '../hooks/queries/useCajaQuery';
import { pushSocketNotification } from '../hooks/queries/useNotificacionesQuery';

interface NotificacionEvento {
  pattern?: string;
  data?: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const WS_PATH = import.meta.env.VITE_WS_PATH ?? '/notificaciones/socket.io';

let socket: Socket | null = null;
const pendingInvalidations = new Set<string>();
let invalidationTimer: ReturnType<typeof setTimeout> | null = null;
const INVALIDATION_DEBOUNCE_MS = 300;

type StoreKey = 'pedidos' | 'mesas' | 'cuentas' | 'caja';

function storesForPattern(pattern?: string) {
  const stores = new Set<StoreKey>();

  if (!pattern || pattern.startsWith('pedido.')) {
    stores.add('pedidos');
    stores.add('mesas');
    stores.add('cuentas');
  }

  if (pattern?.startsWith('cuenta.') || pattern?.startsWith('pago.')) {
    stores.add('mesas');
    stores.add('pedidos');
    stores.add('cuentas');
    stores.add('caja');
  }

  if (pattern?.startsWith('mesa.')) {
    stores.add('mesas');
    stores.add('pedidos');
  }

  return stores;
}

function invalidateStores(stores: Set<StoreKey>) {
  if (stores.has('pedidos')) {
    queryClient.invalidateQueries({
      queryKey: PEDIDOS_QUERY_KEY,
      exact: false,
      refetchType: 'active',
    });
  }
  if (stores.has('mesas')) {
    queryClient.invalidateQueries({
      queryKey: MESAS_QUERY_KEY,
      exact: false,
      refetchType: 'active',
    });
  }
  if (stores.has('cuentas')) {
    queryClient.invalidateQueries({
      queryKey: CUENTAS_QUERY_KEY,
      exact: false,
      refetchType: 'active',
    });
  }
  if (stores.has('caja')) {
    queryClient.invalidateQueries({
      queryKey: CAJA_QUERY_KEY,
      exact: false,
      refetchType: 'active',
    });
  }
}

function scheduleInvalidate(pattern?: string) {
  pendingInvalidations.add(pattern ?? '*');

  if (invalidationTimer) return;

  invalidationTimer = setTimeout(() => {
    const patterns = [...pendingInvalidations];
    pendingInvalidations.clear();
    invalidationTimer = null;

    const stores = new Set<StoreKey>();
    patterns.forEach((key) => {
      storesForPattern(key === '*' ? undefined : key).forEach((store) =>
        stores.add(store),
      );
    });
    invalidateStores(stores);
  }, INVALIDATION_DEBOUNCE_MS);
}

export const socketService = {
  connect() {
    if (socket?.connected) return;

    if (!socket) {
      socket = io(BASE_URL, {
        path: WS_PATH,
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
      });

      socket.on('pedidoUpdate', (evento: NotificacionEvento) => {
        pushSocketNotification(evento);
        scheduleInvalidate(evento?.pattern);
      });
    }

    socket.connect();
  },

  disconnect() {
    socket?.disconnect();
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};

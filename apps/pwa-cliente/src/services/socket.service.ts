// services/socket.service.ts - Singleton Socket.IO para actualizaciones en tiempo real

import { io, type Socket } from 'socket.io-client';
import { useCuentasStore } from '../store/cuentas.store';
import { useMesasStore } from '../store/mesas.store';
import { useNotificacionesStore } from '../store/notificaciones.store';
import { usePedidosStore } from '../store/pedidos.store';

interface NotificacionEvento {
  pattern?: string;
  data?: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const WS_PATH = import.meta.env.VITE_WS_PATH ?? '/notificaciones/socket.io';

let socket: Socket | null = null;
const pendingInvalidations = new Set<string>();
let invalidationTimer: ReturnType<typeof setTimeout> | null = null;

type StoreKey = 'pedidos' | 'mesas' | 'cuentas';

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
  }

  if (pattern?.startsWith('mesa.')) {
    stores.add('mesas');
    stores.add('pedidos');
  }

  return stores;
}

function invalidateStores(stores: Set<StoreKey>) {
  const targets = new Set<Promise<void>>();

  if (stores.has('pedidos'))
    targets.add(usePedidosStore.getState().invalidate());
  if (stores.has('mesas')) targets.add(useMesasStore.getState().invalidate());
  if (stores.has('cuentas'))
    targets.add(useCuentasStore.getState().invalidate());

  void Promise.allSettled([...targets]);
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
  }, 300);
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
        useNotificacionesStore.getState().pushFromSocket(evento);
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

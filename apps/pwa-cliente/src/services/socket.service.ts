// services/socket.service.ts - Singleton Socket.IO para actualizaciones en tiempo real

import { io, type Socket } from 'socket.io-client';
import { useCuentasStore } from '../store/cuentas.store';
import { useMesasStore } from '../store/mesas.store';
import { useNotificacionesStore } from '../store/notificaciones.store';
import { usePedidosStore } from '../store/pedidos.store';
import { getAuthToken } from '../api/client';

interface NotificacionEvento {
  pattern?: string;
  data?: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const WS_PATH = import.meta.env.VITE_WS_PATH ?? '/notificaciones/socket.io';

let socket: Socket | null = null;

function invalidateForPattern(pattern?: string) {
  const targets = new Set<Promise<void>>();

  if (!pattern || pattern.startsWith('pedido.')) {
    targets.add(usePedidosStore.getState().invalidate());
    targets.add(useMesasStore.getState().invalidate());
    targets.add(useCuentasStore.getState().invalidate());
  }

  if (pattern?.startsWith('cuenta.') || pattern?.startsWith('pago.')) {
    targets.add(useMesasStore.getState().invalidate());
    targets.add(usePedidosStore.getState().invalidate());
    targets.add(useCuentasStore.getState().invalidate());
  }

  if (pattern?.startsWith('mesa.')) {
    targets.add(useMesasStore.getState().invalidate());
    targets.add(usePedidosStore.getState().invalidate());
  }

  void Promise.allSettled([...targets]);
}

export const socketService = {
  connect() {
    if (socket?.connected) return;

    if (!socket) {
      socket = io(BASE_URL, {
        path: WS_PATH,
        withCredentials: true,
        transports: ['websocket', 'polling'],
        query: getAuthToken() ? { jwt: getAuthToken() } : undefined,
        auth: getAuthToken() ? { token: getAuthToken() } : undefined,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
      });

      socket.on('pedidoUpdate', (evento: NotificacionEvento) => {
        useNotificacionesStore.getState().pushFromSocket(evento);
        invalidateForPattern(evento?.pattern);
      });
    }

    socket.auth = getAuthToken() ? { token: getAuthToken() } : {};
    socket.io.opts.query = getAuthToken() ? { jwt: getAuthToken() } : {};
    socket.connect();
  },

  disconnect() {
    socket?.disconnect();
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};

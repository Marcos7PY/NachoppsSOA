import { create } from 'zustand';
import * as notificacionesApi from '../api/notificaciones.api';
import { mapNotificaciones, mapSocketNotification } from '../mappers/notificacion.mapper';
import type { NotificacionVM, SocketNotificationPayload } from '../types/notificacion.types';

interface NotificacionesState {
  notificaciones: NotificacionVM[];
  loading: boolean;
  error: string | null;
}

interface NotificacionesActions {
  fetch: () => Promise<void>;
  pushFromSocket: (evento: SocketNotificationPayload) => void;
  markAllRead: () => void;
}

type NotificacionesStore = NotificacionesState & NotificacionesActions;

export const useNotificacionesStore = create<NotificacionesStore>((set, get) => ({
  notificaciones: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await notificacionesApi.getAll();
      set({ notificaciones: mapNotificaciones(dtos), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Notificaciones pendientes de backend',
        loading: false,
      });
    }
  },

  pushFromSocket: (evento) => {
    const notificacion = mapSocketNotification(evento);
    set({ notificaciones: [notificacion, ...get().notificaciones].slice(0, 20) });
  },

  markAllRead: () => {
    set({
      notificaciones: get().notificaciones.map((item) => ({ ...item, unread: false })),
    });
  },
}));

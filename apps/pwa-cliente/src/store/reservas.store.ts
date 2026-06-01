// store/reservas.store.ts - Zustand store de reservas

import { create } from 'zustand';
import * as reservasApi from '../api/reservas.api';
import { mapReserva, mapReservas } from '../mappers/reserva.mapper';
import type { CrearReservaPayload, DisponibilidadResponse, ReservaVM } from '../types/reserva.types';

interface ReservasState {
  reservas: ReservaVM[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  disponibilidad: DisponibilidadResponse | null;
}

interface ReservasActions {
  fetch: () => Promise<void>;
  crear: (payload: CrearReservaPayload) => Promise<void>;
  confirmar: (id: string) => Promise<void>;
  cancelar: (id: string, motivo?: string) => Promise<void>;
  consultarDisponibilidad: (fecha: string, hora: string) => Promise<void>;
  clearFeedback: () => void;
}

type ReservasStore = ReservasState & ReservasActions;

export const useReservasStore = create<ReservasStore>((set, get) => ({
  reservas: [],
  loading: false,
  saving: false,
  error: null,
  success: null,
  disponibilidad: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const dtos = await reservasApi.getAll();
      set({ reservas: mapReservas(dtos), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar reservas',
        loading: false,
      });
    }
  },

  crear: async (payload) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await reservasApi.crear(payload);
      set({
        reservas: [mapReserva(dto), ...get().reservas],
        saving: false,
        success: 'Reserva creada.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al crear reserva',
        saving: false,
      });
    }
  },

  confirmar: async (id) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await reservasApi.confirmar(id);
      const reserva = mapReserva(dto);
      set({
        reservas: get().reservas.map((item) => (item.id === id ? reserva : item)),
        saving: false,
        success: 'Reserva confirmada.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al confirmar reserva',
        saving: false,
      });
    }
  },

  cancelar: async (id, motivo) => {
    set({ saving: true, error: null, success: null });
    try {
      const dto = await reservasApi.cancelar(id, motivo);
      const reserva = mapReserva(dto);
      set({
        reservas: get().reservas.map((item) => (item.id === id ? reserva : item)),
        saving: false,
        success: 'Reserva cancelada.',
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cancelar reserva',
        saving: false,
      });
    }
  },

  consultarDisponibilidad: async (fecha, hora) => {
    if (!fecha || !hora) {
      set({ disponibilidad: null });
      return;
    }

    try {
      const response = await reservasApi.disponibilidad(fecha, hora);
      set({ disponibilidad: response });
    } catch {
      set({ disponibilidad: null });
    }
  },

  clearFeedback: () => set({ error: null, success: null }),
}));

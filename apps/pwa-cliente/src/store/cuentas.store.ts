// store/cuentas.store.ts - Zustand store de cuentas/caja

import { create } from 'zustand';
import * as cuentasApi from '../api/cuentas.api';
import { mapCuenta } from '../mappers/cuenta.mapper';
import { useMesasStore } from './mesas.store';
import { usePedidosStore } from './pedidos.store';
import type {
  CuentaVM,
  DividirCuentaPayload,
  DividirCuentaResponse,
  RegistrarPagoPayload,
  TicketDto,
} from '../types/cuenta.types';

interface CuentasState {
  cuentaActiva: CuentaVM | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  ticket: TicketDto | null;
  division: DividirCuentaResponse | null;
}

interface CuentasActions {
  cargar: (mesaId: string) => Promise<void>;
  abrir: (mesaId: string) => Promise<void>;
  registrarPago: (payload: RegistrarPagoPayload) => Promise<void>;
  cerrar: (descuento?: number) => Promise<void>;
  dividir: (payload: DividirCuentaPayload) => Promise<void>;
  invalidate: () => Promise<void>;
  clearFeedback: () => void;
}

type CuentasStore = CuentasState & CuentasActions;

export const useCuentasStore = create<CuentasStore>((set, get) => ({
  cuentaActiva: null,
  loading: false,
  error: null,
  success: null,
  ticket: null,
  division: null,

  cargar: async (mesaId: string) => {
    set({ loading: true, error: null, success: null, ticket: null, division: null });
    try {
      const dto = await cuentasApi.getByMesa(mesaId);
      set({ cuentaActiva: mapCuenta(dto), loading: false });
    } catch (err) {
      set({
        cuentaActiva: null,
        error: err instanceof Error ? err.message : 'Error al cargar cuenta',
        loading: false,
      });
    }
  },

  abrir: async (mesaId: string) => {
    set({ loading: true, error: null, success: null, ticket: null, division: null });
    try {
      const dto = await cuentasApi.abrir(mesaId);
      set({ cuentaActiva: mapCuenta(dto), loading: false, success: 'Cuenta abierta.' });
      await useMesasStore.getState().invalidate();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al abrir cuenta',
        loading: false,
      });
    }
  },

  registrarPago: async (payload: RegistrarPagoPayload) => {
    set({ loading: true, error: null, success: null });
    try {
      await cuentasApi.registrarPago(payload);
      set({ loading: false, success: 'Pago registrado correctamente.' });
      await Promise.all([
        get().invalidate(),
        useMesasStore.getState().invalidate(),
        usePedidosStore.getState().invalidate(),
      ]);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al registrar pago',
        loading: false,
      });
    }
  },

  cerrar: async (descuento = 0) => {
    const cuenta = get().cuentaActiva;
    if (!cuenta) return;

    set({ loading: true, error: null, success: null });
    try {
      const response = await cuentasApi.cerrar(cuenta.id, { descuento });
      set({
        cuentaActiva: null,
        loading: false,
        success: response.message,
        ticket: response.ticket,
        division: null,
      });
      await Promise.all([
        useMesasStore.getState().invalidate(),
        usePedidosStore.getState().invalidate(),
      ]);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cerrar cuenta',
        loading: false,
      });
    }
  },

  dividir: async (payload: DividirCuentaPayload) => {
    const cuenta = get().cuentaActiva;
    if (!cuenta) return;

    set({ loading: true, error: null, success: null, division: null });
    try {
      const division = await cuentasApi.dividir(cuenta.id, payload);
      set({ loading: false, division, success: 'División calculada.' });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al dividir cuenta',
        loading: false,
      });
    }
  },

  invalidate: async () => {
    const cuenta = get().cuentaActiva;
    if (!cuenta) return;

    try {
      const dto = await cuentasApi.getById(cuenta.id);
      set({ cuentaActiva: mapCuenta(dto) });
    } catch {
      set({ cuentaActiva: null });
    }
  },

  clearFeedback: () => set({ error: null, success: null }),
}));

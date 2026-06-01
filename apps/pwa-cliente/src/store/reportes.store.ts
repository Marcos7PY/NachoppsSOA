// store/reportes.store.ts - Zustand store de reportes

import { create } from 'zustand';
import * as reportesApi from '../api/reportes.api';
import { mapResumen } from '../mappers/reporte.mapper';
import type { ResumenVM } from '../types/reporte.types';

interface ReportesState {
  resumen: ResumenVM | null;
  loading: boolean;
  error: string | null;
}

interface ReportesActions {
  fetch: () => Promise<void>;
}

type ReportesStore = ReportesState & ReportesActions;

export const useReportesStore = create<ReportesStore>((set) => ({
  resumen: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const dto = await reportesApi.getResumen();
      set({ resumen: mapResumen(dto), loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar reportes',
        loading: false,
      });
    }
  },
}));

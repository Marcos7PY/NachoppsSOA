// types/reporte.types.ts - DTOs y ViewModels de reportes

export interface ResumenDto {
  fecha: string;
  totalVentas: number;
  ingresosTotales: number;
  ventasPorHora?: Array<{ hora: string; total: number; ingresos?: number }>;
  topProductos?: Array<{ productoId?: string; nombre: string; cantidad: number; ingresos?: number }>;
}

export interface ResumenVM {
  fecha: string;
  fechaLabel: string;
  totalVentas: number;
  ingresosTotales: number;
  ingresosLabel: string;
  ticketPromedio: number | null;
  ticketPromedioLabel: string;
  ventasPorHora: Array<{ hora: string; total: number; ingresos?: number }>;
  topProductos: Array<{ productoId?: string; nombre: string; cantidad: number; ingresos?: number }>;
}

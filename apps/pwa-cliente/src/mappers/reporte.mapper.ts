// mappers/reporte.mapper.ts - ResumenDto -> ResumenVM

import type { ResumenDto, ResumenVM } from '../types/reporte.types';

function formatMoney(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value);
}

export function mapResumen(dto: ResumenDto): ResumenVM {
  const fecha = new Date(dto.fecha);
  const ticketPromedio = dto.totalVentas > 0 ? dto.ingresosTotales / dto.totalVentas : null;

  return {
    fecha: dto.fecha,
    fechaLabel: Number.isNaN(fecha.getTime())
      ? dto.fecha
      : fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }),
    totalVentas: dto.totalVentas,
    ingresosTotales: dto.ingresosTotales,
    ingresosLabel: formatMoney(dto.ingresosTotales),
    ticketPromedio,
    ticketPromedioLabel: ticketPromedio === null ? 'Sin ventas' : formatMoney(ticketPromedio),
    ventasPorHora: dto.ventasPorHora ?? [],
    topProductos: dto.topProductos ?? [],
  };
}

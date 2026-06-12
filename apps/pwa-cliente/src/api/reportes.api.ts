// api/reportes.api.ts - Llamadas al servicio de reportes

import { client } from './client';
import type { ResumenDto } from '../types/reporte.types';

export function getResumen(): Promise<ResumenDto> {
  return client.get<ResumenDto>('/reportes/resumen');
}

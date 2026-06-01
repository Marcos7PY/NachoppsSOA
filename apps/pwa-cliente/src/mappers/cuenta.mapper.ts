// mappers/cuenta.mapper.ts - CuentaDto -> CuentaVM

import type { CuentaDto, CuentaEstado, CuentaVM } from '../types/cuenta.types';
import { mapPedidos } from './pedido.mapper';

const ESTADO_LABEL: Record<CuentaEstado, string> = {
  ABIERTA: 'Abierta',
  CERRADA: 'Cerrada',
  PAGADA: 'Pagada',
};

export function mapCuenta(dto: CuentaDto): CuentaVM {
  const pedidos = mapPedidos(Array.isArray(dto.pedidos) ? dto.pedidos : []);

  return {
    id: dto.id,
    mesaId: dto.mesaId,
    pedidos,
    total: dto.total,
    estado: dto.estado,
    estadoLabel: ESTADO_LABEL[dto.estado] ?? dto.estado,
    ticket: dto.ticket ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    cantidadPedidos: pedidos.length,
    cantidadItems: pedidos.reduce((sum, pedido) => sum + pedido.cantidadItems, 0),
  };
}

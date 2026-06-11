import { describe, it, expect } from 'vitest';
import { toPedidoDto } from './pedidos.mapper';

const BASE_DATE = new Date('2026-06-01T10:00:00.000Z');

describe('toPedidoDto', () => {
  it('mapea un pedido sin items', () => {
    const pedido = {
      id: 'ped-1',
      mesaId: 'mesa-1',
      estado: 'PENDIENTE',
      createdAt: BASE_DATE,
    };

    const dto = toPedidoDto(pedido as any);

    expect(dto.id).toBe('ped-1');
    expect(dto.mesaId).toBe('mesa-1');
    expect(dto.estado).toBe('PENDIENTE');
    expect(dto.items).toEqual([]);
    expect(dto.total).toBe(0);
    expect(dto.comensales).toBe(1);
    expect(dto.createdAt).toBe(BASE_DATE.toISOString());
  });

  it('mapea un pedido con items', () => {
    const pedido = {
      id: 'ped-2',
      mesaId: 'mesa-2',
      estado: 'EN_PREPARACION',
      createdAt: BASE_DATE,
      items: [
        { id: 'item-1', productoId: 'prod-1', cantidad: 2, estado: 'PENDIENTE' },
        { id: 'item-2', productoId: 'prod-2', cantidad: 1, estado: 'LISTO' },
      ],
    };

    const dto = toPedidoDto(pedido as any);

    expect(dto.items).toHaveLength(2);
    expect(dto.items[0]).toEqual({ id: 'item-1', productoId: 'prod-1', cantidad: 2, estado: 'PENDIENTE' });
    expect(dto.items[1]).toEqual({ id: 'item-2', productoId: 'prod-2', cantidad: 1, estado: 'LISTO' });
  });
});

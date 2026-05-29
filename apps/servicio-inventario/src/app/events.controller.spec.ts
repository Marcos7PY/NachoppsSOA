import { describe, expect, it, vi } from 'vitest';
import { EventsController } from './events.controller';

describe('EventsController - Inventario', () => {
  it('pedido.creado recibe payload directo y reduce stock desde pedido', async () => {
    const appService = { procesarPedidoCreado: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as any);
    const pedido = { id: 'pedido-1', mesaId: 'mesa-1', items: [], total: 0, estado: 'PENDIENTE', createdAt: new Date().toISOString() };

    await controller.handlePedidoCreado({ pedido } as any);

    expect(appService.procesarPedidoCreado).toHaveBeenCalledWith(pedido);
  });
});

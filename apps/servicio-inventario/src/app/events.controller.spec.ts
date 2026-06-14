import { describe, expect, it, vi } from 'vitest';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { PedidoCreadoPayload } from '@org/contracts';

describe('EventsController - Inventario', () => {
  it('pedido.creado recibe payload directo y reduce stock desde pedido', async () => {
    const appService = { procesarPedidoCreado: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as unknown as AppService);
    const pedido = { id: 'pedido-1', mesaId: 'mesa-1', items: [], total: 0, estado: 'PENDIENTE', createdAt: new Date().toISOString() };

    await controller.handlePedidoCreado({ pedido } as unknown as PedidoCreadoPayload);

    expect(appService.procesarPedidoCreado).toHaveBeenCalledWith(pedido);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { AppController } from './app.controller';

describe('AppController - Notificaciones', () => {
  it('pedido.creado emite el payload directo', async () => {
    const gateway = { emitPedidoUpdate: vi.fn() };
    const controller = new AppController({ getData: vi.fn() } as any, gateway as any);
    const payload = {
      pedido: { id: 'pedido-1', mesaId: 'mesa-1', items: [], total: 0, estado: 'PENDIENTE', createdAt: new Date().toISOString() },
    };

    await controller.handlePedidoCreado(payload as any, {} as any);

    expect(gateway.emitPedidoUpdate).toHaveBeenCalledWith({ pattern: 'pedido.creado', data: payload });
  });
});

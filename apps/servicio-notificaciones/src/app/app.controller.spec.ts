import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { RoutingKeys } from '@org/contracts';
import { AppController } from './app.controller';

describe('AppController - Notificaciones', () => {
  it('pedido.creado persiste y emite el payload enriquecido', async () => {
    const gateway = { emitPedidoUpdate: vi.fn() };
    const appService = {
      registrarNotificacion: vi.fn().mockResolvedValue({
        id: 'notif-1',
        contenido: 'Nuevo pedido',
      }),
    };
    const controller = new AppController(appService as any, gateway as any);
    const payload = {
      pedido: {
        id: 'pedido-1',
        mesaId: 'mesa-1',
        items: [],
        total: 0,
        estado: 'PENDIENTE',
        createdAt: new Date().toISOString(),
      },
    };

    await controller.handlePedidoCreado(payload as any, {} as any);

    expect(appService.registrarNotificacion).toHaveBeenCalledWith(
      RoutingKeys.PedidoCreado,
      payload,
    );
    expect(gateway.emitPedidoUpdate).toHaveBeenCalledWith({
      pattern: RoutingKeys.PedidoCreado,
      data: {
        ...payload,
        notificacionId: 'notif-1',
        contenido: 'Nuevo pedido',
      },
    });
  });
});

import { describe, expect, it, vi } from 'vitest';
import { AppController } from './app.controller';

describe('AppController - Pedidos', () => {
  it('P-62: crea pedido con token S2S sin email/nombre usando fallback legible', async () => {
    const appService = {
      crearPedido: vi.fn().mockResolvedValue({ message: 'ok', pedido: { id: 'p-1' } }),
    };
    const controller = new AppController(appService as any);
    const body = { mesaId: 'mesa-1', items: [] } as any;

    await expect(controller.crearPedido(body, 'svc-pedidos', null, null)).resolves.toEqual({
      message: 'ok',
      pedido: { id: 'p-1' },
    });
    expect(appService.crearPedido).toHaveBeenCalledWith(body, {
      id: 'svc-pedidos',
      nombre: 'svc-pedidos',
    });
  });

  it('propaga errores al procesar pago para permitir retry/DLQ', async () => {
    const error = new Error('fallo transitorio');
    const appService = {
      procesarPagoRecibido: vi.fn().mockRejectedValue(error),
    };
    const controller = new AppController(appService as any);

    await expect(
      controller.procesarPago({
        transaccionId: 'tx-001',
        cuentaId: 'c-001',
        mesaId: 'm-001',
        monto: 50,
        metodo: 'EFECTIVO',
      }),
    ).rejects.toThrow(error);
  });
});

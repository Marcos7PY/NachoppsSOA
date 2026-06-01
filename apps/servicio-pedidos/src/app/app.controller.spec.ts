import { describe, expect, it, vi } from 'vitest';
import { AppController } from './app.controller';

describe('AppController - Pedidos', () => {
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

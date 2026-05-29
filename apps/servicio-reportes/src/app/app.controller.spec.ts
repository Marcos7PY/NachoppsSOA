import { describe, expect, it, vi } from 'vitest';
import { AppController } from './app.controller';

describe('AppController - Reportes', () => {
  it('cuenta.cerrada recibe payload directo y registra venta', async () => {
    const appService = {
      obtenerResumenDiario: vi.fn(),
      registrarVenta: vi.fn().mockResolvedValue(undefined),
    };
    const controller = new AppController(appService as any);
    const payload = { cuentaId: 'cuenta-1', mesaId: 'mesa-1', total: 100 };

    await controller.handleCuentaCerrada(payload);

    expect(appService.registrarVenta).toHaveBeenCalledWith(payload);
  });
});

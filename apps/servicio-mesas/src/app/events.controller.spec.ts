import { describe, expect, it, vi } from 'vitest';
import { EventsController } from './events.controller';

describe('EventsController - Mesas', () => {
  it('cuenta.abierta recibe payload directo y ocupa la mesa', async () => {
    const appService = { actualizarEstado: vi.fn().mockResolvedValue({}) };
    const controller = new EventsController(appService as any);

    await controller.handleCuentaAbierta({ cuentaId: 'cuenta-1', mesaId: 'mesa-1' });

    expect(appService.actualizarEstado).toHaveBeenCalledWith('mesa-1', {
      estado: 'OCUPADA',
      cuentaAsociada: 'cuenta-1',
    });
  });

  it('cuenta.cerrada recibe payload directo y libera la mesa', async () => {
    const appService = { actualizarEstado: vi.fn().mockResolvedValue({}) };
    const controller = new EventsController(appService as any);

    await controller.handleCuentaCerrada({ cuentaId: 'cuenta-1', mesaId: 'mesa-1', total: 90 });

    expect(appService.actualizarEstado).toHaveBeenCalledWith('mesa-1', {
      estado: 'LIBRE',
      cuentaAsociada: null,
    });
  });
});

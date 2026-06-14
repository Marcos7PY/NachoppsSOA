/* eslint-disable */
import { describe, expect, it, vi } from 'vitest';
import { EventsController } from './events.controller';

describe('EventsController - Caja', () => {
  it('cuenta.abierta recibe payload directo y sincroniza caja', async () => {
    const prisma = {
      cuentaAbierta: {
        upsert: vi.fn().mockResolvedValue({}),
      },
    };
    const controller = new EventsController(prisma as any);

    await controller.handleCuentaAbierta({ cuentaId: 'cuenta-1', mesaId: 'mesa-1' });

    expect(prisma.cuentaAbierta.upsert).toHaveBeenCalledWith({
      where: { cuentaId: 'cuenta-1' },
      create: { cuentaId: 'cuenta-1', mesaId: 'mesa-1', total: 0, estado: 'ABIERTA' },
      update: { estado: 'ABIERTA', mesaId: 'mesa-1' },
    });
  });

  it('cuenta.cerrada recibe payload directo y sincroniza caja', async () => {
    const prisma = {
      cuentaAbierta: {
        update: vi.fn().mockResolvedValue({}),
      },
    };
    const controller = new EventsController(prisma as any);

    await controller.handleCuentaCerrada({ cuentaId: 'cuenta-1', mesaId: 'mesa-1', total: 120 });

    expect(prisma.cuentaAbierta.update).toHaveBeenCalledWith({
      where: { cuentaId: 'cuenta-1' },
      data: { estado: 'CERRADA', total: 120 },
    });
  });
});

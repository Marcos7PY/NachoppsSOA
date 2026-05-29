import { describe, expect, it, vi } from 'vitest';
import { EventsController } from './events.controller';

describe('EventsController - Pedidos', () => {
  it('mesa.creada recibe payload directo y sincroniza mesa local', async () => {
    const appService = { upsertMesaLocal: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as any);
    const mesa = { id: 'mesa-1', numero: 1, capacidad: 4, ubicacion: 'Salon', estado: 'LIBRE' };

    await controller.handleMesaCreada({ mesa } as any);

    expect(appService.upsertMesaLocal).toHaveBeenCalledWith(mesa);
  });

  it('mesa.actualizada recibe payload directo y sincroniza mesa local', async () => {
    const appService = { upsertMesaLocal: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as any);
    const mesa = { id: 'mesa-2', numero: 2, capacidad: 4, ubicacion: 'Terraza', estado: 'OCUPADA' };

    await controller.handleMesaActualizada({ mesa } as any);

    expect(appService.upsertMesaLocal).toHaveBeenCalledWith(mesa);
  });
});

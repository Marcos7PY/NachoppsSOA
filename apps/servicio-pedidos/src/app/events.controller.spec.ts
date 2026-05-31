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

  it('producto.creado delega en procesamiento idempotente de producto creado', async () => {
    const appService = { procesarProductoCreado: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as any);
    const payload = { eventId: 'evt-1', id: 'prod-1', nombre: 'Nachos', precio: 10, stockActual: 5, disponible: true };

    await controller.handleProductoCreado(payload as any);

    expect(appService.procesarProductoCreado).toHaveBeenCalledWith(payload);
  });

  it('producto.actualizado delega en procesamiento idempotente de producto actualizado', async () => {
    const appService = { procesarProductoActualizado: vi.fn().mockResolvedValue(undefined) };
    const controller = new EventsController(appService as any);
    const payload = {
      eventId: 'evt-2',
      id: 'prod-1',
      nombre: 'Nachos',
      precio: 10,
      stockActual: 8,
      stockDelta: 3,
      stockSyncMode: 'REPOSICION',
      disponible: true,
    };

    await controller.handleProductoActualizado(payload as any);

    expect(appService.procesarProductoActualizado).toHaveBeenCalledWith(payload);
  });
});

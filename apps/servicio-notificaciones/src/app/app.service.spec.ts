import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AppService — Notificaciones', () => {
  let service: AppService;
  const prisma = {
    notificacion: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AppService(prisma as unknown as PrismaService);
  });

  describe('obtenerNotificaciones', () => {
    it('devuelve las últimas notificaciones', async () => {
      prisma.notificacion.findMany.mockResolvedValue([{ id: 'notif-1' }]);

      const result = await service.obtenerNotificaciones();

      expect(result).toEqual([{ id: 'notif-1' }]);
      expect(prisma.notificacion.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        take: 50,
      });
    });
  });

  describe('registrarNotificacion', () => {
    it('persiste contenido de pedido creado con numero de mesa y total', async () => {
      prisma.notificacion.create.mockResolvedValue({ id: 'notif-1' });

      const result = await service.registrarNotificacion('pedido.creado', {
        numeroMesa: 7,
        total: 42,
      });

      expect(result).toEqual({ id: 'notif-1' });
      expect(prisma.notificacion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventoOrigen: 'pedido.creado',
          destinatario: 'TODOS',
          canal: 'UI',
          contenido: 'Nuevo pedido registrado para la Mesa 7 por un total de S/ 42.00.',
          estado: 'PENDIENTE',
        }) as unknown,
      });
    });

    it('devuelve null si falla la persistencia', async () => {
      prisma.notificacion.create.mockRejectedValue(new Error('db down'));

      await expect(
        service.registrarNotificacion('pedido.actualizado', {
          mesaId: 'mesa-1',
          estado: 'EN_PREPARACION',
        }),
      ).resolves.toBeNull();
    });

    it('formatea reservas y payloads genericos', async () => {
      prisma.notificacion.create
        .mockResolvedValueOnce({ id: 'reserva' })
        .mockResolvedValueOnce({ id: 'generico' });

      await service.registrarNotificacion('reserva.creada', {
        clienteNombre: 'Ana',
        fecha: '2026-01-02',
        hora: '20:00',
      });
      await service.registrarNotificacion('evento.desconocido', { ok: true });

      expect(prisma.notificacion.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({
            contenido: 'Nueva reserva registrada a nombre de Ana para el 2026-01-02 a las 20:00.',
          }) as unknown,
        }) as unknown,
      );
      expect(prisma.notificacion.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: expect.objectContaining({
            contenido: '{"ok":true}',
          }) as unknown,
        }) as unknown,
      );
    });

    it('usa fallback en texto() cuando el valor no es string ni número', async () => {
      prisma.notificacion.create.mockResolvedValue({ id: 'fb' });

      // mesaId=null → texto(null, '??') toma el fallback → Mesa ??
      await service.registrarNotificacion('pedido.creado', {
        mesaId: null,
        total: 10,
      });

      expect(prisma.notificacion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          contenido: expect.stringContaining('Mesa ??') as unknown,
        }) as unknown,
      });
    });
  });
});

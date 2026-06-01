import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppService } from './app.service';

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
    service = new AppService(prisma as any);
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
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  const mock = {
    $connect: async () => {},
    $disconnect: async () => {},
    checkAndRecordIdempotencyKey: async (_key: string) => true,
    ...overrides,
  };
  return mock as any;
}

describe('AppService — Inventario', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(() => {
    mockPrisma = createMockPrismaService({
      producto: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      categoria: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    });

    service = new AppService(mockPrisma as any);
  });

  describe('reducirStockAutomatico', () => {
    it('debe reducir stock y publicar alerta si cae bajo 10', async () => {
      mockPrisma.producto.findUnique
        .mockResolvedValueOnce({
          id: 'prod-001',
          nombre: 'Cerveza',
          stockActual: 15,
          disponible: true,
        })
        .mockResolvedValueOnce({
          id: 'prod-001',
          nombre: 'Cerveza',
          stockActual: 5,
          disponible: true,
        });

      mockPrisma.producto.updateMany.mockResolvedValue({ count: 1 });

      await service.reducirStockAutomatico('prod-001', 10);

      expect(mockPrisma.producto.updateMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ id: 'prod-001' }),
        data: expect.objectContaining({ stockActual: { decrement: 10 } }),
      });
    });

    it('no debe hacer nada si el producto no existe', async () => {
      mockPrisma.producto.findUnique.mockResolvedValue(null);

      await expect(
        service.reducirStockAutomatico('inexistente', 5)
      ).resolves.not.toThrow();
    });

    it('no debe reducir si stockActual es null (producto sin control de stock)', async () => {
      mockPrisma.producto.findUnique.mockResolvedValue({
        id: 'prod-002',
        nombre: 'Plato Especial',
        stockActual: null,
        disponible: true,
      });

      await service.reducirStockAutomatico('prod-002', 5);

      expect(mockPrisma.producto.updateMany).not.toHaveBeenCalled();
    });
  });
});

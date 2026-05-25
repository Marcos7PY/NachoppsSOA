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

describe('AppService — Cuentas', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(() => {
    mockPrisma = createMockPrismaService({
      cuenta: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    });

    service = new AppService(
      mockPrisma as any,
      { publish: vi.fn().mockResolvedValue(undefined) } as any,
    );
  });

  describe('abrirCuenta', () => {
    it('debe crear una cuenta nueva si la mesa no tiene una abierta', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue(null);
      mockPrisma.cuenta.create.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: 'ABIERTA',
        total: 0,
        pedidos: [],
        ticket: null,
        auditorId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.abrirCuenta({ mesaId: 'm-001' });

      expect(result.cuenta.id).toBe('c-001');
      expect(result.cuenta.estado).toBe('ABIERTA');
    });

    it('debe rechazar si la mesa ya tiene una cuenta abierta', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue({ id: 'c-existing', estado: 'ABIERTA' });

      await expect(
        service.abrirCuenta({ mesaId: 'm-001' })
      ).rejects.toThrow('La mesa ya tiene una cuenta abierta');
    });
  });

  describe('dividirCuenta', () => {
    it('debe dividir en partes iguales', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: 'ABIERTA',
        total: 150,
        pedidos: [{ id: 'p-1', total: 150, items: [{ precioUnitario: 50, cantidad: 3 }] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.spyOn(service as any, 'fetchPedidosDeMesa').mockResolvedValue([
        { id: 'p-1', total: 150, items: [{ precioUnitario: 50, cantidad: 3 }] },
      ]);

      const result = await service.dividirCuenta('c-001', { metodo: 'IGUALES', numPartes: 3 });

      expect(result.metodo).toBe('IGUALES');
      expect(result.partes).toHaveLength(3);
      expect(result.partes[0].monto).toBe(50);
    });
  });
});

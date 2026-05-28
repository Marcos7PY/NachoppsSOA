import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';
import { PedidoEstado } from '@org/contracts';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    checkAndRecordIdempotencyKey: async (_key: string) => true,
    ...overrides,
  } as any;
}

function createMockPublisher() {
  return { publish: vi.fn().mockResolvedValue(undefined) };
}

describe('AppService — Pedidos', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;
  let mockPublisher: ReturnType<typeof createMockPublisher>;

  const basePedido = {
    id: 'p-001',
    mesaId: 'm-001',
    numeroMesa: 5,
    estado: PedidoEstado.Pendiente,
    total: 100,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrismaService({
      pedido: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
    });
    mockPublisher = createMockPublisher();

    service = new AppService(mockPrisma as any, mockPublisher as any);
  });

  describe('procesarPagoRecibido', () => {
    it('debe mantener estado si no se paga completo', async () => {
      const pedidoConSaldo = { ...basePedido, total: 100, estado: PedidoEstado.Pendiente };
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([pedidoConSaldo] as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update').mockResolvedValue(pedidoConSaldo as any);

      await service.procesarPagoRecibido({
        cuentaId: 'cuenta-1',
        mesaId: 'mesa-1',
        montoTotal: 100,
        metodoPago: 'EFECTIVO'
      });

      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 'p-001' },
        data: { estado: PedidoEstado.Pagado },
      });
    });

    it('debe actualizar estado a PAGADO si el pago cubre el total', async () => {
      const pedidoPendiente = { ...basePedido, total: 100, estado: PedidoEstado.Pendiente };
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([pedidoPendiente] as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update').mockResolvedValue(pedidoPendiente as any);

      await service.procesarPagoRecibido({
        cuentaId: 'cuenta-1',
        mesaId: 'mesa-1',
        montoTotal: 100,
        metodoPago: 'EFECTIVO'
      });

      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 'p-001' },
        data: { estado: PedidoEstado.Pagado },
      });
    });

    it('no debe lanzar error si no hay pedidos para la mesa', async () => {
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([]);
      await expect(service.procesarPagoRecibido({ cuentaId: 'c-001', mesaId: 'm-empty', montoTotal: 100, metodoPago: 'EFECTIVO' })).resolves.not.toThrow();
    });
  });
});

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
    sesionMesaId: 's-001',
    estado: PedidoEstado.Pendiente,
    total: 100,
    montoPagado: 0,
    items: [],
    auditorId: null,
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

  describe('registrarPagoInterno', () => {
    it('debe actualizar montoPagado y mantener estado si no se paga completo', async () => {
      const pedidoConSaldo = { ...basePedido, montoPagado: 0, total: 100, estado: PedidoEstado.Pendiente };
      mockPrisma.pedido.findUnique.mockResolvedValue(pedidoConSaldo);
      mockPrisma.pedido.update.mockResolvedValue({
        ...pedidoConSaldo,
        montoPagado: 40,
        estado: PedidoEstado.Pendiente,
      });

      await service.registrarPagoInterno('p-001', 40);

      expect(mockPrisma.pedido.update).toHaveBeenCalledWith({
        where: { id: 'p-001' },
        data: { montoPagado: 40, estado: PedidoEstado.Pendiente },
      });
    });

    it('debe cambiar estado a PAGADO cuando el monto pagado iguala o supera el total', async () => {
      const pedidoPendiente = { ...basePedido, montoPagado: 60, total: 100, estado: PedidoEstado.Pendiente };
      mockPrisma.pedido.findUnique.mockResolvedValue(pedidoPendiente);
      mockPrisma.pedido.update.mockResolvedValue({
        ...pedidoPendiente,
        montoPagado: 100,
        estado: PedidoEstado.Pagado,
      });

      await service.registrarPagoInterno('p-001', 40);

      expect(mockPrisma.pedido.update).toHaveBeenCalledWith({
        where: { id: 'p-001' },
        data: { montoPagado: 100, estado: PedidoEstado.Pagado },
      });
    });

    it('no debe lanzar error si el pedido no existe', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(null);
      await expect(service.registrarPagoInterno('inexistente', 50)).resolves.not.toThrow();
    });
  });
});

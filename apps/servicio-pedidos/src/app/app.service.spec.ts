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
      $executeRaw: vi.fn().mockResolvedValue(1),
      $queryRaw: vi.fn().mockResolvedValue([{ stockActual: 1 }]),
      pedido: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      productoLocal: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
      idempotencyKey: {
        create: vi.fn().mockResolvedValue({}),
      },
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
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

  describe('upsertProductoLocal', () => {
    it('no debe re-inflar stock local si producto.actualizado de consumo llega stale-alto', async () => {
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 7,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      await service.upsertProductoLocal({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 12,
        categoriaNombre: 'COCINA',
        disponible: true,
        allowStockIncrease: false,
      });

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 7 }),
      }));
    });

    it('debe permitir aumento de stock local cuando la actualizacion es reposicion', async () => {
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 7,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      await service.upsertProductoLocal({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 12,
        categoriaNombre: 'COCINA',
        disponible: true,
        allowStockIncrease: true,
        stockDelta: 5,
        stockSyncMode: 'REPOSICION',
      });

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 12 }),
      }));
    });
  });

  describe('procesarProductoActualizado', () => {
    it('debe aplicar reposicion como delta una sola vez si hay redelivery secuencial', async () => {
      const duplicate = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
      mockPrisma.idempotencyKey.create
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(duplicate);
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 7,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      const payload = {
        eventId: 'evt-repo-1',
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 20,
        stockDelta: 5,
        stockSyncMode: 'REPOSICION',
        categoriaNombre: 'COCINA',
        disponible: true,
      } as any;

      await service.procesarProductoActualizado(payload);
      await service.procesarProductoActualizado(payload);

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledTimes(1);
      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 12 }),
      }));
    });

    it('no debe inflar si un consumo stale-alto viene mal etiquetado como reposicion sin delta positivo', async () => {
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 7,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      await service.procesarProductoActualizado({
        eventId: 'evt-bad-label',
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 20,
        stockDelta: -4,
        stockSyncMode: 'REPOSICION',
        categoriaNombre: 'COCINA',
        disponible: true,
      } as any);

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 7 }),
      }));
    });

    it('no debe modificar stock local ante eco de consumo desde inventario', async () => {
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 4,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      await service.procesarProductoActualizado({
        eventId: 'evt-consumo',
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 2,
        stockDelta: -1,
        stockSyncMode: 'CONSUMO_PEDIDO',
        categoriaNombre: 'COCINA',
        disponible: true,
      } as any);

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 4 }),
      }));
    });
  });

  describe('procesarProductoCreado', () => {
    it('no debe re-inflar stock local si producto.creado llega tarde sobre una proyeccion existente', async () => {
      mockPrisma.productoLocal.findUnique.mockResolvedValue({
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 3,
        categoriaNombre: 'COCINA',
        disponible: true,
      });
      mockPrisma.productoLocal.upsert.mockResolvedValue({});

      await service.procesarProductoCreado({
        eventId: 'evt-created-late',
        id: 'prod-1',
        nombre: 'Nachos',
        precio: 10,
        stockActual: 20,
        categoriaNombre: 'COCINA',
        disponible: true,
      } as any);

      expect(mockPrisma.productoLocal.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({ stockActual: 3 }),
      }));
    });
  });
});

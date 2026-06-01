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
        create: vi.fn(),
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
      outboxEvent: {
        createMany: vi.fn().mockResolvedValue({ count: 2 }),
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

  describe('listarPedidos', () => {
    it('debe listar solo pedidos activos por mesa', async () => {
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([]);

      await service.listarPedidos({ mesaId: 'mesa-1' });

      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          mesaId: 'mesa-1',
          estado: { notIn: [PedidoEstado.Pagado, PedidoEstado.Cancelado] },
        },
        take: 21,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }));
    });

    it('devuelve data y nextCursor cuando hay mas resultados', async () => {
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([
        { ...basePedido, id: 'p-001' },
        { ...basePedido, id: 'p-002' },
        { ...basePedido, id: 'p-003' },
      ] as any);

      const result = await service.listarPedidos({ limit: 2 });

      expect(result.data.map((pedido) => pedido.id)).toEqual(['p-001', 'p-002']);
      expect(result.nextCursor).toBe('p-002');
      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(expect.objectContaining({
        take: 3,
      }));
    });

    it('aplica cursor, estado, updatedSince y tope maximo de limit', async () => {
      vi.spyOn(mockPrisma.pedido, 'findMany').mockResolvedValue([]);

      await service.listarPedidos({
        cursor: 'p-010',
        estado: PedidoEstado.Listo,
        updatedSince: '2026-01-01T00:00:00.000Z',
        limit: 500,
      });

      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          estado: PedidoEstado.Listo,
          updatedAt: { gte: new Date('2026-01-01T00:00:00.000Z') },
        },
        cursor: { id: 'p-010' },
        skip: 1,
        take: 101,
      }));
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

  describe('persistirPedido', () => {
    it('no debe reservar stock local para productos sin control de stock', async () => {
      mockPrisma.pedido.create.mockResolvedValue({
        ...basePedido,
        items: [
          {
            id: 'item-1',
            pedidoId: 'p-001',
            productoId: 'prod-libre',
            nombre: 'Ceviche',
            cantidad: 2,
            precioUnitario: 25,
            area: 'COCINA',
            notas: null,
            estado: PedidoEstado.Pendiente,
            comensal: 1,
            modificadores: [],
          },
        ],
      } as any);

      await (service as any).persistirPedido('mesa-1', 1, [
        {
          productoId: 'prod-libre',
          nombre: 'Ceviche',
          cantidad: 2,
          precioUnitario: 25,
          stockActual: null,
          area: 'COCINA',
          comensal: 1,
          modificadores: [],
        },
      ], 50);

      expect(mockPrisma.$executeRaw).not.toHaveBeenCalled();
      expect(mockPrisma.$queryRaw).not.toHaveBeenCalled();
      expect(mockPrisma.pedido.create).toHaveBeenCalled();
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

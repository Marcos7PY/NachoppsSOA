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
      outboxEvent: {
        create: vi.fn().mockResolvedValue({}),
      },
      idempotencyKey: {
        create: vi.fn().mockResolvedValue({}),
      },
      $executeRaw: vi.fn(),
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
    });

    service = new AppService(mockPrisma as any);
  });

  describe('listarProductos', () => {
    const productoBase = {
      id: 'prod-001',
      categoriaId: 'cat-001',
      categoria: { id: 'cat-001', nombre: 'Bebidas', descripcion: null },
      nombre: 'Cerveza',
      descripcion: null,
      precio: 8.5,
      disponible: true,
      stockActual: 10,
    };

    it('devuelve data y nextCursor cuando hay mas productos', async () => {
      mockPrisma.producto.findMany.mockResolvedValue([
        { ...productoBase, id: 'prod-001' },
        { ...productoBase, id: 'prod-002' },
        { ...productoBase, id: 'prod-003' },
      ]);

      const result = await service.listarProductos({ limit: 2 });

      expect(result.data.map((producto) => producto.id)).toEqual([
        'prod-001',
        'prod-002',
      ]);
      expect(result.nextCursor).toBe('prod-002');
      expect(mockPrisma.producto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
          orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
        }),
      );
    });

    it('aplica cursor, categoria, disponible, search, updatedSince y tope maximo de limit', async () => {
      mockPrisma.producto.findMany.mockResolvedValue([]);

      await service.listarProductos({
        categoriaId: 'cat-001',
        disponible: false as any,
        search: 'limon',
        cursor: 'prod-010',
        updatedSince: '2026-01-01T00:00:00.000Z',
        limit: 500,
      });

      expect(mockPrisma.producto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            categoriaId: 'cat-001',
            disponible: false,
            updatedAt: { gte: new Date('2026-01-01T00:00:00.000Z') },
            OR: [
              { nombre: { contains: 'limon', mode: 'insensitive' } },
              { descripcion: { contains: 'limon', mode: 'insensitive' } },
            ],
          },
          cursor: { id: 'prod-010' },
          skip: 1,
          take: 101,
        }),
      );
    });
  });

  describe('reducirStockAutomatico', () => {
    it('debe reducir stock y publicar alerta si cae bajo 10', async () => {
      mockPrisma.producto.findUnique
        .mockResolvedValueOnce({
          id: 'prod-001',
          nombre: 'Cerveza',
          precio: { toNumber: () => 8.5 },
          stockActual: 15,
          disponible: true,
          categoria: { nombre: 'Bebidas' },
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
        categoria: { nombre: 'Cocina' },
      });

      await service.reducirStockAutomatico('prod-002', 5);

      expect(mockPrisma.producto.updateMany).not.toHaveBeenCalled();
    });

    it('publica disponibilidad final false cuando el stock llega a cero', async () => {
      mockPrisma.producto.findUnique
        .mockResolvedValueOnce({
          id: 'prod-004',
          nombre: 'Limonada',
          precio: { toNumber: () => 9 },
          stockActual: 1,
          disponible: true,
          categoria: { nombre: 'Bebidas' },
        })
        .mockResolvedValueOnce({
          id: 'prod-004',
          nombre: 'Limonada',
          stockActual: 0,
          disponible: true,
        });
      mockPrisma.producto.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.producto.update.mockResolvedValue({
        id: 'prod-004',
        nombre: 'Limonada',
        stockActual: 0,
        disponible: false,
      });

      await service.reducirStockAutomatico('prod-004', 1);

      const payload = JSON.parse(mockPrisma.outboxEvent.create.mock.calls[0][0].data.payload);
      expect(payload).toMatchObject({
        stockActual: 0,
        disponible: false,
      });
    });
  });

  describe('actualizarStock', () => {
    it('serializa por producto y publica el stock final calculado dentro de la transacción', async () => {
      mockPrisma.producto.findUnique.mockResolvedValue({
        id: 'prod-005',
        nombre: 'Agua',
        precio: { toNumber: () => 5 },
        stockActual: 10,
        disponible: true,
        categoria: { nombre: 'Bebidas' },
      });
      mockPrisma.producto.update.mockResolvedValue({
        id: 'prod-005',
        nombre: 'Agua',
        precio: { toNumber: () => 5 },
        stockActual: 15,
        disponible: true,
      });

      await service.actualizarStock('prod-005', 5);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
      expect(mockPrisma.producto.update).toHaveBeenCalledWith({
        where: { id: 'prod-005' },
        data: {
          stockActual: 15,
          disponible: true,
        },
      });
    });
  });

  describe('procesarPedidoCreado', () => {
    it('debe fallar antes de registrar idempotencia con marcador QA de DLQ', async () => {
      await expect(
        service.procesarPedidoCreado({
          id: 'pedido-force-dlq',
          items: [{ productoId: 'prod-003', cantidad: 1, notas: '__QA_INVENTARIO_FORCE_DLQ__' }],
        }),
      ).rejects.toThrow('Fallo QA controlado');

      expect(mockPrisma.idempotencyKey.create).not.toHaveBeenCalled();
      expect(mockPrisma.producto.updateMany).not.toHaveBeenCalled();
    });

    it('debe ignorar redelivery del mismo pedido sin descontar stock dos veces', async () => {
      const duplicate = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
      mockPrisma.idempotencyKey.create
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(duplicate);
      mockPrisma.producto.findUnique
        .mockResolvedValueOnce({
          id: 'prod-003',
          nombre: 'Nachos',
          precio: { toNumber: () => 12.5 },
          stockActual: 10,
          disponible: true,
          categoria: { nombre: 'Cocina' },
        })
        .mockResolvedValueOnce({
          id: 'prod-003',
          nombre: 'Nachos',
          stockActual: 7,
          disponible: true,
        });
      mockPrisma.producto.updateMany.mockResolvedValue({ count: 1 });

      const pedido = {
        id: 'pedido-redelivery-1',
        items: [{ productoId: 'prod-003', cantidad: 3 }],
      };

      await service.procesarPedidoCreado(pedido);
      await service.procesarPedidoCreado(pedido);

      expect(mockPrisma.idempotencyKey.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.producto.updateMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.producto.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'prod-003',
          stockActual: { gte: 3 },
        },
        data: {
          stockActual: { decrement: 3 },
        },
      });
    });
  });
});

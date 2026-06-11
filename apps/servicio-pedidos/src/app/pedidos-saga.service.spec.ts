import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PedidosSagaService } from './pedidos-saga.service';
import { PedidoEstado } from '@org/contracts';

// T-40: specs de transiciones de estado y compensación de saga, movidos junto a
// la clase extraída de AppService (antes vivían en app.service.spec.ts).

function createMockPrismaService(overrides: Record<string, any> = {}) {
  const prisma: any = {
    $connect: async () => {},
    $disconnect: async () => {},
    pedido: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    pedidoItem: {
      update: vi.fn(),
      updateMany: vi.fn(),
      findMany: vi.fn(),
    },
    idempotencyKey: {
      create: vi.fn().mockResolvedValue({}),
    },
    outboxEvent: {
      create: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    ...overrides,
  };
  prisma.$transaction = vi.fn(async (cb: any) => cb(prisma));
  return prisma;
}

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

describe('PedidosSagaService — Pedidos', () => {
  let service: PedidosSagaService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrismaService();
    service = new PedidosSagaService(mockPrisma as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('actualizarEstado — guard de transiciones', () => {
    it('permite el avance comercial LISTO → ENTREGADO', async () => {
      vi.spyOn(mockPrisma.pedido, 'findUnique').mockResolvedValue({ ...basePedido, estado: PedidoEstado.Listo } as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update').mockResolvedValue({
        ...basePedido,
        estado: PedidoEstado.Entregado,
        items: [],
      } as any);

      await service.actualizarEstado('p-001', { estado: PedidoEstado.Entregado });

      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'p-001' },
        data: { estado: PedidoEstado.Entregado },
      }));
    });

    it('rechaza una transición inválida (PAGADO → EN_PREPARACION)', async () => {
      vi.spyOn(mockPrisma.pedido, 'findUnique').mockResolvedValue({ ...basePedido, estado: PedidoEstado.Pagado } as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update');

      await expect(
        service.actualizarEstado('p-001', { estado: PedidoEstado.EnPreparacion }),
      ).rejects.toThrow(/inválida/i);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('actualizarEstadoItem — cocina manda (derivación)', () => {
    const itemBase = { id: 'i-1', pedidoId: 'p-001', nombre: 'Plato', cantidad: 1, precioUnitario: 10, area: 'COCINA', notas: null, modificadores: [] };

    it('sube el pedido a EN_PREPARACION cuando arranca el primer ítem', async () => {
      vi.spyOn(mockPrisma.pedidoItem, 'update').mockResolvedValue({ id: 'i-1', pedidoId: 'p-001' } as any);
      vi.spyOn(mockPrisma.pedido, 'findUnique').mockResolvedValue({
        ...basePedido,
        estado: PedidoEstado.Pendiente,
        items: [
          { ...itemBase, id: 'i-1', estado: PedidoEstado.EnPreparacion },
          { ...itemBase, id: 'i-2', estado: PedidoEstado.Pendiente },
        ],
      } as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update').mockResolvedValue({
        ...basePedido, estado: PedidoEstado.EnPreparacion, items: [],
      } as any);

      await service.actualizarEstadoItem('i-1', { estado: PedidoEstado.EnPreparacion });

      expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
        data: { estado: PedidoEstado.EnPreparacion },
      }));
    });

    it('marca el pedido LISTO y emite pedido.listo cuando todos los ítems están listos', async () => {
      vi.spyOn(mockPrisma.pedidoItem, 'update').mockResolvedValue({ id: 'i-2', pedidoId: 'p-001' } as any);
      vi.spyOn(mockPrisma.pedido, 'findUnique').mockResolvedValue({
        ...basePedido,
        estado: PedidoEstado.EnPreparacion,
        items: [
          { ...itemBase, id: 'i-1', estado: PedidoEstado.Listo },
          { ...itemBase, id: 'i-2', estado: PedidoEstado.Listo },
        ],
      } as any);
      vi.spyOn(mockPrisma.pedido, 'update').mockResolvedValue({
        ...basePedido, estado: PedidoEstado.Listo, items: [],
      } as any);

      await service.actualizarEstadoItem('i-2', { estado: PedidoEstado.Listo });

      const eventos = mockPrisma.outboxEvent.createMany.mock.calls.at(-1)[0].data;
      expect(eventos.some((e: any) => e.routingKey === 'pedido.listo')).toBe(true);
    });

    it('no pisa un estado comercial (ENTREGADO) al tocar un ítem', async () => {
      vi.spyOn(mockPrisma.pedidoItem, 'update').mockResolvedValue({ id: 'i-1', pedidoId: 'p-001' } as any);
      vi.spyOn(mockPrisma.pedido, 'findUnique').mockResolvedValue({
        ...basePedido,
        estado: PedidoEstado.Entregado,
        items: [{ ...itemBase, id: 'i-1', estado: PedidoEstado.Listo }],
      } as any);
      const updateSpy = vi.spyOn(mockPrisma.pedido, 'update');

      await service.actualizarEstadoItem('i-1', { estado: PedidoEstado.Listo });

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('procesarStockInsuficiente — compensación de saga', () => {
    const itemRechazado = (over: Record<string, any> = {}) => ({
      id: 'it-1', productoId: 'prod-a', nombre: 'A', cantidad: 1, precioUnitario: 10,
      area: 'COCINA', notas: null, estado: 'RECHAZADO_SIN_STOCK', modificadores: [], ...over,
    });

    it('marca el ítem RECHAZADO_SIN_STOCK y emite PedidoActualizado, sin tocar el pedido si quedan ítems vivos', async () => {
      const prisma = createMockPrismaService({
        pedidoItem: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
        pedido: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'ped-1', mesaId: 'm-1', numeroMesa: 3, estado: PedidoEstado.Pendiente,
            total: 50, createdAt: new Date(),
            items: [
              itemRechazado(),
              itemRechazado({ id: 'it-2', productoId: 'prod-b', nombre: 'B', estado: 'PENDIENTE' }),
            ],
          }),
          update: vi.fn(),
        },
        outboxEvent: { create: vi.fn().mockResolvedValue({}) },
        idempotencyKey: { create: vi.fn().mockResolvedValue({}) },
      });
      const svc = new PedidosSagaService(prisma as any);

      await svc.procesarStockInsuficiente({ pedidoId: 'ped-1', productoId: 'prod-a', solicitado: 5, disponible: 1 });

      expect(prisma.pedidoItem.updateMany).toHaveBeenCalledWith({
        where: { pedidoId: 'ped-1', productoId: 'prod-a', estado: { not: 'RECHAZADO_SIN_STOCK' } },
        data: { estado: 'RECHAZADO_SIN_STOCK' },
      });
      expect(prisma.pedido.update).not.toHaveBeenCalled();
      expect(prisma.outboxEvent.create).toHaveBeenCalledTimes(1);
      expect(prisma.outboxEvent.create.mock.calls[0][0].data.routingKey).toBe('pedido.actualizado');
    });

    it('pasa el pedido entero a RECHAZADO_SIN_STOCK cuando todos los ítems quedan rechazados', async () => {
      const items = [itemRechazado()];
      const prisma = createMockPrismaService({
        pedidoItem: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
        pedido: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'ped-2', mesaId: 'm-1', numeroMesa: 3, estado: PedidoEstado.Pendiente,
            total: 10, createdAt: new Date(), items,
          }),
          update: vi.fn().mockResolvedValue({
            id: 'ped-2', mesaId: 'm-1', numeroMesa: 3, estado: PedidoEstado.RechazadoSinStock,
            total: 10, createdAt: new Date(), items,
          }),
        },
        outboxEvent: { create: vi.fn().mockResolvedValue({}) },
        idempotencyKey: { create: vi.fn().mockResolvedValue({}) },
      });
      const svc = new PedidosSagaService(prisma as any);

      await svc.procesarStockInsuficiente({ pedidoId: 'ped-2', productoId: 'prod-a', solicitado: 5, disponible: 0 });

      expect(prisma.pedido.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'ped-2' },
        data: { estado: PedidoEstado.RechazadoSinStock },
      }));
    });

    it('es idempotente: una clave duplicada (P2002) no propaga ni re-marca', async () => {
      const prisma = createMockPrismaService({
        idempotencyKey: { create: vi.fn().mockRejectedValue({ code: 'P2002' }) },
        pedidoItem: { updateMany: vi.fn() },
        pedido: { findUnique: vi.fn(), update: vi.fn() },
        outboxEvent: { create: vi.fn() },
      });
      const svc = new PedidosSagaService(prisma as any);

      await expect(
        svc.procesarStockInsuficiente({ pedidoId: 'ped-3', productoId: 'prod-a', solicitado: 1, disponible: 0 }),
      ).resolves.toBeUndefined();
      expect(prisma.pedidoItem.updateMany).not.toHaveBeenCalled();
      expect(prisma.outboxEvent.create).not.toHaveBeenCalled();
    });
  });
});

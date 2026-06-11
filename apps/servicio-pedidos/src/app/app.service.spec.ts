import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// T-33: neutralizar el breaker en los specs del servicio (igual que en caja);
// el comportamiento del breaker se prueba aparte en http-clients.breaker.spec.ts.
vi.mock('@org/resiliencia', async () => {
  const actual = await vi.importActual('@org/resiliencia');
  return {
    ...actual,
    CircuitBreakerOptions: () => (_target: any, _key: string, descriptor: PropertyDescriptor) => descriptor,
  };
});

import { AppService } from './app.service';
import { MesasHttpClient } from './mesas-http.client';
import { InventarioHttpClient } from './inventario-http.client';
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
  return {
    publish: vi.fn().mockResolvedValue(undefined),
    generateServiceToken: vi.fn().mockReturnValue('service-token'),
  };
}

// T-33: los clientes HTTP reales con el token service mockeado, para que los
// specs sigan espiando axios de extremo a extremo.
function createService(prisma: any, tokenService: any) {
  return new AppService(
    prisma,
    new MesasHttpClient(tokenService),
    new InventarioHttpClient(tokenService),
  );
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
      pedidoItem: {
        update: vi.fn(),
        findMany: vi.fn(),
      },
      productoLocal: {
        findUnique: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        upsert: vi.fn(),
      },
      mesaLocal: {
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

    service = createService(mockPrisma as any, mockPublisher as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validarMesa', () => {
    it('usa la proyección local cuando la mesa ya está sincronizada', async () => {
      const mesaLocal = { id: 'mesa-1', numero: 1, updatedAt: new Date() };
      mockPrisma.mesaLocal.findUnique.mockResolvedValue(mesaLocal);
      const getSpy = vi.spyOn(axios, 'get');

      await expect((service as any).validarMesa('mesa-1')).resolves.toBe(mesaLocal);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('sincroniza la mesa desde servicio-mesas cuando falta en pedidos', async () => {
      const mesaLocal = { id: 'mesa-1', numero: 1, updatedAt: new Date() };
      mockPrisma.mesaLocal.findUnique.mockResolvedValue(null);
      mockPrisma.mesaLocal.upsert.mockResolvedValue(mesaLocal);
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { id: 'mesa-1', numero: 1 } });

      await expect((service as any).validarMesa('mesa-1')).resolves.toBe(mesaLocal);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/mesas/mesa-1'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer service-token' },
        }),
      );
      expect(mockPrisma.mesaLocal.upsert).toHaveBeenCalledWith({
        where: { id: 'mesa-1' },
        create: { id: 'mesa-1', numero: 1 },
        update: { numero: 1 },
      });
    });
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

      await (service as any).persistirPedido({
        mesaId: 'mesa-1',
        numeroMesa: 1,
        items: [
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
        ],
        total: 50,
      });

      expect(mockPrisma.$executeRaw).not.toHaveBeenCalled();
      expect(mockPrisma.$queryRaw).not.toHaveBeenCalled();
      expect(mockPrisma.pedido.create).toHaveBeenCalled();
    });

    it('persiste y expone el mesero en pedido, items y eventos', async () => {
      mockPrisma.pedido.create.mockResolvedValue({
        ...basePedido,
        meseroId: 'u-mesero-1',
        meseroNombre: 'Ana Mesa',
        items: [
          {
            id: 'item-1',
            pedidoId: 'p-001',
            productoId: 'prod-1',
            nombre: 'Nachos',
            cantidad: 1,
            precioUnitario: 25,
            area: 'COCINA',
            notas: null,
            estado: PedidoEstado.Pendiente,
            comensal: 1,
            meseroId: 'u-mesero-1',
            meseroNombre: 'Ana Mesa',
            modificadores: [],
          },
        ],
      } as any);

      await (service as any).persistirPedido({
        mesaId: 'mesa-1',
        numeroMesa: 1,
        items: [
          {
            productoId: 'prod-1',
            nombre: 'Nachos',
            cantidad: 1,
            precioUnitario: 25,
            stockActual: null,
            area: 'COCINA',
            comensal: 1,
            modificadores: [],
          },
        ],
        total: 25,
        modalidad: 'MESA',
        mesero: { id: 'u-mesero-1', nombre: 'Ana Mesa' },
      });

      expect(mockPrisma.pedido.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          meseroId: 'u-mesero-1',
          meseroNombre: 'Ana Mesa',
          items: expect.objectContaining({
            create: [
              expect.objectContaining({
                meseroId: 'u-mesero-1',
                meseroNombre: 'Ana Mesa',
              }),
            ],
          }),
        }),
      }));

      const eventos = mockPrisma.outboxEvent.createMany.mock.calls.at(-1)[0].data;
      const pedidoCreado = eventos.find((e: any) => e.routingKey === 'pedido.creado');
      const payload = JSON.parse(pedidoCreado.payload);
      expect(payload.pedido).toEqual(expect.objectContaining({
        meseroId: 'u-mesero-1',
        meseroNombre: 'Ana Mesa',
      }));
      expect(payload.pedido.items[0]).toEqual(expect.objectContaining({
        meseroId: 'u-mesero-1',
        meseroNombre: 'Ana Mesa',
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

  describe('procesarStockInsuficiente — compensación de saga', () => {
    const itemRechazado = (over: Record<string, any> = {}) => ({
      id: 'it-1', productoId: 'prod-a', nombre: 'A', cantidad: 1, precioUnitario: 10,
      area: 'COCINA', notas: null, estado: 'RECHAZADO_SIN_STOCK', modificadores: [], ...over,
    });

    it('marca el ítem RECHAZADO_SIN_STOCK y emite PedidoActualizado, sin tocar el pedido si quedan ítems vivos', async () => {
      const prisma: any = createMockPrismaService({
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
      prisma.$transaction = vi.fn(async (cb: any) => cb(prisma));
      const svc = createService(prisma, mockPublisher as any);

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
      const prisma: any = createMockPrismaService({
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
      prisma.$transaction = vi.fn(async (cb: any) => cb(prisma));
      const svc = createService(prisma, mockPublisher as any);

      await svc.procesarStockInsuficiente({ pedidoId: 'ped-2', productoId: 'prod-a', solicitado: 5, disponible: 0 });

      expect(prisma.pedido.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'ped-2' },
        data: { estado: PedidoEstado.RechazadoSinStock },
      }));
    });

    it('es idempotente: una clave duplicada (P2002) no propaga ni re-marca', async () => {
      const prisma: any = createMockPrismaService({
        idempotencyKey: { create: vi.fn().mockRejectedValue({ code: 'P2002' }) },
        pedidoItem: { updateMany: vi.fn() },
        pedido: { findUnique: vi.fn(), update: vi.fn() },
        outboxEvent: { create: vi.fn() },
      });
      prisma.$transaction = vi.fn(async (cb: any) => cb(prisma));
      const svc = createService(prisma, mockPublisher as any);

      await expect(
        svc.procesarStockInsuficiente({ pedidoId: 'ped-3', productoId: 'prod-a', solicitado: 1, disponible: 0 }),
      ).resolves.toBeUndefined();
      expect(prisma.pedidoItem.updateMany).not.toHaveBeenCalled();
      expect(prisma.outboxEvent.create).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';
import { CuentaEstado, PedidoEstado } from '@org/contracts';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  const mock = {
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: vi.fn(async (cb: any) => cb(mock)),
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
        updateMany: vi.fn(),
      },
      outboxEvent: {
        create: vi.fn(),
        createMany: vi.fn(),
      },
      $executeRaw: vi.fn(),
    });

    service = new AppService(mockPrisma as any);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockPrisma.outboxEvent.create.mockResolvedValue({});

      const result = await service.abrirCuenta({ mesaId: 'm-001' });

      expect(result.cuenta.id).toBe('c-001');
      expect(result.cuenta.estado).toBe('ABIERTA');
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalled();
    });

    it('debe rechazar si la mesa ya tiene una cuenta abierta y origen es manual', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue({ id: 'c-existing', estado: 'ABIERTA' });

      await expect(
        service.abrirCuenta({ mesaId: 'm-001' }, 'manual')
      ).rejects.toThrow('La mesa ya tiene una cuenta abierta');
    });

    it('no debe rechazar si la mesa ya tiene una cuenta abierta y origen es fallback', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-existing',
        mesaId: 'm-001',
        estado: 'ABIERTA',
        total: 0,
        pedidos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.abrirCuenta({ mesaId: 'm-001' }, 'fallback');

      expect(result.message).toBe('Cuenta ya existe.');
      expect(result.cuenta.id).toBe('c-existing');
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

      vi.spyOn(service, 'obtenerCuenta').mockResolvedValue({
        id: 'c-001',
        estado: 'ABIERTA',
        mesaId: 'm-001',
        total: 150,
        pedidos: [
          { id: 'p-1', total: 150, items: [{ precioUnitario: 50, cantidad: 3 }] } as any
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.dividirCuenta('c-001', { metodo: 'IGUALES', numPartes: 3 });

      expect(result.metodo).toBe('IGUALES');
      expect(result.partes).toHaveLength(3);
      expect(result.partes[0].monto).toBe(50);
    });
  });

  describe('cerrarCuenta', () => {
    const cuentaAbierta = {
      id: 'c-001',
      mesaId: 'm-001',
      estado: CuentaEstado.Abierta,
      total: 50,
      pedidos: [
        { id: 'p-001', total: 50, items: [{ productoId: 'prod-1', precioUnitario: 25, cantidad: 2 }] },
      ],
      ticket: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('cierra con updateMany condicional y emite outbox solo si cambió el estado', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue(cuentaAbierta);
      mockPrisma.cuenta.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.outboxEvent.createMany.mockResolvedValue({ count: 2 });

      const result = await service.cerrarCuenta('c-001', {});

      expect(result.ticket.total).toBe(50);
      expect(mockPrisma.cuenta.updateMany).toHaveBeenCalledWith({
        where: { id: 'c-001', estado: CuentaEstado.Abierta },
        data: expect.objectContaining({
          estado: CuentaEstado.Cerrada,
          total: expect.anything(),
          ticket: expect.any(String),
        }),
      });
      expect(mockPrisma.outboxEvent.createMany).toHaveBeenCalledTimes(1);
    });

    it('propaga el mesero del pedido al evento cuenta.cerrada', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue({
        ...cuentaAbierta,
        pedidos: [
          {
            id: 'p-001',
            total: 50,
            meseroId: 'u-mesero-1',
            meseroNombre: 'Ana Mesa',
            items: [{ productoId: 'prod-1', precioUnitario: 25, cantidad: 2 }],
          },
        ],
      });
      mockPrisma.cuenta.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.outboxEvent.createMany.mockResolvedValue({ count: 2 });

      await service.cerrarCuenta('c-001', {});

      const eventos = mockPrisma.outboxEvent.createMany.mock.calls.at(-1)[0].data;
      const cuentaCerrada = eventos.find((e: any) => e.routingKey === 'cuenta.cerrada');
      const payload = JSON.parse(cuentaCerrada.payload);
      expect(payload).toEqual(expect.objectContaining({
        meseroId: 'u-mesero-1',
        meseroNombre: 'Ana Mesa',
      }));
    });

    it('rechaza cierre concurrente sin emitir eventos duplicados', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue(cuentaAbierta);
      mockPrisma.cuenta.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.cerrarCuenta('c-001', {})).rejects.toThrow('ya fue cerrada');

      expect(mockPrisma.outboxEvent.createMany).not.toHaveBeenCalled();
    });
  });

  describe('eventos de pedidos con payload directo', () => {
    const pedido = {
      id: 'p-001',
      mesaId: 'm-001',
      numeroMesa: 1,
      estado: PedidoEstado.Pendiente,
      total: 50,
      items: [],
      createdAt: new Date().toISOString(),
    };

    it('pedido.creado recibe payload directo y consolida cuenta', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [],
        total: 0,
      });
      mockPrisma.cuenta.update.mockResolvedValue({});

      await service.procesarPedidoCreado({ pedido });

      expect(mockPrisma.cuenta.update).toHaveBeenCalledWith({
        where: { id: 'c-001' },
        data: expect.objectContaining({
          pedidos: [pedido],
          total: expect.anything(),
        }),
      });
    });

    it('pedido.actualizado recibe payload directo y actualiza snapshot', async () => {
      const pedidoActualizado = { ...pedido, total: 75 };
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [pedido],
        total: 50,
      });
      mockPrisma.cuenta.update.mockResolvedValue({});

      await service.procesarPedidoActualizado({ pedido: pedidoActualizado });

      expect(mockPrisma.cuenta.update).toHaveBeenCalledWith({
        where: { id: 'c-001' },
        data: expect.objectContaining({
          pedidos: [pedidoActualizado],
          total: expect.anything(),
        }),
      });
    });

    it('pago.registrado recibe payload directo y cierra cuenta', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [pedido],
        total: 50,
      });
      const cerrarCuenta = vi.spyOn(service, 'cerrarCuenta').mockResolvedValue({ message: 'ok', ticket: {} as any });

      await service.procesarPagoRegistrado({
        transaccionId: 'tx-001',
        cuentaId: 'c-001',
        mesaId: 'm-001',
        monto: 50,
        metodo: 'EFECTIVO',
      });

      expect(cerrarCuenta).toHaveBeenCalledWith('c-001', {});
    });
  });
});

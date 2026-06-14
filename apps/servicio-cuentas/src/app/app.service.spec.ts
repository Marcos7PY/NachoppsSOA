/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-assertion */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';
import { CuentaEstado, PedidoEstado } from '@org/contracts';

import { PrismaService } from '../prisma/prisma.service';

function createMockPrismaService() {
  const mock = {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $transaction: vi.fn((cb: (m: unknown) => unknown) => cb(mock)),
    checkAndRecordIdempotencyKey: () => Promise.resolve(true),
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
  };
  return mock;
}

describe('AppService — Cuentas', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(() => {
    mockPrisma = createMockPrismaService();

    service = new AppService(mockPrisma as unknown as PrismaService);
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
          { id: 'p-1', total: 150, items: [{ precioUnitario: 50, cantidad: 3 }] } as unknown as PedidoEstado
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as CuentaEstado);

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
        {
          id: 'p-001',
          mesaId: 'm-001',
          estado: PedidoEstado.Entregado,
          total: 50,
          items: [{ productoId: 'prod-1', precioUnitario: 25, cantidad: 2 }],
        },
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
            mesaId: 'm-001',
            estado: PedidoEstado.Entregado,
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

      const eventos = mockPrisma.outboxEvent.createMany.mock.calls.at(-1)[0].data as { routingKey: string, payload: string }[];
      const cuentaCerrada = eventos.find((e: { routingKey: string }) => e.routingKey === 'cuenta.cerrada');
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({
          pedidos: [pedidoActualizado],
          total: expect.anything(),
        }),
      });
    });

    it('excluye pedidos CANCELADO del total pero conserva el snapshot', async () => {
      const pedidoCancelado = { ...pedido, id: 'p-002', total: 30, estado: PedidoEstado.Cancelado };
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [{ ...pedido, total: 50 }, { ...pedidoCancelado, estado: PedidoEstado.Pendiente }],
        total: 80,
      });
      mockPrisma.cuenta.update.mockResolvedValue({});

      await service.procesarPedidoActualizado({ pedido: pedidoCancelado });

      const data = mockPrisma.cuenta.update.mock.calls.at(-1)[0].data as { pedidos: unknown[], total: { toNumber: () => number } };
      expect(data.pedidos).toEqual([{ ...pedido, total: 50 }, pedidoCancelado]);
      expect(data.total.toNumber()).toBe(50);
    });

    it('excluye pedidos RECHAZADO_SIN_STOCK del total', async () => {
      const pedidoRechazado = { ...pedido, total: 30, estado: PedidoEstado.RechazadoSinStock };
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [pedido],
        total: 50,
      });
      mockPrisma.cuenta.update.mockResolvedValue({});

      await service.procesarPedidoActualizado({ pedido: pedidoRechazado });

      const data = mockPrisma.cuenta.update.mock.calls.at(-1)[0].data as { total: { toNumber: () => number } };
      expect(data.total.toNumber()).toBe(0);
    });

    it('suma el total recomputado de un rechazo parcial', async () => {
      const pedidoParcial = { ...pedido, total: 30, estado: PedidoEstado.Pendiente };
      mockPrisma.cuenta.findFirst.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [],
        total: 0,
      });
      mockPrisma.cuenta.update.mockResolvedValue({});

      await service.procesarPedidoActualizado({ pedido: pedidoParcial });

      const data = mockPrisma.cuenta.update.mock.calls.at(-1)[0].data as { total: { toNumber: () => number } };
      expect(data.total.toNumber()).toBe(30);
    });

    it('ignora PedidoActualizado si la cuenta abierta ya no existe', async () => {
      mockPrisma.cuenta.findFirst.mockResolvedValue(null);

      await service.procesarPedidoActualizado({ pedido });

      expect(mockPrisma.cuenta.update).not.toHaveBeenCalled();
    });

    it('pago.registrado recibe payload directo y cierra cuenta', async () => {
      mockPrisma.cuenta.findUnique.mockResolvedValue({
        id: 'c-001',
        mesaId: 'm-001',
        estado: CuentaEstado.Abierta,
        pedidos: [pedido],
        total: 50,
      });
      const cerrarCuenta = vi.spyOn(service, 'cerrarCuenta').mockResolvedValue({ message: 'ok', ticket: {} as unknown } as never);

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

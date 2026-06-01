import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('@org/resiliencia', async () => {
  const actual = await vi.importActual('@org/resiliencia');
  return {
    ...actual,
    CircuitBreakerOptions: () => (_target: any, _key: string, descriptor: PropertyDescriptor) => descriptor,
  };
});

import { AppService } from './app.service';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    checkAndRecordIdempotencyKey: async (_key: string) => true,
    ...overrides,
  } as any;
}

describe('AppService — Caja', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;
  let mockTokenService: { generateServiceToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenService = { generateServiceToken: vi.fn().mockReturnValue('mock-service-token') };

    mockPrisma = createMockPrismaService({
      transaccion: {
        create: vi.fn(),
        findMany: vi.fn(),
        aggregate: vi.fn(),
      },
      outboxEvent: {
        create: vi.fn(),
      },
      cuentaAbierta: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
      $executeRaw: vi.fn(),
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
    });

    process.env['CUENTAS_SERVICE_URL'] = 'http://localhost:3005/api';

    service = new AppService(mockPrisma as any, mockTokenService as any);
  });

  describe('registrarPago', () => {
    it('debe registrar un pago y publicar evento', async () => {
      mockPrisma.cuentaAbierta.findUnique.mockResolvedValue(null);
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });
      mockPrisma.cuentaAbierta.upsert.mockResolvedValue({ cuentaId: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' });
      mockPrisma.transaccion.aggregate.mockResolvedValue({ _sum: { monto: 0 } });
      const transaccionCreada = {
        id: 't-001',
        cuentaId: 'c-001',
        monto: 50,
        metodo: 'EFECTIVO',
        referencia: null,
        notas: null,
        createdAt: new Date(),
      };
      mockPrisma.transaccion.create.mockResolvedValue(transaccionCreada);
      mockPrisma.outboxEvent.create.mockResolvedValue({});

      const result = await service.registrarPago({
        cuentaId: 'c-001',
        montoRecibido: 50,
        metodo: 'EFECTIVO',
      });

      expect(result.transaccion).toBeDefined();
      expect(result.transaccion.monto).toBe(50);
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            routingKey: 'pago.registrado',
          })
        })
      );
    });

    it('debe consultar cuenta remota antes de abrir la transacción con lock', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });
      mockPrisma.cuentaAbierta.upsert.mockResolvedValue({ cuentaId: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' });
      mockPrisma.transaccion.aggregate.mockResolvedValue({ _sum: { monto: 0 } });
      mockPrisma.transaccion.create.mockResolvedValue({
        id: 't-001',
        cuentaId: 'c-001',
        monto: 50,
        metodo: 'EFECTIVO',
        referencia: null,
        notas: null,
        createdAt: new Date(),
      });
      mockPrisma.outboxEvent.create.mockResolvedValue({});

      await service.registrarPago({
        cuentaId: 'c-001',
        montoRecibido: 50,
        metodo: 'EFECTIVO',
      });

      expect(vi.mocked(axios.get).mock.invocationCallOrder[0]).toBeLessThan(
        mockPrisma.$transaction.mock.invocationCallOrder[0],
      );
    });

    it('debe rechazar si el monto excede el total de la cuenta', async () => {
      mockPrisma.cuentaAbierta.findUnique.mockResolvedValue(null);
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });
      mockPrisma.cuentaAbierta.upsert.mockResolvedValue({ cuentaId: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' });
      mockPrisma.transaccion.aggregate.mockResolvedValue({ _sum: { monto: 10 } });

      await expect(
        service.registrarPago({ cuentaId: 'c-001', montoRecibido: 50, metodo: 'EFECTIVO' })
      ).rejects.toThrow('Pago duplicado o excedente');
    });
  });

  describe('listarTransacciones', () => {
    it('debe retornar lista de transacciones', async () => {
      mockPrisma.transaccion.findMany.mockResolvedValue([
        { id: 't-001', cuentaId: 'c-001', monto: 50, metodo: 'EFECTIVO', referencia: null, notas: null, createdAt: new Date() },
        { id: 't-002', cuentaId: 'c-002', monto: 80, metodo: 'TARJETA', referencia: 'ref-1', notas: null, createdAt: new Date() },
      ]);

      const result = await service.listarTransacciones();

      expect(result.data).toHaveLength(2);
      expect(result.data[0].monto).toBe(50);
      expect(result.data[1].monto).toBe(80);
    });
  });
});

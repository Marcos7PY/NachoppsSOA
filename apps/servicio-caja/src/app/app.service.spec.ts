import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';
import { MetodoPago } from '@org/contracts';

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
  let mockPublisher: { publish: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockPublisher = { publish: vi.fn().mockResolvedValue(undefined) };

    mockPrisma = createMockPrismaService({
      transaccion: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
    });

    service = new AppService(mockPrisma as any, mockPublisher as any);
  });

  describe('registrarPago', () => {
    it('debe registrar un pago y publicar evento', async () => {
      const transaccionCreada = {
        id: 't-001',
        pedidoId: 'p-001',
        monto: 50,
        metodo: 'EFECTIVO',
        referencia: null,
        notas: null,
        createdAt: new Date(),
      };
      mockPrisma.transaccion.create.mockResolvedValue(transaccionCreada);

      const result = await service.registrarPago({
        pedidoId: 'p-001',
        pagos: [{ monto: 50, metodo: 'EFECTIVO' as MetodoPago }],
        notas: 'pago mesa 5',
      });

      expect(result.transacciones).toHaveLength(1);
      expect(result.transacciones[0].monto).toBe(50);
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        'pago.registrado',
        expect.objectContaining({ pedidoId: 'p-001', monto: 50 }),
        'servicio-caja',
      );
    });

    it('debe rechazar si no se envian pagos', async () => {
      await expect(
        service.registrarPago({ pedidoId: 'p-001', pagos: [] })
      ).rejects.toThrow('Debe enviar al menos un pago');
    });

    it('debe registrar multiples pagos en una llamada', async () => {
      mockPrisma.transaccion.create
        .mockResolvedValueOnce({ id: 't-001', pedidoId: 'p-001', monto: 30, metodo: 'EFECTIVO', referencia: null, notas: null, createdAt: new Date() })
        .mockResolvedValueOnce({ id: 't-002', pedidoId: 'p-001', monto: 20, metodo: 'TARJETA', referencia: null, notas: null, createdAt: new Date() });

      const result = await service.registrarPago({
        pedidoId: 'p-001',
        pagos: [
          { monto: 30, metodo: 'EFECTIVO' as MetodoPago },
          { monto: 20, metodo: 'TARJETA' as MetodoPago },
        ],
      });

      expect(result.transacciones).toHaveLength(2);
      expect(result.transacciones[0].metodo).toBe('EFECTIVO');
      expect(result.transacciones[1].metodo).toBe('TARJETA');
    });
  });

  describe('listarTransacciones', () => {
    it('debe retornar lista de transacciones', async () => {
      mockPrisma.transaccion.findMany.mockResolvedValue([
        { id: 't-001', pedidoId: 'p-001', monto: 50, metodo: 'EFECTIVO', referencia: null, notas: null, createdAt: new Date() },
        { id: 't-002', pedidoId: 'p-002', monto: 80, metodo: 'TARJETA', referencia: 'ref-1', notas: null, createdAt: new Date() },
      ]);

      const result = await service.listarTransacciones();

      expect(result).toHaveLength(2);
      expect(result[0].monto).toBe(50);
      expect(result[1].monto).toBe(80);
    });
  });
});

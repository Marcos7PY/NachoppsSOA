import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
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
import { CuentasHttpClient } from './cuentas-http.client';

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
        update: vi.fn(),
      },
      turnoCaja: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      movimientoCaja: {
        create: vi.fn(),
      },
      $executeRaw: vi.fn(),
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
    });

    process.env['CUENTAS_SERVICE_URL'] = 'http://localhost:3005/api';

    // T-40: el cliente HTTP real con el token service mockeado, para que los
    // specs sigan espiando axios de extremo a extremo.
    service = new AppService(mockPrisma as any, new CuentasHttpClient(mockTokenService as any));
  });

  describe('registrarPago', () => {
    const turnoAbierto = {
      id: 'turno-001',
      cajaId: 'T01',
      cajaNombre: 'Terminal 01',
      usuarioId: 'u-001',
      cajeroNombre: 'Caja',
      fondoInicial: 300,
      estado: 'ABIERTA',
      abiertoAt: new Date(),
      cerradoAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('debe registrar un pago y publicar evento', async () => {
      mockPrisma.turnoCaja.findFirst.mockResolvedValue(turnoAbierto);
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });
      vi.mocked(axios.post).mockResolvedValue({ data: { ticket: { id: 'tk-001', total: 50 } } });
      mockPrisma.cuentaAbierta.upsert.mockResolvedValue({ cuentaId: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' });
      mockPrisma.cuentaAbierta.update.mockResolvedValue({});
      mockPrisma.transaccion.aggregate.mockResolvedValue({ _sum: { monto: 0 } });
      const transaccionCreada = {
        id: 't-001',
        cuentaId: 'c-001',
        turnoId: 'turno-001',
        mesaId: 'm-001',
        monto: 50,
        metodo: 'EFECTIVO',
        referencia: null,
        notas: null,
        createdAt: new Date(),
      };
      mockPrisma.transaccion.create.mockResolvedValue(transaccionCreada);
      mockPrisma.movimientoCaja.create.mockResolvedValue({});
      mockPrisma.outboxEvent.create.mockResolvedValue({});

      const result = await service.registrarPago({
        cuentaId: 'c-001',
        montoRecibido: 50,
        metodo: 'EFECTIVO',
      });

      expect(result.transaccion).toBeDefined();
      expect(result.transaccion.monto).toBe(50);
      expect(mockPrisma.movimientoCaja.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tipo: 'VENTA',
            turnoId: 'turno-001',
            transaccionId: 't-001',
          }),
        }),
      );
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            routingKey: 'pago.registrado',
          })
        })
      );
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3005/api/c-001/cerrar',
        { descuento: 0 },
        expect.any(Object),
      );
    });

    it('debe consultar cuenta remota antes de abrir la transacción con lock', async () => {
      mockPrisma.turnoCaja.findFirst.mockResolvedValue(turnoAbierto);
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });
      vi.mocked(axios.post).mockResolvedValue({ data: { ticket: { id: 'tk-001', total: 50 } } });
      mockPrisma.cuentaAbierta.upsert.mockResolvedValue({ cuentaId: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' });
      mockPrisma.cuentaAbierta.update.mockResolvedValue({});
      mockPrisma.transaccion.aggregate.mockResolvedValue({ _sum: { monto: 0 } });
      mockPrisma.transaccion.create.mockResolvedValue({
        id: 't-001',
        cuentaId: 'c-001',
        turnoId: 'turno-001',
        mesaId: 'm-001',
        monto: 50,
        metodo: 'EFECTIVO',
        referencia: null,
        notas: null,
        createdAt: new Date(),
      });
      mockPrisma.movimientoCaja.create.mockResolvedValue({});
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

    it('debe rechazar si el monto no cubre el total exacto de la cuenta', async () => {
      mockPrisma.turnoCaja.findFirst.mockResolvedValue(turnoAbierto);
      vi.mocked(axios.get).mockResolvedValue({ data: { id: 'c-001', mesaId: 'm-001', total: 50, estado: 'ABIERTA' } });

      await expect(
        service.registrarPago({ cuentaId: 'c-001', montoRecibido: 60, metodo: 'EFECTIVO' })
      ).rejects.toThrow('total exacto');
    });
  });

  describe('abrirTurno — T-25 carrera', () => {
    const turnoAbierto = {
      id: 'turno-001',
      cajaId: 'T01',
      cajaNombre: 'Terminal 01',
      usuarioId: 'u-001',
      cajeroNombre: 'Caja',
      fondoInicial: 300,
      estado: 'ABIERTA',
      abiertoAt: new Date(),
      cerradoAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('devuelve el turno existente si ya hay uno ABIERTA (sin crear)', async () => {
      mockPrisma.turnoCaja.findFirst.mockResolvedValue(turnoAbierto);

      const result = await service.abrirTurno({ fondoInicial: 300 } as any, 'u-001');

      expect(result.id).toBe('turno-001');
      expect(mockPrisma.turnoCaja.create).not.toHaveBeenCalled();
    });

    it('crea un turno nuevo cuando no hay ninguno abierto', async () => {
      mockPrisma.turnoCaja.findFirst.mockResolvedValueOnce(null);
      mockPrisma.turnoCaja.create.mockResolvedValue(turnoAbierto);
      mockPrisma.movimientoCaja.create.mockResolvedValue({});

      const result = await service.abrirTurno({ fondoInicial: 300 } as any, 'u-001');

      expect(result.id).toBe('turno-001');
      expect(mockPrisma.turnoCaja.create).toHaveBeenCalled();
    });

    it('ante carrera (P2002 del índice único) devuelve el turno ganador', async () => {
      // 1ª lectura: no hay turno → intenta crear; el índice rechaza con P2002;
      // 2ª lectura: el turno del ganador ya está ABIERTA.
      mockPrisma.turnoCaja.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(turnoAbierto);
      mockPrisma.turnoCaja.create.mockRejectedValue({ code: 'P2002' });

      const result = await service.abrirTurno({ fondoInicial: 300 } as any, 'u-002');

      expect(result.id).toBe('turno-001');
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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservasService } from './reservas.service';
import { ReservaEstado, RoutingKeys } from '@org/contracts';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  return { ...overrides } as any;
}

describe('ReservasService — Reservas', () => {
  let service: ReservasService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  const reservaBase = {
    id: 'r-001',
    clienteId: 'c-001',
    clienteNombre: 'Juan Perez',
    clienteTelefono: '999888777',
    fecha: new Date('2026-06-15'),
    hora: '19:00',
    mesaPreferida: 5,
    numComensales: 4,
    estado: ReservaEstado.Pendiente,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPrisma = createMockPrismaService({
      reserva: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      outboxEvent: {
        create: vi.fn(),
      },
    });
    mockPrisma.$transaction = vi.fn(async (callback) => callback(mockPrisma));
    service = new ReservasService(mockPrisma);
  });

  describe('listar', () => {
    it('debe listar reservas', async () => {
      mockPrisma.reserva.findMany.mockResolvedValue([reservaBase]);
      const result = await service.listar();
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBeNull();
      expect(mockPrisma.reserva.findMany).toHaveBeenCalledWith(expect.objectContaining({
        take: 21,
        orderBy: [{ fecha: 'asc' }, { hora: 'asc' }, { id: 'asc' }],
      }));
    });

    it('debe retornar array vacio si no hay reservas', async () => {
      mockPrisma.reserva.findMany.mockResolvedValue([]);
      const result = await service.listar();
      expect(result.data).toEqual([]);
    });

    it('devuelve data y nextCursor cuando hay mas resultados', async () => {
      mockPrisma.reserva.findMany.mockResolvedValue([
        { ...reservaBase, id: 'r-001' },
        { ...reservaBase, id: 'r-002' },
        { ...reservaBase, id: 'r-003' },
      ]);

      const result = await service.listar({ limit: 2 });

      expect(result.data.map((reserva) => reserva.id)).toEqual(['r-001', 'r-002']);
      expect(result.nextCursor).toBe('r-002');
      expect(mockPrisma.reserva.findMany).toHaveBeenCalledWith(expect.objectContaining({
        take: 3,
      }));
    });

    it('aplica cursor, estado, fecha, updatedSince y tope maximo de limit', async () => {
      mockPrisma.reserva.findMany.mockResolvedValue([]);

      await service.listar({
        cursor: 'r-010',
        estado: ReservaEstado.Confirmada,
        fecha: '2026-06-15',
        updatedSince: '2026-01-01T00:00:00.000Z',
        limit: 500,
      });

      expect(mockPrisma.reserva.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          estado: ReservaEstado.Confirmada,
          fecha: new Date('2026-06-15'),
          updatedAt: { gte: new Date('2026-01-01T00:00:00.000Z') },
        },
        cursor: { id: 'r-010' },
        skip: 1,
        take: 101,
      }));
    });
  });

  describe('crear', () => {
    it('debe crear una reserva y publicar evento', async () => {
      mockPrisma.reserva.count.mockResolvedValue(0);
      mockPrisma.reserva.create.mockResolvedValue(reservaBase);

      const result = await service.crear({
        clienteId: 'c-001',
        clienteNombre: 'Juan Perez',
        clienteTelefono: '999888777',
        fecha: '2026-06-15',
        hora: '19:00',
        mesaPreferida: 5,
        numComensales: 4,
      });

      expect(result.message).toBe('Reserva creada');
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          routingKey: RoutingKeys.ReservaCreada,
          status: 'PENDING',
        }),
      });
    });

    it('debe lanzar ConflictException si no hay disponibilidad', async () => {
      mockPrisma.reserva.count.mockResolvedValue(1);
      await expect(service.crear({
        clienteId: 'c-001',
        clienteNombre: 'Juan',
        clienteTelefono: '999',
        fecha: '2026-06-15',
        hora: '19:00',
        mesaPreferida: 5,
        numComensales: 4,
      })).rejects.toThrow('No hay disponibilidad');
    });

    it('debe traducir la carrera de unicidad a ConflictException', async () => {
      mockPrisma.reserva.count.mockResolvedValue(0);
      mockPrisma.reserva.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.crear({
        clienteId: 'c-001',
        clienteNombre: 'Juan',
        clienteTelefono: '999',
        fecha: '2026-06-15',
        hora: '19:00',
        mesaPreferida: 5,
        numComensales: 4,
      })).rejects.toThrow('No hay disponibilidad');
    });

    it('re-lanza errores que no son de unicidad', async () => {
      mockPrisma.reserva.count.mockResolvedValue(0);
      mockPrisma.$transaction.mockRejectedValue(new Error('db timeout'));

      await expect(service.crear({
        clienteId: 'c-001',
        clienteNombre: 'Juan',
        clienteTelefono: '999',
        fecha: '2026-06-15',
        hora: '19:00',
        mesaPreferida: 5,
        numComensales: 4,
      })).rejects.toThrow('db timeout');
    });
  });

  describe('confirmar', () => {
    it('debe confirmar una reserva pendiente', async () => {
      mockPrisma.reserva.findUnique.mockResolvedValue(reservaBase);
      mockPrisma.reserva.update.mockResolvedValue({ ...reservaBase, estado: ReservaEstado.Confirmada });

      const result = await service.confirmar('r-001');
      expect(result.reserva.estado).toBe(ReservaEstado.Confirmada);
    });

    it('debe lanzar ConflictException si ya esta confirmada', async () => {
      mockPrisma.reserva.findUnique.mockResolvedValue({ ...reservaBase, estado: ReservaEstado.Confirmada });
      await expect(service.confirmar('r-001')).rejects.toThrow('Solo se pueden confirmar reservas pendientes');
    });
  });

  describe('cancelar', () => {
    it('debe cancelar una reserva y publicar evento', async () => {
      mockPrisma.reserva.findUnique.mockResolvedValue(reservaBase);
      mockPrisma.reserva.update.mockResolvedValue({ ...reservaBase, estado: ReservaEstado.Cancelada });

      const result = await service.cancelar('r-001', 'Cliente cancelo');
      expect(result.reserva.estado).toBe(ReservaEstado.Cancelada);
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          routingKey: RoutingKeys.ReservaCancelada,
          payload: JSON.stringify({ reservaId: 'r-001', motivo: 'Cliente cancelo' }),
          status: 'PENDING',
        }),
      });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockPrisma.reserva.findUnique.mockResolvedValue(null);
      await expect(service.cancelar('inexistente')).rejects.toThrow('no encontrada');
    });
  });
});

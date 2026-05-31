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
      expect(result.reservas).toHaveLength(1);
    });

    it('debe retornar array vacio si no hay reservas', async () => {
      mockPrisma.reserva.findMany.mockResolvedValue([]);
      const result = await service.listar();
      expect(result.reservas).toEqual([]);
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

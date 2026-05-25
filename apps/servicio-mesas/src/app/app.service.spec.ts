import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppService } from './app.service';
import { MesaEstado } from '@org/contracts';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  return { ...overrides } as any;
}

describe('AppService — Mesas', () => {
  let service: AppService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  const mesaBase = {
    id: 'm-001',
    numero: 5,
    capacidad: 4,
    ubicacion: 'Salon Principal',
    estado: MesaEstado.Libre,
    cuentaAsociada: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPrisma = createMockPrismaService({
      mesa: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    });
    service = new AppService(mockPrisma);
  });

  describe('listarMesas', () => {
    it('debe retornar todas las mesas ordenadas por numero', async () => {
      mockPrisma.mesa.findMany.mockResolvedValue([mesaBase]);
      const result = await service.listarMesas();
      expect(result.mesas).toHaveLength(1);
      expect(mockPrisma.mesa.findMany).toHaveBeenCalledWith({ orderBy: { numero: 'asc' } });
    });

    it('debe retornar array vacio si no hay mesas', async () => {
      mockPrisma.mesa.findMany.mockResolvedValue([]);
      const result = await service.listarMesas();
      expect(result.mesas).toEqual([]);
    });
  });

  describe('crearMesa', () => {
    it('debe crear una mesa exitosamente', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(null);
      mockPrisma.mesa.create.mockResolvedValue(mesaBase);
      const result = await service.crearMesa({ numero: 5, capacidad: 4 });
      expect(result.message).toBe('Mesa creada exitosamente');
      expect(mockPrisma.mesa.create).toHaveBeenCalledWith({
        data: { numero: 5, capacidad: 4, ubicacion: 'Salon Principal', estado: MesaEstado.Libre },
      });
    });

    it('debe lanzar ConflictException si el numero ya existe', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(mesaBase);
      await expect(service.crearMesa({ numero: 5, capacidad: 4 })).rejects.toThrow('ya existe');
    });
  });

  describe('actualizarEstado', () => {
    it('debe actualizar el estado de una mesa', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(mesaBase);
      mockPrisma.mesa.update.mockResolvedValue({ ...mesaBase, estado: MesaEstado.Ocupada });
      const result = await service.actualizarEstado('m-001', { estado: MesaEstado.Ocupada });
      expect(result.mesa.estado).toBe(MesaEstado.Ocupada);
    });

    it('debe lanzar NotFoundException si la mesa no existe', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(null);
      await expect(service.actualizarEstado('inexistente', { estado: MesaEstado.Ocupada })).rejects.toThrow('no encontrada');
    });
  });

  describe('obtenerMesa', () => {
    it('debe retornar la mesa por id', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(mesaBase);
      const result = await service.obtenerMesa('m-001');
      expect(result.id).toBe('m-001');
    });

    it('debe lanzar NotFoundException si la mesa no existe', async () => {
      mockPrisma.mesa.findUnique.mockResolvedValue(null);
      await expect(service.obtenerMesa('inexistente')).rejects.toThrow('no encontrada');
    });
  });
});

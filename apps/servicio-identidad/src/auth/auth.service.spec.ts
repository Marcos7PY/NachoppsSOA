import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RolUsuario } from '@org/contracts';

function createMockPrismaService(overrides: Record<string, any> = {}) {
  return {
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    usuario: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    auditoriaLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    ...overrides,
  } as any;
}

function createMockJwtService() {
  return {
    sign: vi.fn().mockReturnValue('fake-access-token'),
    verify: vi
      .fn()
      .mockReturnValue({ sub: 'u-001', email: 'admin@test.com', rol: 'ADMIN' }),
  } as any;
}

function createMockPublisher() {
  return { publish: vi.fn().mockResolvedValue(undefined) };
}

describe('AuthService — Identidad', () => {
  let service: AuthService;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;
  let mockJwt: ReturnType<typeof createMockJwtService>;
  let mockPublisher: ReturnType<typeof createMockPublisher>;

  const usuarioBase = {
    id: 'u-001',
    nombre: 'Admin',
    email: 'admin@nachopps.com',
    password: 'hashed_password',
    rol: 'ADMIN',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = createMockPrismaService();
    mockJwt = createMockJwtService();
    mockPublisher = createMockPublisher();

    service = new AuthService(mockPrisma, mockJwt, mockPublisher as any);

    vi.mock('bcrypt', () => ({
      default: {
        compare: vi.fn().mockResolvedValue(true),
        hash: vi.fn().mockResolvedValue('hashed_password'),
      },
      compare: vi.fn().mockResolvedValue(true),
      hash: vi.fn().mockResolvedValue('hashed_password'),
    }));
  });

  describe('validarToken', () => {
    it('debe validar un token correctamente', async () => {
      const result = await service.validarToken('fake-token');
      expect(result.valid).toBe(true);
      expect(result.payload.sub).toBe('u-001');
    });

    it('debe lanzar UnauthorizedException si el token es invalido', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('invalid');
      });
      await expect(service.validarToken('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('cambiarRol', () => {
    it('debe cambiar el rol de un usuario', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(usuarioBase);
      mockPrisma.usuario.update.mockResolvedValue({
        ...usuarioBase,
        rol: 'MESERO',
      });
      mockPrisma.auditoriaLog.create.mockResolvedValue({});

      const result = await service.cambiarRol('u-001', {
        rol: RolUsuario.MESERO,
      });
      expect(result.rol).toBe('MESERO');
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(
        service.cambiarRol('inexistente', { rol: RolUsuario.MESERO }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerPerfil', () => {
    it('debe retornar el perfil del usuario', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(usuarioBase);
      const result = await service.obtenerPerfil('u-001');
      expect(result.email).toBe('admin@nachopps.com');
      expect(result.rol).toBe('ADMIN');
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(service.obtenerPerfil('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('crearUsuario', () => {
    it('debe crear un usuario nuevo', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockPrisma.usuario.create.mockResolvedValue({
        ...usuarioBase,
        nombre: 'Nuevo',
        email: 'nuevo@test.com',
        rol: 'MESERO',
      });
      mockPrisma.auditoriaLog.create.mockResolvedValue({});

      const result = await service.crearUsuario({
        nombre: 'Nuevo',
        email: 'nuevo@test.com',
        password: '123456',
        rol: RolUsuario.MESERO,
      });

      expect(result.email).toBe('nuevo@test.com');
      expect(result.rol).toBe('MESERO');
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(usuarioBase);
      await expect(
        service.crearUsuario({
          nombre: 'Duplicado',
          email: 'admin@nachopps.com',
          password: '123456',
          rol: RolUsuario.MESERO,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('listarUsuarios', () => {
    it('debe listar todos los usuarios', async () => {
      mockPrisma.usuario.findMany.mockResolvedValue([usuarioBase]);
      const result = await service.listarUsuarios();
      expect(result).toHaveLength(1);
    });

    it('debe retornar array vacio si no hay usuarios', async () => {
      mockPrisma.usuario.findMany.mockResolvedValue([]);
      const result = await service.listarUsuarios();
      expect(result).toEqual([]);
    });
  });
});

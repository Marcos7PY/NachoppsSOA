import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RolUsuario } from '@org/contracts';

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('hashed_password'),
  },
  compare: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

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
      expect(result.data).toHaveLength(1);
    });

    it('debe retornar array vacio si no hay usuarios', async () => {
      mockPrisma.usuario.findMany.mockResolvedValue([]);
      const result = await service.listarUsuarios();
      expect(result.data).toEqual([]);
    });
  });

  describe('refresh tokens (plan 1.4)', () => {
    it('issueRefreshToken guarda el hash (no el token) y devuelve el valor en claro', async () => {
      mockPrisma.refreshToken.create.mockResolvedValue({});
      const r = await service.issueRefreshToken('u-001');
      expect(typeof r.token).toBe('string');
      expect(r.token.length).toBeGreaterThan(20);
      const arg = mockPrisma.refreshToken.create.mock.calls[0][0];
      expect(arg.data.userId).toBe('u-001');
      expect(arg.data.tokenHash).toMatch(/^[a-f0-9]{64}$/);
      expect(arg.data.tokenHash).not.toBe(r.token);
      expect(arg.data.expiresAt).toBeInstanceOf(Date);
    });

    it('rota: emite uno nuevo, revoca el anterior y devuelve access', async () => {
      mockPrisma.refreshToken.findUnique
        .mockResolvedValueOnce({ id: 'rt-1', userId: 'u-001', revokedAt: null, expiresAt: new Date(Date.now() + 1e6) })
        .mockResolvedValueOnce({ id: 'rt-2' });
      mockPrisma.usuario.findUnique.mockResolvedValue(usuarioBase);
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.refreshToken.update.mockResolvedValue({});

      const r = await service.rotateRefreshToken('raw-token');
      expect(r.access_token).toBe('fake-access-token');
      expect(r.usuario.id).toBe('u-001');
      expect(typeof r.refresh.token).toBe('string');
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'rt-1' }, data: expect.objectContaining({ replacedById: 'rt-2' }) }),
      );
    });

    it('detecta reuso: token revocado revoca toda la cadena y rechaza', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({ id: 'rt-1', userId: 'u-001', revokedAt: new Date(), expiresAt: new Date(Date.now() + 1e6) });
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });
      await expect(service.rotateRefreshToken('raw')).rejects.toBeInstanceOf(UnauthorizedException);
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'u-001', revokedAt: null } }),
      );
    });

    it('rechaza un token expirado', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({ id: 'rt-1', userId: 'u-001', revokedAt: null, expiresAt: new Date(Date.now() - 1000) });
      await expect(service.rotateRefreshToken('raw')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rechaza un token inexistente', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.rotateRefreshToken('raw')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('revokeRefreshTokenByRaw revoca el token presentado y es no-op sin token', async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
      await service.revokeRefreshTokenByRaw('raw');
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
      await service.revokeRefreshTokenByRaw(null);
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
    });
  });
});

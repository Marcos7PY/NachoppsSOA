import { describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller';

function createResponse() {
  return {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  };
}

describe('AuthController', () => {
  it('expone health check del servicio', () => {
    const controller = new AuthController({} as any);

    expect(controller.healthCheck()).toEqual({
      status: 'OK',
      service: 'Identidad',
    });
  });

  it('login delega en AuthService y configura cookies access/refresh/CSRF', async () => {
    const authService = {
      login: vi.fn().mockResolvedValue({
        access_token: 'jwt-token',
        usuario: { id: 'user-1', email: 'admin@test.com', rol: 'ADMIN' },
      }),
      issueRefreshToken: vi.fn().mockResolvedValue({ token: 'refresh-1', expiresAt: new Date() }),
    };
    const response = createResponse();
    const controller = new AuthController(authService as any);

    const result = await controller.login(
      { email: 'admin@test.com', password: 'secret' },
      response as any,
    );

    expect(result.access_token).toBe('jwt-token');
    expect(typeof result.expires_in).toBe('number');
    expect(authService.issueRefreshToken).toHaveBeenCalledWith('user-1');
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'jwt-token',
      expect.objectContaining({ httpOnly: true, sameSite: 'strict', path: '/' }),
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-1',
      expect.objectContaining({ httpOnly: true, sameSite: 'strict', path: '/' }),
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'nachopps.csrf_token',
      expect.any(String),
      expect.objectContaining({ httpOnly: false, sameSite: 'strict', path: '/' }),
    );
  });

  it('refresh rota el token y devuelve un nuevo access', async () => {
    const authService = {
      rotateRefreshToken: vi.fn().mockResolvedValue({
        access_token: 'new-access',
        refresh: { token: 'refresh-2', expiresAt: new Date() },
        usuario: { id: 'user-1' },
      }),
    };
    const response = createResponse();
    const controller = new AuthController(authService as any);

    const result = await controller.refresh(
      { cookies: { refresh_token: 'refresh-1' } } as any,
      {} as any,
      response as any,
    );

    expect(authService.rotateRefreshToken).toHaveBeenCalledWith('refresh-1');
    expect(result.access_token).toBe('new-access');
    expect(typeof result.expires_in).toBe('number');
    expect(response.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-2', expect.any(Object));
  });

  it('refresh sin token responde 401', async () => {
    const controller = new AuthController({} as any);
    await expect(
      controller.refresh({ cookies: {} } as any, {} as any, createResponse() as any),
    ).rejects.toThrowError();
  });

  it('logout revoca el refresh y limpia las tres cookies', async () => {
    const response = createResponse();
    const authService = { revokeRefreshTokenByRaw: vi.fn().mockResolvedValue(undefined) };
    const controller = new AuthController(authService as any);

    await expect(
      controller.logout({ cookies: { refresh_token: 'r1' } } as any, response as any),
    ).resolves.toEqual({
      success: true,
      message: 'Sesión cerrada correctamente en el servidor',
    });

    expect(authService.revokeRefreshTokenByRaw).toHaveBeenCalledWith('r1');
    expect(response.clearCookie).toHaveBeenCalledWith('access_token', expect.objectContaining({ httpOnly: true, path: '/' }));
    expect(response.clearCookie).toHaveBeenCalledWith('refresh_token', expect.objectContaining({ httpOnly: true, path: '/' }));
    expect(response.clearCookie).toHaveBeenCalledWith('nachopps.csrf_token', expect.objectContaining({ httpOnly: false, path: '/' }));
  });

  it('delega endpoints protegidos y publicos al servicio', async () => {
    const authService = {
      obtenerPerfil: vi.fn().mockResolvedValue({ id: 'user-1' }),
      crearUsuario: vi.fn().mockResolvedValue({ id: 'new-user' }),
      listarUsuarios: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      cambiarRol: vi.fn().mockResolvedValue({ id: 'user-1', rol: 'ADMIN' }),
    };
    const controller = new AuthController(authService as any);

    expect(await controller.me({ user: { sub: 'user-1' } })).toEqual({ id: 'user-1' });
    expect(await controller.crearUsuario({ email: 'a@test.com' } as any)).toEqual({
      id: 'new-user',
    });
    expect(await controller.listarUsuarios({ limit: 10 } as any)).toEqual({
      items: [],
      total: 0,
    });
    expect(
      await controller.cambiarRol('user-1', { rol: 'ADMIN' } as any, { user: { sub: 'admin-1' } }),
    ).toEqual({
      id: 'user-1',
      rol: 'ADMIN',
    });
  });
});

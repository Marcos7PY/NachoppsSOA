import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { RolesGuard } from './roles.guard';

function contextWithUser(user: unknown): ExecutionContext {
  return {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('permite rutas sin roles requeridos', () => {
    const guard = new RolesGuard({
      getAllAndOverride: vi.fn().mockReturnValue(undefined),
    } as any);

    expect(guard.canActivate(contextWithUser(undefined))).toBe(true);
  });

  it('permite usuarios cuyo rol coincide con la ruta', () => {
    const guard = new RolesGuard({
      getAllAndOverride: vi.fn().mockReturnValue(['ADMIN', 'GERENCIA']),
    } as any);

    expect(guard.canActivate(contextWithUser({ rol: 'ADMIN' }))).toBe(true);
  });

  it('rechaza usuarios sin rol permitido', () => {
    const guard = new RolesGuard({
      getAllAndOverride: vi.fn().mockReturnValue(['ADMIN']),
    } as any);

    expect(() => guard.canActivate(contextWithUser({ rol: 'MESERO' }))).toThrow(
      ForbiddenException,
    );
  });
});

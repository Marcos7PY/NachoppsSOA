import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import type { ExecutionContext } from '@nestjs/common';

function makeContext(user: unknown, handler = {}, cls = {}): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('devuelve true cuando no hay @Roles declarado (endpoint abierto)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = makeContext(null);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('devuelve true cuando @Roles está vacío', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const ctx = makeContext(null);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('devuelve true cuando el rol del usuario coincide', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const ctx = makeContext({ rol: 'ADMIN' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('devuelve true con múltiples roles permitidos y rol válido', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'GERENCIA']);
    const ctx = makeContext({ rol: 'GERENCIA' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('lanza ForbiddenException cuando el rol no coincide', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const ctx = makeContext({ rol: 'CAJERO' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('lanza ForbiddenException cuando no hay usuario (req.user = null)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const ctx = makeContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('lanza ForbiddenException cuando req.user es undefined', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['MESERO']);
    const ctx = makeContext(undefined);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('el mensaje de ForbiddenException menciona el rol requerido', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'SISTEMA']);
    const ctx = makeContext({ rol: 'CAJERO' });
    expect(() => guard.canActivate(ctx)).toThrow('ADMIN | SISTEMA');
  });

  it('pasa handler y class al reflector (cobertura de ramas)', () => {
    const spy = vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const handler = function handler() { return; };
    const cls = class TestClass {};
    const ctx = makeContext({ rol: 'ADMIN' }, handler, cls);
    guard.canActivate(ctx);
    expect(spy).toHaveBeenCalledWith(expect.any(String), [handler, cls]);
  });
});

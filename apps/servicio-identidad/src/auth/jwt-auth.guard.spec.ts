import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nestjs/passport', () => ({
  AuthGuard: () =>
    class {
      async canActivate() {
        return true;
      }
    },
}));

import { JwtAuthGuard } from './jwt-auth.guard';

function contextFor(request: Record<string, unknown>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('JwtAuthGuard de identidad', () => {
  const guard = new JwtAuthGuard();

  it.each(['GET', 'HEAD', 'OPTIONS'])(
    'permite %s autenticado sin validar CSRF',
    async (method) => {
      await expect(
        guard.canActivate(
          contextFor({
            method,
            headers: {},
            cookies: {},
          }),
        ),
      ).resolves.toBe(true);
    },
  );

  it.each(['POST', 'PATCH', 'DELETE'])(
    'rechaza %s cookie-only sin header CSRF',
    async (method) => {
      await expect(
        guard.canActivate(
          contextFor({
            method,
            headers: {},
            cookies: { 'nachopps.csrf_token': 'csrf-token' },
          }),
        ),
      ).rejects.toThrow(ForbiddenException);
    },
  );

  it.each(['POST', 'PATCH', 'DELETE'])(
    'permite %s cookie-only cuando cookie y header CSRF coinciden',
    async (method) => {
      await expect(
        guard.canActivate(
          contextFor({
            method,
            headers: { 'x-csrf-token': 'csrf-token' },
            cookies: { 'nachopps.csrf_token': 'csrf-token' },
          }),
        ),
      ).resolves.toBe(true);
    },
  );

  it.each(['POST', 'PATCH', 'DELETE'])(
    'permite %s service-to-service con Authorization Bearer sin CSRF',
    async (method) => {
      await expect(
        guard.canActivate(
          contextFor({
            method,
            headers: { authorization: 'Bearer service-token' },
            cookies: {},
          }),
        ),
      ).resolves.toBe(true);
    },
  );
});

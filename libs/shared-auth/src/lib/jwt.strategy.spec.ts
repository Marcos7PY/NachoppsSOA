import { describe, it, expect } from 'vitest';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy (shared-auth)', () => {
  it('exige JWT_PUBLIC_KEY al inicializar', () => {
    const pub = process.env.JWT_PUBLIC_KEY;
    const svc = process.env.SERVICE_JWT_SECRET;
    delete process.env.JWT_PUBLIC_KEY;
    process.env.SERVICE_JWT_SECRET = 's';

    expect(() => new JwtStrategy()).toThrow(/JWT_PUBLIC_KEY/);

    process.env.JWT_PUBLIC_KEY = pub;
    process.env.SERVICE_JWT_SECRET = svc;
  });

  it('valida y proyecta los campos de identidad del payload', async () => {
    const pub = process.env.JWT_PUBLIC_KEY;
    const svc = process.env.SERVICE_JWT_SECRET;
    process.env.JWT_PUBLIC_KEY = 'dummy-public';
    process.env.SERVICE_JWT_SECRET = 'dummy-service';

    const strategy = new JwtStrategy();
    await expect(
      strategy.validate({ sub: 'u1', email: 'a@b.com', rol: 'ADMIN', nombre: 'Ana', extra: 'ignored' }),
    ).resolves.toEqual({ sub: 'u1', email: 'a@b.com', rol: 'ADMIN', nombre: 'Ana' });

    process.env.JWT_PUBLIC_KEY = pub;
    process.env.SERVICE_JWT_SECRET = svc;
  });
});

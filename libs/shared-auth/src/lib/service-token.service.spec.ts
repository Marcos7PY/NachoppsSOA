import { describe, it, expect, vi } from 'vitest';
import { ServiceTokenService } from './service-token.service';
import { JwtService } from '@nestjs/jwt';

describe('ServiceTokenService', () => {
  it('firma un token de servicio con rol SISTEMA, aud destino y expiración 1h', () => {
    const jwt = { sign: vi.fn().mockReturnValue('signed-token') };
    const svc = new ServiceTokenService(jwt as unknown as JwtService);

    const token = svc.generateServiceToken('servicio-caja', 'servicio-cuentas');

    expect(token).toBe('signed-token');
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: 'servicio-caja', email: 'servicio-caja@internal', rol: 'SISTEMA', aud: 'servicio-cuentas' },
      { expiresIn: '1h' },
    );
  });
});

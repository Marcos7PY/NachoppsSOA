import { describe, it, expect, vi } from 'vitest';
import { ServiceTokenService } from './service-token.service';

describe('ServiceTokenService', () => {
  it('firma un token de servicio con rol SISTEMA y expiración 1h', () => {
    const jwt = { sign: vi.fn().mockReturnValue('signed-token') };
    const svc = new ServiceTokenService(jwt as any);

    const token = svc.generateServiceToken('servicio-caja');

    expect(token).toBe('signed-token');
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: 'servicio-caja', email: 'servicio-caja@internal', rol: 'SISTEMA' },
      { expiresIn: '1h' },
    );
  });
});

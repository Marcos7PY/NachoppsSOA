import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServiceTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Emite un token S2S (rol SISTEMA, HS256). T-17: incluye el claim `aud` con el
   * servicio destino para que un token robado no funcione como pase maestro plano —
   * solo lo acepta el servicio cuyo `SERVICE_NAME` coincide con `audience`.
   * Se firma `aud` en el payload (no vía la opción `audience` de jsonwebtoken) para
   * no interferir con los tokens RS256 de usuario, que no llevan `aud`.
   */
  generateServiceToken(serviceName: string, audience: string): string {
    return this.jwtService.sign(
      { sub: serviceName, email: `${serviceName}@internal`, rol: 'SISTEMA', aud: audience },
      { expiresIn: '1h' },
    );
  }
}

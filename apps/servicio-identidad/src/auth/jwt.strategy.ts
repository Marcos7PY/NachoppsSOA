import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Estrategia Passport-JWT.
 * Extrae el Bearer token del header Authorization y verifica
 * la firma HS256 con JWT_SECRET.
 *
 * El payload decodificado se inyecta en `req.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'nachopps_jwt_secret_dev',
    });
  }

  /** Retorna el payload que se asigna a `req.user`. */
  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}

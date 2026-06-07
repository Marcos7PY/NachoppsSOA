import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';
import {
  getJwtPublicKey,
  getServiceJwtSecret,
  makeJwtSecretOrKeyProvider,
  JWT_VERIFY_ALGORITHMS,
} from './jwt-keys';

const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  return req?.cookies?.['access_token'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1º cookie httpOnly, 2º header Bearer (fallback no-breaking)
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      // Verifica RS256 (usuario, clave pública) y HS256 (servicio, secreto).
      secretOrKeyProvider: makeJwtSecretOrKeyProvider(getJwtPublicKey(), getServiceJwtSecret()),
      algorithms: [...JWT_VERIFY_ALGORITHMS],
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      rol: payload.rol,
      nombre: payload.nombre,
    };
  }
}

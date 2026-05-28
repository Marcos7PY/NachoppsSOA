import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServiceTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateServiceToken(serviceName: string): string {
    return this.jwtService.sign(
      { sub: serviceName, email: `${serviceName}@internal`, rol: 'SISTEMA' },
      { expiresIn: '1h' },
    );
  }
}

import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ServiceTokenService } from './service-token.service';
import { getServiceJwtSecret } from './jwt-keys';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Este JwtModule firma los tokens de SERVICIO (S2S) en HS256 con el secreto
    // dedicado. Los tokens de usuario los firma identidad en RS256 (su propio
    // AuthModule). Verlo en jwt-keys.ts.
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getServiceJwtSecret(),
        signOptions: { algorithm: 'HS256', expiresIn: '1h', issuer: 'nachopps-service' },
      }),
    }),
  ],
  providers: [JwtStrategy, ServiceTokenService],
  exports: [JwtModule, PassportModule, ServiceTokenService],
})
export class SharedAuthModule {}

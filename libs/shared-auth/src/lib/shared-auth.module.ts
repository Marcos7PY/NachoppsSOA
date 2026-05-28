import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ServiceTokenService } from './service-token.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET env variable is required');
        return { secret, signOptions: { expiresIn: '24h', issuer: 'nachopps-identidad' } };
      }
    }),
  ],
  providers: [JwtStrategy, ServiceTokenService],
  exports: [JwtModule, PassportModule, ServiceTokenService],
})
export class SharedAuthModule {}

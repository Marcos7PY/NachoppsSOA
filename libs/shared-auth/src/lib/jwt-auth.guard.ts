import {
  ForbiddenException,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.path === '/api/telemetry/metrics' ||
      request.path === '/telemetry/metrics'
    ) {
      return true;
    }

    const authenticated = await (super.canActivate(
      context,
    ) as Promise<boolean>);
    this.assertCsrfToken(request);
    return authenticated;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }

  private assertCsrfToken(request: Request) {
    if (SAFE_METHODS.has(String(request.method).toUpperCase())) return;

    const authorization = request.headers?.authorization;
    if (
      typeof authorization === 'string' &&
      authorization.toLowerCase().startsWith('bearer ')
    )
      return;

    const cookieToken = request.cookies?.['nachopps.csrf_token'];
    const headerToken = request.headers?.['x-csrf-token'];
    const normalizedHeader = Array.isArray(headerToken)
      ? headerToken[0]
      : headerToken;

    if (!cookieToken || !normalizedHeader || cookieToken !== normalizedHeader) {
      throw new ForbiddenException('Token CSRF inválido o ausente');
    }
  }
}

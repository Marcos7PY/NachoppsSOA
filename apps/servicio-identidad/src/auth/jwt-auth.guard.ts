import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Guard que exige un JWT Bearer válido en la petición. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await (super.canActivate(
      context,
    ) as Promise<boolean>);
    const request = context.switchToHttp().getRequest();

    if (!SAFE_METHODS.has(String(request.method).toUpperCase())) {
      const authorization = request.headers?.authorization;
      if (
        typeof authorization === 'string' &&
        authorization.toLowerCase().startsWith('bearer ')
      ) {
        return authenticated;
      }

      const cookieToken = request.cookies?.['nachopps.csrf_token'];
      const headerToken = request.headers?.['x-csrf-token'];
      const normalizedHeader = Array.isArray(headerToken)
        ? headerToken[0]
        : headerToken;

      if (
        !cookieToken ||
        !normalizedHeader ||
        cookieToken !== normalizedHeader
      ) {
        throw new ForbiddenException('Token CSRF inválido o ausente');
      }
    }

    return authenticated;
  }
}

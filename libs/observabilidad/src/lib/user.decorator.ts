import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    if (ctx.getType() !== 'http') return null;
    const request = ctx.switchToHttp().getRequest();
    // request.user lo popula la JwtStrategy DESPUÉS de verificar firma + expiración
    return request.user?.sub ?? null;
  },
);

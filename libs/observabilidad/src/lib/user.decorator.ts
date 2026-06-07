import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type UsuarioActualField = 'sub' | 'email' | 'rol' | 'nombre' | 'payload';

export const UsuarioActual = createParamDecorator(
  (data: UsuarioActualField | undefined, ctx: ExecutionContext): string | Record<string, unknown> | null => {
    if (ctx.getType() !== 'http') return null;
    const request = ctx.switchToHttp().getRequest();
    // request.user lo popula la JwtStrategy DESPUÉS de verificar firma + expiración
    if (data === 'payload') return request.user ?? null;
    if (data) return request.user?.[data] ?? null;
    return request.user?.sub ?? null;
  },
);

import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const logger = new Logger('UsuarioActualDecorator');
    
    // Solo funciona en contexto HTTP
    if (ctx.getType() !== 'http') {
      return null;
    }

    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Decodificar el JWT sin verificar la firma (Kong ya lo hizo en el API Gateway)
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      return payload.sub || null;
    } catch (error) {
      logger.error('Error al decodificar el token JWT para auditoría', error);
      return null;
    }
  },
);

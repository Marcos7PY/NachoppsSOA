import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de excepciones unificado (T-11).
 *
 * Antes existían 9 copias idénticas (una por servicio); ahora vive en
 * `libs/observabilidad` y lo aplica por defecto `bootstrapNachoppsService`.
 * Normaliza cualquier excepción a un JSON estable y registra el error.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: unknown =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (exception && typeof exception === 'object' && 'code' in exception) {
      const code = (exception as { code?: string }).code;
      if (code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Conflicto: registro duplicado (P2002)';
      } else if (code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Registro no encontrado (P2025)';
      }
    }

    this.logger.error(
      `HTTP ${status} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'string'
          ? message
          : (message as { message?: string }).message ?? 'Internal server error',
    });
  }
}

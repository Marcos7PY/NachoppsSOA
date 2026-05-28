import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';
import { context, propagation } from '@opentelemetry/api';

@Injectable()
export class RabbitMQRetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RabbitMQRetryInterceptor.name);

  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = executionContext.getType();

    if (ctxType !== 'rpc' && (ctxType as string) !== 'rmq') {
      return next.handle();
    }

    const rmqContext = ctxType === 'rpc'
      ? executionContext.switchToRpc().getContext<RmqContext>()
      : (executionContext as any).args?.[1] as RmqContext | undefined;

    const channel = rmqContext?.getChannelRef?.() || null;
    const originalMsg = rmqContext?.getMessage?.() || null;

    const maxRetries = 3;
    const initialDelay = 1000;

    // Extracción de OpenTelemetry
    let currentCtx = context.active();
    if (originalMsg?.properties?.headers) {
      currentCtx = propagation.extract(currentCtx, originalMsg.properties.headers);
    }

    return context.with(currentCtx, () => {
      return next.handle().pipe(
      tap(() => {
        if (channel && originalMsg) {
          try { channel.ack(originalMsg); } catch { /* ignore */ }
        }
      }),
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;
            if (retryAttempt > maxRetries) {
              this.logger.error(
                `Reintentos agotados (${maxRetries}). Mandando a DLQ. Error: ${error.message}`
              );
              if (channel && originalMsg) {
                try { channel.nack(originalMsg, false, false); } catch { /* ignore */ }
              }
              return throwError(() => error);
            }

            const delayMs = initialDelay * Math.pow(2, index);
            this.logger.warn(
              `Fallo en el consumidor. Reintento ${retryAttempt}/${maxRetries} en ${delayMs}ms. Error: ${error.message}`
            );
            return timer(delayMs);
          }),
        ),
      ),
    );
    });
  }
}

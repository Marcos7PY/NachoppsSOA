import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RabbitMQRetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RabbitMQRetryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType();

    if (ctxType !== 'rpc' && (ctxType as string) !== 'rmq') {
      return next.handle();
    }

    const rmqContext = ctxType === 'rpc'
      ? context.switchToRpc().getContext<RmqContext>()
      : (context as any).args?.[1] as RmqContext | undefined;

    const channel = rmqContext?.getChannelRef?.() || null;
    const originalMsg = rmqContext?.getMessage?.() || null;

    const maxRetries = 3;
    const initialDelay = 1000;

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
  }
}

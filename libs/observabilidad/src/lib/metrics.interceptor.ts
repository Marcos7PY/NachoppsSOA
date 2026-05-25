import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly requestCounter: Counter<string>;
  private readonly requestDuration: Histogram<string>;

  constructor() {
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Número total de peticiones HTTP',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.requestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duración de peticiones HTTP en segundos',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, route, url } = req;
    const path = route ? route.path : url;
    
    const endTimer = this.requestDuration.startTimer();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = res.statusCode;
          this.requestCounter.inc({ method, route: path, status_code: statusCode });
          endTimer({ method, route: path, status_code: statusCode });
        },
        error: (err) => {
          const statusCode = err.status || 500;
          this.requestCounter.inc({ method, route: path, status_code: statusCode });
          endTimer({ method, route: path, status_code: statusCode });
        },
      })
    );
  }
}

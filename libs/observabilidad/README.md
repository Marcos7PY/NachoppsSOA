# observabilidad

Tracing (OpenTelemetry), métricas (Prometheus) y logging (Winston) compartidos,
más el **bootstrap unificado** de los microservicios.

## `bootstrapNachoppsService` (T-10)

Las 9 copias de `main.ts` diferían solo en nombre de servicio, cola/DLQ,
metadatos de Swagger y puerto. `bootstrapNachoppsService` centraliza el resto
(fail-fast de `RABBITMQ_URI`, Winston, prefijo `api`, cookieParser, helmet, CORS,
`ValidationPipe`, filtro global, transporte RMQ con DLX y Swagger fuera de prod).

**Orden de carga (importante).** `initTracing()` debe ejecutarse **antes** de
importar Nest para que la auto-instrumentación de OpenTelemetry parchee
http/amqp/pg. Por eso el bootstrap vive **fuera** del barrel `@org/observabilidad`
(que es ligero) y se importa en un segundo paso desde
`@org/observabilidad/bootstrap`. El `main.ts` resultante:

```ts
import { initTracing } from '@org/observabilidad';
initTracing('servicio-pedidos');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-pedidos', module: AppModule, queue: 'pedidos_queue', defaultPort: 3000,
  swagger: { title: '… API Pedidos', description: '…' },
  exceptionFilter: new GlobalExceptionFilter(),
});
```

Servicios sin cola consumidora (identidad, reservas) omiten `queue`: no se levanta
microservicio RMQ. `dotenv` se carga en `main.ts` (necesita el `__dirname` del app
y debe correr antes de importar `AppModule`, que lee `process.env` al construirse).

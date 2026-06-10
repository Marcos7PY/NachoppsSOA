import { initTracing } from '@org/observabilidad';
initTracing('servicio-caja');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-caja', module: AppModule, queue: 'caja_queue', defaultPort: 3009,
  swagger: { title: 'Nachopps Restobar — API Caja', description: 'Turnos, pagos mixtos, arqueos y caja chica' },
  exceptionFilter: new GlobalExceptionFilter(),
});

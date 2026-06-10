import { initTracing } from '@org/observabilidad';
initTracing('servicio-mesas');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-mesas', module: AppModule, queue: 'mesas_queue', defaultPort: 3002,
  swagger: { title: 'Nachopps Restobar — API Mesas', description: 'Mapa de mesas, estados y liberación automática' },
  exceptionFilter: new GlobalExceptionFilter(),
});

import { initTracing } from '@org/observabilidad';
initTracing('servicio-reportes');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-reportes', module: AppModule, queue: 'reportes_queue', defaultPort: 3004,
  swagger: { title: 'Nachopps Restobar — API Reportes', description: 'Snapshots, ventas diarias y dashboard' },
  exceptionFilter: new GlobalExceptionFilter(),
});

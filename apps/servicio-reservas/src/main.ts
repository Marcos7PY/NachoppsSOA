import { initTracing } from '@org/observabilidad';
initTracing('servicio-reservas');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-reservas', module: AppModule, defaultPort: 3006,
  swagger: { title: 'Nachopps Restobar — API Reservas', description: 'Agenda, confirmación y disponibilidad de reservas' },
  exceptionFilter: new GlobalExceptionFilter(),
});

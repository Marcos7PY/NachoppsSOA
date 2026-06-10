import { initTracing } from '@org/observabilidad';
initTracing('servicio-identidad');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });
import { bootstrapNachoppsService } from '@org/observabilidad/bootstrap';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

void bootstrapNachoppsService({
  serviceName: 'servicio-identidad', module: AppModule, defaultPort: 3001,
  swagger: { title: 'Nachopps Restobar — API Identidad', description: 'Autenticación JWT, gestión de usuarios, roles y refresh tokens' },
  exceptionFilter: new GlobalExceptionFilter(),
});

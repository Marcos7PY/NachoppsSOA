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
  swagger: { title: 'Nachopps Restobar — API Pedidos', description: 'Comandas, saga de pedidos, modificadores y KDS' },
  exceptionFilter: new GlobalExceptionFilter(),
});

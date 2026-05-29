import { initTracing } from '@org/observabilidad';
initTracing('servicio-reportes');

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser = require('cookie-parser');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Reportes')
    .setDescription('Snapshots, ventas diarias y dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env['RABBITMQ_URI'] || 'amqp://nachopps:nachopps_secret@localhost:5672'],
      queue: 'reportes_queue',
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'NACHOPPS_DLX',
          'x-dead-letter-routing-key': 'dlq.reportes_queue'
        }
      },
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3004;
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(`🚀 Servicio de Reportes corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
  Logger.log(`🚀 RabbitMQ conectado a queue: reportes_queue`);
}

bootstrap();

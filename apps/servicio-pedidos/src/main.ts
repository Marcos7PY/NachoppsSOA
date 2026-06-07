import { initTracing } from '@org/observabilidad';
initTracing('servicio-pedidos');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import cookieParser = require('cookie-parser');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import helmet from 'helmet';
import { buildHelmetOptions } from '@org/shared-auth';

async function bootstrap() {
  if (!process.env.RABBITMQ_URI) {
    throw new Error('RABBITMQ_URI environment variable is required');
  }
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // Logger JSON estructurado con trace_id/correlationId (plan 5.1).
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableShutdownHooks();
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.use(helmet(buildHelmetOptions()));

  app.enableCors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:4200'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'pedidos_queue',
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'NACHOPPS_DLX',
          'x-dead-letter-routing-key': 'dlq.pedidos_queue',
        },
      },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      noAck: false,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nachopps Restobar — API Pedidos')
      .setDescription('Comandas, saga de pedidos, modificadores y KDS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    Logger.log(`📄 Swagger: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  const port = process.env.PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Servicio Pedidos corriendo en: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

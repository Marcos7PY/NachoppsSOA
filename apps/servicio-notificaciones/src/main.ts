import { initTracing } from '@org/observabilidad';
initTracing('servicio-notificaciones');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { CONSUMER_BINDING_ALL_DOMAIN_EVENTS } from '@org/contracts';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const RABBITMQ_URI = process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URI],
      queue: 'notificaciones_queue',
      queueOptions: { durable: true },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      routingKey: CONSUMER_BINDING_ALL_DOMAIN_EVENTS,
      noAck: false,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Notificaciones')
    .setDescription('WebSockets, push notifications y auditoría de eventos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3008;
  await app.listen(port);
  Logger.log(`🚀 Servicio Notificaciones corriendo en: http://localhost:${port}/api`);
  Logger.log(`📡 Microservicio RabbitMQ iniciado`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

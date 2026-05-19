import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { CONSUMER_BINDING_ALL_DOMAIN_EVENTS } from '@org/contracts';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const RABBITMQ_URI = process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672';

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

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

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3008;
  await app.listen(port);
  Logger.log(`🚀 Servicio Notificaciones corriendo en: http://localhost:${port}/api`);
  Logger.log(`📡 Microservicio RabbitMQ iniciado`);
}

bootstrap();

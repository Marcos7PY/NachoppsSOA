import { initTracing } from '@org/observabilidad';
initTracing('servicio-pedidos');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser = require('cookie-parser');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'],
      queue: 'pedidos_queue',
      queueOptions: { 
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'NACHOPPS_DLX',
          'x-dead-letter-routing-key': 'dlq.pedidos_queue'
        }
      },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      noAck: false,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Pedidos')
    .setDescription('Comandas, saga de pedidos, modificadores y KDS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Servicio Pedidos corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

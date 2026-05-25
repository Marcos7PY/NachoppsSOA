import { initTracing } from '@org/observabilidad';
initTracing('servicio-inventario');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { RoutingKeys } from '@org/contracts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'],
      queue: 'inventario_queue',
      queueOptions: { durable: true },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      routingKey: RoutingKeys.PedidoCreado,
      noAck: false,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Inventario')
    .setDescription('Productos, categorías, stock y validación por lote')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = process.env.PORT || 3007;
  await app.listen(port);
  Logger.log(`🚀 Servicio Inventario corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

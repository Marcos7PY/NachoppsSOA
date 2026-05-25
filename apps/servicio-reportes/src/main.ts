import { initTracing } from '@org/observabilidad';
initTracing('servicio-reportes');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Reportes')
    .setDescription('Dashboard, ventas del día y métricas de negocio')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3010;
  await app.listen(port);
  Logger.log(`🚀 Servicio Reportes corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

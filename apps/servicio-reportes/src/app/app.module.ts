import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { RoutingKeys } from '@org/contracts';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    PrismaModule,
    SharedAuthModule,
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'],
      queue: 'reportes_queue',
      bindings: [RoutingKeys.CuentaCerrada]
    }),
    ObservabilidadModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

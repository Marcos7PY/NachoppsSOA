import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxAdminModule } from '@org/resiliencia';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    OutboxAdminModule.forRoot(PrismaService),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'],
      queue: 'cuentas_queue',
      bindings: ['pedido.creado', 'pedido.actualizado', 'pago.registrado']
    })
  ],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

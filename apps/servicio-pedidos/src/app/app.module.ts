import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxAdminModule } from '@org/resiliencia';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';
import { IdempotencyInterceptor, IDEMPOTENCY_DB } from '@org/resiliencia';
import { PrismaService } from '../prisma/prisma.service';
import { RoutingKeys } from '@org/contracts';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    OutboxAdminModule.forRoot(PrismaService),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'],
      queue: 'pedidos_queue',
      bindings: [RoutingKeys.PagoRegistrado, RoutingKeys.MesaCreada, RoutingKeys.MesaActualizada, RoutingKeys.ProductoCreado, RoutingKeys.ProductoActualizado, RoutingKeys.StockInsuficiente]
    }),
  ],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    IdempotencyInterceptor,
    { provide: IDEMPOTENCY_DB, useExisting: PrismaService },
  ],
})
export class AppModule {}

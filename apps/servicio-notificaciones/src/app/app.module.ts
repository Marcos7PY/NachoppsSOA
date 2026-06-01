import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { ObservabilidadModule } from '@org/observabilidad';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';
import { RoutingKeys } from '@org/contracts';

@Module({
  imports: [
    PrismaModule,
    ObservabilidadModule,
    SharedAuthModule,
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
      queue: 'notificaciones_queue',
      bindings: [
        RoutingKeys.PedidoCreado,
        RoutingKeys.PedidoActualizado,
        RoutingKeys.CuentaAbierta,
        RoutingKeys.CuentaCerrada,
        RoutingKeys.MesaActualizada,
        RoutingKeys.ReservaCreada,
        RoutingKeys.ReservaCancelada,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationsGateway,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

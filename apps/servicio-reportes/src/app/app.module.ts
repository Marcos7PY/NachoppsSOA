import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { RoutingKeys } from '@org/contracts';

@Module({
  imports: [
    PrismaModule,
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@localhost:5672',
      queue: 'reportes_queue',
      bindings: [RoutingKeys.CuentaCerrada]
    }),
    ObservabilidadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { ReservasService } from './reservas.service';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    RabbitMQModule.forRoot(process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672'),
  ],
  controllers: [AppController],
  providers: [
    ReservasService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

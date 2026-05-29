import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ObservabilidadModule } from '@org/observabilidad';
import { OutboxProcessor } from './outbox.processor';

@Module({
  imports: [
    ObservabilidadModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(
      process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
    ),
    AuthModule,
  ],
  providers: [OutboxProcessor],
})
export class AppModule {}

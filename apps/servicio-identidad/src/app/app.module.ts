import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ObservabilidadModule } from '@org/observabilidad';

@Module({
  imports: [
    ObservabilidadModule,
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
    ),
    AuthModule,
  ],
})
export class AppModule {}

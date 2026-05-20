import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672',
    ),
    AuthModule,
  ],
})
export class AppModule {}


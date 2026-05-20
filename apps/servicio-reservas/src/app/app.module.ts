import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { ReservasService } from './reservas.service';

@Module({
  imports: [
    PrismaModule,
    RabbitMQModule.forRoot(process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672'),
  ],
  controllers: [AppController],
  providers: [ReservasService],
})
export class AppModule {}

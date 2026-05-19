import { Module } from '@nestjs/common';
import { RabbitMQModule, RabbitMQPublisherService } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    RabbitMQModule.forRoot(process.env.RABBITMQ_URI ?? 'amqp://nachopps:nachopps_secret@localhost:5672'),
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQPublisherService],
})
export class AppModule {}

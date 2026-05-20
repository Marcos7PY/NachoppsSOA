import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';

@Module({
  imports: [
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

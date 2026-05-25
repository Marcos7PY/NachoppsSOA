import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

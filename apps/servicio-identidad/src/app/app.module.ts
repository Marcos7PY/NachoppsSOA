import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboxAdminModule } from '@org/resiliencia';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ObservabilidadModule } from '@org/observabilidad';
import { OutboxProcessor } from './outbox.processor';

@Module({
  imports: [
    ObservabilidadModule,
    PrismaModule,
    OutboxAdminModule.forRoot(PrismaService),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(process.env['RABBITMQ_URI']),
    AuthModule,
  ],
  providers: [OutboxProcessor],
})
export class AppModule {}

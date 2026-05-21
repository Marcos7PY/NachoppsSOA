import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}

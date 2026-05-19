import { DynamicModule, Module } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';

@Module({})
export class RabbitMQModule {
  static forRoot(uri: string): DynamicModule {
    const connectionProvider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: () => amqp.connect([uri]),
    };

    return {
      module: RabbitMQModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
      global: true,
    };
  }
}

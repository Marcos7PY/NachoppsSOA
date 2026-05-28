import { DynamicModule, Module } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';

export interface RabbitMQModuleOptions {
  uri: string;
  queue?: string;
  bindings?: string[];
}

@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions | string): DynamicModule {
    const uri = typeof options === 'string' ? options : options.uri;
    const queue = typeof options === 'string' ? undefined : options.queue;
    const bindings = typeof options === 'string' ? [] : (options.bindings || []);

    const connectionProvider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: () => amqp.connect([uri]),
    };

    const optionsProvider = {
      provide: 'RABBITMQ_OPTIONS',
      useValue: { queue, bindings },
    };

    return {
      module: RabbitMQModule,
      providers: [connectionProvider, optionsProvider, RabbitMQPublisherService],
      exports: [connectionProvider, RabbitMQPublisherService],
      global: true,
    };
  }
}

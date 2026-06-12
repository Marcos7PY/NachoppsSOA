import { DynamicModule, Module } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';

export interface RabbitMQModuleOptions {
  uri?: string;
  queue?: string;
  bindings?: string[];
}

@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions | string | undefined): DynamicModule {
    const moduleOptions = typeof options === 'string' ? { uri: options } : (options || {});
    const { uri, queue, bindings = [] } = moduleOptions;

    const connectionProvider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: () => {
        if (!uri) {
          throw new Error('RABBITMQ_URI environment variable is required');
        }

        return amqp.connect([uri]);
      },
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

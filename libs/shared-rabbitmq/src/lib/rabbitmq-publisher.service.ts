import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  createEventEnvelope,
  DomainEventEnvelope,
  NACHOPPS_EXCHANGE,
  RoutingKey,
} from '@org/contracts';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQPublisherService.name);
  private channelWrapper: amqp.ChannelWrapper;

  constructor(
    @Inject(RABBITMQ_CONNECTION)
    private readonly connection: amqp.AmqpConnectionManager,
  ) {}

  onModuleInit() {
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(NACHOPPS_EXCHANGE, 'topic', { durable: true });
        this.logger.log(`Exchange "${NACHOPPS_EXCHANGE}" declarado`);
      },
    });
  }

  async publish<TPayload>(
    routingKey: RoutingKey,
    data: TPayload,
    producer?: string,
  ): Promise<void> {
    const envelope: DomainEventEnvelope<TPayload> = createEventEnvelope(
      routingKey,
      data,
      producer,
    );

    await this.channelWrapper.publish(NACHOPPS_EXCHANGE, routingKey, envelope);
    this.logger.log(`Evento publicado: ${routingKey}`);
  }
}

import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DomainEventEnvelope, RoutingKeys } from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ) {
    const payload = envelope.data ?? envelope;
    // A2: delegar al servicio que implementa dedup por pedido.id
    const pedido = payload.pedido ?? payload;
    await this.appService.procesarPedidoCreado(pedido);
  }
}

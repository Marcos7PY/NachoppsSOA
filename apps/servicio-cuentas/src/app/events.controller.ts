import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DomainEventEnvelope, RoutingKeys, PagoRegistradoPayload } from '@org/contracts';
import { AppService } from './app.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {

  constructor(
    private readonly appService: AppService,
  ) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ): Promise<void> {
    await this.appService.procesarPedidoCreado(envelope);
  }

  @EventPattern(RoutingKeys.PedidoActualizado)
  async handlePedidoActualizado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ): Promise<void> {
    await this.appService.procesarPedidoActualizado(envelope);
  }

  @EventPattern(RoutingKeys.PagoRegistrado)
  async handlePagoRegistrado(
    @Payload() envelope: DomainEventEnvelope<PagoRegistradoPayload>,
  ): Promise<void> {
    await this.appService.procesarPagoRegistrado(envelope);
  }
}

import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RoutingKeys, DomainEventEnvelope, MesaCreadaPayload, MesaActualizadaPayload } from '@org/contracts';
import { AppService } from './app.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.MesaCreada)
  async handleMesaCreada(@Payload() envelope: DomainEventEnvelope<MesaCreadaPayload>) {
    const mesa = envelope.data.mesa;
    await this.appService.upsertMesaLocal(mesa);
  }

  @EventPattern(RoutingKeys.MesaActualizada)
  async handleMesaActualizada(@Payload() envelope: DomainEventEnvelope<MesaActualizadaPayload>) {
    const mesa = envelope.data.mesa;
    await this.appService.upsertMesaLocal(mesa);
  }
}

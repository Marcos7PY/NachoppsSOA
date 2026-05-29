import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RoutingKeys, DomainEventEnvelope, MesaCreadaPayload, MesaActualizadaPayload, ProductoCreadoPayload, ProductoActualizadoPayload } from '@org/contracts';
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

  @EventPattern(RoutingKeys.ProductoCreado)
  async handleProductoCreado(@Payload() envelope: DomainEventEnvelope<ProductoCreadoPayload>) {
    const payload = envelope.data ?? (envelope as unknown as ProductoCreadoPayload);
    await this.appService.upsertProductoLocal({
      id: payload.id,
      nombre: payload.nombre,
      precio: payload.precio,
      stockActual: payload.stockActual ?? null,
      categoriaNombre: payload.categoriaNombre ?? 'COCINA',
      disponible: payload.disponible,
    });
  }

  @EventPattern(RoutingKeys.ProductoActualizado)
  async handleProductoActualizado(@Payload() envelope: DomainEventEnvelope<ProductoActualizadoPayload>) {
    const payload = envelope.data ?? (envelope as unknown as ProductoActualizadoPayload);
    await this.appService.upsertProductoLocal({
      id: payload.id,
      nombre: payload.nombre,
      precio: payload.precio,
      stockActual: payload.stockActual ?? null,
      categoriaNombre: payload.categoriaNombre ?? 'COCINA',
      disponible: payload.disponible,
    });
  }
}

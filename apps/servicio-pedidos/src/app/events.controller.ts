import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RoutingKeys, MesaCreadaPayload, MesaActualizadaPayload, ProductoCreadoPayload, ProductoActualizadoPayload } from '@org/contracts';
import { AppService } from './app.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.MesaCreada)
  async handleMesaCreada(@Payload() payload: MesaCreadaPayload) {
    await this.appService.upsertMesaLocal(payload.mesa);
  }

  @EventPattern(RoutingKeys.MesaActualizada)
  async handleMesaActualizada(@Payload() payload: MesaActualizadaPayload) {
    await this.appService.upsertMesaLocal(payload.mesa);
  }

  @EventPattern(RoutingKeys.ProductoCreado)
  async handleProductoCreado(@Payload() payload: ProductoCreadoPayload) {
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
  async handleProductoActualizado(@Payload() payload: ProductoActualizadoPayload) {
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

import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CuentaAbiertaPayload, CuentaCerradaPayload, RoutingKeys } from '@org/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @EventPattern(RoutingKeys.CuentaAbierta)
  async handleCuentaAbierta(
    @Payload() payload: CuentaAbiertaPayload,
  ) {
    await this.prisma.cuentaAbierta.upsert({
      where: { cuentaId: payload.cuentaId },
      create: { cuentaId: payload.cuentaId, mesaId: payload.mesaId, total: 0, estado: 'ABIERTA' },
      update: { estado: 'ABIERTA', mesaId: payload.mesaId },
    });

    this.logger.log(`Cuenta ${payload.cuentaId} abierta. Mesa ${payload.mesaId}`);
  }

  @EventPattern(RoutingKeys.CuentaCerrada)
  async handleCuentaCerrada(
    @Payload() payload: CuentaCerradaPayload,
  ) {
    await this.prisma.cuentaAbierta.update({
      where: { cuentaId: payload.cuentaId },
      data: { estado: 'CERRADA', total: payload.total },
    }).catch(() => {
      this.logger.warn(`Cuenta ${payload.cuentaId} no encontrada en proyección local para cerrar`);
    });

    this.logger.log(
      `Cuenta ${payload.cuentaId} cerrada. Mesa ${payload.mesaId}. Total: S/ ${payload.total}`,
    );
  }
}

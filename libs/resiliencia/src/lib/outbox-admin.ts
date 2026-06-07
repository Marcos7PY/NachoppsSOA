import {
  Controller,
  DynamicModule,
  Get,
  Inject,
  Module,
  NotFoundException,
  Param,
  Post,
  Type,
  UseGuards,
} from '@nestjs/common';
import { Roles, RolesGuard } from '@org/shared-auth';

/**
 * Reproceso del outbox en BD (plan 3.3).
 *
 * Expone, por servicio y protegido por rol, el listado de eventos FAILED y un
 * endpoint para reencolarlos (FAILED → PENDING) antes de que la purga los borre
 * a los 7 días. NO cubre el DLQ del broker (mecanismo distinto).
 */
export const OUTBOX_DB = Symbol('OUTBOX_DB');

export interface OutboxDb {
  outboxEvent: {
    findMany(args: unknown): Promise<unknown[]>;
    updateMany(args: { where: Record<string, unknown>; data: Record<string, unknown> }): Promise<{ count: number }>;
  };
}

@Controller('outbox')
export class OutboxAdminController {
  constructor(@Inject(OUTBOX_DB) private readonly db: OutboxDb) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SISTEMA')
  @Get('failed')
  listFailed() {
    return this.db.outboxEvent.findMany({
      where: { status: 'FAILED' },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SISTEMA')
  @Post(':id/retry')
  async retry(@Param('id') id: string) {
    const r = await this.db.outboxEvent.updateMany({
      where: { id, status: 'FAILED' },
      data: { status: 'PENDING', attempts: 0 },
    });
    if (r.count === 0) {
      throw new NotFoundException(`No hay un evento de outbox FAILED con id ${id}`);
    }
    return { message: 'Evento reencolado (FAILED → PENDING)', id };
  }
}

@Module({})
export class OutboxAdminModule {
  /**
   * `prismaService`: la clase PrismaService del servicio (expone `outboxEvent`).
   * Debe estar disponible globalmente (PrismaModule @Global) para el useExisting.
   */
  static forRoot(prismaService: Type<unknown>): DynamicModule {
    return {
      module: OutboxAdminModule,
      controllers: [OutboxAdminController],
      providers: [{ provide: OUTBOX_DB, useExisting: prismaService }],
    };
  }
}

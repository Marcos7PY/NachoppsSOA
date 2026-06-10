import { DynamicModule, Inject, Injectable, Logger, Module, Optional, Type } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IDEMPOTENCY_DB } from './idempotency.interceptor';

/**
 * Purga periódica de `IdempotencyKey` (plan T-06).
 *
 * El modelo `IdempotencyKey` vive en 6 servicios (caja, inventario, mesas,
 * notificaciones, pedidos, reportes), pero el cron de purga solo existía en los
 * processors de pedidos e inventario: en los otros 4 la tabla crecía sin límite,
 * incumpliendo la invariante `retencion-idempotency-keys.md`.
 *
 * Este servicio centraliza la purga (cron horario, retención 7 días) y se
 * registra por servicio con `IdempotencyPurgeModule.forService(PrismaService)`.
 * Reutiliza el token `IDEMPOTENCY_DB` (PrismaService) ya usado por el interceptor.
 */
export const IDEMPOTENCY_PURGE_CONFIG = Symbol('IDEMPOTENCY_PURGE_CONFIG');

export interface IdempotencyPurgeConfig {
  /** Días de retención antes de borrar una clave (default 7). */
  retencionDias?: number;
}

interface IdempotencyPurgeDb {
  idempotencyKey: {
    deleteMany(args: { where: { createdAt: { lt: Date } } }): Promise<{ count: number }>;
  };
}

@Injectable()
export class IdempotencyPurgeService {
  private readonly logger = new Logger(IdempotencyPurgeService.name);
  private readonly retencionDias: number;

  constructor(
    @Inject(IDEMPOTENCY_DB) private readonly db: IdempotencyPurgeDb,
    @Optional() @Inject(IDEMPOTENCY_PURGE_CONFIG) config?: IdempotencyPurgeConfig,
  ) {
    this.retencionDias = config?.retencionDias ?? 7;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async purgarIdempotencyKeys() {
    const cutoff = new Date(Date.now() - this.retencionDias * 24 * 3600_000);
    const r = await this.db.idempotencyKey.deleteMany({ where: { createdAt: { lt: cutoff } } });
    if (r.count > 0) this.logger.log(`Purga idempotency_keys: ${r.count} eliminadas`);
  }
}

/**
 * Registra la purga de idempotency keys para un servicio.
 *
 * `prismaService` debe exponer el modelo `idempotencyKey` y estar disponible
 * globalmente (PrismaModule @Global). Requiere `ScheduleModule.forRoot()` en el
 * servicio para que el `@Cron` se active.
 */
@Module({})
export class IdempotencyPurgeModule {
  static forService(prismaService: Type<unknown>, config?: IdempotencyPurgeConfig): DynamicModule {
    return {
      module: IdempotencyPurgeModule,
      providers: [
        IdempotencyPurgeService,
        { provide: IDEMPOTENCY_DB, useExisting: prismaService },
        { provide: IDEMPOTENCY_PURGE_CONFIG, useValue: config ?? {} },
      ],
      exports: [IdempotencyPurgeService],
    };
  }
}

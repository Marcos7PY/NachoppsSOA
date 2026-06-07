import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, lastValueFrom } from 'rxjs';

/**
 * Idempotencia HTTP en mutaciones críticas (plan 1.3).
 *
 * Si la petición POST trae el header `Idempotency-Key`, persistimos la clave y la
 * respuesta. Un reintento/doble-click con la misma clave devuelve la respuesta
 * cacheada (mismo recurso, misma respuesta) en lugar de crear un duplicado.
 *
 * El store es agnóstico del cliente Prisma concreto: cada servicio inyecta su
 * PrismaService (que expone el modelo `idempotencyKey`) bajo el token IDEMPOTENCY_DB.
 */
export const IDEMPOTENCY_DB = Symbol('IDEMPOTENCY_DB');

export interface IdempotencyRecord {
  key: string;
  statusCode?: number | null;
  body?: string | null;
  completedAt?: Date | null;
}

export interface IdempotencyDb {
  idempotencyKey: {
    findUnique(args: { where: { key: string } }): Promise<IdempotencyRecord | null>;
    create(args: { data: { key: string; method?: string; path?: string } }): Promise<unknown>;
    update(args: { where: { key: string }; data: Record<string, unknown> }): Promise<unknown>;
    delete(args: { where: { key: string } }): Promise<unknown>;
  };
}

const IN_PROGRESS_MSG = 'Ya hay una solicitud en curso con esta Idempotency-Key';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(IDEMPOTENCY_DB) private readonly db: IdempotencyDb) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const req = context.switchToHttp().getRequest();
    if (req.method !== 'POST') return next.handle();

    const headerKey = req.headers['idempotency-key'];
    if (!headerKey || typeof headerKey !== 'string') return next.handle();

    const res = context.switchToHttp().getResponse();
    const routePath = req.route?.path ?? req.url;
    const key = `http:${req.method}:${routePath}:${headerKey}`;

    return from(this.handle(next, key, req.method, String(routePath), res));
  }

  private async handle(
    next: CallHandler,
    key: string,
    method: string,
    path: string,
    res: { statusCode?: number; status: (code: number) => unknown },
  ): Promise<unknown> {
    const existing = await this.db.idempotencyKey.findUnique({ where: { key } });
    if (existing) {
      if (existing.completedAt && existing.statusCode != null) {
        res.status(existing.statusCode);
        return existing.body != null ? JSON.parse(existing.body) : undefined;
      }
      // Registro reclamado pero aún sin completar → duplicado concurrente.
      throw new ConflictException(IN_PROGRESS_MSG);
    }

    // Reclama la clave de forma atómica (el índice único resuelve la carrera).
    try {
      await this.db.idempotencyKey.create({ data: { key, method, path } });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        throw new ConflictException(IN_PROGRESS_MSG);
      }
      throw e;
    }

    try {
      const result = await lastValueFrom(next.handle());
      // En POST el status real (201) lo fija Nest tras el interceptor; aquí solo
      // está el 200 por defecto, así que normalizamos a 201 para el replay.
      const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 201;
      await this.db.idempotencyKey.update({
        where: { key },
        data: { statusCode, body: JSON.stringify(result ?? null), completedAt: new Date() },
      });
      return result;
    } catch (err) {
      // Falló: liberamos la clave para que un reintento legítimo pueda proceder.
      await this.db.idempotencyKey.delete({ where: { key } }).catch(() => undefined);
      throw err;
    }
  }
}

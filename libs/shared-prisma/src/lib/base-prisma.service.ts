import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBasePrismaService<T extends new (...args: any[]) => any>(PrismaClientClass: T) {
  abstract class BasePrismaService extends PrismaClientClass implements OnModuleInit, OnModuleDestroy {
    abstract readonly serviceName: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in the environment');
      }

      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      super({ adapter, ...args[0] });
    }

    async onModuleInit() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).$connect();
      const connectionString = process.env.DATABASE_URL ?? '';
      const dbName = connectionString.split('/').pop()?.split('?')[0] ?? 'desconocida';
      Logger.log(`Conectado a ${dbName} vía PrismaPg`, this.serviceName);
    }

    async $checkAndRecordIdempotencyKey(key: string): Promise<boolean> {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).idempotencyKey) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (this as any).idempotencyKey.create({ data: { key } });
          return false;
        }
        return false; // Dummy fallback if model doesn't exist
      } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2002') {
          return true; // Ya existía
        }
        throw error;
      }
    }

    async onModuleDestroy() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).$disconnect();
    }
  }

  return BasePrismaService;
}

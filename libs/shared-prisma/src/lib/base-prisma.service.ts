import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export function createBasePrismaService<T extends new (...args: any[]) => any>(PrismaClientClass: T) {
  abstract class BasePrismaService extends PrismaClientClass implements OnModuleInit, OnModuleDestroy {
    protected abstract readonly serviceName: string;

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
      await (this as any).$connect();
      const connectionString = process.env.DATABASE_URL ?? '';
      const dbName = connectionString.split('/').pop()?.split('?')[0] ?? 'desconocida';
      Logger.log(`Conectado a ${dbName} vía PrismaPg`, this.serviceName);
    }

    async $checkAndRecordIdempotencyKey(key: string): Promise<boolean> {
      try {
        if ((this as any).idempotencyKey) {
          await (this as any).idempotencyKey.create({ data: { key } });
          return false;
        }
        return false; // Dummy fallback if model doesn't exist
      } catch (error: any) {
        if (error.code === 'P2002') {
          return true; // Ya existía
        }
        throw error;
      }
    }

    async onModuleDestroy() {
      await (this as any).$disconnect();
    }
  }

  return BasePrismaService;
}
